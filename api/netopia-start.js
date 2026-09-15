import { getProduct } from './_lib/products.js';
import { mintOrderID, buildStartPayload, startPayment, siteUrl } from './_lib/netopia.js';

const REQUIRED = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Mesaje pentru codurile de eroare documentate de NETOPIA. */
const ERROR_MESSAGES = {
  '19': 'Cardul este expirat.',
  '20': 'Fonduri insuficiente.',
  '21': 'Codul CVV este incorect.',
  '22': 'Codul CVV este incorect.',
  '34': 'Tranzacția nu este permisă de banca emitentă.',
  '56': 'Comanda există deja. Reia comanda din magazin.',
  '99': 'Există deja o comandă cu alt preț pentru acest identificator.',
};

function clean(v, max = 120) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function isAllowedOrigin(origin) {
  if (origin.startsWith('http://localhost')) return true;
  let host;
  try { host = new URL(origin).host.toLowerCase(); } catch { return false; }
  const base = new URL(siteUrl()).host.toLowerCase().replace(/^www\./, '');
  return host === base || host === 'www.' + base;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* Cererea trebuie să vină din propriul site. Acceptăm și apex, și www:
     informs.ro face 307 către www.informs.ro, deci browserul poate trimite
     oricare dintre cele două ca Origin, iar o nepotrivire de gazdă nu are
     voie să blocheze o vânzare. */
  const origin = req.headers.origin || '';
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: 'Origine nepermisă.' });
  }

  const body = req.body || {};

  if (!body.acceptTerms || !body.acceptWaiver) {
    return res.status(400).json({ error: 'Trebuie să accepți termenii și livrarea imediată a documentului.' });
  }

  /* Cât timp nu avem cheile NETOPIA, prețurile trebuie să rămână vizibile
     pe site pentru validarea punctului de vânzare, dar clientul are dreptul
     la un mesaj onest, nu la o eroare de server. */
  if (!process.env.NETOPIA_API_KEY || !process.env.NETOPIA_POS_SIGNATURE) {
    return res.status(503).json({
      error: 'Plata online cu cardul se activează în curând. Scrie-ne la ' +
             'office@informs.ro și îți trimitem factura proforma pentru plata prin transfer bancar.',
    });
  }

  const product = getProduct(clean(body.sku, 40));
  if (!product) {
    return res.status(400).json({ error: 'Produs indisponibil.' });
  }

  const billing = {};
  for (const k of REQUIRED) {
    billing[k] = clean(body[k]);
    if (!billing[k]) {
      return res.status(400).json({ error: 'Completează toate câmpurile obligatorii.' });
    }
  }
  if (!EMAIL_RE.test(billing.email)) {
    return res.status(400).json({ error: 'Adresa de email nu este validă.' });
  }

  // Opționale, dar necesare pentru factura pe firmă.
  billing.company = clean(body.company);
  billing.cui = clean(body.cui, 20);

  try {
    const orderID = mintOrderID(product.sku);
    const payload = buildStartPayload({
      orderID,
      product,
      billing,
      ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
      userAgent: req.headers['user-agent'] || '',
    });

    const { ok, status, json } = await startPayment(payload);

    if (json && json.payment && json.payment.paymentURL) {
      return res.status(200).json({ paymentURL: json.payment.paymentURL, orderID });
    }

    const code = json && json.error ? String(json.error.code) : '';
    const detail = json && json.error && Array.isArray(json.error.details)
      ? json.error.details.map(d => d.field).filter(Boolean).join(', ')
      : '';
    console.error('netopia-start failed', { ok, status, code, detail, message: json && json.error && json.error.message });

    return res.status(502).json({
      error: ERROR_MESSAGES[code] || 'Plata nu a putut fi inițiată. Încearcă din nou sau contactează-ne.',
    });
  } catch (err) {
    console.error('netopia-start error', err);
    return res.status(500).json({ error: 'Eroare de server. Încearcă din nou în câteva minute.' });
  }
}
