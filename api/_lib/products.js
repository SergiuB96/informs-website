/* Catalogul autoritativ de produse.
 *
 * Prețul folosit la plată se ia EXCLUSIV de aici, niciodată din
 * cererea clientului. SKU-urile trebuie să corespundă cu cele din
 * SHOP_PRODUCTS (Shop.jsx); prețurile trebuie ținute sincronizate
 * manual între cele două locuri.
 *
 * blobPath = calea fișierului în Vercel Blob privat. Fișierele se
 * încarcă separat, nu fac parte din repository.
 *
 * Foldere în Blob, pe domenii:
 *   produse/constructii/proceduri-tehnice/   proceduri tehnice de execuție (.docx)
 */

const PRODUCTS = {
  'INF-PTE-TRS': {
    idx: 'e',
    title: 'PTE Trasarea constructiilor',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Trasare_constructii_v1.0.docx',
    fileName: 'INFORMS - PTE Trasarea constructiilor v1.0.docx',
  },

  'INF-PTE-SAP': {
    idx: 'f',
    title: 'PTE Lucrari de sape de ciment',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Lucrari_sape_de_ciment_v1.0.docx',
    fileName: 'INFORMS - PTE Lucrari de sape de ciment v1.0.docx',
  },

  'INF-PTE-IMP': {
    idx: 'g',
    title: 'PTE Lucrari de imprejmuiri si porti',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Lucrari_imprejmuiri_si_porti_v1.0.docx',
    fileName: 'INFORMS - PTE Lucrari de imprejmuiri si porti v1.0.docx',
  },

  /* Cele trei produse plătite de la început erau doar de test și nu
     au avut niciodată fișier în Blob. Un produs real se adaugă aici și
     în SHOP_PRODUCTS (Shop.jsx), cu același sku și același preț:

  'INF-XXX': {
    idx: 'e',                        // o literă, unică; intră în orderID
    title: 'Denumirea produsului',
    price: 199,
    blobPath: 'produse/fisier.docx',
    fileName: 'INFORMS - Denumire.docx',
  },

     Indexuri deja folosite, a nu se refolosi: a, b, c, d, t (produse
     scoase), e (INF-PTE-TRS), f (INF-PTE-SAP), g (INF-PTE-IMP). Următorul liber: h. Un orderID vechi s-ar potrivi altfel cu produsul nou.

     Pentru un nou test de plată: un SKU ascuns (`hidden` în Shop.jsx),
     cu un fișier neutru în Blob, niciodată un document de client.
     Testul din 28.09.2026 a folosit INF-TEST-010, 0,1 RON, idx 't',
     produse/test-plata.txt. */
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
