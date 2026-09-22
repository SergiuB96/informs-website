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
  'INF-CS-PROD': {
    idx: 'a',
    title: 'Caiet de sarcini - achiziție de produse',
    price: 249,
    blobPath: 'produse/caiet-sarcini-produse.docx',
    fileName: 'INFORMS - Caiet de sarcini - achizitie produse.docx',
  },
  'INF-STR-CTR': {
    idx: 'b',
    title: 'Strategia de contractare - model complet',
    price: 199,
    blobPath: 'produse/strategie-contractare.docx',
    fileName: 'INFORMS - Strategia de contractare.docx',
  },
  'INF-PCK-SERV': {
    idx: 'c',
    title: 'Pachet documentație de atribuire - servicii',
    price: 499,
    blobPath: 'produse/pachet-documentatie-servicii.zip',
    fileName: 'INFORMS - Pachet documentatie atribuire servicii.zip',
  },
  /* Pentru un nou test de plată: un SKU ascuns (`hidden` în Shop.jsx),
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
