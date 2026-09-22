/* Catalogul autoritativ de produse.
 *
 * Prețul folosit la plată se ia EXCLUSIV de aici, niciodată din
 * cererea clientului. SKU-urile trebuie să corespundă cu cele din
 * SHOP_PRODUCTS (Shop.jsx); prețurile trebuie ținute sincronizate
 * manual între cele două locuri.
 *
 * blobPath = calea fișierului în Vercel Blob privat. Fișierele se
 * încarcă separat, nu fac parte din repository.
 */

const PRODUCTS = {
  /* Gol: cele trei produse plătite de până acum erau doar de test și nu
     au avut niciodată fișier în Blob. Un produs real se adaugă aici și
     în SHOP_PRODUCTS (Shop.jsx), cu același sku și același preț:

  'INF-XXX': {
    idx: 'a',                        // o literă, unică; intră în orderID
    title: 'Denumirea produsului',
    price: 199,
    blobPath: 'produse/fisier.docx',
    fileName: 'INFORMS - Denumire.docx',
  },

     Pentru un nou test de plată: un SKU ascuns (`hidden` în Shop.jsx),
     cu un fișier neutru în Blob, niciodată un document de client. */
};

/* Indexul scurt folosit în orderID, ca să încapă în cele 64 de caractere. */
const BY_IDX = Object.fromEntries(
  Object.entries(PRODUCTS).map(([sku, p]) => [p.idx, { sku, ...p }])
);

function getProduct(sku) {
  const p = PRODUCTS[sku];
  return p ? { sku, ...p } : null;
}

module.exports = { PRODUCTS, BY_IDX, getProduct };
