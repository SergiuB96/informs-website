/* Facturare automată prin Oblio.
 *
 * Atenție la direcție: integrarea „Oblio x NETOPIA" de pe oblio.eu este
 * fluxul invers față de ce avem noi. Aceea pune un buton „Plătește cu
 * cardul" pe o factură emisă deja în Oblio. La noi plata se întâmplă
 * prima, în magazin, iar factura trebuie emisă DUPĂ confirmarea plății.
 * Pentru asta se folosește API-ul Oblio, nu punctul de vânzare dedicat.
 *
 * Documentație: https://www.oblio.eu/api
 *
 * Modulul este inert cât timp variabilele de mediu lipsesc, ca plățile
 * să funcționeze normal înainte de a exista un cont Oblio configurat.
 */

const BASE = 'https://www.oblio.eu/api';

/* Funcțiile sunt reutilizate între cereri pe Fluid Compute, deci merită
   ținut tokenul în memorie: are o oră de valabilitate, iar Oblio limitează
   la 30 de cereri / 10 secunde. */
let cachedToken = null;

function isConfigured() {
  return Boolean(process.env.OBLIO_EMAIL && process.env.OBLIO_SECRET && process.env.OBLIO_CIF);
}

async function getToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(BASE + '/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.OBLIO_EMAIL,
      client_secret: process.env.OBLIO_SECRET,
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json || !json.access_token) {
    throw new Error('Oblio: autentificare eșuată (' + res.status + ')');
  }

  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (Number(json.expires_in || 3600) * 1000),
  };
  return cachedToken.value;
}

function splitName(billing) {
  const person = [billing.lastName, billing.firstName].filter(Boolean).join(' ').trim();
  return person || billing.email;
}

/* Emite factura fiscală pentru o comandă plătită.
 *
 * TVA: societatea este neplătitoare, deci `vatPercentage: 0`. Numele cotei
 * se lasă pe seama configurării contului Oblio; dacă acel cont cere unul
 * explicit, se dă prin OBLIO_VAT_NAME. */
async function issueInvoice({ orderID, product, billing, company, cui }) {
  const token = await getToken();

  const isCompany = Boolean(cui);
  const client = {
    name: isCompany ? (company || splitName(billing)) : splitName(billing),
    email: billing.email || '',
    phone: billing.phone || '',
    address: billing.details || '',
    city: billing.city || '',
    state: billing.state || '',
    country: 'Romania',
  };
  if (isCompany) client.cif = cui;

  const item = {
    name: product.title,
    code: product.sku,
    price: product.price,
    quantity: 1,
    measuringUnit: 'buc',
    productType: 'Serviciu',
    vatIncluded: 1,
    vatPercentage: 0,
  };
  if (process.env.OBLIO_VAT_NAME) item.vatName = process.env.OBLIO_VAT_NAME;

  const today = new Date().toISOString().slice(0, 10);

  const payload = {
    cif: process.env.OBLIO_CIF,
    client,
    issueDate: today,
    dueDate: today,
    /* Seria de facturi, definită în contul Oblio la Setări → Serii documente.
       Contul MILBAC are o singură serie de tip Factura, „MIL", marcată implicită. */
    seriesName: process.env.OBLIO_SERIES || 'MIL',
    language: 'RO',
    precision: 2,
    currency: 'RON',
    products: [item],
    issuerName: 'Website informs.ro',
    mentions: 'Comanda ' + orderID + '. Achitat online cu cardul, prin NETOPIA Payments.',
    collect: {
      type: 'Card',
      documentNumber: orderID,
    },
    sendEmail: 1,
  };

  const res = await fetch(BASE + '/docs/invoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.status !== 200) {
    const msg = json && (json.statusMessage || json.message) ? (json.statusMessage || json.message) : ('HTTP ' + res.status);
    throw new Error('Oblio: factura nu a fost emisă (' + msg + ')');
  }

  return {
    seriesName: json.data?.seriesName,
    number: json.data?.number,
    link: json.data?.link,
  };
}

/* Trimiterea în SPV se poate face automat din setările contului Oblio
   („Trimite automat e-Factura în SPV"). Apelul explicit e pentru conturile
   pe care acea opțiune este oprită. */
async function sendToSpv({ seriesName, number }) {
  const token = await getToken();
  const res = await fetch(BASE + '/docs/einvoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({ cif: process.env.OBLIO_CIF, seriesName, number }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error('Oblio: trimiterea în SPV a eșuat (HTTP ' + res.status + ')');
  return json;
}

module.exports = { isConfigured, issueInvoice, sendToSpv };
