const { useState, useEffect } = React;

/* ══════════════════════════════════════════════════
   SHOP - Marketplace produse digitale INFORMS
   ──────────────────────────────────────────────────
   Adaugă sau editează produse în array-ul SHOP_PRODUCTS
   de mai jos. Fiecare produs are câmpuri auto-explicative.
══════════════════════════════════════════════════ */

/* ─── Date produse ───────────────────────────────
   format: 'word' | 'excel' | 'pdf' | 'pachet'
   category: 'achizitii' | 'delegare' | 'management' | 'monitorizare'
       Opțional. Nu are filtru în pagină până la ~12 produse („Ce vrei
       să faci”); acum servește doar linkurile din meniu (/magazin#achizitii).
   audiences: publicul, pentru filtrul „Pentru cine”:
       'autoritati' | 'ofertanti' | 'constructii'
   shelf: 'uzuale' pune produsul pe raftul „Formulare uzuale”, sub
       catalog, fără public și nepromovat.
   forWhom: fraza „Pentru cine” din fereastra produsului.
   version, updated: versiunea fișierului (ca în numele lui, _v1.0)
       și luna în care a fost publicată.
   cv: clasă CSS pe antetul cardului (cv-word | cv-excel | cv-pdf | cv-atr).
       În css/shop.css toate au același antet navy; formatul se citește
       din eticheta DOC/XLS/PDF, nu din culoare.
   file: calea relativă către fișier - DOAR pentru produse gratuite
         ex: 'assets/produse/gratuite/pdf/ghid-termeni.pdf'
   sku:  cod unic de produs, obligatoriu pentru produsele cu preț.
         Trebuie să existe și în api/_lib/products.js, de unde se ia
         prețul la plată. Prețul de aici este doar pentru afișare;
         serverul nu are încredere în el niciodată.

   hidden: true scoate produsul din listă; apare doar cu /magazin?test=1.

   ⚠️ Produsele cu preț NU au câmp 'file'. Fișierele lor stau în
   Vercel Blob privat și se livrează prin link semnat, după plată.
─────────────────────────────────────────────────── */
const SHOP_PRODUCTS = [
  {
    id: 'contract-instrainare-mijloc-transport',
    title: 'Contract de înstrăinare-dobândire mijloc de transport',
    shortDesc: 'Model de contract pentru transferul dreptului de proprietate asupra unui mijloc de transport.',
    longDesc: 'Modelul oficial de contract pentru înstrăinarea și dobândirea unui mijloc de transport, preluat din sursa publică și transformat de INFORMS în formular PDF completabil. Înainte de folosire, verifică dacă autoritatea la care depui actele cere versiunea actuală a modelului.',
    shelf: 'uzuale',
    forWhom: 'Persoanele și firmele care vând sau cumpără un vehicul.',
    version: '1.0',
    updated: 'mai 2026',
    format: 'pdf',
    cv: 'cv-pdf',
    price: 0,
    featured: false,
    isNew: false,
    tags: ['Contract', 'Mijloc de transport', 'Înstrăinare'],
    includes: [
      'Contract de înstrăinare-dobândire (PDF completabil)',
    ],
    stats: { files: 1, pages: 0 },
    file: 'assets/produse/gratuite/pdf/Contract%20de%20instrainare-dobandire%20mijloc%20de%20transport_v1.0.pdf',
  },
  {
    id: 'fisa-consultatii-medicale-permis',
    title: 'Fișă consultații medicale - permis conducere',
    shortDesc: 'Formular pentru înregistrarea consultațiilor medicale în vederea obținerii sau reînnoirii permisului de conducere.',
    longDesc: 'Fișa oficială pentru consultațiile medicale necesare obținerii sau reînnoirii permisului de conducere, preluată din sursa publică și transformată de INFORMS în formular PDF completabil.',
    shelf: 'uzuale',
    forWhom: 'Persoanele care obțin sau reînnoiesc permisul de conducere.',
    version: '1.0',
    updated: 'mai 2026',
    format: 'pdf',
    cv: 'cv-pdf',
    price: 0,
    featured: false,
    isNew: false,
    tags: ['Fișă medicală', 'Permis conducere', 'Formulare'],
    includes: [
      'Fișă consultații medicale (PDF completabil)',
    ],
    stats: { files: 1, pages: 0 },
    file: 'assets/produse/gratuite/pdf/Fisa%20consultatii%20medicale_permis%20conducere_v1.0.pdf',
  },
  {
    id: 'formular-f14-incepere-lucrari',
    title: 'Formular F.14 - Comunicare începere execuție lucrări',
    shortDesc: 'Formular oficial pentru comunicarea datei de începere a execuției lucrărilor de construcții către Inspectoratul de Stat în Construcții.',
    longDesc: 'Formularul oficial prin care titularul autorizației de construire comunică Inspectoratului de Stat în Construcții data de începere a execuției lucrărilor, prevăzut de normele de aplicare ale Legii nr. 50/1991. Preluat din sursa publică și transformat de INFORMS în formular PDF completabil.',
    audiences: ['constructii'],
    forWhom: 'Titularul autorizației de construire, persoană, firmă sau autoritate, și cei care pregătesc actele în numele lui.',
    version: '1.0',
    updated: 'mai 2026',
    format: 'pdf',
    cv: 'cv-pdf',
    price: 0,
    featured: false,
    isNew: false,
    tags: ['F.14', 'Execuție lucrări', 'Construcții'],
    includes: [
      'Formular F.14 (PDF completabil)',
    ],
    stats: { files: 1, pages: 0 },
    file: 'assets/produse/gratuite/pdf/Formular%20F.14%20Comunicare%20privind%20inceperea%20executiei%20lucrarilor_v1.0.pdf',
  },
  {
    id: 'proces-verbal-receptie-lucrari',
    title: 'Proces-verbal recepție la terminarea lucrărilor',
    shortDesc: 'Model de proces-verbal pentru recepția la terminarea lucrărilor de construcții, după Regulamentul de recepție a construcțiilor.',
    longDesc: 'Modelul de proces-verbal de recepție la terminarea lucrărilor, din anexele HG nr. 343/2017 privind recepția construcțiilor. Preluat din sursa publică și transformat de INFORMS în formular PDF completabil.',
    audiences: ['autoritati', 'constructii'],
    forWhom: 'Comisiile de recepție, beneficiarii lucrărilor (inclusiv autoritățile contractante), executanții și diriginții de șantier.',
    version: '1.0',
    updated: 'mai 2026',
    format: 'pdf',
    cv: 'cv-pdf',
    price: 0,
    featured: false,
    isNew: false,
    tags: ['Recepție lucrări', 'Proces-verbal', 'Construcții'],
    includes: [
      'Proces-verbal recepție terminare lucrări (PDF completabil)',
    ],
    stats: { files: 1, pages: 0 },
    file: 'assets/produse/gratuite/pdf/Proces-verbal_receptie%20terminare%20lucrari_v1.0.pdf',
  },
  {
    id: 'proces-verbal-receptie-partiala',
    title: 'Proces-verbal de recepție parțială',
    shortDesc: 'Model de proces-verbal privind stadiul fizic de execuție a lucrărilor de construcții, pentru recepția unei etape sau a unei părți din investiție.',
    longDesc: 'Modelul de proces-verbal prin care executantul și investitorul consemnează stadiul fizic de execuție a construcției la o anumită dată, în cadrul contractului de lucrări. Cuprinde identificarea imobilului și a autorizației de construire, participanții, dirigintele de șantier care asigură secretariatul, stadiul fizic constatat și mențiunile părților. Transformat de INFORMS în formular PDF completabil.',
    audiences: ['autoritati', 'constructii'],
    forWhom: 'Investitorii și beneficiarii lucrărilor (inclusiv autoritățile contractante), executanții și diriginții de șantier.',
    version: '1.0',
    updated: 'septembrie 2026',
    format: 'pdf',
    cv: 'cv-pdf',
    price: 0,
    featured: false,
    isNew: true,
    tags: ['Recepție parțială', 'Stadiu fizic', 'Construcții'],
    includes: [
      'Proces-verbal de recepție parțială (PDF completabil, 2 pagini)',
    ],
    stats: { files: 1, pages: 2 },
    file: 'assets/produse/gratuite/pdf/Proces_verbal_receptie_partiala_v1.0.pdf',
  },
  {
    id: 'pte-trasarea-constructiilor',
    sku: 'INF-PTE-TRS',
    title: 'Procedură tehnică de execuție: trasarea construcțiilor',
    shortDesc: 'Procedură tehnică de execuție (PTE) pentru trasarea pe teren a construcțiilor civile, industriale și agricole, de la rețeaua de trasare la trasarea de detaliu și recepția pe faze determinante.',
    longDesc: 'Stabilește metodologia, cerințele de calitate și responsabilitățile pentru trasarea planimetrică și altimetrică a construcțiilor noi, a extinderilor și a consolidărilor, pe baza planului de trasare al proiectantului. Trimite la Legea nr. 10/1995, HG nr. 273/1994 cu modificările din HG nr. 343/2017, normativul C 83-75 și STAS 9824/0-74 și 9824/1-87. Document Word editabil, de adaptat la datele concrete ale lucrării.',
    audiences: ['constructii'],
    forWhom: 'Executanții de lucrări de construcții (RTE, șef de șantier, topometrist, responsabil control calitate) și diriginții de șantier.',
    version: '1.0',
    updated: 'septembrie 2026',
    format: 'word',
    cv: 'cv-word',
    price: 49,
    featured: false,
    isNew: true,
    tags: ['PTE', 'Trasare', 'Construcții'],
    includes: [
      'Scop, domeniu de aplicare și documente de referință',
      'Definiții și prescurtări (RTE, SPL, CQ, PVLA, RNC)',
      'Responsabilități pe funcții, de la RTE la dirigintele de șantier',
      'Resurse: personal, echipamente topometrice, materiale',
      'Tehnologia de execuție, toleranțe și controlul calității',
      'Recepția pe faze determinante și înregistrările obligatorii',
    ],
    stats: { files: 1, pages: 11 },
  },
  {
    id: 'pte-lucrari-sape-de-ciment',
    sku: 'INF-PTE-SAP',
    title: 'Procedură tehnică de execuție: lucrări de șape de ciment',
    shortDesc: 'Procedură tehnică de execuție (PTE) pentru șapele de ciment în aderență, glisante și flotante, de la pregătirea stratului suport la îngrijirea după turnare și recepția pe faze determinante.',
    longDesc: 'Stabilește metodologia, cerințele de calitate și responsabilitățile pentru executarea șapelor de ciment ca strat de egalizare sau suport pentru pardoseli, în clădiri noi și la reabilitări, cu aplicare manuală sau mecanizată. Trimite la Legea nr. 10/1995, HG nr. 273/1994 cu modificările din HG nr. 343/2017, normativele GP 037/98 și C 35-82 și SR EN 13813. Document Word editabil, de adaptat la datele concrete ale lucrării.',
    audiences: ['constructii'],
    forWhom: 'Executanții de lucrări de construcții (RTE, șef de șantier, șef de punct de lucru, responsabil control calitate) și diriginții de șantier.',
    version: '1.0',
    updated: 'septembrie 2026',
    format: 'word',
    cv: 'cv-word',
    price: 49,
    featured: false,
    isNew: true,
    tags: ['PTE', 'Șape', 'Pardoseli'],
    includes: [
      'Scop, domeniu de aplicare și documente de referință',
      'Tipuri de șapă: în aderență, glisantă, flotantă',
      'Definiții și prescurtări (RTE, SPL, CQ, PVLA, RNC)',
      'Responsabilități pe funcții, de la RTE la dirigintele de șantier',
      'Resurse: personal, utilaje, materiale',
      'Tehnologia de execuție, toleranțe de planeitate și controlul calității',
      'Recepția pe faze determinante și înregistrările obligatorii',
    ],
    stats: { files: 1, pages: 12 },
  },
  {
    id: 'pte-lucrari-imprejmuiri-si-porti',
    sku: 'INF-PTE-IMP',
    title: 'Procedură tehnică de execuție: împrejmuiri și porți',
    shortDesc: 'Procedură tehnică de execuție (PTE) pentru împrejmuiri și porți: fundațiile stâlpilor, montarea stâlpilor și a panourilor, porți batante și glisante, recepția pe faze determinante.',
    longDesc: 'Stabilește metodologia, cerințele de calitate și responsabilitățile pentru executarea împrejmuirilor perimetrale și interioare, cu stâlpi metalici sau din beton și panouri din plasă de sârmă, tablă, lemn sau PVC, inclusiv porțile batante și glisante cu accesoriile de închidere. Trimite la Legea nr. 10/1995, HG nr. 273/1994 cu modificările din HG nr. 343/2017, NP 112-2014, C 150-1999, SR EN 1090-2 și seria SR EN 10223. Document Word editabil, de adaptat la datele concrete ale lucrării.',
    audiences: ['constructii'],
    forWhom: 'Executanții de lucrări de construcții (RTE, șef de șantier, șef de punct de lucru, responsabil control calitate) și diriginții de șantier.',
    version: '1.0',
    updated: 'septembrie 2026',
    format: 'word',
    cv: 'cv-word',
    price: 49,
    featured: false,
    isNew: true,
    tags: ['PTE', 'Împrejmuiri', 'Porți'],
    includes: [
      'Scop, domeniu de aplicare și documente de referință',
      'Definiții și prescurtări (RTE, SPL, CQ, PVLA, RNC)',
      'Responsabilități pe funcții, de la RTE la dirigintele de șantier',
      'Resurse: personal, utilaje, materiale (stâlpi, panouri, beton, armătură)',
      'Fundații izolate, montajul stâlpilor, panourilor și porților',
      'Toleranțe, controlul calității și îmbinările sudate',
      'Recepția pe faze determinante și înregistrările obligatorii',
    ],
    stats: { files: 1, pages: 13 },
  },
  {
    id: 'pte-lucrari-beton-armat',
    sku: 'INF-PTE-BA',
    title: 'Procedură tehnică de execuție: lucrări de beton armat',
    shortDesc: 'Procedură tehnică de execuție (PTE) pentru structuri din beton armat monolit: armare, cofrare, turnare, compactare, protecție și decofrare, cu recepția pe faze determinante.',
    longDesc: 'Stabilește metodologia, cerințele de calitate și responsabilitățile pentru fundații, stâlpi, grinzi, plăci, pereți structurali și scări din beton armat monolit, în clasele C12/15 până la C40/50, cu beton de la stație autorizată sau preparat pe șantier. Trimite la Legea nr. 10/1995, HG nr. 273/1994 cu modificările din HG nr. 343/2017, NE 012/1-2007, NE 012/2-2010, SR EN 206 și SR EN 13670. Document Word editabil, de adaptat la datele concrete ale lucrării.',
    audiences: ['constructii'],
    forWhom: 'Executanții de lucrări de construcții (RTE, șef de șantier, șef de punct de lucru, responsabil control calitate) și diriginții de șantier.',
    version: '1.0',
    updated: 'septembrie 2026',
    format: 'word',
    cv: 'cv-word',
    price: 49,
    featured: false,
    isNew: true,
    tags: ['PTE', 'Beton armat', 'Structuri'],
    includes: [
      'Scop, domeniu de aplicare și documente de referință',
      'Definiții și prescurtări (RTE, SPL, CQ, PVLA, RNC)',
      'Responsabilități pe funcții, de la RTE la dirigintele de șantier',
      'Resurse: personal, utilaje, materiale (beton, armătură, cofraje)',
      'Armare, cofrare, turnare, compactare, protecție și decofrare',
      'Toleranțe, încercări pe beton și controlul calității',
      'Recepția pe faze determinante și înregistrările obligatorii',
    ],
    stats: { files: 1, pages: 14 },
  },
];

const SHOW_HIDDEN = new URLSearchParams(window.location.search).get('test') === '1';

/* ─── Filtre: public × format × „Doar gratuite” ──
   Categoriile (ce vrei să faci) primesc filtru propriu de la ~12
   produse. Până atunci le folosesc doar linkurile din meniu, care
   ascund categoriile goale prin shopHasProducts. */
const SHOP_CATEGORIES = ['achizitii', 'delegare', 'management', 'monitorizare'];

/* Produsele pe care vizitatorul le vede. Un filtru fără niciun produs
   vizibil nu apare: un raft gol arată ca un magazin părăsit. */
const VISIBLE_PRODUCTS = SHOP_PRODUCTS.filter(p => !p.hidden || SHOW_HIDDEN);
const hasProducts = id =>
  id === 'all' ||
  (id === 'gratuite' ? VISIBLE_PRODUCTS.some(p => p.price === 0)
                     : VISIBLE_PRODUCTS.some(p => p.category === id));

/* Paginile statice trimit la /magazin#gratuite etc. Aplicația nu vede
   ancora în cale, deci o citim aici; o ancoră necunoscută sau spre o
   categorie goală lasă magazinul pe „Toate produsele”. */
function categoryFromHash(fallback) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return (id === 'gratuite' || SHOP_CATEGORIES.includes(id)) && hasProducts(id) ? id : fallback;
}

/* Fiecare produs are adresa proprie, /magazin/<id>. Ascunsele raman
   accesibile doar cu ?test=1, ca in lista. */
function productBySlug(slug) {
  return VISIBLE_PRODUCTS.find(p => p.id === slug) || null;
}

const AUDIENCES = [
  { id: 'autoritati',  label: 'Autorități' },
  { id: 'ofertanti',   label: 'Ofertanți' },
  { id: 'constructii', label: 'Construcții și proiecte' },
].filter(a => VISIBLE_PRODUCTS.some(p => (p.audiences || []).includes(a.id)));

/* „Pachete” lipsește până există primul pachet. */
const SHOP_FORMATS = [
  { id: 'all',    label: 'Toate',  cls: 'fmt-all' },
  { id: 'word',   label: 'Word',   cls: 'fmt-word' },
  { id: 'excel',  label: 'Excel',  cls: 'fmt-excel' },
  { id: 'pdf',    label: 'PDF',    cls: 'fmt-pdf' },
  { id: 'pachet', label: 'Pachete', cls: 'fmt-pachet' },
].filter(f => f.id === 'all' || VISIBLE_PRODUCTS.some(p => p.format === f.id));

const FORMAT_META = {
  word:   { abbr: 'DOC',  label: 'Word' },
  excel:  { abbr: 'XLS',  label: 'Excel' },
  pdf:    { abbr: 'PDF',  label: 'PDF' },
  pachet: { abbr: 'PKG',  label: 'Pachet' },
};

/* ─── Icoane inline (folosite doar în Shop) ─────── */
function IcoSearch({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IcoFile({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IcoPages({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="3" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8h6M7 12h8M7 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 7h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Card produs ───────────────────────────────── */
/* ─── Vizualizări unice (api/views.js) ───────────
   O singură cerere pentru toate produsele, reținută pe toată durata
   vizitei. Serverul întoarce null sub prag, deci aici doar afișăm. */
let viewsRequest = null;
function loadViews() {
  if (!viewsRequest) {
    const ids = VISIBLE_PRODUCTS.map(p => p.id).join(',');
    viewsRequest = fetch('/api/views?ids=' + encodeURIComponent(ids))
      .then(r => (r.ok ? r.json() : { counts: {} }))
      .then(j => j.counts || {})
      .catch(() => ({}));
  }
  return viewsRequest;
}

function useViews() {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    let alive = true;
    loadViews().then(c => { if (alive) setCounts(c); });
    return () => { alive = false; };
  }, []);
  return counts;
}

const recordedViews = new Set();
function recordView(id) {
  if (recordedViews.has(id)) return;
  recordedViews.add(id);
  fetch('/api/views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    keepalive: true,
  }).catch(() => { /* numărătoarea nu are voie să deranjeze */ });
}

const fmtViews = n => n.toLocaleString('ro-RO');

function IcoEye({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ProductCard({ product, onOpen, views }) {
  const fmt = FORMAT_META[product.format];
  const href = '/magazin/' + product.id;
  /* Link real, ca sa poata fi deschis in tab nou si urmat de crawlere;
     clicul obisnuit ramane navigare pe client. */
  const open = e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    onOpen(product);
  };
  return (
    <div className="shop-product-card" onClick={open}>
      <div className={`shop-card-vis model-card-vis ${product.cv}`}>
        <div className="mc-pat" />
        {product.isNew && product.price !== 0 && <div className="shop-badge-new">Nou</div>}
        <div className="mc-badge">{fmt.label}</div>
        <div className="mc-tag">{fmt.abbr}</div>
        {views != null && (
          <div className="mc-views" title="Vizualizări unice">
            <IcoEye /> <span>{fmtViews(views)}</span>
          </div>
        )}
      </div>

      <div className="shop-card-body">
        <a className="shop-card-title" href={href} onClick={open}>{product.title}</a>
        <div className="shop-card-desc">{product.shortDesc}</div>

        <div className="shop-card-tags">
          {product.tags.map(t => (
            <span key={t} className="shop-card-tag">{t}</span>
          ))}
        </div>

        <div className="shop-card-stats">
          {product.stats.files > 0 && (
            <span className="shop-stat-item">
              <IcoFile size={13} />
              &nbsp;{product.stats.files} {product.stats.files === 1 ? 'fișier' : 'fișiere'}
            </span>
          )}
          {product.stats.pages > 0 && (
            <span className="shop-stat-item">
              <IcoPages size={13} />
              &nbsp;{product.stats.pages} pag.
            </span>
          )}
        </div>

        <div className="shop-card-footer">
          {product.price === 0
            ? <div className="shop-card-price">Gratuit</div>
            : <div className="shop-card-price">{product.price} <span>{COMMERCE.currency}</span></div>
          }
          <a className="shop-card-cta" href={href} onClick={open}>
            {product.price === 0 ? 'Descarcă gratuit' : 'Comandă'}
            <span className="shop-card-cta__arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Grup de filtre din coloana stângă ───────────
   O listă de opțiuni exclusive (ca butoane radio), cu numărul de
   produse al fiecăreia. O opțiune fără produse nu apare. */
function FilterGroup({ title, options, value, onChange, count }) {
  const shown = options.filter(o => o.id === 'all' || count(o.id) > 0);
  return (
    <div className="shop-side__group" role="radiogroup" aria-label={title}>
      <div className="shop-side__title">{title}</div>
      {shown.map(o => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={'shop-side__opt' + (value === o.id ? ' is-on' : '')}
        >
          <span className="shop-side__mark" aria-hidden="true" />
          <span className="shop-side__lbl">{o.label}</span>
          <span className="shop-side__n">{count(o.id)}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Formular de checkout (plată cu cardul) ─────
   Datele de facturare cerute de procesator + cele două
   acorduri obligatorii. Prețul NU se trimite de aici:
   serverul îl ia din propriul catalog, după sku. */
/* Judetele, dupa registrul SIRUTA. Codul auto e cheia in
   assets/date/localitati.json, care tine unitatile administrative. */
const JUDETE = [
  { c: 'AB', n: 'Alba' },
  { c: 'AR', n: 'Arad' },
  { c: 'AG', n: 'Argeș' },
  { c: 'BC', n: 'Bacău' },
  { c: 'BH', n: 'Bihor' },
  { c: 'BN', n: 'Bistrița-Năsăud' },
  { c: 'BT', n: 'Botoșani' },
  { c: 'BV', n: 'Brașov' },
  { c: 'BR', n: 'Brăila' },
  { c: 'B', n: 'București' },
  { c: 'BZ', n: 'Buzău' },
  { c: 'CS', n: 'Caraș-Severin' },
  { c: 'CJ', n: 'Cluj' },
  { c: 'CT', n: 'Constanța' },
  { c: 'CV', n: 'Covasna' },
  { c: 'CL', n: 'Călărași' },
  { c: 'DJ', n: 'Dolj' },
  { c: 'DB', n: 'Dâmbovița' },
  { c: 'GL', n: 'Galați' },
  { c: 'GR', n: 'Giurgiu' },
  { c: 'GJ', n: 'Gorj' },
  { c: 'HR', n: 'Harghita' },
  { c: 'HD', n: 'Hunedoara' },
  { c: 'IL', n: 'Ialomița' },
  { c: 'IS', n: 'Iași' },
  { c: 'IF', n: 'Ilfov' },
  { c: 'MM', n: 'Maramureș' },
  { c: 'MH', n: 'Mehedinți' },
  { c: 'MS', n: 'Mureș' },
  { c: 'NT', n: 'Neamț' },
  { c: 'OT', n: 'Olt' },
  { c: 'PH', n: 'Prahova' },
  { c: 'SM', n: 'Satu Mare' },
  { c: 'SB', n: 'Sibiu' },
  { c: 'SV', n: 'Suceava' },
  { c: 'SJ', n: 'Sălaj' },
  { c: 'TR', n: 'Teleorman' },
  { c: 'TM', n: 'Timiș' },
  { c: 'TL', n: 'Tulcea' },
  { c: 'VS', n: 'Vaslui' },
  { c: 'VN', n: 'Vrancea' },
  { c: 'VL', n: 'Vâlcea' }
];

/* Localitatile se incarca o singura data, la deschiderea formularului:
   ~38 KB pentru cele 3.180 de unitati administrativ-teritoriale
   (municipii, orase, comune) din SIRUTA 2025 (INS, data.gov.ro), plus
   Bucurestiul pe sectoare. Prea mult ca sa stea in pagina degeaba,
   destul de putin cat sa nu merite impartit pe judete. */
/* /assets/ e cache imutabil un an: la fiecare actualizare a listei se
   schimbă ?v=, altfel browserele care au lista veche o păstrează. */
const LOCALITATI_URL = 'assets/date/localitati.json?v=siruta-2025-s1';

const CHECKOUT_FIELDS = [
  { k: 'lastName',   label: 'Nume *',        ph: 'Popescu',            w: 1 },
  { k: 'firstName',  label: 'Prenume *',     ph: 'Ion',                w: 1 },
  { k: 'email',      label: 'Email *',       ph: 'ion@exemplu.ro',     w: 2, type: 'email' },
  { k: 'phone',      label: 'Telefon',       ph: '+40 7xx xxx xxx',    w: 2, type: 'tel', pfOptional: true },
  { k: 'address',    label: 'Adresă *',      ph: 'Str. Exemplu nr. 1', w: 2 },
  { k: 'state',      label: 'Județ *',       w: 1, kind: 'judet' },
  { k: 'city',       label: 'Localitate *',  w: 1, kind: 'localitate' },
  { k: 'postalCode', label: 'Cod poștal',    ph: '010101',             w: 1, pfOptional: true },
];

/* Telefonul și codul poștal sunt opționale doar la persoana fizică;
   pentru factura pe firmă rămân obligatorii (vezi și api/netopia-start.js). */
const fieldLabel = (f, entity) =>
  f.pfOptional ? f.label + (entity === 'pj' ? ' *' : ' (opțional)') : f.label;

/* Doar pentru persoana juridica. Oblio decide dupa CUI daca factura
   se emite pe firma, deci la comutarea pe persoana fizica ambele se
   golesc, altfel o valoare ramasa ar schimba destinatarul facturii. */
const COMPANY_FIELDS = [
  { k: 'company', label: 'Denumire firmă *', ph: 'Exemplu S.R.L.', w: 2 },
  { k: 'cui',     label: 'CUI *',            ph: 'RO12345678',     w: 1 },
];

const REQUIRED_FIELDS = ['lastName', 'firstName', 'email', 'address', 'city', 'state'];
const REQUIRED_FIELDS_PJ = REQUIRED_FIELDS.concat(['phone', 'postalCode', 'company', 'cui']);

function CheckoutForm({ product, onNav }) {
  const [form, setForm] = useState({ lastName: '', firstName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', company: '', cui: '' });
  const [terms, setTerms] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [entity, setEntity] = useState('pf');
  const [localitati, setLocalitati] = useState(null);
  const [locEroare, setLocEroare] = useState(false);

  /* Incarcam o singura data, la montarea formularului. */
  useEffect(() => {
    let activ = true;
    fetch(LOCALITATI_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (activ) setLocalitati(d); })
      .catch(() => { if (activ) setLocEroare(true); });
    return () => { activ = false; };
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  /* Schimbarea judetului invalideaza localitatea aleasa. */
  const setJudet = (e) => setForm({ ...form, state: e.target.value, city: '' });

  const schimbaTip = (t) => {
    setEntity(t);
    /* Oblio emite pe firma daca exista CUI, deci la persoana fizica
       golim ambele campuri, nu doar le ascundem. */
    if (t === 'pf') setForm({ ...form, company: '', cui: '' });
  };

  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const cuiValid = (v) => /^(RO)?\s?\d{2,10}$/i.test(v.trim());

  const obligatorii = entity === 'pj' ? REQUIRED_FIELDS_PJ : REQUIRED_FIELDS;

  const complete = obligatorii.every(k => (form[k] || '').trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    && (entity !== 'pj' || cuiValid(form.cui));
  /* Renunțarea la dreptul de retragere privește doar consumatorul. */
  const ready = complete && terms && (entity === 'pj' || waiver);

  /* In form.state tinem NUMELE judetului, nu codul: campul pleaca asa
     cum e catre Oblio si ajunge pe factura, unde „AB” ar fi gresit.
     Codul il derivam doar ca sa cautam localitatile. */
  const codJudet = (JUDETE.find(j => j.n === form.state) || {}).c;
  const locJudet = (localitati && codJudet && localitati[codJudet]) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) {
      setError('Completează toate câmpurile marcate cu * și bifează acordurile.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/netopia-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: product.sku, ...form, acceptTerms: terms, acceptWaiver: entity === 'pf' && waiver }),
      });
      const json = await res.json();
      if (res.ok && json.paymentURL) {
        if (json.orderID) rememberOrder(json.orderID);
        window.location.assign(json.paymentURL);
        return;
      }
      setError(json.error || 'Plata nu a putut fi inițiată. Încearcă din nou sau scrie-ne la ' + COMPANY.email + '.');
    } catch {
      setError('Conexiunea s-a întrerupt. Verifică internetul și încearcă din nou sau scrie-ne la ' + COMPANY.email + '.');
    } finally {
      setLoading(false);
    }
  };

  /* Aspectul vine din css/shop.css (sp-form, sp-input, ...). Aici
     rămâne doar logica formularului. */
  return (
    <form onSubmit={handleSubmit} noValidate className="sp-form">
      <div className="shop-modal-lbl">Date de facturare</div>

      <div className="sp-seg" role="radiogroup" aria-label="Tip de client">
        {[['pf', 'Persoană fizică'], ['pj', 'Persoană juridică']].map(([t, eticheta]) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={entity === t}
            onClick={() => schimbaTip(t)}
            className={'sp-seg__opt' + (entity === t ? ' is-on' : '')}
          >{eticheta}</button>
        ))}
      </div>

      <div className="sp-fields">
        {(entity === 'pj' ? COMPANY_FIELDS.concat(CHECKOUT_FIELDS) : CHECKOUT_FIELDS).map(f => (
          <div key={f.k} className={f.w === 2 ? 'sp-field sp-field--full' : 'sp-field'}>
            <label className="sp-label">{fieldLabel(f, entity)}</label>

            {f.kind === 'judet' ? (
              <select className="sp-input" value={form.state} onChange={setJudet}>
                <option value="">Alege județul</option>
                {JUDETE.map(j => <option key={j.c} value={j.n}>{j.n}</option>)}
              </select>
            ) : f.kind === 'localitate' ? (
              <select
                className={'sp-input' + (form.state ? '' : ' is-empty')}
                value={form.city}
                onChange={set('city')}
                disabled={!form.state || !localitati}
              >
                <option value="">
                  {!form.state ? 'Alege întâi județul'
                    : locEroare ? 'Lista nu s-a încărcat'
                    : !localitati ? 'Se încarcă...'
                    : 'Alege localitatea'}
                </option>
                {locJudet.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} className="sp-input" value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} />
            )}
          </div>
        ))}
      </div>

      {locEroare && (
        <p className="sp-err-inline">
          Lista localităților nu s-a putut încărca. Reîncarcă pagina sau scrie-ne la {COMPANY.email}.
        </p>
      )}

      <label className="sp-check">
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
        <span>
          Am citit și accept <a href="/termeni-si-conditii" onClick={e => { e.preventDefault(); go('termeni-si-conditii'); }}>Termenii și condițiile</a> și <a href="/politica-confidentialitate" onClick={e => { e.preventDefault(); go('politica-confidentialitate'); }}>Politica de confidențialitate</a>. *
        </span>
      </label>

      {entity === 'pf' && (
        <label className="sp-check">
          <input type="checkbox" checked={waiver} onChange={e => setWaiver(e.target.checked)} />
          <span>
            Solicit livrarea imediată a documentului digital și confirm că, odată începută livrarea,
            îmi pierd <a href="/dreptul-de-retragere" onClick={e => { e.preventDefault(); go('dreptul-de-retragere'); }}>dreptul de retragere</a> de {COMMERCE.withdrawalDays} zile. *
          </span>
        </label>
      )}

      {error && <p className="sp-err">{error}</p>}

      <button type="submit" className="btn btn-primary sp-btn-block" disabled={!ready || loading}>
        {loading ? 'Se deschide pagina de plată...' : 'Plătește ' + fmtPrice(product.price)}
      </button>

      <div className="sp-pay-logo">
        <img src="uploads/netopia-payments.webp" alt="NETOPIA Payments, Visa, Mastercard" />
      </div>
      <p className="sp-fine">
        Plata se face în pagina securizată NETOPIA Payments. {COMPANY.brand} nu vede și nu stochează datele cardului.
      </p>
    </form>
  );
}

/* ─── Modal detalii produs ──────────────────────── */
/* Conținutul unui produs: descriere, detalii și modul de obținere.
   Trăiește pe pagina produsului (/magazin/<produs>), care are adresă
   proprie, deci poate fi trimisă prin link și indexată. */
function ProductDetails({ product, onNav }) {
  const isFree = product.price === 0;
  const hasFreeFile = isFree && product.file;

  const [email,       setEmail]       = useState('');
  const [newsletter,  setNewsletter]  = useState(false);
  const [emailErr,    setEmailErr]    = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloaded,  setDownloaded]  = useState(false);
  const [checkout,    setCheckout]    = useState(false);

  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleDownload = async e => {
    e.preventDefault();
    if (newsletter && !validEmail(email)) { setEmailErr('Introdu o adresă de email validă.'); return; }
    setEmailErr('');
    setDownloading(true);
    /* Documentul gratuit nu cere date personale. Emailul ajunge în lista
       de noutăți doar cu bifa separată, nebifată implicit (GDPR art. 7). */
    if (newsletter) {
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), product: product.title, consent: true }),
        });
      } catch (_) {}
    }
    const a = document.createElement('a');
    a.href = product.file;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof gtag === 'function') {
      gtag('event', 'file_download', {
        event_category: 'free_product',
        event_label: product.title,
        file_name: product.file.split('/').pop(),
      });
    }
    setDownloading(false);
    setDownloaded(true);
  };

  /* Produsele gratuite fără fișier atașat se solicită tot pe email. */
  const handleRequestFree = () => {
    const subject = encodeURIComponent('Solicitare: ' + product.title);
    const body = encodeURIComponent(
      'Bună ziua,\n\nDoresc să primesc:\n' + product.title + '\n\nCu stimă,'
    );
    window.open('mailto:' + COMPANY.email + '?subject=' + subject + '&body=' + body);
  };

  const canDownload = !newsletter || validEmail(email);

  return (
    <div className="sp-detail">

          <div className="shop-modal-sec">
            <div className="shop-modal-lbl">Descriere</div>
            <p className="sp-modal-text">{product.longDesc}</p>
          </div>

          {product.forWhom && (
            <div className="shop-modal-sec">
              <div className="shop-modal-lbl">Pentru cine</div>
              <p className="sp-modal-text">{product.forWhom}</p>
            </div>
          )}

          <div className="shop-modal-sec">
            <div className="shop-modal-lbl">Ce include</div>
            <ul className="shop-modal-includes">
              {product.includes.map((item, i) => (
                <li key={i}>
                  <div className="shop-modal-check">✓</div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shop-modal-sec">
            <div className="shop-modal-lbl">Detalii tehnice</div>
            <div className="sp-modal-stats">
                {product.version && (
                  <div>
                    <span>Versiunea <strong>{product.version}</strong>{product.updated ? ', ' + product.updated : ''}</span>
                  </div>
                )}
                {product.stats.files > 0 && (
                  <div>
                    <IcoFile size={16} />
                    <span><strong>{product.stats.files}</strong> {product.stats.files === 1 ? 'fișier' : 'fișiere'}</span>
                  </div>
                )}
                {product.stats.pages > 0 && (
                  <div>
                    <IcoPages size={16} />
                    <span><strong>{product.stats.pages}</strong> pagini totale</span>
                  </div>
                )}
            </div>
            {!isFree && (
              <p className="sp-modal-text sp-modal-text--note">
                Versiune fixă: actualizările sunt incluse doar în contractele de servicii.
                Licența acoperă utilizarea în activitatea proprie a entității de pe factură
                (<a href="/termeni-si-conditii" onClick={e => { e.preventDefault(); go('termeni-si-conditii'); }}>Termeni și condiții</a>).
              </p>
            )}
          </div>

          {/* ── Descărcare gratuită cu email + GDPR ── */}
          {hasFreeFile ? (
            downloaded ? (
              <div className="sp-done">
                <div className="sp-done__ico">✓</div>
                <div className="sp-done__title">Descărcarea a pornit</div>
                <div className="sp-done__text">Verifică folderul de descărcări din browser.</div>
              </div>
            ) : (
              <form onSubmit={handleDownload} noValidate className="sp-form">
                <div className="shop-modal-lbl">Descarcă gratuit</div>
                <label className="sp-check">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={e => { setNewsletter(e.target.checked); setEmailErr(''); }}
                  />
                  <span>
                    Opțional: vreau să primesc pe email noutăți despre modele și modificări legislative. Mă pot dezabona oricând.
                    Detalii în <a href="/politica-confidentialitate" onClick={e => { e.preventDefault(); go('politica-confidentialitate'); }}>Politica de confidențialitate</a>.
                  </span>
                </label>
                {newsletter && (
                  <div className="sp-field">
                    <label className="sp-label">Adresă de email *</label>
                    <input
                      type="email"
                      placeholder="exemplu@email.ro"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                      className={'sp-input' + (emailErr ? ' is-invalid' : '')}
                    />
                    {emailErr && <span className="sp-err-inline">{emailErr}</span>}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary sp-btn-block"
                  disabled={!canDownload || downloading}
                >
                  {downloading ? 'Se pregătește...' : 'Descarcă gratuit'}
                </button>
              </form>
            )
          ) : (
            <>
              <div className="shop-modal-price-box">
                <div>
                  {isFree
                    ? <div className="shop-modal-price-note">
                        Documentul este gratuit. Trimite-ne o cerere pe email și îl primești în cel mult o zi lucrătoare.
                      </div>
                    : <>
                        <div className="shop-modal-price">
                          {product.price} <span>{COMMERCE.currency}</span>
                        </div>
                        <div className="shop-modal-price-note">{COMMERCE.priceNote} · {COMMERCE.deliveryNote}</div>
                      </>
                  }
                </div>
              </div>

              {isFree ? (
                <>
                  <div className="shop-modal-actions">
                    <button className="btn btn-primary" onClick={handleRequestFree}>
                      Cere documentul pe email
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {checkout
                    ? <CheckoutForm product={product} onNav={onNav} />
                    : <div className="shop-modal-actions">
                        <button className="btn btn-primary" onClick={() => setCheckout(true)}>
                          Cumpără cu cardul
                        </button>
                      </div>}
                  {/* Traseul pentru instituții (D4): ofertă sau comandă fermă, e-Factura, OP. */}
                  <div className="sp-inst">
                    <div className="sp-inst__title">Cumperi pentru o instituție?</div>
                    <p className="sp-inst__text">
                      Trimite-ne la <a href={'mailto:' + COMPANY.email + '?subject=' + encodeURIComponent('Cerere de ofertă: ' + product.title)}>{COMPANY.email}</a> o
                      cerere de ofertă sau o comandă fermă. Emitem factura prin e-Factura, plătești prin ordin de plată,
                      iar documentul îl primești pe email.
                    </p>
                    <div className="sp-inst__seap">
                      <a href="https://www.e-licitatie.ro/pub" target="_blank" rel="noopener noreferrer" aria-label="SEAP / SICAP, e-licitatie.ro">
                        <img src="uploads/seap-sicap-logo-h102.webp" alt="SEAP / SICAP" width="250" height="102" loading="lazy" />
                      </a>
                      <span>
                        <strong>Suntem și pe SEAP.</strong> Produsele și serviciile INFORMS pot fi achiziționate prin sistemul electronic de achiziții publice.
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
    </div>
  );
}

/* Fereastra de produs din magazin. Același conținut ca pagina
   /magazin/<produs>, care rămâne pentru linkuri directe și crawlere. */
function ProductModal({ product, onClose, onNav, views }) {
  const fmt = FORMAT_META[product.format];
  const closeRef = React.useRef(null);

  useEffect(() => { recordView(product.id); }, [product.id]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="shop-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="sp-modal-title">
        <div className="shop-modal-hd">
          <button ref={closeRef} className="shop-modal-close" onClick={onClose} aria-label="Închide">×</button>
          <div className="sp-modal-fmt">
            {fmt.label}{product.price === 0 ? ' · Gratuit' : ''}
            {views != null && <span className="sp-modal-views"> · <IcoEye size={12} /> {fmtViews(views)} vizualizări unice</span>}
          </div>
          <h2 id="sp-modal-title" className="sp-modal-title">{product.title}</h2>
          <div className="sp-modal-tags">
            {product.tags.map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
        <div className="shop-modal-bd">
          <ProductDetails product={product} onNav={onNav} />
        </div>
      </div>
    </div>
  );
}

/* Pagina unui produs. Antetul reia identitatea magazinului, iar
   conținutul stă pe „hârtie”, ca fereastra de dinainte. */
function ProductPage({ slug, onNav }) {
  const product = productBySlug(slug);
  useEffect(() => { if (product) recordView(product.id); }, [slug]);
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  if (!product) {
    return (
      <>
        <div className="pg-hero">
          <div className="container">
            <h1>Produsul nu a fost găsit</h1>
            <p>Adresa nu corespunde niciunui produs din magazin.</p>
          </div>
        </div>
        <section className="sec">
          <div className="container">
            <button className="btn btn-primary" onClick={() => go('magazin')}>Înapoi în magazin</button>
          </div>
        </section>
      </>
    );
  }

  const fmt = FORMAT_META[product.format];

  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <nav className="sp-crumbs" aria-label="Firimituri">
            <a href="/magazin" onClick={e => { e.preventDefault(); go('magazin'); }}>Magazin</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.title}</span>
          </nav>
          <div className="tag-label">{fmt.label}{product.price === 0 ? ' · Gratuit' : ''}</div>
          <h1>{product.title}</h1>
          <p>{product.shortDesc}</p>
        </div>
      </div>

      <section className="sec sp-detail-wrap">
        <div className="container">
          <ProductDetails product={product} onNav={onNav} />
        </div>
      </section>
    </>
  );
}

/* ─── Pagina principală Shop ────────────────────── */
/* ─── Comanda în curs de plată ───────────────────
   NETOPIA folosește redirectUrl doar după 3-D Secure. Fără 3DS,
   butonul „Înapoi la magazin” din pagina lor duce la adresa din
   contul NETOPIA (/magazin), fără numărul comenzii. De aceea îl
   ținem în sessionStorage și, la întoarcerea de pe domeniul
   NETOPIA, trimitem clientul la „Stare comandă”. */
const PENDING_ORDER_KEY = 'informs_order';
const PENDING_ORDER_TTL = 60 * 60 * 1000;

function rememberOrder(orderID) {
  try { sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({ orderID, at: Date.now() })); } catch { /* stocare blocată */ }
}

function pendingOrder() {
  try {
    const v = JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY) || 'null');
    return v && v.orderID && Date.now() - v.at < PENDING_ORDER_TTL ? v.orderID : null;
  } catch { return null; }
}

function forgetOrder() {
  try { sessionStorage.removeItem(PENDING_ORDER_KEY); } catch { /* stocare blocată */ }
}

function cameFromNetopia() {
  try { return /netopia|mobilpay/i.test(new URL(document.referrer).host); } catch { return false; }
}

function ShopPage({ onNav, initialCategory = 'all' }) {
  /* Întoarcere de pe pagina NETOPIA fără redirectUrl: vezi mai sus. */
  useEffect(() => {
    const id = pendingOrder();
    if (id && cameFromNetopia()) {
      window.location.replace('/comanda-finalizata?o=' + encodeURIComponent(id));
    }
  }, []);

  /* #gratuite (din meniu și din paginile statice) pornește „Doar gratuite”;
     o categorie din meniu filtrează în tăcere, până primește filtru propriu. */
  const [startCat] = useState(() =>
    categoryFromHash(hasProducts(initialCategory) ? initialCategory : 'all'));
  const [audience, setAudience] = useState('all');
  const [category, setCategory] = useState(startCat === 'gratuite' ? 'all' : startCat);
  const [onlyFree, setOnlyFree] = useState(startCat === 'gratuite');
  const [format,   setFormat]   = useState('all');
  const [query,    setQuery]    = useState('');

  /* Clicul pe card deschide fereastra; Ctrl/Cmd+clic pe link deschide
     tot pagina produsului, în tab nou. */
  const [openId, setOpenId] = useState(null);
  const views = useViews();
  const openProduct = (p) => setOpenId(p.id);
  const closeProduct = React.useCallback(() => setOpenId(null), []);
  const openedProduct = openId ? productBySlug(openId) : null;

  const q = query.trim().toLowerCase();
  const matches = p =>
    (category === 'all' || p.category === category) &&
    (format === 'all' || p.format === format) &&
    (!onlyFree || p.price === 0) &&
    (!q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)));

  const catalog = VISIBLE_PRODUCTS.filter(p =>
    !p.shelf && matches(p) && (audience === 'all' || (p.audiences || []).includes(audience)));

  /* Raftul „Formulare uzuale” nu are public, deci dispare când alegi unul. */
  const shelf = audience === 'all'
    ? VISIBLE_PRODUCTS.filter(p => p.shelf === 'uzuale' && matches(p))
    : [];

  const total = catalog.length + shelf.length;
  const hasFilters = audience !== 'all' || category !== 'all' || format !== 'all' || onlyFree || q;

  const resetFilters = () => {
    setAudience('all'); setCategory('all'); setFormat('all'); setOnlyFree(false); setQuery('');
  };

  const grid = list => (
    <div className="shop-grid">
      {list.map((p, i) => (
        <FadeUp key={p.id} delay={Math.min(i, 5) * 70} style={{ display: 'flex', flexDirection: 'column' }}>
          <ProductCard product={p} onOpen={openProduct} views={views[p.id]} />
        </FadeUp>
      ))}
    </div>
  );

  return (
    <>
      {/* Hero: navy, cu imaginea de documente pe fundal */}
      <div className="pg-hero pg-hero--shop">
        <div className="container">
          <div className="tag-label">Magazin</div>
          <h1>Documente profesionale pentru sectorul public și privat</h1>
          <p>Fiecare model indică formatul, versiunea și ce conține. Câteva formulare sunt gratuite.</p>
          <div className="shop-search-wrap">
            <span className="shop-search-ico"><IcoSearch size={18} /></span>
            <input
              className="shop-search"
              type="text"
              placeholder="Caută după denumire (ex: recepție, F.14, contract)"
              aria-label="Caută în magazin"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SEAP notice */}
      <div className="sp-seap">
        <div className="container sp-seap__inner">
          <a href="https://www.e-licitatie.ro/pub" target="_blank" rel="noopener noreferrer">
            <img src="uploads/seap-sicap-logo-h102.webp" alt="SEAP / SICAP" width="250" height="102" />
          </a>
          <span>
            <strong>Suntem și pe SEAP.</strong> Produsele și serviciile INFORMS pot fi achiziționate prin sistemul electronic de achiziții publice.
          </span>
        </div>
      </div>

      {/* Catalog: filtrele în coloana din stânga, produsele în dreapta */}
      <section className="sec sp-catalog">
        <div className="container">
          <div className="shop-layout">

          <aside className="shop-side" aria-label="Filtre">
            {AUDIENCES.length > 0 && (
              <FilterGroup
                title="Pentru cine"
                options={[{ id: 'all', label: 'Toate' }].concat(AUDIENCES)}
                value={audience}
                onChange={setAudience}
                count={id => id === 'all'
                  ? VISIBLE_PRODUCTS.length
                  : VISIBLE_PRODUCTS.filter(p => (p.audiences || []).includes(id)).length}
              />
            )}

            <FilterGroup
              title="Format"
              options={SHOP_FORMATS}
              value={format}
              onChange={setFormat}
              count={id => id === 'all'
                ? VISIBLE_PRODUCTS.length
                : VISIBLE_PRODUCTS.filter(p => p.format === id).length}
            />

            <div className="shop-side__group">
              <div className="shop-side__title">Preț</div>
              <label className="shop-side__check">
                <input type="checkbox" checked={onlyFree} onChange={e => setOnlyFree(e.target.checked)} />
                <span>Doar gratuite</span>
              </label>
            </div>

            {hasFilters && (
              <button type="button" className="shop-side__reset" onClick={resetFilters}>
                Resetează filtrele
              </button>
            )}
          </aside>

          <div className="shop-main">

          {/* Result bar */}
          <div className="shop-result-bar">
            <div className="shop-result-count">
              <strong>{total}</strong>&nbsp;
              {total === 1 ? 'produs găsit' : 'produse găsite'}
            </div>
          </div>

          {catalog.length > 0 && grid(catalog)}

          {total === 0 && (
            <div className="shop-empty">
              <h3>Niciun produs pentru filtrele alese</h3>
              <p>Unele categorii sunt încă în lucru. Resetează filtrele sau scrie-ne ce document cauți.</p>
              <button className="btn btn-outline" onClick={resetFilters}>Resetează filtrele</button>
            </div>
          )}

          {/* Raftul separat, fără promovare (decizia B5) */}
          {shelf.length > 0 && (
            <div className="sp-shelf">
              <h2 className="sp-shelf__title">Formulare uzuale</h2>
              <p className="sp-shelf__lead">Formulare oficiale de uz general, preluate din sursa publică și transformate de INFORMS în PDF completabil.</p>
              {grid(shelf)}
            </div>
          )}

          </div>
          </div>

          {/* CTA banner */}
          <div className="shop-cta-banner">
            <div className="sp-cta__k">Servicii</div>
            <h2 className="sp-cta__title">Documentație la comandă</h2>
            <p className="sp-cta__lead">
              Nu ai găsit instrumentul potrivit? Îl putem elabora sau adapta pe procedura, proiectul sau fluxul tău de lucru.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { onNav('contact'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
            >
              Descrie ce îți trebuie
            </button>
          </div>

        </div>
      </section>

      {openedProduct && (
        <ProductModal product={openedProduct} onClose={closeProduct} onNav={onNav} views={views[openedProduct.id]} />
      )}
    </>
  );
}

/* ─── Pagina de întoarcere din plată ─────────────
   /api/netopia-return interoghează statusul comenzii la
   procesator și redirecționează aici cu ?s=ok|pending|fail.
   Pagina e strict informativă: livrarea o face webhook-ul. */
const ORDER_POLL_MS  = 4000;
const ORDER_POLL_MAX = 23; // ~90 de secunde
const CANCEL_POLL_MAX = 4; // ~15 secunde după cancelUrl

/* Stările comenzii. `tone` alege culoarea etichetei și a filetului de
   sus (css/shop.css, .os-card--*); `steps` sunt pașii următori, numerotați. */
const ORDER_STATES = {
  checking: {
    tone: 'wait',
    tag: 'Se verifică',
    title: 'Verificăm plata',
    lead: 'Durează doar câteva secunde. Nu închide pagina și nu relua plata.',
    steps: [],
  },
  ok: {
    tone: 'ok',
    tag: 'Plătită',
    title: 'Plata a fost confirmată',
    lead: 'Îți mulțumim. Îți trimitem documentul pe adresa de email din comandă.',
    steps: [
      'Deschide emailul de la INFORMS și descarcă documentul. Linkul e valabil 72 de ore.',
      'Nu îl găsești în 10 minute? Verifică folderele Spam și Promoții.',
      'Tot nimic? Scrie-ne la ' + COMPANY.email + ' cu numărul comenzii de mai sus.',
    ],
  },
  pending: {
    tone: 'wait',
    tag: 'În procesare',
    title: 'Plata este în curs de procesare',
    lead: 'Banca verifică tranzacția. Imediat ce plata e confirmată, primești documentul pe email, automat.',
    steps: [
      'Nu relua plata până nu primești un răspuns.',
      'Pagina se actualizează singură cât timp o ții deschisă.',
      'Dacă nu primești nimic într-o oră, scrie-ne la ' + COMPANY.email + '.',
    ],
  },
  fail: {
    tone: 'fail',
    tag: 'Nefinalizată',
    title: 'Plata nu a fost finalizată',
    lead: 'Tranzacția a fost respinsă sau anulată de bancă ori întreruptă înainte de final.',
    steps: [
      'O sumă blocată pe card o eliberează banca automat, de regulă în câteva zile lucrătoare.',
      'Poți relua comanda din magazin, cu același card sau cu altul.',
      'Preferi transferul bancar? Scrie-ne și îți trimitem factura proforma.',
    ],
  },
};

function OrderStatusPage({ onNav }) {
  const params = new URLSearchParams(window.location.search);
  /* Fixat la prima randare: forgetOrder() golește sessionStorage, iar
     numărul comenzii trebuie să rămână afișat. */
  const [orderID] = useState(() => params.get('o') || pendingOrder());
  /* v=1: am venit pe cancelUrl, care la NETOPIA înseamnă și „Înapoi la
     magazin” după o plată reușită. Verificăm scurt comanda păstrată;
     dacă nu e plătită, rămâne „nefinalizată”. */
  const verifyCancel = params.get('v') === '1' && !!orderID;
  const [key, setKey] = useState(verifyCancel ? 'checking' : (params.get('s') || (orderID ? 'checking' : 'pending')));
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  /* Cât timp plata e „în curs”, întrebăm serverul din nou la câteva
     secunde: IPN-ul ajunge de obicei în primul minut. */
  useEffect(() => {
    if (key === 'ok' || key === 'fail') { forgetOrder(); return; }
    if (!orderID) return;
    let tries = 0;
    let stopped = false;
    const check = async () => {
      tries += 1;
      try {
        const r = await fetch('/api/netopia-return?format=json&orderId=' + encodeURIComponent(orderID), { cache: 'no-store' });
        const j = await r.json();
        if (stopped) return;
        if (j.state === 'ok' || j.state === 'fail') { setKey(j.state); forgetOrder(); return; }
      } catch { /* rețea: mai încercăm */ }
      if (stopped) return;
      if (tries < (verifyCancel ? CANCEL_POLL_MAX : ORDER_POLL_MAX)) timer = setTimeout(check, ORDER_POLL_MS);
      else { setKey(verifyCancel ? 'fail' : 'pending'); forgetOrder(); }
    };
    let timer = setTimeout(check, key === 'checking' ? 0 : ORDER_POLL_MS);
    return () => { stopped = true; clearTimeout(timer); };
    // o singură rundă de verificări pe comandă; schimbările de stare
    // făcute de ea nu trebuie să o repornească
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderID]);

  const st = ORDER_STATES[key] || ORDER_STATES.pending;

  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <h1>Stare comandă</h1>
          <p>Rezultatul plății și pașii următori.</p>
        </div>
      </div>
      <section className="sec">
        <div className="container os-wrap">
          <article className={'os-card os-card--' + st.tone} aria-live="polite">
            <header className="os-meta">
              <div>
                <div className="os-meta__k">Comanda</div>
                <div className="os-meta__v">{orderID || 'fără număr'}</div>
              </div>
              <div className="os-tag">{st.tag}</div>
            </header>

            <div className="os-body">
              <h2 className="os-title">{st.title}</h2>
              <p className="os-lead">{st.lead}</p>

              {st.steps.length > 0 && (
                <ol className="os-steps">
                  {st.steps.map((s, i) => (
                    <li key={i}>
                      <span className="os-steps__n">{String(i + 1).padStart(2, '0')}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              )}
              {key === 'checking' && <div className="os-progress" aria-hidden="true"><span /></div>}
            </div>

            <footer className="os-actions">
              <button className="btn btn-primary" onClick={() => go('magazin')}>
                {key === 'fail' ? 'Reia comanda' : 'Înapoi în magazin'}
              </button>
              <button className="btn btn-outline" onClick={() => go('contact')}>Contactează-ne</button>
            </footer>
          </article>
        </div>
      </section>
    </>
  );
}

Object.assign(window, {
  ShopPage,
  ProductPage,
  OrderStatusPage,
  shopHasProducts: hasProducts,
  shopProductBySlug: productBySlug,
});
