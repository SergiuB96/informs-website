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
    title: 'Caiet de sarcini - achizitie de produse',
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
    title: 'Pachet documentatie de atribuire - servicii',
    price: 499,
    blobPath: 'produse/pachet-documentatie-servicii.zip',
    fileName: 'INFORMS - Pachet documentatie atribuire servicii.zip',
  },
  /* Produs de test pentru fluxul de plată, ascuns în magazin (vezi
     `hidden` în Shop.jsx). Refolosește fișierul strategiei. De scos
     după ce testul NETOPIA + Oblio trece. */
  'INF-TEST-10': {
    idx: 'd',
    title: 'Test plata INFORMS',
    price: 10,
    blobPath: 'produse/strategie-contractare.docx',
    fileName: 'INFORMS - Test plata.docx',
  },
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
