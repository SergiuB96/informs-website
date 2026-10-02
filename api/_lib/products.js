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

  'INF-PTE-BA': {
    idx: 'h',
    title: 'PTE Lucrari de beton armat',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Lucrari_beton_armat_v1.0.docx',
    fileName: 'INFORMS - PTE Lucrari de beton armat v1.0.docx',
  },

  'INF-PTE-PAV': {
    idx: 'i',
    title: 'PTE Lucrari de pavaje si borduri',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Lucrari_pavaje_si_borduri_v1.0.docx',
    fileName: 'INFORMS - PTE Lucrari de pavaje si borduri v1.0.docx',
  },

  'INF-PTE-HID': {
    idx: 'j',
    title: 'PTE Lucrari de hidroizolatii cu membrane',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Lucrari_hidroizolatii-membrane_v1.0.docx',
    fileName: 'INFORMS - PTE Lucrari de hidroizolatii cu membrane v1.0.docx',
  },

  'INF-PTE-IEL': {
    idx: 'k',
    title: 'PTE Instalatii electrice de joasa tensiune',
    price: 49,
    blobPath: 'produse/constructii/proceduri-tehnice/PTE_Instalatii-electrice-joasa-tensiune_v1.0.docx',
    fileName: 'INFORMS - PTE Instalatii electrice de joasa tensiune v1.0.docx',
  },

  /* Cele trei produse plătite de la început erau doar de test și nu
     au avut niciodată fișier în Blob. Un produs real se adaugă aici și
     în SHOP_PRODUCTS (Shop.jsx), cu același sku și același preț:

  'INF-XXX': {
    idx: 'j',                        // o literă nefolosită (lista de mai jos)
    title: 'Denumirea produsului',
    price: 199,
    blobPath: 'produse/fisier.docx',
    fileName: 'INFORMS - Denumire.docx',
  },

     Indexuri deja folosite, a nu se refolosi: a, b, c, d, t (produse
     scoase), e (INF-PTE-TRS), f (INF-PTE-SAP), g (INF-PTE-IMP),
     h (INF-PTE-BA), i (INF-PTE-PAV), j (INF-PTE-HID), k (INF-PTE-IEL).
     Următorul liber: l. Un orderID vechi s-ar potrivi altfel cu
     produsul nou.

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
