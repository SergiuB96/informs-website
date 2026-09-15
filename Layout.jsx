const { useState, useEffect, useRef } = React;

function FadeUp({ children, delay = 0, style = {}, className = '' }) {
  return (
    <div className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function Nav({ onNav, page }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const ddTimer = useRef(null);
  const [ddProdOpen, setDdProdOpen] = useState(false);
  const ddProdTimer = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const h = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      if (y > 80) {
        setHidden(y > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const go = (p, e) => { if (e) e.preventDefault(); onNav(p); setOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const openDd  = () => { clearTimeout(ddTimer.current); setDdOpen(true); };
  const closeDd = () => { ddTimer.current = setTimeout(() => setDdOpen(false), 220); };

  const openDdProd  = () => { clearTimeout(ddProdTimer.current); setDdProdOpen(true); };
  const closeDdProd = () => { ddProdTimer.current = setTimeout(() => setDdProdOpen(false), 220); };

  const svcs = [
    ['analiza-si-solutii', 'Analiză și soluții personalizate'],
    ['achizitii-publice', 'Achiziții publice'],
    ['delegare-servicii', 'Delegare servicii de utilități publice'],
    ['modele-excel', 'Modele de lucru EXCEL'],
    ['modele-word', 'Modele de lucru WORD'],
    ['modele-pdf', 'Modele de lucru PDF'],
  ];
  const svcPages = svcs.map(s => s[0]);

  const prodCats = [
    { cat: 'all',          label: 'Toate produsele' },
    { cat: 'achizitii',    label: 'Achiziții publice' },
    { cat: 'delegare',     label: 'Delegare servicii' },
    { cat: 'management',   label: 'Management proiect' },
    { cat: 'digitalizare', label: 'Digitalizare' },
    { cat: 'gratuite',     label: 'Gratuite', green: true },
  ];

  return (
    <>
      <nav className={`main-nav${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`}>
        <div className="nav-island">
          <div className="nav-inner">
            <a className="nav-logo" href="/" onClick={(e) => go('home', e)}>
              <img
                src="logo/png/logo-no-background.png"
                alt="INFORMS"
                style={{ height: '28px', width: 'auto', display: 'block' }}
              />
            </a>

            <div className="nav-links">
              <a className={`nav-link${page === 'home' ? ' active' : ''}`} href="/" onClick={(e) => go('home', e)}>Acasă</a>
              <a className={`nav-link${page === 'despre-noi' ? ' active' : ''}`} href="/despre-noi" onClick={(e) => go('despre-noi', e)}>Despre noi</a>

              <div
                className={`nav-dd${ddOpen ? ' dd-open' : ''}`}
                onMouseEnter={openDd}
                onMouseLeave={closeDd}
              >
                <a className={`nav-link nav-dd-toggle${svcPages.includes(page) || page === 'servicii' ? ' active' : ''}`} href="/servicii" onClick={(e) => { e.preventDefault(); go('servicii'); }}>
                  Servicii
                </a>
                <div className="nav-dd-menu" onMouseEnter={openDd} onMouseLeave={closeDd}>
                  {svcs.map(([p, l]) => (
                    <a key={p} className="nav-dd-item" href={`/${p}`} onClick={(e) => go(p, e)}>{l}</a>
                  ))}
                </div>
              </div>

              <div
                className={`nav-dd${ddProdOpen ? ' dd-open' : ''}`}
                onMouseEnter={openDdProd}
                onMouseLeave={closeDdProd}
              >
                <a className={`nav-link nav-dd-toggle${page === 'magazin' ? ' active' : ''}`} href="/magazin" onClick={(e) => { e.preventDefault(); go('magazin'); }}>
                  Produse
                </a>
                <div className="nav-dd-menu" onMouseEnter={openDdProd} onMouseLeave={closeDdProd}>
                  {prodCats.map(({ cat, label, green }) => (
                    <a key={cat} className="nav-dd-item" href={`/magazin`} style={green ? { color: '#16A34A' } : {}} onClick={(e) => {
                      e.preventDefault();
                      onNav('magazin', { category: cat });
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      setDdProdOpen(false);
                    }}>{label}</a>
                  ))}
                </div>
              </div>
            </div>

            <div className="nav-end">
              <a className={`nav-link nav-cta${page === 'contact' ? ' active' : ''}`} href="/contact" onClick={(e) => go('contact', e)}>
                Contact
              </a>
              <button className={`hamburger${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-label="Meniu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <a className="m-link" href="/" onClick={(e) => go('home', e)}>Acasă</a>
        <a className="m-link" href="/despre-noi" onClick={(e) => go('despre-noi', e)}>Despre noi</a>
        <div className="m-section-title">Servicii</div>
        {svcs.map(([p, l]) => (
          <a key={p} className="m-link" href={`/${p}`} style={{ paddingLeft: '26px', fontSize: '14px' }} onClick={(e) => go(p, e)}>{l}</a>
        ))}
        <div className="m-section-title">Produse</div>
        {prodCats.map(({ cat, label, green }) => (
          <a key={cat} className="m-link" href="/magazin"
            style={{ paddingLeft: cat === 'all' ? '14px' : '26px', fontSize: cat === 'all' ? '15px' : '14px', ...(green ? { color: '#16A34A' } : {}) }}
            onClick={(e) => {
              e.preventDefault();
              onNav('magazin', { category: cat });
              window.scrollTo({ top: 0, behavior: 'instant' });
              setOpen(false);
            }}>{label}</a>
        ))}
        <div style={{ marginTop: '12px', padding: '0 2px' }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => go('contact')}>
            Contact
          </button>
        </div>
      </div>
    </>
  );
}

/* Link de footer cu href real, ca să poată fi copiat sau deschis în tab nou. */
function FLink({ to, go, children }) {
  const href = to === 'home' ? '/' : '/' + to;
  return (
    <a href={href} onClick={(e) => { e.preventDefault(); go(to); }}>{children}</a>
  );
}

function Footer({ onNav, page }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const videoRef = useRef(null);
  const isHome = page === 'home' || page === undefined;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!isHome) { el.pause(); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer>
      <video ref={videoRef} className="footer-vid" muted playsInline preload="none" style={{ display: isHome ? '' : 'none' }}>
        <source src="assets/videos_library/footer.mp4" type="video/mp4" />
        <track kind="captions" src="" label="Română" srclang="ro" default />
      </video>
      <div className="footer-content">
      <div className="footer-gradient-line"></div>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="f-logo">
              <img
                src="logo/png/logo-no-background.png"
                alt="INFORMS"
                style={{ height: '28px', width: 'auto', display: 'block', marginBottom: '14px', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="f-desc">
              Documentații complete, formulare și instrumente de lucru inteligente,
              într-un format intuitiv, standard și ușor de utilizat.
            </p>
            <div className="f-legal">
              {companyRows().map((r, i) => (
                <div key={i}>
                  <span className="f-legal-lbl">{r.label}</span>
                  {r.href
                    ? <a className="f-legal-val" href={r.href}>{r.val}</a>
                    : <span className="f-legal-val">{r.val}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.38)', marginBottom: '6px', lineHeight: '1.5' }}>
                Digitalizează achizițiile publice cu aplicația
              </p>
              <a href="https://agathaplus.ro/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,.75)', fontSize: '14.5px', fontWeight: 600 }}>
                Agatha Plus ↗
              </a>
            </div>
            <div className="f-partners">
              <a href="https://www.e-licitatie.ro/pub" target="_blank" rel="noopener noreferrer">
                <img src="uploads/seap-sicap-logo.webp" alt="SEAP / SICAP" />
              </a>
              {/* Varianta albă, cea pe care o alege componenta oficială NETOPIA
                  pentru un fundal închis ca #061830. Se afișează la opacitate
                  întreagă: siglele Visa și Mastercard nu au voie alterate. */}
              <a href="https://netopia-payments.com/" target="_blank" rel="noopener noreferrer" title="NETOPIA Payments">
                <img className="f-netopia" src="uploads/netopia-payments-white.svg" alt="NETOPIA Payments, Visa, Mastercard" />
              </a>
              <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
                <img src="uploads/anpc-sal.png" alt="ANPC SAL" />
              </a>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                <img src="uploads/anpc-sol.png" alt="ANPC SOL" />
              </a>
            </div>
          </div>

          <div>
            <h5>Link-uri rapide</h5>
            <FLink to="home" go={go}>Pagina principală</FLink>
            <FLink to="despre-noi" go={go}>Despre noi</FLink>
            <FLink to="magazin" go={go}>Produse</FLink>
            <FLink to="contact" go={go}>Contact</FLink>
          </div>

          <div>
            <h5>Servicii</h5>
            <FLink to="analiza-si-solutii" go={go}>Analiză și soluții</FLink>
            <FLink to="achizitii-publice" go={go}>Achiziții publice</FLink>
            <FLink to="delegare-servicii" go={go}>Delegare servicii</FLink>
            <FLink to="modele-excel" go={go}>Modele EXCEL</FLink>
            <FLink to="modele-word" go={go}>Modele WORD</FLink>
            <FLink to="modele-pdf" go={go}>Modele PDF</FLink>
          </div>

          <div>
            <h5>Politici</h5>
            <FLink to="termeni-si-conditii" go={go}>Termeni și condiții</FLink>
            <FLink to="politica-confidentialitate" go={go}>Politica de confidențialitate</FLink>
            <FLink to="politica-gdpr" go={go}>Politica GDPR</FLink>
            <FLink to="politica-cookies" go={go}>Politica de cookie-uri</FLink>
            <FLink to="politica-livrare" go={go}>Politica de livrare</FLink>
            <FLink to="politica-anulare" go={go}>Politica de anulare și retur</FLink>
            <FLink to="dreptul-de-retragere" go={go}>Dreptul de retragere</FLink>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {COMPANY.brand} - Toate drepturile rezervate. Parte a companiei {COMPANY.name}.</span>
          <span style={{ fontStyle: 'italic', opacity: .7 }}>
            „Există un singur tip de succes - acela de a-ți putea petrece timpul așa cum îți dorești." - Chr. Morley
          </span>
        </div>
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
