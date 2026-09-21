/* Integrare NETOPIA Payments API v2.
 *
 * Referințe verificate:
 *  - spec OpenAPI live: https://secure.sandbox.netopia-payments.com/spec
 *  - https://doc.netopia-payments.com/docs/payment-api/v2.x/intro
 *  - github.com/netopiapayments/sample-app-js, /composer, /go-sdk
 *
 * Decizii deliberate:
 *  - Verificăm semnătura IPN manual cu node:crypto, fără o bibliotecă
 *    JWT. SDK-ul PHP oficial conține `JWT::$timestamp = time() * 1000`,
 *    ceea ce arată că NETOPIA emite iat/nbf/exp în milisecunde. O
 *    bibliotecă standard, care le interpretează în secunde, ar respinge
 *    fiecare notificare. Protecția la replay vine din legarea `sub` de
 *    hash-ul payload-ului, plus marcajul de idempotență.
 *  - Nu ținem bază de date. Identitatea comenzii e semnată HMAC în
 *    orderID, iar adevărul despre plată se ia de la /operation/status.
 */

const crypto = require('node:crypto');
const { BY_IDX, getProduct } = require('./products.js');

function baseUrl() {
  if (process.env.NETOPIA_BASE_URL) return process.env.NETOPIA_BASE_URL.replace(/\/+$/, '');
  return process.env.NETOPIA_LIVE === '1'
    ? 'https://secure.mobilpay.ro/pay'
    : 'https://secure.sandbox.netopia-payments.com';
}

function siteUrl() {
  return (process.env.SITE_URL || 'https://informs.ro').replace(/\/+$/, '');
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error('Variabila de mediu ' + name + ' nu este configurată.');
  return v;
}

/* ─── orderID semnat ─────────────────────────────
   Format: INF<time36><rand36><idx><pret36>-<sig>
   Rămâne sub 64 de caractere și conține doar [A-Za-z0-9-]. */
const ORDER_PREFIX = 'INF';

/* Hex, nu base64url: alfabetul base64url conține '-', care ar rupe
   despărțirea orderID-ului pe '-' în mod aleatoriu, la ~1 din 3 comenzi. */
function hmac(secret, data) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function mintOrderID(sku) {
  const product = getProduct(sku);
  if (!product) throw new Error('SKU necunoscut: ' + sku);
  const body = [
    ORDER_PREFIX,
    Date.now().toString(36),
    crypto.randomBytes(6).toString('hex'),
    product.idx,
    String(product.price),
  ].join('-');
  const sig = hmac(requireEnv('ORDER_SECRET'), body).slice(0, 24);
  return body + '-' + sig;
}

function parseOrderID(orderID) {
  if (typeof orderID !== 'string') return null;
  const parts = orderID.split('-');
  if (parts.length !== 6 || parts[0] !== ORDER_PREFIX) return null;

  const sig = parts.pop();
  const body = parts.join('-');
  const expected = hmac(requireEnv('ORDER_SECRET'), body).slice(0, 24);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  const entry = BY_IDX[parts[3]];
  if (!entry) return null;
  const price = Number(parts[4]);
  if (!Number.isFinite(price) || price !== entry.price) return null;

  return { orderID, sku: entry.sku, price, product: entry };
}

/* ─── Token de descărcare ────────────────────────
   Semnat separat de orderID, ca o scurgere a unuia
   să nu îl compromită pe celălalt. */
function signDownloadToken(sku, orderID, ttlHours = 72) {
  const exp = Date.now() + ttlHours * 3600 * 1000;
  const body = Buffer.from(JSON.stringify({ sku, orderID, exp }), 'utf8').toString('base64url');
  return body + '.' + hmac(requireEnv('DOWNLOAD_SECRET'), body).slice(0, 40);
}

function verifyDownloadToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = hmac(requireEnv('DOWNLOAD_SECRET'), body).slice(0, 40);
  if (!sig || sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  let claims;
  try {
    claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!claims || typeof claims.exp !== 'number' || Date.now() > claims.exp) return null;
  if (!getProduct(claims.sku)) return null;
  return claims;
}

/* ─── Apeluri către NETOPIA ──────────────────────── */
async function callNetopia(path, payload) {
  const res = await fetch(baseUrl() + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': requireEnv('NETOPIA_API_KEY'),
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* răspuns non-JSON */ }
  return { ok: res.ok, status: res.status, json, text };
}

const RO_COUNTRY_CODE = 642;

function buildStartPayload({ orderID, product, billing, ip, userAgent }) {
  const address = {
    email:       billing.email,
    phone:       billing.phone,
    firstName:   billing.firstName,
    lastName:    billing.lastName,
    city:        billing.city,
    country:     RO_COUNTRY_CODE,
    countryName: 'Romania',
    state:       billing.state,
    postalCode:  billing.postalCode,
    details:     billing.address,
  };

  return {
    config: {
      emailTemplate: '',
      emailSubject: '',
      notifyUrl:   siteUrl() + '/api/netopia-ipn',
      redirectUrl: siteUrl() + '/api/netopia-return',
      cancelUrl:   siteUrl() + '/api/netopia-return?c=1',
      language: 'ro',
    },
    payment: {
      options: { installments: 0, bonus: 0 },
      instrument: { type: 'card' },
      data: {
        BROWSER_USER_AGENT: userAgent || '',
        IP_ADDRESS: ip || '',
      },
    },
    order: {
      ntpID: '',
      posSignature: requireEnv('NETOPIA_POS_SIGNATURE'),
      dateTime: new Date().toISOString(),
      description: 'INFORMS - ' + product.title,
      orderID,
      amount: product.price,
      currency: 'RON',
      billing: address,
      shipping: address,
      products: [{
        name: product.title,
        code: product.sku,
        category: 'digital',
        price: product.price,
        vat: 0,
      }],
      installments: { selected: 0, available: [0] },
      /* Câmp liber, întors intact de /operation/status. Îl folosim ca să
         recuperăm la facturare datele de firmă, care nu au loc în `billing`. */
      data: {
        sku: product.sku,
        company: billing.company || '',
        cui: billing.cui || '',
      },
    },
  };
}

function startPayment(payload) {
  return callNetopia('/payment/card/start', payload);
}

function getStatus({ orderID, ntpID }) {
  return callNetopia('/operation/status', {
    posID: requireEnv('NETOPIA_POS_SIGNATURE'),
    orderID,
    ntpID: ntpID || '',
  });
}

/* Stări în care marfa se consideră plătită. Sursă: SDK-urile oficiale
   (Go ipn.go, Python constants.py, PHP IPN.php - identice). */
const STATUS = {
  NEW: 1, OPENED: 2, PAID: 3, CANCELED: 4, CONFIRMED: 5, PENDING: 6,
  SCHEDULED: 7, CREDIT: 8, CHARGEBACK_INIT: 9, CHARGEBACK_ACCEPT: 10,
  ERROR: 11, DECLINED: 12, FRAUD: 13, PENDING_AUTH: 14, AUTH_3D: 15,
  REPRESENTMENT: 16, REVERSED: 17, PENDING_ANY: 18, EXPIRED: 23,
};

function isPaid(status) {
  return status === STATUS.PAID || status === STATUS.CONFIRMED;
}

function isFailed(status) {
  return [STATUS.CANCELED, STATUS.ERROR, STATUS.DECLINED, STATUS.REVERSED, STATUS.EXPIRED].includes(status);
}

/* ─── Verificarea notificării IPN ──────────────── */
const HASH_BY_ALG = { RS256: 'sha256', RS384: 'sha384', RS512: 'sha512' };

/* Cheia cu care NETOPIA semnează IPN-ul, aceeași în sandbox și live.
   NU este certificatul din „Punct de vânzare → Setări securitate”: acela
   are 1024 de biți, iar semnătura IPN are 2048, deci nu o poate verifica.
   Sursa: pluginul oficial netopiapayments/woocommerce, v2/
   wc-netopiapayments-gateway.php (publicKeyStr). Verificat pe 21.09.2026
   cu tokenul real al unei plăți din sandbox. Este o cheie publică. */
const NETOPIA_IPN_PUBLIC_KEY = [
  '-----BEGIN PUBLIC KEY-----',
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy6pUDAFLVul4y499gz1P',
  'gGSvTSc82U3/ih3e5FDUs/F0Jvfzc4cew8TrBDrw7Y+AYZS37D2i+Xi5nYpzQpu7',
  'ryS4W+qvgAA1SEjiU1Sk2a4+A1HeH+vfZo0gDrIYTh2NSAQnDSDxk5T475ukSSwX',
  'L9tYwO6CpdAv3BtpMT5YhyS3ipgPEnGIQKXjh8GMgLSmRFbgoCTRWlCvu7XOg94N',
  'fS8l4it2qrEldU8VEdfPDfFLlxl3lUoLEmCncCjmF1wRVtk4cNu+WtWQ4mBgxpt0',
  'tX2aJkqp4PV3o5kI4bqHq/MS7HVJ7yxtj/p8kawlVYipGsQj3ypgltQ3bnYV/LRq',
  '8QIDAQAB',
  '-----END PUBLIC KEY-----',
].join('\n');

/* Cheia de mai sus plus, opțional, NETOPIA_PUBLIC_KEY din mediu, pentru
   cazul în care NETOPIA o rotește. Oricare verifică, e la fel de sigur:
   niciuna nu poate semna. */
function trustedIpnKeys() {
  const extra = (process.env.NETOPIA_PUBLIC_KEY || '').replace(/\\n/g, '\n').trim();
  return extra ? [NETOPIA_IPN_PUBLIC_KEY, extra] : [NETOPIA_IPN_PUBLIC_KEY];
}

function signatureMatches(hash, signedPart, signature, key) {
  try {
    return crypto.createVerify(hash).update(signedPart).verify(key, signature);
  } catch {
    return false; // cheie invalidă sau de altă mărime decât semnătura
  }
}

function verifyNetopiaToken(token, rawBody) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Wrong_Verification_Token');
  const [h, p, s] = parts;

  const header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8'));
  if (header.typ !== 'JWT') throw new Error('Wrong_Token_Type');
  const hash = HASH_BY_ALG[header.alg || 'RS512'];
  if (!hash) throw new Error('Unsupported_Alg');

  const signature = Buffer.from(s, 'base64url');
  const valid = trustedIpnKeys().some(key => signatureMatches(hash, h + '.' + p, signature, key));
  if (!valid) throw new Error('E_VERIFICATION_FAILED_SIGNATURE');

  const claims = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
  if (claims.iss !== 'NETOPIA Payments') throw new Error('E_VERIFICATION_FAILED_GENERAL');

  const aud = Array.isArray(claims.aud) ? claims.aud[0] : claims.aud;
  if (!aud || aud !== requireEnv('NETOPIA_POS_SIGNATURE')) throw new Error('E_VERIFICATION_FAILED_AUDIENCE');

  // base64 standard, peste octeții bruți ai corpului cererii
  const digest = crypto.createHash('sha512').update(rawBody).digest('base64');
  if (digest !== claims.sub) throw new Error('E_VERIFICATION_FAILED_TAINTED_PAYLOAD');

  return claims;
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = { baseUrl, siteUrl, mintOrderID, parseOrderID, signDownloadToken, verifyDownloadToken, buildStartPayload, startPayment, getStatus, isPaid, isFailed, verifyNetopiaToken, readRawBody, STATUS };
