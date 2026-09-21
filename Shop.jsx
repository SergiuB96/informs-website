const { useState, useEffect } = React;

/* ══════════════════════════════════════════════════
   SHOP - Marketplace produse digitale INFORMS
   ──────────────────────────────────────────────────
   Adaugă sau editează produse în array-ul SHOP_PRODUCTS
   de mai jos. Fiecare produs are câmpuri auto-explicative.
══════════════════════════════════════════════════ */

/* ─── Date produse ───────────────────────────────
   format: 'word' | 'excel' | 'pdf' | 'pachet'
   category: 'achizitii' | 'delegare' | 'management' | 'digitalizare' | 'gratuite'
   mainCategories: array cu unul sau mai multe dintre:
       'autoritati' | 'companii' | 'liber-profesionisti' | 'uz-zilnic'
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
    longDesc: 'Formular PDF completabil pentru înstrăinarea și dobândirea unui mijloc de transport. Conține toate clauzele obligatorii și câmpurile necesare pentru o tranzacție legală conformă.',
    category: 'gratuite',
    mainCategories: ['uz-zilnic', 'companii', 'liber-profesionisti'],
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
    longDesc: 'Fișă medicală standardizată pentru consultațiile necesare obținerii sau reînnoirii permisului de conducere. Formular PDF completabil, conform cerințelor autorităților competente.',
    category: 'gratuite',
    mainCategories: ['uz-zilnic'],
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
    shortDesc: 'Formular oficial pentru comunicarea datei de începere a execuției lucrărilor de construcții către autoritățile competente.',
    longDesc: 'Formularul F.14 este documentul oficial prin care se comunică data de începere a execuției lucrărilor de construcții. PDF completabil, conform legislației în vigoare privind autorizarea executării lucrărilor de construcții.',
    category: 'gratuite',
    mainCategories: ['autoritati', 'companii'],
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
    shortDesc: 'Model de proces-verbal pentru recepția la terminarea lucrărilor de construcții, conform normelor legale în vigoare.',
    longDesc: 'Formular PDF pentru procesul-verbal de recepție la terminarea lucrărilor de construcții. Include toate rubricile obligatorii conform HG 343/2017 privind recepția lucrărilor de construcții.',
    category: 'gratuite',
    mainCategories: ['autoritati', 'companii'],
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
    id: 'test-plata',
    sku: 'INF-TEST-10',
    title: 'Test plată INFORMS',
    shortDesc: 'Produs de test pentru verificarea plății cu cardul.',
    longDesc: 'Produs intern, folosit pentru a verifica plata NETOPIA, livrarea documentului și emiterea facturii.',
    category: 'achizitii',
    mainCategories: ['companii'],
    format: 'word',
    cv: 'cv-word',
    price: 10,
    hidden: true,
    featured: false,
    isNew: false,
    tags: ['Test'],
    includes: [
      'Document de test (DOCX)',
    ],
    stats: { files: 1, pages: 0 },
  },
];

const SHOW_HIDDEN = new URLSearchParams(window.location.search).get('test') === '1';

/* ─── Configurare categorii și formate ──────────── */
const SHOP_CATEGORIES = [
  { id: 'all',          label: 'Toate produsele' },
  { id: 'achizitii',   label: 'Achiziții publice' },
  { id: 'delegare',    label: 'Delegare servicii' },
  { id: 'management',  label: 'Management proiect' },
  { id: 'digitalizare',label: 'Digitalizare' },
  { id: 'gratuite',    label: 'Gratuite' },
];

const SHOP_FORMATS = [
  { id: 'all',    label: 'Toate',   cls: 'fmt-all' },
  { id: 'word',   label: 'WORD',    cls: 'fmt-word' },
  { id: 'excel',  label: 'EXCEL',   cls: 'fmt-excel' },
  { id: 'pdf',    label: 'PDF',     cls: 'fmt-pdf' },
  { id: 'pachet', label: 'Pachete', cls: 'fmt-pachet' },
];

/* ─── Categorii principale (profil utilizator) ──── */
const MAIN_CATEGORIES = [
  { id: 'autoritati',          label: 'Autorități',          subcategories: ['achizitii','delegare','management','digitalizare','gratuite'] },
  { id: 'companii',            label: 'Companii',            subcategories: ['management','digitalizare','gratuite'] },
  { id: 'liber-profesionisti', label: 'Liber-profesioniști', subcategories: ['management','gratuite'] },
  { id: 'uz-zilnic',           label: 'Uz zilnic',           subcategories: ['gratuite'] },
];

const FORMAT_META = {
  word:   { abbr: 'DOC',  label: 'WORD' },
  excel:  { abbr: 'XLS',  label: 'EXCEL' },
  pdf:    { abbr: 'PDF',  label: 'PDF' },
  pachet: { abbr: 'PKG',  label: 'PACHET' },
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
function ProductCard({ product, onClick }) {
  const fmt = FORMAT_META[product.format];
  return (
    <div className="shop-product-card" onClick={() => onClick(product)}>
      <div className={`shop-card-vis model-card-vis ${product.cv}`}>
        <div className="mc-pat" />
        {product.price === 0 && <div className="shop-badge-free">Gratuit</div>}
        {product.isNew && product.price !== 0 && <div className="shop-badge-new">Nou</div>}
        <div className="mc-badge">{fmt.label}</div>
        <div className="mc-tag">{fmt.abbr}</div>
      </div>

      <div className="shop-card-body">
        <div className="shop-card-title">{product.title}</div>
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
          <button
            className="btn btn-primary btn-sm"
            onClick={e => { e.stopPropagation(); onClick(product); }}
          >
            {product.price === 0 ? 'Descarcă →' : 'Detalii →'}
          </button>
        </div>
      </div>
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
   34 KB pentru 2898 de unitati administrative, prea mult ca sa stea in
   pagina degeaba, destul de putin cat sa nu merite impartit pe judete. */
const LOCALITATI_URL = 'assets/date/localitati.json';

const CHECKOUT_FIELDS = [
  { k: 'lastName',   label: 'Nume *',        ph: 'Popescu',            w: 1 },
  { k: 'firstName',  label: 'Prenume *',     ph: 'Ion',                w: 1 },
  { k: 'email',      label: 'Email *',       ph: 'ion@exemplu.ro',     w: 2, type: 'email' },
  { k: 'phone',      label: 'Telefon *',     ph: '+40 7xx xxx xxx',    w: 2, type: 'tel' },
  { k: 'address',    label: 'Adresă *',      ph: 'Str. Exemplu nr. 1', w: 2 },
  { k: 'state',      label: 'Județ *',       w: 1, kind: 'judet' },
  { k: 'city',       label: 'Localitate *',  w: 1, kind: 'localitate' },
  { k: 'postalCode', label: 'Cod poștal *',  ph: '010101',             w: 1 },
];

/* Doar pentru persoana juridica. Oblio decide dupa CUI daca factura
   se emite pe firma, deci la comutarea pe persoana fizica ambele se
   golesc, altfel o valoare ramasa ar schimba destinatarul facturii. */
const COMPANY_FIELDS = [
  { k: 'company', label: 'Denumire firmă *', ph: 'Exemplu S.R.L.', w: 2 },
  { k: 'cui',     label: 'CUI *',            ph: 'RO12345678',     w: 1 },
];

const REQUIRED_FIELDS = ['lastName', 'firstName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];

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

  const obligatorii = entity === 'pj'
    ? REQUIRED_FIELDS.concat(['company', 'cui'])
    : REQUIRED_FIELDS;

  const complete = obligatorii.every(k => (form[k] || '').trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    && (entity !== 'pj' || cuiValid(form.cui));
  const ready = complete && terms && waiver;

  /* In form.state tinem NUMELE judetului, nu codul: campul pleaca asa
     cum e catre Oblio si ajunge pe factura, unde „AB” ar fi gresit.
     Codul il derivam doar ca sa cautam localitatile. */
  const codJudet = (JUDETE.find(j => j.n === form.state) || {}).c;
  const locJudet = (localitati && codJudet && localitati[codJudet]) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) {
      setError('Completează toate câmpurile marcate cu * și bifează ambele acorduri.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/netopia-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: product.sku, ...form, acceptTerms: terms, acceptWaiver: waiver }),
      });
      const json = await res.json();
      if (res.ok && json.paymentURL) {
        window.location.assign(json.paymentURL);
        return;
      }
      setError(json.error || 'Plata nu a putut fi inițiată. Încearcă din nou sau scrie-ne la ' + COMPANY.email + '.');
    } catch {
      setError('Eroare de rețea. Încearcă din nou sau scrie-ne la ' + COMPANY.email + '.');
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
            <label className="sp-label">{f.label}</label>

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

      <label className="sp-check">
        <input type="checkbox" checked={waiver} onChange={e => setWaiver(e.target.checked)} />
        <span>
          Solicit expres livrarea imediată a documentului digital și confirm că am luat cunoștință că, odată începută descărcarea,
          îmi pierd <a href="/dreptul-de-retragere" onClick={e => { e.preventDefault(); go('dreptul-de-retragere'); }}>dreptul de retragere</a> de {COMMERCE.withdrawalDays} zile. *
        </span>
      </label>

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
function ProductModal({ product, onClose, onNav }) {
  const fmt = FORMAT_META[product.format];
  const isFree = product.price === 0;
  const hasFreeFile = isFree && product.file;

  const [email,       setEmail]       = useState('');
  const [gdpr,        setGdpr]        = useState(false);
  const [emailErr,    setEmailErr]    = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloaded,  setDownloaded]  = useState(false);
  const [checkout,    setCheckout]    = useState(false);

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, []);

  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleDownload = async e => {
    e.preventDefault();
    if (!validEmail(email)) { setEmailErr('Introdu o adresă de email validă.'); return; }
    if (!gdpr) return;
    setEmailErr('');
    setDownloading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), product: product.title }),
      });
    } catch (_) {}
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

  const canDownload = validEmail(email) && gdpr;

  return (
    <div className="shop-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="shop-modal">

        {/* Antet navy, același pentru toate formatele */}
        <div className="shop-modal-hd">
          <button className="shop-modal-close" onClick={onClose} aria-label="Închide">×</button>
          <div className="sp-modal-fmt">{fmt.label}</div>
          <h3 className="sp-modal-title">{product.title}</h3>
          <div className="sp-modal-tags">
            {product.tags.map(t => <span key={t}>{t}</span>)}
          </div>
        </div>

        {/* Body */}
        <div className="shop-modal-bd">

          <div className="shop-modal-sec">
            <div className="shop-modal-lbl">Descriere</div>
            <p className="sp-modal-text">{product.longDesc}</p>
          </div>

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

          {(product.stats.files > 0 || product.stats.pages > 0) && (
            <div className="shop-modal-sec">
              <div className="shop-modal-lbl">Detalii tehnice</div>
              <div className="sp-modal-stats">
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
            </div>
          )}

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
                <label className="sp-check">
                  <input
                    type="checkbox"
                    checked={gdpr}
                    onChange={e => setGdpr(e.target.checked)}
                  />
                  <span>
                    Am citit și accept <strong>Politica de confidențialitate</strong> și sunt de acord cu prelucrarea datelor cu caracter personal în scopul furnizării documentului solicitat, conform GDPR (Regulamentul UE 2016/679). *
                  </span>
                </label>
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
                        Fără costuri. Trimite-ne un email și îți livrăm documentul gratuit.
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
                      Solicită acces gratuit
                    </button>
                  </div>
                  <p className="sp-fine sp-fine--gap">
                    Trimite-ne un email și îți livrăm documentul gratuit în cel mai scurt timp.
                  </p>
                </>
              ) : checkout ? (
                <CheckoutForm product={product} onNav={onNav} />
              ) : (
                <>
                  <div className="shop-modal-actions">
                    <button className="btn btn-primary" onClick={() => setCheckout(true)}>
                      Cumpără cu cardul
                    </button>
                  </div>
                  <p className="sp-fine sp-fine--gap">
                    Documentele se livrează prin email, în format editabil, imediat după confirmarea plății.
                    Preferi transferul bancar? Scrie-ne la <a href={'mailto:' + COMPANY.email}>{COMPANY.email}</a>.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Pagina principală Shop ────────────────────── */
function ShopPage({ onNav, initialCategory = 'all' }) {
  const [mainCat,  setMainCat]  = useState('all');
  const [category, setCategory] = useState(initialCategory);
  const [format,   setFormat]   = useState('all');
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(null);

  const handleMainCat = id => { setMainCat(id); setCategory('all'); };

  const activeSubs = React.useMemo(() => {
    if (mainCat === 'all') return SHOP_CATEGORIES;
    const mc = MAIN_CATEGORIES.find(m => m.id === mainCat);
    if (!mc) return SHOP_CATEGORIES;
    return SHOP_CATEGORIES.filter(c => c.id === 'all' || mc.subcategories.includes(c.id));
  }, [mainCat]);

  const filtered = SHOP_PRODUCTS.filter(p => {
    if (p.hidden && !SHOW_HIDDEN) return false;
    const matchMain = mainCat === 'all' || p.mainCategories.includes(mainCat);
    const matchCat  = category === 'all' || p.category === category;
    const matchFmt  = format   === 'all' || p.format   === format;
    const q = query.trim().toLowerCase();
    const matchQ = !q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchMain && matchCat && matchFmt && matchQ;
  });

  const hasFilters = mainCat !== 'all' || category !== 'all' || format !== 'all' || query.trim();

  const resetFilters = () => { setMainCat('all'); setCategory('all'); setFormat('all'); setQuery(''); };

  return (
    <>
      {/* Hero: navy plat, ca paginile statice */}
      <div className="pg-hero">
        <div className="container">
          <div className="tag-label">Produse digitale</div>
          <h1>Documente profesionale pentru sectorul public și privat</h1>
          <p>Modele Word, Excel și PDF, gata de completat. O parte sunt gratuite.</p>
          <div className="shop-search-wrap">
            <span className="shop-search-ico"><IcoSearch size={18} /></span>
            <input
              className="shop-search"
              type="text"
              placeholder="Caută (ex: licitație, caiet de sarcini, SEAP, salubrizare...)"
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
            <img src="uploads/seap-sicap-logo.webp" alt="SEAP / SICAP" />
          </a>
          <span>
            <strong>Suntem și pe SEAP.</strong> Produsele și serviciile INFORMS pot fi achiziționate prin sistemul electronic de achiziții publice.
          </span>
        </div>
      </div>

      {/* Main categories */}
      <div className="sp-profile">
        <div className="container">
          <div className="sp-profile__lbl">Filtrează după profil</div>
          <div className="sp-profile__row">
            {MAIN_CATEGORIES.map(m => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mainCat === m.id}
                onClick={() => handleMainCat(mainCat === m.id ? 'all' : m.id)}
                className={'sp-chip' + (mainCat === m.id ? ' is-on' : '')}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="shop-filter-bar" id="shop-filter-bar">
        <div className="container">
          <div className="shop-tabs">
            {activeSubs.map(c => (
              <div
                key={c.id}
                className={`shop-tab${category === c.id ? ' active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </div>
            ))}
          </div>
          <div className="shop-formats">
            <span className="shop-fmt-label">Format:</span>
            {SHOP_FORMATS.map(f => (
              <div
                key={f.id}
                className={`shop-fmt ${f.cls}${format === f.id ? ' active' : ''}`}
                onClick={() => setFormat(f.id)}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="sec sp-catalog">
        <div className="container">

          {/* Result bar */}
          <div className="shop-result-bar">
            <div className="shop-result-count">
              <strong>{filtered.length}</strong>&nbsp;
              {filtered.length === 1 ? 'produs găsit' : 'produse găsite'}
              {hasFilters && (
                <button className="shop-reset-btn" onClick={resetFilters}>
                  ✕ Resetează filtrele
                </button>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="shop-grid">
              {filtered.map((p, i) => (
                <FadeUp key={p.id} delay={Math.min(i, 5) * 70} style={{ display: 'flex', flexDirection: 'column' }}>
                  <ProductCard product={p} onClick={setSelected} />
                </FadeUp>
              ))}
            </div>
          ) : (
            <div className="shop-empty">
              <div className="shop-empty-icon">🔍</div>
              <h3>Niciun produs găsit</h3>
              <p>Încearcă să modifici criteriile de filtrare sau căutare.</p>
              <button className="btn btn-outline" onClick={resetFilters}>Resetează filtrele</button>
            </div>
          )}

          {/* CTA banner */}
          <div className="shop-cta-banner">
            <div className="sp-cta__k">Ai nevoie de ceva personalizat?</div>
            <h2 className="sp-cta__title">Documentație la comandă</h2>
            <p className="sp-cta__lead">
              Nu ai găsit ce căutai? Elaborăm documentații personalizate, adaptate exact situației și nevoilor tale specifice.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { onNav('contact'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
            >
              Contactează-ne
            </button>
          </div>

        </div>
      </section>

      {/* Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onNav={onNav}
        />
      )}
    </>
  );
}

/* ─── Pagina de întoarcere din plată ─────────────
   /api/netopia-return interoghează statusul comenzii la
   procesator și redirecționează aici cu ?s=ok|pending|fail.
   Pagina e strict informativă: livrarea o face webhook-ul. */
const ORDER_STATES = {
  ok: {
    color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC', icon: '✓',
    title: 'Plata a fost confirmată',
    body: 'Îți mulțumim. Ai primit pe email confirmarea comenzii și linkul de descărcare. Dacă mesajul nu apare în câteva minute, verifică folderul Spam sau Promoții.',
  },
  pending: {
    color: '#B45309', bg: '#FFFBEB', border: '#FCD34D', icon: '⏳',
    title: 'Plata este în curs de procesare',
    body: 'Banca verifică tranzacția. Imediat ce plata este confirmată, primești documentul pe email, automat. Nu relua plata până nu primești un răspuns.',
  },
  fail: {
    color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '!',
    title: 'Plata nu a fost finalizată',
    body: 'Tranzacția a fost respinsă sau anulată și nu ți s-a reținut nicio sumă. Poți relua comanda din magazin sau ne poți scrie pentru plata prin transfer bancar.',
  },
};

function OrderStatusPage({ onNav }) {
  const key = new URLSearchParams(window.location.search).get('s');
  const st = ORDER_STATES[key] || ORDER_STATES.pending;
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <h1>Stare comandă</h1>
          <p>Rezultatul plății și pașii următori.</p>
        </div>
      </div>
      <section className="sec">
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ textAlign: 'center', padding: '56px 40px', background: st.bg, border: '1px solid ' + st.border, borderRadius: '20px' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '14px', color: st.color }}>{st.icon}</div>
            <h3 style={{ marginBottom: '14px', fontSize: '1.4rem', color: st.color }}>{st.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: '1.75', marginBottom: '30px' }}>{st.body}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => go('magazin')}>Înapoi în magazin</button>
              <button className="btn btn-outline" onClick={() => go('contact')}>Contactează-ne</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { ShopPage, OrderStatusPage });
