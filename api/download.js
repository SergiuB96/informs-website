import { get, put } from '@vercel/blob';
import { verifyDownloadToken } from './_lib/netopia.js';
import { getProduct } from './_lib/products.js';

/* Livrarea fișierelor plătite.
 *
 * Fișierele stau în Vercel Blob cu acces privat, nu sub /assets, ca să
 * nu poată fi descărcate de cine ghicește URL-ul. Accesul se face doar
 * cu un token semnat HMAC, emis de webhook-ul IPN după confirmarea
 * plății, și care expiră.
 *
 * Fără bază de date nu putem limita numărul de descărcări sau revoca un
 * token înainte de expirare - de aceea durata de viață este scurtă. */

/* Începerea descărcării este momentul în care consumatorul pierde
   dreptul de retragere (art. 16 lit. m din OUG 34/2014), deci trebuie
   să-l putem dovedi. Marcajul stă lângă cel de livrare din IPN. Dacă
   scrierea eșuează, descărcarea merge înainte: clientul a plătit. */
async function recordDownload(orderID, sku) {
  const at = new Date().toISOString();
  try {
    await put('orders/' + orderID + '.downloads/' + at.replace(/[:.]/g, '-') + '.json',
      JSON.stringify({ orderID, sku, downloadStartedAt: at }), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
  } catch (err) {
    console.error('download record failed', { orderID, sku, at, message: err.message });
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const claims = verifyDownloadToken(req.query && req.query.t);
  if (!claims) {
    return res.status(403).send('Link invalid sau expirat. Scrie-ne la office@informs.ro și îți trimitem unul nou.');
  }

  const product = getProduct(claims.sku);
  if (!product) {
    return res.status(404).send('Produsul nu mai este disponibil.');
  }

  try {
    /* Store-ul e privat: un fetch() simplu pe URL-ul blob-ului e respins,
       get() se autentifică prin OIDC (BLOB_STORE_ID) sau BLOB_READ_WRITE_TOKEN. */
    const result = await get(product.blobPath, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) throw new Error('Blob not found: ' + product.blobPath);
    const blob = result.blob;

    await recordDownload(claims.orderID, claims.sku);

    res.setHeader('Content-Type', blob.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="' + product.fileName + '"');
    if (blob.size) res.setHeader('Content-Length', String(blob.size));

    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('download error', { sku: claims.sku, orderID: claims.orderID, message: err.message });
    return res.status(500).send('Documentul nu a putut fi livrat. Scrie-ne la office@informs.ro cu numărul comenzii.');
  }
}
