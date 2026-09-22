import { list } from '@vercel/blob';
import { parseOrderID, getStatus, isPaid, isFailed } from './_lib/netopia.js';

/* Pagina de întoarcere din 3DS și interogarea de stare a comenzii.
 *
 * NETOPIA trimite clientul înapoi cu GET ?orderId=... (atenție la
 * literă: orderId aici, orderID în corpul cererii de plată). Acceptăm
 * și POST, defensiv, pentru configurațiile care întorc prin formular.
 *
 * Cu ?format=json răspunde {state} în loc de redirect: pagina
 * „Stare comandă” îl folosește ca să reverifice cât timp plata e în curs.
 *
 * Endpoint-ul este strict informativ. Livrarea se face exclusiv din
 * webhook-ul IPN, care este singurul canal autentificat criptografic. */

function outcome(status) {
  if (isPaid(status)) return 'ok';
  if (isFailed(status)) return 'fail';
  return 'pending';
}

/* Marcajul scris de IPN după trimiterea emailului de livrare. Dacă
   există, plata a fost verificată criptografic și documentul a plecat,
   deci e un răspuns mai sigur decât interogarea de status. */
async function isDelivered(orderID) {
  try {
    const { blobs } = await list({ prefix: 'orders/' + orderID + '.delivered', limit: 1 });
    return blobs.length > 0;
  } catch (err) {
    console.error('netopia-return: marcajul de livrare nu a putut fi citit', { orderID, message: err.message });
    return false;
  }
}

async function orderState(orderID) {
  /* orderID-ul e semnat HMAC; unul fabricat nu ajunge la Blob sau la NETOPIA. */
  const parsed = parseOrderID(orderID);
  if (!parsed) return 'pending';

  if (await isDelivered(parsed.orderID)) return 'ok';

  try {
    const { status: http, json } = await getStatus({ orderID: parsed.orderID });
    const state = outcome(json?.payment?.status);
    if (state !== 'ok') {
      console.warn('netopia-return fără plată confirmată', {
        orderID: parsed.orderID, http, paymentStatus: json?.payment?.status, error: json?.error,
      });
    }
    return state;
  } catch (err) {
    console.error('netopia-return error', err);
    return 'pending';
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const orderID = String(
    (req.query && (req.query.orderId || req.query.orderID)) ||
    (req.body && (req.body.orderId || req.body.orderID)) ||
    ''
  ).slice(0, 64);

  const cancelled = req.query && req.query.c === '1';
  if (cancelled) console.warn('netopia-return pe cancelUrl', { orderID, query: req.query });

  const state = cancelled ? 'fail' : await orderState(orderID);

  if (req.query && req.query.format === 'json') {
    return res.status(200).json({ state });
  }

  const o = orderID ? '&o=' + encodeURIComponent(orderID) : '';
  res.writeHead(303, { Location: '/comanda-finalizata?s=' + state + o });
  res.end();
}
