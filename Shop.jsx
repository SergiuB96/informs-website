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
   cv: clasa CSS pentru culoarea header-ului cardului
       cv-word (albastru) | cv-excel (verde) | cv-pdf (roșu) | cv-atr (navy)
   file: calea relativă către fișier - DOAR pentru produse gratuite
         ex: 'assets/produse/gratuite/pdf/ghid-termeni.pdf'
   sku:  cod unic de produs, obligatoriu pentru produsele cu preț.
         Trebuie să existe și în api/_lib/products.js, de unde se ia
         prețul la plată. Prețul de aici este doar pentru afișare;
         serverul nu are încredere în el niciodată.

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

  /* ─────────────────────────────────────────────────
     PRODUSE CU PREȚ
     Titlurile, descrierile și prețurile de mai jos sunt
     un punct de plecare - ajustează-le înainte de live.
     Orice modificare de preț trebuie făcută ȘI în
     api/_lib/products.js, altfel plata e respinsă.
  ───────────────────────────────────────────────── */
  {
    id: 'caiet-sarcini-produse',
    sku: 'INF-CS-PROD',
    title: 'Caiet de sarcini - achiziție de produse',
    shortDesc: 'Model complet de caiet de sarcini pentru proceduri de achiziție de produse, cu specificații tehnice și cerințe de calificare.',
    longDesc: 'Model editabil de caiet de sarcini pentru achiziția de produse, structurat conform cerințelor Legii nr. 98/2016 și ale normelor de aplicare. Include secțiunile de specificații tehnice, condiții de livrare și recepție, cerințe privind garanția și modul de formulare a criteriilor de atribuire, cu note explicative pentru fiecare secțiune.',
    category: 'achizitii',
    mainCategories: ['autoritati', 'companii'],
    format: 'word',
    cv: 'cv-word',
    price: 249,
    featured: true,
    isNew: true,
    tags: ['Caiet de sarcini', 'Produse', 'Legea 98/2016'],
    includes: [
      'Caiet de sarcini - achiziție produse (Word editabil)',
      'Note explicative pe fiecare secțiune',
      'Model de specificații tehnice',
      'Grilă de cerințe de calificare',
    ],
    stats: { files: 1, pages: 24 },
  },
  {
    id: 'strategie-contractare',
    sku: 'INF-STR-CTR',
    title: 'Strategia de contractare - model complet',
    shortDesc: 'Document de fundamentare a procedurii de atribuire, cu justificarea valorii estimate și a criteriilor de atribuire.',
    longDesc: 'Model de strategie de contractare care acoperă toate elementele cerute de legislația achizițiilor publice: relația dintre obiectul contractului și necesitatea identificată, justificarea valorii estimate, alegerea procedurii, criteriile de calificare și de atribuire, aranjamentele contractuale și modul de gestionare a riscurilor.',
    category: 'achizitii',
    mainCategories: ['autoritati'],
    format: 'word',
    cv: 'cv-word',
    price: 199,
    featured: true,
    isNew: true,
    tags: ['Strategie de contractare', 'Atribuire', 'Fundamentare'],
    includes: [
      'Strategia de contractare (Word editabil)',
      'Secțiune de justificare a valorii estimate',
      'Matrice de riscuri contractuale',
    ],
    stats: { files: 1, pages: 18 },
  },
  {
    id: 'pachet-documentatie-servicii',
    sku: 'INF-PCK-SERV',
    title: 'Pachet documentație de atribuire - servicii',
    shortDesc: 'Setul complet de documente pentru o procedură de achiziție de servicii: caiet de sarcini, clauze contractuale, formulare.',
    longDesc: 'Pachet complet pentru pregătirea unei proceduri de achiziție de servicii. Conține caietul de sarcini, modelul de contract cu clauzele obligatorii și facultative, setul de formulare pentru ofertanți și strategia de contractare, toate corelate între ele și gata de adaptat la obiectul concret al procedurii.',
    category: 'achizitii',
    mainCategories: ['autoritati', 'companii'],
    format: 'pachet',
    cv: 'cv-atr',
    price: 499,
    featured: true,
    isNew: true,
    tags: ['Pachet complet', 'Servicii', 'Documentație de atribuire'],
    includes: [
      'Caiet de sarcini - servicii (Word)',
      'Model de contract cu clauze contractuale (Word)',
      'Set complet de formulare pentru ofertanți (Word)',
      'Strategia de contractare (Word)',
    ],
    stats: { files: 4, pages: 86 },
  },
];

/* ─── Configurare categorii și formate ──────────── */
const SHOP_CATEGORIES = [
  { id: 'all',          label: 'Toate produsele' },
  { id: 'achizitii',   label: 'Achiziții publice' },
  { id: 'delegare',    label: 'Delegare servicii' },
  { id: 'management',  label: 'Management proiect' },
  { id: 'digitalizare',label: 'Digitalizare' },
  { id: 'gratuite',    label: 'Gratuite', green: true },
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
  word:   { abbr: 'DOC',  label: 'WORD',   bg: 'linear-gradient(135deg,#0D2D6A 0%,#1358B0 100%)' },
  excel:  { abbr: 'XLS',  label: 'EXCEL',  bg: 'linear-gradient(135deg,#083020 0%,#177245 100%)' },
  pdf:    { abbr: 'PDF',  label: 'PDF',    bg: 'linear-gradient(135deg,#6B1208 0%,#C23B22 100%)' },
  pachet: { abbr: 'PKG',  label: 'PACHET', bg: 'linear-gradient(135deg,#061830 0%,#0D3870 100%)' },
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
            ? <div className="shop-card-price" style={{ color: '#16A34A' }}>Gratuit</div>
            : <div className="shop-card-price">{product.price} <span>{COMMERCE.currency}</span></div>
          }
          <button
            className="btn btn-primary btn-sm"
            style={product.price === 0 ? { background: '#16A34A', borderColor: '#16A34A' } : {}}
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
const CHECKOUT_FIELDS = [
  { k: 'lastName',   label: 'Nume *',        ph: 'Popescu',        w: 1 },
  { k: 'firstName',  label: 'Prenume *',     ph: 'Ion',            w: 1 },
  { k: 'email',      label: 'Email *',       ph: 'ion@exemplu.ro', w: 2, type: 'email' },
  { k: 'phone',      label: 'Telefon *',     ph: '+40 7xx xxx xxx', w: 2, type: 'tel' },
  { k: 'address',    label: 'Adresă *',      ph: 'Str. Exemplu nr. 1',  w: 2 },
  { k: 'city',       label: 'Localitate *',  ph: 'București',      w: 1 },
  { k: 'state',      label: 'Județ *',       ph: 'București',      w: 1 },
  { k: 'postalCode', label: 'Cod poștal *',  ph: '010101',         w: 1 },
  { k: 'company',    label: 'Firmă',         ph: 'opțional',       w: 1 },
  { k: 'cui',        label: 'CUI',           ph: 'opțional',       w: 2 },
];

const REQUIRED_FIELDS = ['lastName', 'firstName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];

function CheckoutForm({ product, onNav }) {
  const [form, setForm] = useState({ lastName: '', firstName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', company: '', cui: '' });
  const [terms, setTerms] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const complete = REQUIRED_FIELDS.every(k => form[k].trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const ready = complete && terms && waiver;

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

  const input = { padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '6px', fontSize: '14.5px', fontFamily: 'var(--font)', color: 'var(--text)', background: '#fff', outline: 'none', width: '100%' };
  const lbl = { fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', display: 'block' };
  const check = { marginTop: '3px', flexShrink: 0, width: '15px', height: '15px', cursor: 'pointer', accentColor: '#1358B0' };
  const checkTxt = { fontSize: '12.5px', color: 'var(--text-2)', lineHeight: '1.65' };
  const linkSt = { color: 'var(--blue-a)', fontWeight: 600 };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div className="shop-modal-lbl" style={{ marginBottom: '2px' }}>Date de facturare</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {CHECKOUT_FIELDS.map(f => (
          <div key={f.k} style={f.w === 2 ? { gridColumn: '1 / -1' } : undefined}>
            <label style={lbl}>{f.label}</label>
            <input type={f.type || 'text'} style={input} value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} />
          </div>
        ))}
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={check} />
        <span style={checkTxt}>
          Am citit și accept <a href="/termeni-si-conditii" style={linkSt} onClick={e => { e.preventDefault(); go('termeni-si-conditii'); }}>Termenii și condițiile</a> și <a href="/politica-confidentialitate" style={linkSt} onClick={e => { e.preventDefault(); go('politica-confidentialitate'); }}>Politica de confidențialitate</a>. *
        </span>
      </label>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
        <input type="checkbox" checked={waiver} onChange={e => setWaiver(e.target.checked)} style={check} />
        <span style={checkTxt}>
          Solicit expres livrarea imediată a documentului digital și confirm că am luat cunoștință că, odată începută descărcarea,
          îmi pierd <a href="/dreptul-de-retragere" style={linkSt} onClick={e => { e.preventDefault(); go('dreptul-de-retragere'); }}>dreptul de retragere</a> de {COMMERCE.withdrawalDays} zile. *
        </span>
      </label>

      {error && (
        <p style={{ color: '#c53030', fontSize: '13px', background: '#fff5f5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fed7d7', margin: 0 }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={!ready || loading} style={{ justifyContent: 'center', background: ready ? '' : '#D1D5DB', borderColor: ready ? '' : '#D1D5DB', cursor: ready ? 'pointer' : 'not-allowed' }}>
        {loading ? 'Se deschide pagina de plată...' : 'Plătește ' + fmtPrice(product.price)}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <img src="uploads/netopia-payments.webp" alt="NETOPIA Payments, Visa, Mastercard" style={{ height: '26px', width: 'auto' }} />
      </div>
      <p style={{ fontSize: '11.5px', color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
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

        {/* Header colorat */}
        <div className="shop-modal-hd" style={{ background: fmt.bg }}>
          <button className="shop-modal-close" onClick={onClose}>×</button>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'rgba(255,255,255,.5)', marginBottom: '10px' }}>
            {fmt.label}
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '14px', letterSpacing: '-.02em', paddingRight: '36px' }}>
            {product.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {product.tags.map(t => (
              <span key={t} style={{ fontSize: '12px', fontWeight: 600, background: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.82)', padding: '3px 10px', borderRadius: '8px' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="shop-modal-bd">

          <div className="shop-modal-sec">
            <div className="shop-modal-lbl">Descriere</div>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.78' }}>{product.longDesc}</p>
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
              <div style={{ display: 'flex', gap: '24px' }}>
                {product.stats.files > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14.5px', color: 'var(--text-2)' }}>
                    <IcoFile size={16} />
                    <span><strong style={{ color: 'var(--navy)' }}>{product.stats.files}</strong> {product.stats.files === 1 ? 'fișier' : 'fișiere'}</span>
                  </div>
                )}
                {product.stats.pages > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14.5px', color: 'var(--text-2)' }}>
                    <IcoPages size={16} />
                    <span><strong style={{ color: 'var(--navy)' }}>{product.stats.pages}</strong> pagini totale</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Descărcare gratuită cu email + GDPR ── */}
          {hasFreeFile ? (
            downloaded ? (
              <div style={{ textAlign: 'center', padding: '28px 20px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>✓</div>
                <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '1.05rem', marginBottom: '6px' }}>Descărcare pornită!</div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>Verifică folderul de descărcări din browser.</div>
              </div>
            ) : (
              <form onSubmit={handleDownload} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div className="shop-modal-lbl" style={{ marginBottom: '2px' }}>Descarcă gratuit</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>Adresă de email *</label>
                  <input
                    type="email"
                    placeholder="exemplu@email.ro"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                    style={{
                      padding: '10px 14px',
                      border: '1.5px solid ' + (emailErr ? '#DC2626' : 'var(--border)'),
                      borderRadius: '6px', fontSize: '15px', fontFamily: 'var(--font)',
                      color: 'var(--text)', background: '#fff', outline: 'none', width: '100%',
                    }}
                  />
                  {emailErr && <span style={{ fontSize: '12.5px', color: '#DC2626' }}>{emailErr}</span>}
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={gdpr}
                    onChange={e => setGdpr(e.target.checked)}
                    style={{ marginTop: '3px', flexShrink: 0, width: '15px', height: '15px', cursor: 'pointer', accentColor: '#1358B0' }}
                  />
                  <span style={{ fontSize: '12.5px', color: 'var(--text-2)', lineHeight: '1.65' }}>
                    Am citit și accept <strong style={{ color: 'var(--navy)' }}>Politica de confidențialitate</strong> și sunt de acord cu prelucrarea datelor cu caracter personal în scopul furnizării documentului solicitat, conform GDPR (Regulamentul UE 2016/679). *
                  </span>
                </label>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canDownload || downloading}
                  style={{
                    background: canDownload ? '#16A34A' : '#D1D5DB',
                    borderColor: canDownload ? '#16A34A' : '#D1D5DB',
                    justifyContent: 'center',
                    cursor: canDownload ? 'pointer' : 'not-allowed',
                  }}
                >
                  {downloading ? 'Se pregătește...' : 'Descarcă gratuit'}
                </button>
              </form>
            )
          ) : (
            <>
              <div className="shop-modal-price-box" style={isFree ? { borderColor: '#86EFAC', background: '#F0FDF4' } : {}}>
                <div>
                  {isFree
                    ? <div className="shop-modal-price-note" style={{ fontSize: '15px', color: '#16A34A', fontWeight: 600 }}>
                        Fără costuri. Trimite-ne un email și îți livrăm documentul gratuit.
                      </div>
                    : <>
                        <div className="shop-modal-price">
                          {product.price} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-2)' }}>{COMMERCE.currency}</span>
                        </div>
                        <div className="shop-modal-price-note">{COMMERCE.priceNote} · {COMMERCE.deliveryNote}</div>
                      </>
                  }
                </div>
              </div>

              {isFree ? (
                <>
                  <div className="shop-modal-actions">
                    <button className="btn btn-primary" style={{ background: '#16A34A', borderColor: '#16A34A', justifyContent: 'center' }} onClick={handleRequestFree}>
                      Solicită acces gratuit
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '14px', textAlign: 'center', lineHeight: '1.6' }}>
                    Trimite-ne un email și îți livrăm documentul gratuit în cel mai scurt timp.
                  </p>
                </>
              ) : checkout ? (
                <CheckoutForm product={product} onNav={onNav} />
              ) : (
                <>
                  <div className="shop-modal-actions">
                    <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setCheckout(true)}>
                      Cumpără cu cardul
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '14px', textAlign: 'center', lineHeight: '1.6' }}>
                    Documentele se livrează prin email, în format editabil, imediat după confirmarea plății.
                    Preferi transferul bancar? Scrie-ne la <a href={'mailto:' + COMPANY.email} style={{ color: 'var(--blue-a)' }}>{COMPANY.email}</a>.
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
      {/* Hero */}
      <div className="pg-hero pg-hero-video" style={{ textAlign: 'center' }}>
        <video className="pg-hero-vid" autoPlay muted playsInline loop preload="none">
          <source src="assets/videos_library/portofoliu-produse-informs.mp4" type="video/mp4" />
          <track kind="captions" src="" label="Română" srclang="ro" default />
        </video>
        <div className="pg-hero-overlay"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="tag-label">Produse digitale</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>Documente profesionale adaptate<br />pentru sectorul public și sectorul privat</h1>
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
      <div style={{ background: '#F0F6FF', borderBottom: '1px solid #C8DCEE' }}>
        <div className="container" style={{ padding: '14px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="https://www.e-licitatie.ro/pub" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
              <img src="uploads/seap-sicap-logo.webp" alt="SEAP / SICAP" style={{ height: '28px', width: 'auto', display: 'block' }} />
            </a>
            <span style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--navy)' }}>Suntem și pe SEAP</strong> — produsele și serviciile INFORMS pot fi achiziționate prin sistemul electronic de achiziții publice.
            </span>
          </div>
        </div>
      </div>

      {/* Main categories */}
      <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <div className="container" style={{ padding: '18px 28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-2)', marginBottom: '12px' }}>
            Filtrează după profil
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {MAIN_CATEGORIES.map(m => (
              <button
                key={m.id}
                onClick={() => handleMainCat(mainCat === m.id ? 'all' : m.id)}
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: mainCat === m.id ? 'var(--navy)' : 'var(--border)',
                  background: mainCat === m.id ? 'var(--navy)' : '#fff',
                  color: mainCat === m.id ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: '14px',
                  fontFamily: 'var(--font)',
                  cursor: 'pointer',
                  transition: 'all .15s',
                  lineHeight: 1.4,
                }}
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
                style={c.green ? { color: category === c.id ? '#16A34A' : '#16A34A', borderBottomColor: category === c.id ? '#16A34A' : 'transparent' } : {}}
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
      <section className="sec" style={{ paddingTop: '36px' }}>
        <div className="container">

          {/* Result bar */}
          <div className="shop-result-bar">
            <div className="shop-result-count">
              <strong>{filtered.length}</strong>&nbsp;
              {filtered.length === 1 ? 'produs găsit' : 'produse găsite'}
              {hasFilters && (
                <button className="shop-reset-btn" onClick={resetFilters} style={{ marginLeft: '14px' }}>
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
              <h3 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Niciun produs găsit</h3>
              <p style={{ marginBottom: '24px' }}>Încearcă să modifici criteriile de filtrare sau căutare.</p>
              <button className="btn btn-outline" onClick={resetFilters}>Resetează filtrele</button>
            </div>
          )}

          {/* CTA banner */}
          <div className="shop-cta-banner">
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--blue-a)', marginBottom: '12px' }}>
              Ai nevoie de ceva personalizat?
            </div>
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.35rem' }}>Documentație la comandă</h3>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '15.5px', lineHeight: '1.75', maxWidth: '480px', margin: '0 auto 28px' }}>
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
