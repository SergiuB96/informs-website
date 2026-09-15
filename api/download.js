import { head } from '@vercel/blob';
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
    const blob = await head(product.blobPath);
    const upstream = await fetch(blob.downloadUrl || blob.url);
    if (!upstream.ok) throw new Error('Blob fetch failed: ' + upstream.status);

    res.setHeader('Content-Type', blob.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="' + product.fileName + '"');
    if (blob.size) res.setHeader('Content-Length', String(blob.size));

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('download error', { sku: claims.sku, orderID: claims.orderID, message: err.message });
    return res.status(500).send('Documentul nu a putut fi livrat. Scrie-ne la office@informs.ro cu numărul comenzii.');
  }
}
