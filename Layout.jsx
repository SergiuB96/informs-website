const { useState, useEffect, useRef } = React;

function FadeUp({ children, delay = 0, style = {}, className = '' }) {
  return (
    <div className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ── Căutare Spețe (decizii CNSC + bibliotecă ANAP) direct în navbar ──
   Rezultatele se afișează inline (dropdown + panou de citire), fără a trimite
   utilizatorul pe subpagina /spete. Indexul compact (search-index.json) se
   încarcă o singură dată, la prima interacțiune. */
let SPETE_INDEX = null;
let SPETE_PROMISE = null;

function foldRo(s) {
  return String(s || '').toLowerCase()
    .replace(/[ăâā]/g, 'a')  // ă â ā
    .replace(/[îī]/g, 'i')         // î ī
    .replace(/[șş]/g, 's')         // ș ş
    .replace(/[țţ]/g, 't')         // ț ţ
    .replace(/[̀-ͯ]/g, '');        // orice diacritic combinat rămas
}

function loadSpeteIndex() {
  if (SPETE_INDEX) return Promise.resolve(SPETE_INDEX);
  if (SPETE_PROMISE) return SPETE_PROMISE;
  SPETE_PROMISE = fetch('search-index.json')
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => {
      const recs = (data.r || []).map((rec) => {
        rec._t = foldRo(rec.t);
        rec._n = foldRo([rec.t, rec.c, (rec.tg || []).join(' '), rec.sol || '', rec.ac || '', String(rec.cod || ''), rec.nr || '', rec.a].join(' '));
        return rec;
      });
      SPETE_INDEX = recs;
      return recs;
    });
  return SPETE_PROMISE;
}

function searchSpete(index, query) {
  const terms = foldRo(query).split(/\s+/).filter((t) => t.length >= 2);
  if (!terms.length) return [];
  const out = [];
  for (let i = 0; i < index.length; i++) {
    const rec = index[i];
    let ok = true, score = 0;
    for (let t = 0; t < terms.length; t++) {
      const term = terms[t];
      if (rec._n.indexOf(term) === -1) { ok = false; break; }
      score += rec._t.indexOf(term) !== -1 ? 6 : 1;
    }
    if (ok) out.push({ rec, score });
  }
  out.sort((a, b) => (b.score - a.score) || (a.rec.t.length - b.rec.t.length));
  return out.map((o) => o.rec);
}

function hlSpete(text, rawTerms) {
  if (!rawTerms.length || !text) return text;
  const esc = rawTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (!esc.length) return text;
  const re = new RegExp('(' + esc.join('|') + ')', 'gi');
  const parts = String(text).split(re);
  const low = rawTerms.map((t) => t.toLowerCase());
  return parts.map((p, i) => (low.indexOf(p.toLowerCase()) !== -1
    ? <mark key={i}>{p}</mark>
    : p));
}

function speteSnippet(rec, terms) {
  const text = rec.a || '';
  if (!text) return '';
  const low = foldRo(text);
  let pos = -1;
  for (let i = 0; i < terms.length; i++) {
    const p = low.indexOf(terms[i]);
    if (p !== -1 && (pos === -1 || p < pos)) pos = p;
  }
  let start = pos > 70 ? pos - 70 : 0;
  let snip = text.slice(start, start + 190).trim();
  if (start > 0) snip = '… ' + snip;
  if (start + 190 < text.length) snip = snip + ' …';
  return snip;
}

function SpeteSearch({ variant }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('all'); // all | anap | cnsc
  const [sel, setSel] = useState(null);
  const [info, setInfo] = useState(false); // popup disclaimer
  const rootRef = useRef(null);
  const deb = useRef(null);

  const ensureData = () => {
    if (SPETE_INDEX) { if (status !== 'ready') setStatus('ready'); return; }
    setStatus('loading');
    loadSpeteIndex().then(() => setStatus('ready')).catch(() => setStatus('error'));
  };

  const run = (value, f) => {
    if (!SPETE_INDEX) { setResults([]); return; }
    let res = searchSpete(SPETE_INDEX, value);
    if (f && f !== 'all') res = res.filter((r) => r.s === f);
    setResults(res.slice(0, 12));
  };

  const onChange = (e) => {
    const v = e.target.value;
    setQ(v);
    setOpen(true);
    ensureData();
    clearTimeout(deb.current);
    deb.current = setTimeout(() => run(v, filter), 150);
  };

  const onFocus = () => { setOpen(true); ensureData(); };

  const pickFilter = (f) => { setFilter(f); run(q, f); };

  useEffect(() => {
    if (status === 'ready' && q) run(q, filter);
    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) { setOpen(false); setInfo(false); } };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setSel(null); setInfo(false); } };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  const rawTerms = q.trim().split(/\s+/).filter((t) => t.length >= 2);
  const showPanel = open && (q.length > 0 || status === 'loading');

  return (
    <div className={`spete-search spete-${variant}`} ref={rootRef}>
      <div className="spete-search-field">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.6 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Cuvinte cheie/expresii - decizii CNSC/spețe ANAP"
          aria-label="Caută pe bază de cuvinte cheie sau expresii în decizii CNSC și spețe ANAP"
        />
        {q && <button className="spete-clear" onClick={() => { setQ(''); setResults([]); }} aria-label="Șterge">×</button>}
      </div>

      <div className="spete-info">
        <button
          className={`spete-info-btn${info ? ' on' : ''}`}
          onClick={(e) => { e.stopPropagation(); setInfo(!info); setOpen(false); }}
          aria-label="Notă privind datele afișate"
          aria-expanded={info}
        >!</button>
        {info && (
          <div className="spete-info-pop" role="dialog" aria-label="Notă privind datele">
            <div className="spete-info-title">Notă privind datele</div>
            <p>
              Informațiile afișate au caracter public și scop exclusiv informativ, fiind preluate
              din sursele oficiale ale ANAP și CNSC. Ele nu constituie consultanță juridică și pot
              fi incomplete sau neactualizate față de sursă. Orice utilizare sau interpretare a
              acestor date se face pe răspunderea exclusivă a utilizatorului; INFORMS și dezvoltatorul
              platformei nu își asumă nicio răspundere pentru deciziile luate pe baza lor.
            </p>
            <div className="spete-info-links">
              <span className="spete-info-links-lbl">Verifică sursele oficiale complete</span>
              <a href="https://achizitiipublice.gov.ro" target="_blank" rel="noopener noreferrer">
                Biblioteca de spețe ANAP <span aria-hidden="true">↗</span>
              </a>
              <a href="https://www.cnsc.ro" target="_blank" rel="noopener noreferrer">
                Decizii CNSC <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {showPanel && (
        <div className="spete-panel">
          <div className="spete-panel-head">
            <button className={`spete-tab${filter === 'all' ? ' on' : ''}`} onClick={() => pickFilter('all')}>Toate</button>
            <button className={`spete-tab${filter === 'anap' ? ' on' : ''}`} onClick={() => pickFilter('anap')}>Spețe ANAP</button>
            <button className={`spete-tab${filter === 'cnsc' ? ' on' : ''}`} onClick={() => pickFilter('cnsc')}>Decizii CNSC</button>
            {status === 'ready' && q && <span className="spete-count">{results.length} rezultate</span>}
          </div>

          <div className="spete-list">
            {status === 'loading' && (
              <div className="spete-empty"><span className="spete-spin"></span> Se încarcă baza de spețe…</div>
            )}
            {status === 'error' && (
              <div className="spete-empty">Nu am putut încărca baza de spețe. Reîncearcă.</div>
            )}
            {status === 'ready' && q.length < 2 && (
              <div className="spete-empty">Scrie cel puțin 2 caractere pentru a căuta.</div>
            )}
            {status === 'ready' && q.length >= 2 && results.length === 0 && (
              <div className="spete-empty">Niciun rezultat pentru „{q}".</div>
            )}
            {status === 'ready' && results.map((rec, i) => (
              <button key={rec.s + (rec.id || i)} className="spete-item" onClick={() => setSel(rec)}>
                <div className="spete-item-top">
                  <span className={`spete-badge ${rec.s}`}>{rec.s === 'cnsc' ? 'CNSC' : (rec.ar ? 'ANAP · arhivă' : 'ANAP')}</span>
                  {rec.c && <span className="spete-cat">{rec.c}</span>}
                </div>
                <div className="spete-item-title">{hlSpete(rec.t, rawTerms)}</div>
                <div className="spete-item-snip">{hlSpete(speteSnippet(rec, foldRo(q).split(/\s+/).filter((x) => x.length >= 2)), rawTerms)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {sel && (
        <div className="spete-modal-ov" onClick={() => setSel(null)}>
          <div className="spete-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="spete-modal-head">
              <button className="spete-modal-close" onClick={() => setSel(null)} aria-label="Închide">×</button>
              <div className="spete-item-top" style={{ marginBottom: '10px' }}>
                <span className={`spete-badge ${sel.s}`}>{sel.s === 'cnsc' ? 'Decizie CNSC' : (sel.ar ? 'Speță ANAP · arhivă' : 'Speță ANAP')}</span>
                {sel.c && <span className="spete-cat">{sel.c}</span>}
              </div>
              <h3 style={{ fontSize: '1.28rem', lineHeight: 1.35, color: 'var(--navy)' }}>{sel.t}</h3>
              <div className="spete-meta">
                {sel.cod ? <span>Cod: <b>{sel.cod}</b></span> : null}
                {sel.id && sel.s === 'cnsc' ? <span>Dosar: <b>{sel.id}</b></span> : null}
                {sel.nr ? <span>Nr.: <b>{sel.nr}</b></span> : null}
                {sel.data ? <span>Data: <b>{sel.data}</b></span> : null}
                {sel.ac ? <span>Autoritate: <b>{sel.ac}</b></span> : null}
              </div>
              {sel.sol && <p className="spete-solutie"><b>Soluție:</b> {sel.sol}</p>}
            </div>
            <div className="spete-modal-body">
              <p>{sel.a || 'Fără text disponibil pentru această înregistrare.'}</p>
              {sel.tg && sel.tg.length > 0 && (
                <div className="spete-tags">
                  {sel.tg.map((t, i) => <span key={i} className="spete-tag">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
