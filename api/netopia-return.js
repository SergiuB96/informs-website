import { parseOrderID, getStatus, isPaid, isFailed } from './_lib/netopia.js';

/* Pagina de întoarcere din 3DS.
 *
 * NETOPIA trimite clientul înapoi cu GET ?orderId=... (atenție la
 * literă: orderId aici, orderID în corpul cererii de plată). Acceptăm
 * și POST, defensiv, pentru configurațiile care întorc prin formular.
 *
 * Endpoint-ul este strict cosmetic. Livrarea se face exclusiv din
 * webhook-ul IPN, care este singurul canal autentificat criptografic. */

function outcome(status) {
  if (isPaid(status)) return 'ok';
  if (isFailed(status)) return 'fail';
  return 'pending';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const orderID =
    (req.query && (req.query.orderId || req.query.orderID)) ||
    (req.body && (req.body.orderId || req.body.orderID)) ||
    '';

  let state = 'pending';

  if (req.query && req.query.c === '1') {
    console.warn('netopia-return pe cancelUrl', { orderID, query: req.query });
    state = 'fail';
  } else {
    try {
      const parsed = parseOrderID(String(orderID));
      if (parsed) {
        const { status: http, json } = await getStatus({ orderID: parsed.orderID });
        state = outcome(json?.payment?.status);
        if (state !== 'ok') {
          console.warn('netopia-return fără plată confirmată', {
            orderID: parsed.orderID, http, paymentStatus: json?.payment?.status, error: json?.error,
          });
        }
      }
    } catch (err) {
      console.error('netopia-return error', err);
    }
  }

  res.writeHead(303, { Location: '/comanda-finalizata?s=' + state });
  res.end();
}
