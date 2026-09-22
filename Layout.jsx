const { useState, useEffect, useRef } = React;

function FadeUp({ children, delay = 0, style = {}, className = '' }) {
  return (
    <div className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* Sageata folosita in linkurile de tip „vezi mai mult”. */
function Arrow() {
  return (
    <svg className="ico-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1 8h12M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Caret() {
  return (
    <svg className="ico-caret" viewBox="0 0 10 6" aria-hidden="true">
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Chrome ─────────────────────────────────────────────────
   Acelasi markup si aceleasi clase ca paginile statice, ca sa nu
   existe o cusatura vizibila cand treci din /servicii in /magazin.
   Stilurile vin din css/spa-chrome.css, generat la build din aceleasi
   surse ca site-ul static.

   Paginile de marketing sunt servite static, deci linkurile catre ele
   sunt navigari reale, nu rutare pe client. Doar Produse ramane
   intern, pentru ca trimite si categoria selectata.
   ──────────────────────────────────────────────────────────── */

const PROD_CATS = [
  { cat: 'all',          label: 'Toate produsele' },
  { cat: 'achizitii',    label: 'Achiziții publice' },
  { cat: 'delegare',     label: 'Delegare servicii' },
  { cat: 'management',   label: 'Management proiect' },
  { cat: 'digitalizare', label: 'Digitalizare' },
  { cat: 'gratuite',     label: 'Gratuite' },
];

const SVC_LINKS = [
  ['/servicii#analiza',  'Analiză și soluții personalizate'],
  ['/servicii#achizitii', 'Achiziții publice'],
  ['/servicii#delegare',  'Delegare servicii de utilități publice'],
  ['/servicii#excel',     'Modele de lucru EXCEL'],
  ['/servicii#word',      'Modele de lucru WORD'],
  ['/servicii#pdf',       'Modele de lucru PDF inteligent'],
];

function Nav({ onNav, page }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);       // 'servicii' | 'produse' | null
  const closeTimer = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') { setMenu(null); setOpen(false); } };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  /* Aceeasi intarziere la inchidere ca pe paginile statice, ca sa poti
     trece cu mouse-ul de pe buton pe panou fara sa se inchida. */
  const enter = (id) => { clearTimeout(closeTimer.current); setMenu(id); };
  const leave = () => { closeTimer.current = setTimeout(() => setMenu(null), 140); };

  const goShop = (cat, e) => {
    e.preventDefault();
    onNav('magazin', { category: cat });
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMenu(null);
    setOpen(false);
  };

  const item = (id, extra = '') =>
    `nav__item${extra}${menu === id ? ' is-open' : ''}`;

  return (
    <>
      <header className={`hdr${scrolled ? ' is-stuck' : ''}`}>
        <div className="hdr__inner">

          <a className="logo" href="/" aria-label="INFORMS - acasă">
            <img className="logo__img" src="assets/brand/logo-white.svg" alt="INFORMS" width="1000" height="166" />
          </a>

          <nav className="nav" aria-label="Navigare principală">
            <ul className="nav__list">
              <li className="nav__item"><a className="nav__link" href="/">Acasă</a></li>
              <li className="nav__item"><a className="nav__link" href="/despre-noi">Despre noi</a></li>

              <li className={item('servicii', ' has-menu')}
                  onMouseEnter={() => enter('servicii')} onMouseLeave={leave}>
                <button className="nav__link" aria-expanded={menu === 'servicii'}
                        onClick={() => setMenu(menu === 'servicii' ? null : 'servicii')}>
                  Servicii <Caret />
                </button>
                <div className="mega">
                  <div className="mega__inner mega__inner--2">
                    <div className="mega__col">
                      <p className="mega__label">Consultanță și documentații</p>
                      <ul className="mega__links">
                        {SVC_LINKS.slice(0, 3).map(([h, l]) => (
                          <li key={h}><a href={h}>{l}</a></li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega__col">
                      <p className="mega__label">Instrumente de lucru</p>
                      <ul className="mega__links">
                        {SVC_LINKS.slice(3).map(([h, l]) => (
                          <li key={h}><a href={h}>{l}</a></li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega__promo">
                      <div className="mega__promo-art art" data-art="grid" data-tint="deep" />
                      <p className="mega__promo-kicker">Actualizare 2026</p>
                      <p className="mega__promo-title">Ce se schimbă odată cu eForms și noile praguri</p>
                      <a className="lnk" href="/servicii">Vezi serviciile <Arrow /></a>
                    </div>
                  </div>
                </div>
              </li>

              <li className={item('produse', ' has-menu')}
                  onMouseEnter={() => enter('produse')} onMouseLeave={leave}>
                <button className="nav__link" aria-expanded={menu === 'produse'}
                        onClick={() => setMenu(menu === 'produse' ? null : 'produse')}>
                  Produse <Caret />
                </button>
                <div className="mega">
                  <div className="mega__inner mega__inner--1">
                    <div className="mega__col">
                      <p className="mega__label">Catalog</p>
                      <ul className="mega__links">
                        {PROD_CATS.map(({ cat, label }) => (
                          <li key={cat}>
                            <a className={page === 'magazin' && cat === 'all' ? 'is-active' : undefined}
                               href="/magazin" onClick={(e) => goShop(cat, e)}>{label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega__promo">
                      <div className="mega__promo-art art" data-art="bars" data-tint="blue" />
                      <p className="mega__promo-kicker">Fără cost</p>
                      <p className="mega__promo-title">Modele gratuite, descărcabile imediat</p>
                      <a className="lnk" href="/magazin" onClick={(e) => goShop('gratuite', e)}>Vezi modelele <Arrow /></a>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav__item"><a className="nav__link" href="/contact">Contact</a></li>
            </ul>
          </nav>

          <div className="hdr__actions">
            <a className="btn btn--primary btn--sm" href="/contact">Solicită o consultare</a>
          </div>

          <button className="burger" type="button" aria-expanded={open}
                  aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
                  onClick={() => setOpen(!open)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {open && (
        <div className="drawer">
          <nav className="drawer__nav" aria-label="Navigare mobilă">
            <a className="drawer__solo" href="/">Acasă</a>
            <a className="drawer__solo" href="/despre-noi">Despre noi</a>

            <details className="drawer__group">
              <summary>Servicii</summary>
              {SVC_LINKS.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
            </details>

            <details className="drawer__group" open={page === 'magazin'}>
              <summary>Produse</summary>
              {PROD_CATS.map(({ cat, label }) => (
                <a key={cat} href="/magazin" onClick={(e) => goShop(cat, e)}>{label}</a>
              ))}
            </details>

            <a className="drawer__solo" href="/contact">Contact</a>
            <a className="btn btn--primary drawer__cta" href="/contact">Solicită o consultare</a>
          </nav>
        </div>
      )}
    </>
  );
}

function Footer() {
  const rows = companyRows();
  const byLabel = (l) => rows.find(r => r.label === l);

  const link = (r) => r.href
    ? <a href={r.href}>{r.val}</a>
    : <span>{r.val}</span>;

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__top">
          <div className="ftr__brand">
            <a className="logo" href="/" aria-label="INFORMS - acasă">
              <img className="logo__img" src="assets/brand/logo-white.svg" alt="INFORMS" width="1000" height="166" />
            </a>
            <p className="ftr__tag">
              Documentații complete, formulare și instrumente de lucru pentru achiziții publice,
              într-un format standard și ușor de aplicat.
            </p>
            <a className="ftr__cross" href="https://agathaplus.ro/" target="_blank" rel="noopener noreferrer">
              <span>Gestionezi tot programul de achiziții? Vezi aplicația <strong>Agatha Plus</strong></span>
              <Arrow />
            </a>
          </div>

          <nav className="ftr__cols" aria-label="Navigare subsol">
            <div className="ftr__col">
              <h2 class="ftr__h">Date firmă</h2>
              <ul>
                {rows.map((r, i) => <li key={i}>{link(r)}</li>)}
              </ul>
            </div>
            <div className="ftr__col">
              <h2 class="ftr__h">Navigare</h2>
              <ul>
                <li><a href="/">Pagina principală</a></li>
                <li><a href="/despre-noi">Despre noi</a></li>
                <li><a href="/servicii">Servicii</a></li>
                <li><a href="/magazin">Produse</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="ftr__col">
              <h2 class="ftr__h">Servicii</h2>
              <ul>
                {SVC_LINKS.map(([h, l]) => (
                  <li key={h}><a href={h}>{l.replace('Modele de lucru ', 'Modele ').replace(' personalizate', '')}</a></li>
                ))}
              </ul>
            </div>
            <div className="ftr__col">
              <h2 class="ftr__h">Politici</h2>
              <ul>
                <li><a href="/termeni-si-conditii">Termeni și condiții</a></li>
                <li><a href="/politica-confidentialitate">Politica de confidențialitate</a></li>
                <li><a href="/politica-gdpr">Politica GDPR</a></li>
                <li><a href="/politica-cookies">Politica de cookie-uri</a></li>
                <li><button type="button" className="cc-link" data-cc="show-preferencesModal">Setări cookie</button></li>
                <li><a href="/politica-livrare">Politica de livrare</a></li>
                <li><a href="/politica-anulare">Anulare și retur</a></li>
                <li><a href="/dreptul-de-retragere">Dreptul de retragere</a></li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Siglele Visa si Mastercard, ca si badge-urile ANPC, se afiseaza
            nealterate: fara opacitate si fara filtre. */}
        <div className="ftr__badges">
          <div className="ftr__badge-row">
            <a className="ftr__badge" href="https://www.e-licitatie.ro/pub" target="_blank" rel="noopener noreferrer">
              <img src="uploads/seap-sicap-logo-h102.webp" alt="SEAP / SICAP" width="250" height="102" loading="lazy" />
            </a>
            <a className="ftr__badge" href="https://netopia-payments.com/" target="_blank" rel="noopener noreferrer" title="NETOPIA Payments">
              <img className="ftr__badge-img--pay" src="uploads/netopia-payments-white.svg"
                   alt="NETOPIA Payments, Visa, Mastercard" width="418" height="75" loading="lazy" />
            </a>
          </div>
          <div className="ftr__badge-row">
            <a className="ftr__badge" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
              <img src="uploads/anpc-sal-h102.webp" alt="ANPC SAL" width="398" height="102" loading="lazy" />
            </a>
            <a className="ftr__badge" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
              <img src="uploads/anpc-sol-h102.webp" alt="ANPC SOL" width="366" height="102" loading="lazy" />
            </a>
          </div>
        </div>

        <div className="ftr__legal">
          <p className="ftr__copy">
            © {new Date().getFullYear()} {COMPANY.brand}. Parte a companiei {COMPANY.name}. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}

function fmtTitle(text) {
  const map = { 'EXCEL': '#177245', 'Excel': '#177245', 'WORD': '#1358B0', 'Word': '#1358B0', 'PDF': '#C23B22' };
  const parts = text.split(/\b(EXCEL|Excel|WORD|Word|PDF)\b/);
  return parts.map((p, i) => map[p]
    ? React.createElement('span', { key: i, style: { color: map[p] } }, p)
    : p
  );
}

Object.assign(window, { FadeUp, Nav, Footer, fmtTitle });
