/* ══════════════════════════════════════════════════
   CONFIG - sursă unică pentru datele firmei și pentru
   regulile comerciale afișate pe site.
   ──────────────────────────────────────────────────
   Se încarcă PRIMUL, înaintea lui Layout.js, ca datele
   să fie disponibile în toate celelalte fișiere prin
   window.COMPANY / window.COMMERCE / window.LEGAL_STYLES.

   ⚠️  Câmpurile marcate TODO trebuie completate înainte
   de deploy. Cât timp conțin marcajul, nu se afișează
   nicăieri pe site - mai bine lipsesc decât să apară
   date de identificare false.
══════════════════════════════════════════════════ */

const TODO = '«TODO»';

const COMPANY = {
  name:         'MILBAC MANAGEMENT S.R.L.',
  brand:        'INFORMS',
  website:      'www.informs.ro',
  url:          'https://www.informs.ro',
  /* Verificate în registrul ANAF (webservicesp.anaf.ro) la 15.09.2026.
     Fără prefix RO la CUI: societatea nu este înregistrată în scopuri de TVA. */
  cui:          '44991231',
  regCom:       'J26/1603/2021',
  address:      'Bld. Pandurilor nr. 86, et. 3, ap. 11, Târgu Mureș, jud. Mureș, 540487',
  phone:        TODO,   // ex: +40 712 345 678 - singurul câmp care mai lipsește
  email:        'office@informs.ro',
  schedule:     'Luni – Vineri, 09:00 – 17:00',
  shareCapital: TODO,   // opțional, ex: 200 RON
  iban:         TODO,   // opțional
  bank:         TODO,   // opțional
};

/* Un câmp e utilizabil doar dacă a fost completat. */
function hasValue(v) {
  return typeof v === 'string' && v.length > 0 && v !== TODO;
}

/* Rândurile de identificare, deja filtrate - folosite în footer,
   pe pagina de contact și în blocurile „operator” din pagini legale. */
function companyRows() {
  return [
    { label: 'Denumire',            val: COMPANY.name },
    { label: 'CUI',                 val: COMPANY.cui },
    { label: 'Nr. Reg. Comerțului', val: COMPANY.regCom },
    { label: 'Sediul social',       val: COMPANY.address },
    { label: 'Telefon',             val: COMPANY.phone, href: 'tel:' + String(COMPANY.phone).replace(/\s/g, '') },
    { label: 'Email',               val: COMPANY.email, href: 'mailto:' + COMPANY.email },
    { label: 'Program',             val: COMPANY.schedule },
  ].filter(r => hasValue(r.val));
}

/* ─── Reguli comerciale ─────────────────────────── */
const COMMERCE = {
  currency:         'RON',
  vatRegistered:    false,
  priceNote:        'Preț final. Societate neplătitoare de TVA.',
  deliveryNote:     'Livrare electronică, imediat după confirmarea plății.',
  deliveryMaxHours: 24,
  withdrawalDays:   14,
  refundDays:       14,
  invoiceHours:     24,
  seller:           'comerciant (vânzător direct)',
  paymentMethods: [
    'Card bancar online (Visa / Mastercard), procesat de NETOPIA Payments',
    'Transfer bancar, pe baza facturii proforma',
  ],
};

function fmtPrice(value) {
  return value + ' ' + COMMERCE.currency;
}

/* ─── Stiluri comune paginilor legale ───────────── */
const LEGAL_STYLES = {
  h2:      { fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginTop: '36px', marginBottom: '10px' },
  p:       { color: 'var(--text-2)', fontSize: '0.97rem', lineHeight: '1.82', marginBottom: '14px' },
  ul:      { color: 'var(--text-2)', fontSize: '0.97rem', lineHeight: '1.82', paddingLeft: '22px', marginBottom: '14px' },
  divider: { borderTop: '1px solid var(--border)', margin: '32px 0' },
  meta:    { fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: '32px' },
  link:    { color: 'var(--blue-a)' },
};

Object.assign(window, { COMPANY, COMMERCE, LEGAL_STYLES, companyRows, hasValue, fmtPrice });
