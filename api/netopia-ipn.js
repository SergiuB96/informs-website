import nodemailer from 'nodemailer';
import { list, put } from '@vercel/blob';
import {
  readRawBody, verifyNetopiaToken, parseOrderID, getStatus,
  signDownloadToken, siteUrl, isPaid, STATUS,
} from './_lib/netopia.js';
import { isConfigured as oblioConfigured, issueInvoice, sendToSpv } from './_lib/oblio.js';
import { buildDeliveryEmail } from './_lib/delivery-email.js';

const DOWNLOAD_TTL_HOURS = 72;

/* NETOPIA semnează un hash SHA-512 peste octeții BRUȚI ai cererii.
   Parsarea automată a corpului de către Vercel ar schimba acei octeți
   și verificarea ar pica, așa că o dezactivăm. */
export const config = { api: { bodyParser: false } };

const OK_RESPONSE   = { errorType: 0, errorCode: null, errorMessage: '' };
const FAIL_RESPONSE = { errorType: 2, errorCode: 0x10000102, errorMessage: 'Verification failed' };

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/* Fără bază de date, marcajul de livrare este un obiect în Blob.
   NETOPIA trimite notificarea de mai multe ori pentru aceeași comandă
   (întâi PAID, apoi CONFIRMED), deci fără marcaj s-ar livra de două ori. */
async function alreadyDelivered(orderID) {
  const { blobs } = await list({ prefix: 'orders/' + orderID + '.delivered', limit: 1 });
  return blobs.length > 0;
}

async function markDelivered(orderID, info) {
  await put('orders/' + orderID + '.delivered', JSON.stringify(info), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

async function sendDelivery({ email, product, orderID, billing }) {
  const paidAt = new Date();
  const expiresAt = new Date(paidAt.getTime() + DOWNLOAD_TTL_HOURS * 3600 * 1000);
  const link = siteUrl() + '/api/download?t=' +
    encodeURIComponent(signDownloadToken(product.sku, orderID, DOWNLOAD_TTL_HOURS));

  const { subject, text, html } = buildDeliveryEmail({
    product,
    orderID,
    link,
    firstName: billing?.firstName,
    lastName: billing?.lastName,
    paidAt,
    expiresAt,
    siteUrl: siteUrl(),
  });

  await transporter().sendMail({
    from: 'INFORMS <' + process.env.SMTP_USER + '>',
    to: email,
    bcc: 'office@informs.ro',
    subject,
    text,
    html,
  });
}

async function notifyStaff(subject, text) {
  try {
    await transporter().sendMail({
      from: 'Website INFORMS <' + process.env.SMTP_USER + '>',
      to: 'office@informs.ro',
      subject,
      text,
    });
  } catch (err) {
    console.error('staff notification failed', err);
  }
}

async function invoiceOrder({ orderID, parsed, statusOrder, fallbackEmail }) {
  if (!oblioConfigured()) return;

  /* O plată din sandbox nu e o vânzare: fără factură reală din seria MIL
     și fără trimitere în SPV. Livrarea documentului merge normal. */
  if (process.env.NETOPIA_LIVE !== '1') {
    console.log('invoice skipped in sandbox', { orderID });
    return;
  }

  const billing = statusOrder?.billing || { email: fallbackEmail };
  const extra = statusOrder?.data || {};

  try {
    const invoice = await issueInvoice({
      orderID,
      product: parsed.product,
      billing,
      company: extra.company || '',
      cui: extra.cui || '',
    });

    if (process.env.OBLIO_SPV === '1') {
      try {
        await sendToSpv(invoice);
      } catch (err) {
        console.error('SPV submission failed', { orderID, message: err.message });
        await notifyStaff('e-Factura netrimisă în SPV: ' + orderID,
          'Factura ' + invoice.seriesName + ' ' + invoice.number + ' a fost emisă, dar nu a ajuns în SPV.\n\n' + err.message);
      }
    }
  } catch (err) {
    console.error('invoice failed', { orderID, message: err.message });
    await notifyStaff('Factură neemisă: ' + orderID,
      'Comanda ' + orderID + ' a fost plătită și livrată, dar factura nu a putut fi emisă automat. Emite-o manual.\n\n' +
      'Produs: ' + parsed.product.title + '\nPreț: ' + parsed.price + ' RON\n' +
      'Email: ' + (billing.email || '-') + '\n\n' + err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ...FAIL_RESPONSE, errorMessage: 'Method not allowed' });
  }

  let payload;
  try {
    const rawBody = await readRawBody(req);
    verifyNetopiaToken(req.headers['verification-token'] || req.headers['Verification-token'], rawBody);
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    /* Tokenul nu e secret (semnătură publică + claims fără date de client);
       îl logăm ca verificarea cheii să poată fi reprodusă offline. */
    console.error('IPN verification failed', err.message, {
      token: String(req.headers['verification-token'] || '').slice(0, 2000),
    });
    return res.status(200).json({ ...FAIL_RESPONSE, errorMessage: err.message });
  }

  /* De aici încolo răspundem mereu 200 cu errorType 0: notificarea a fost
     autentică și primită. Eșecurile noastre interne se rezolvă din loguri
     și pe email, nu prin a forța NETOPIA să reîncerce la nesfârșit. */
  try {
    const orderID = payload?.order?.orderID;
    const parsed = parseOrderID(orderID);
    if (!parsed) {
      console.error('IPN cu orderID necunoscut', orderID);
      return res.status(200).json(OK_RESPONSE);
    }

    /* Sursa de adevăr este interogarea de status, nu corpul notificării:
       tot de acolo luăm și emailul de facturare, care nu vine în IPN. */
    const { json } = await getStatus({ orderID, ntpID: payload?.payment?.ntpID });
    const status = json?.payment?.status ?? payload?.payment?.status;
    const amount = json?.order?.amount;
    const email  = json?.order?.billing?.email;

    if (!isPaid(status)) {
      console.warn('IPN fără plată confirmată', {
        orderID,
        status,
        statusFromQuery: json?.payment?.status,
        statusFromIpn: payload?.payment?.status,
        queryError: json?.error,
      });
      if (status === STATUS.FRAUD) {
        await notifyStaff('Comandă marcată ca fraudă: ' + orderID,
          'Comanda ' + orderID + ' a fost marcată pentru verificare antifraudă. Nu a fost livrată.');
      } else if (status === STATUS.CREDIT) {
        await notifyStaff('Rambursare înregistrată: ' + orderID,
          'Comanda ' + orderID + ' a fost rambursată. Verifică dacă documentul a fost deja descărcat.');
      }
      return res.status(200).json(OK_RESPONSE);
    }

    if (typeof amount === 'number' && Math.round(amount * 100) !== Math.round(parsed.price * 100)) {
      console.error('IPN cu sumă neconcordantă', { orderID, amount, expected: parsed.price });
      await notifyStaff('Sumă neconcordantă: ' + orderID,
        'Comanda ' + orderID + ' a venit cu suma ' + amount + ' în loc de ' + parsed.price + '. Nu a fost livrată automat.');
      return res.status(200).json(OK_RESPONSE);
    }

    if (!email) {
      console.error('IPN fără email de facturare', orderID);
      await notifyStaff('Comandă plătită fără email: ' + orderID,
        'Comanda ' + orderID + ' este plătită, dar nu am putut extrage adresa de email. Livrează manual.');
      return res.status(200).json(OK_RESPONSE);
    }

    if (await alreadyDelivered(orderID)) {
      return res.status(200).json(OK_RESPONSE);
    }

    /* Marcăm DUPĂ trimitere, nu înainte. Dacă emailul eșuează, comanda
       rămâne nemarcată și a doua notificare (PAID, apoi CONFIRMED) mai
       încearcă o dată. Riscul invers, un email dublu, e mult mai puțin
       grav decât un client care a plătit și nu primește nimic. */
    await sendDelivery({ email, product: parsed.product, orderID, billing: json?.order?.billing });
    await markDelivered(orderID, { email, sku: parsed.sku, at: new Date().toISOString() });

    /* Facturarea vine după livrare și nu o poate bloca: clientul a plătit,
       deci trebuie să primească documentul chiar dacă Oblio e indisponibil.
       O factură lipsă se rezolvă manual, dintr-o notificare. */
    await invoiceOrder({ orderID, parsed, statusOrder: json?.order, fallbackEmail: email });

    return res.status(200).json(OK_RESPONSE);
  } catch (err) {
    console.error('IPN processing error', err);
    await notifyStaff('Eroare la procesarea unei comenzi',
      'A apărut o eroare la procesarea unei notificări de plată:\n\n' + (err && err.stack ? err.stack : String(err)));
    return res.status(200).json(OK_RESPONSE);
  }
}
