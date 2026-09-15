(function(){
const {
  useState,
  useEffect,
  useRef
} = React;
function FadeUp({
  children,
  delay = 0,
  style = {},
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `anim-fade-up ${className}`,
    style: {
      animationDelay: `${delay}ms`,
      ...style
    }
  }, children);
}

/* ── Căutare Spețe (decizii CNSC + bibliotecă ANAP) direct în navbar ──
   Rezultatele se afișează inline (dropdown + panou de citire), fără a trimite
   utilizatorul pe subpagina /spete. Indexul compact (search-index.json) se
   încarcă o singură dată, la prima interacțiune. */
let SPETE_INDEX = null;
let SPETE_PROMISE = null;
function foldRo(s) {
  return String(s || '').toLowerCase().replace(/[ăâā]/g, 'a') // ă â ā
  .replace(/[îī]/g, 'i') // î ī
  .replace(/[șş]/g, 's') // ș ş
  .replace(/[țţ]/g, 't') // ț ţ
  .replace(/[̀-ͯ]/g, ''); // orice diacritic combinat rămas
}
function loadSpeteIndex() {
  if (SPETE_INDEX) return Promise.resolve(SPETE_INDEX);
  if (SPETE_PROMISE) return SPETE_PROMISE;
  SPETE_PROMISE = fetch('search-index.json').then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(data => {
    const recs = (data.r || []).map(rec => {
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
  const terms = foldRo(query).split(/\s+/).filter(t => t.length >= 2);
  if (!terms.length) return [];
  const out = [];
  for (let i = 0; i < index.length; i++) {
    const rec = index[i];
    let ok = true,
      score = 0;
    for (let t = 0; t < terms.length; t++) {
      const term = terms[t];
      if (rec._n.indexOf(term) === -1) {
        ok = false;
        break;
      }
      score += rec._t.indexOf(term) !== -1 ? 6 : 1;
    }
    if (ok) out.push({
      rec,
      score
    });
  }
  out.sort((a, b) => b.score - a.score || a.rec.t.length - b.rec.t.length);
  return out.map(o => o.rec);
}
function hlSpete(text, rawTerms) {
  if (!rawTerms.length || !text) return text;
  const esc = rawTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (!esc.length) return text;
  const re = new RegExp('(' + esc.join('|') + ')', 'gi');
  const parts = String(text).split(re);
  const low = rawTerms.map(t => t.toLowerCase());
  return parts.map((p, i) => low.indexOf(p.toLowerCase()) !== -1 ? /*#__PURE__*/React.createElement("mark", {
    key: i
  }, p) : p);
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
function SpeteSearch({
  variant
}) {
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
    if (SPETE_INDEX) {
      if (status !== 'ready') setStatus('ready');
      return;
    }
    setStatus('loading');
    loadSpeteIndex().then(() => setStatus('ready')).catch(() => setStatus('error'));
  };
  const run = (value, f) => {
    if (!SPETE_INDEX) {
      setResults([]);
      return;
    }
    let res = searchSpete(SPETE_INDEX, value);
    if (f && f !== 'all') res = res.filter(r => r.s === f);
    setResults(res.slice(0, 12));
  };
  const onChange = e => {
    const v = e.target.value;
    setQ(v);
    setOpen(true);
    ensureData();
    clearTimeout(deb.current);
    deb.current = setTimeout(() => run(v, filter), 150);
  };
  const onFocus = () => {
    setOpen(true);
    ensureData();
  };
  const pickFilter = f => {
    setFilter(f);
    run(q, f);
  };
  useEffect(() => {
    if (status === 'ready' && q) run(q, filter);
    // eslint-disable-next-line
  }, [status]);
  useEffect(() => {
    const onDoc = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setInfo(false);
      }
    };
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSel(null);
        setInfo(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  const rawTerms = q.trim().split(/\s+/).filter(t => t.length >= 2);
  const showPanel = open && (q.length > 0 || status === 'loading');
  return /*#__PURE__*/React.createElement("div", {
    className: `spete-search spete-${variant}`,
    ref: rootRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-search-field"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "7",
    r: "5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 11l3.6 3.6",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: q,
    onChange: onChange,
    onFocus: onFocus,
    placeholder: "Cuvinte cheie/expresii - decizii CNSC/spe\u021Be ANAP",
    "aria-label": "Caut\u0103 pe baz\u0103 de cuvinte cheie sau expresii \xEEn decizii CNSC \u0219i spe\u021Be ANAP"
  }), q && /*#__PURE__*/React.createElement("button", {
    className: "spete-clear",
    onClick: () => {
      setQ('');
      setResults([]);
    },
    "aria-label": "\u0218terge"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "spete-info"
  }, /*#__PURE__*/React.createElement("button", {
    className: `spete-info-btn${info ? ' on' : ''}`,
    onClick: e => {
      e.stopPropagation();
      setInfo(!info);
      setOpen(false);
    },
    "aria-label": "Not\u0103 privind datele afi\u0219ate",
    "aria-expanded": info
  }, "!"), info && /*#__PURE__*/React.createElement("div", {
    className: "spete-info-pop",
    role: "dialog",
    "aria-label": "Not\u0103 privind datele"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-info-title"
  }, "Not\u0103 privind datele"), /*#__PURE__*/React.createElement("p", null, "Informa\u021Biile afi\u0219ate au caracter public \u0219i scop exclusiv informativ, fiind preluate din sursele oficiale ale ANAP \u0219i CNSC. Ele nu constituie consultan\u021B\u0103 juridic\u0103 \u0219i pot fi incomplete sau neactualizate fa\u021B\u0103 de surs\u0103. Orice utilizare sau interpretare a acestor date se face pe r\u0103spunderea exclusiv\u0103 a utilizatorului; INFORMS \u0219i dezvoltatorul platformei nu \xEE\u0219i asum\u0103 nicio r\u0103spundere pentru deciziile luate pe baza lor."), /*#__PURE__*/React.createElement("div", {
    className: "spete-info-links"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spete-info-links-lbl"
  }, "Verific\u0103 sursele oficiale complete"), /*#__PURE__*/React.createElement("a", {
    href: "https://achizitiipublice.gov.ro",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Biblioteca de spe\u021Be ANAP ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197")), /*#__PURE__*/React.createElement("a", {
    href: "https://www.cnsc.ro",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Decizii CNSC ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197"))))), showPanel && /*#__PURE__*/React.createElement("div", {
    className: "spete-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-panel-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: `spete-tab${filter === 'all' ? ' on' : ''}`,
    onClick: () => pickFilter('all')
  }, "Toate"), /*#__PURE__*/React.createElement("button", {
    className: `spete-tab${filter === 'anap' ? ' on' : ''}`,
    onClick: () => pickFilter('anap')
  }, "Spe\u021Be ANAP"), /*#__PURE__*/React.createElement("button", {
    className: `spete-tab${filter === 'cnsc' ? ' on' : ''}`,
    onClick: () => pickFilter('cnsc')
  }, "Decizii CNSC"), status === 'ready' && q && /*#__PURE__*/React.createElement("span", {
    className: "spete-count"
  }, results.length, " rezultate")), /*#__PURE__*/React.createElement("div", {
    className: "spete-list"
  }, status === 'loading' && /*#__PURE__*/React.createElement("div", {
    className: "spete-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spete-spin"
  }), " Se \xEEncarc\u0103 baza de spe\u021Be\u2026"), status === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "spete-empty"
  }, "Nu am putut \xEEnc\u0103rca baza de spe\u021Be. Re\xEEncearc\u0103."), status === 'ready' && q.length < 2 && /*#__PURE__*/React.createElement("div", {
    className: "spete-empty"
  }, "Scrie cel pu\u021Bin 2 caractere pentru a c\u0103uta."), status === 'ready' && q.length >= 2 && results.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "spete-empty"
  }, "Niciun rezultat pentru \u201E", q, "\"."), status === 'ready' && results.map((rec, i) => /*#__PURE__*/React.createElement("button", {
    key: rec.s + (rec.id || i),
    className: "spete-item",
    onClick: () => setSel(rec)
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-item-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: `spete-badge ${rec.s}`
  }, rec.s === 'cnsc' ? 'CNSC' : rec.ar ? 'ANAP · arhivă' : 'ANAP'), rec.c && /*#__PURE__*/React.createElement("span", {
    className: "spete-cat"
  }, rec.c)), /*#__PURE__*/React.createElement("div", {
    className: "spete-item-title"
  }, hlSpete(rec.t, rawTerms)), /*#__PURE__*/React.createElement("div", {
    className: "spete-item-snip"
  }, hlSpete(speteSnippet(rec, foldRo(q).split(/\s+/).filter(x => x.length >= 2)), rawTerms)))))), sel && /*#__PURE__*/React.createElement("div", {
    className: "spete-modal-ov",
    onClick: () => setSel(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-modal",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spete-modal-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "spete-modal-close",
    onClick: () => setSel(null),
    "aria-label": "\xCEnchide"
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    className: "spete-item-top",
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `spete-badge ${sel.s}`
  }, sel.s === 'cnsc' ? 'Decizie CNSC' : sel.ar ? 'Speță ANAP · arhivă' : 'Speță ANAP'), sel.c && /*#__PURE__*/React.createElement("span", {
    className: "spete-cat"
  }, sel.c)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.28rem',
      lineHeight: 1.35,
      color: 'var(--navy)'
    }
  }, sel.t), /*#__PURE__*/React.createElement("div", {
    className: "spete-meta"
  }, sel.cod ? /*#__PURE__*/React.createElement("span", null, "Cod: ", /*#__PURE__*/React.createElement("b", null, sel.cod)) : null, sel.id && sel.s === 'cnsc' ? /*#__PURE__*/React.createElement("span", null, "Dosar: ", /*#__PURE__*/React.createElement("b", null, sel.id)) : null, sel.nr ? /*#__PURE__*/React.createElement("span", null, "Nr.: ", /*#__PURE__*/React.createElement("b", null, sel.nr)) : null, sel.data ? /*#__PURE__*/React.createElement("span", null, "Data: ", /*#__PURE__*/React.createElement("b", null, sel.data)) : null, sel.ac ? /*#__PURE__*/React.createElement("span", null, "Autoritate: ", /*#__PURE__*/React.createElement("b", null, sel.ac)) : null), sel.sol && /*#__PURE__*/React.createElement("p", {
    className: "spete-solutie"
  }, /*#__PURE__*/React.createElement("b", null, "Solu\u021Bie:"), " ", sel.sol)), /*#__PURE__*/React.createElement("div", {
    className: "spete-modal-body"
  }, /*#__PURE__*/React.createElement("p", null, sel.a || 'Fără text disponibil pentru această înregistrare.'), sel.tg && sel.tg.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "spete-tags"
  }, sel.tg.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "spete-tag"
  }, t)))))));
}
function Nav({
  onNav,
  page
}) {
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
    window.addEventListener('scroll', h, {
      passive: true
    });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const go = (p, e) => {
    if (e) e.preventDefault();
    onNav(p);
    setOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const openDd = () => {
    clearTimeout(ddTimer.current);
    setDdOpen(true);
  };
  const closeDd = () => {
    ddTimer.current = setTimeout(() => setDdOpen(false), 220);
  };
  const openDdProd = () => {
    clearTimeout(ddProdTimer.current);
    setDdProdOpen(true);
  };
  const closeDdProd = () => {
    ddProdTimer.current = setTimeout(() => setDdProdOpen(false), 220);
  };
  const svcs = [['analiza-si-solutii', 'Analiză și soluții personalizate'], ['achizitii-publice', 'Achiziții publice'], ['delegare-servicii', 'Delegare servicii de utilități publice'], ['modele-excel', 'Modele de lucru EXCEL'], ['modele-word', 'Modele de lucru WORD'], ['modele-pdf', 'Modele de lucru PDF']];
  const svcPages = svcs.map(s => s[0]);
  const prodCats = [{
    cat: 'all',
    label: 'Toate produsele'
  }, {
    cat: 'achizitii',
    label: 'Achiziții publice'
  }, {
    cat: 'delegare',
    label: 'Delegare servicii'
  }, {
    cat: 'management',
    label: 'Management proiect'
  }, {
    cat: 'digitalizare',
    label: 'Digitalizare'
  }, {
    cat: 'gratuite',
    label: 'Gratuite',
    green: true
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    className: `main-nav${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-island"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-logo",
    href: "/",
    onClick: e => go('home', e)
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo/png/logo-no-background.png",
    alt: "INFORMS",
    style: {
      height: '28px',
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link${page === 'home' ? ' active' : ''}`,
    href: "/",
    onClick: e => go('home', e)
  }, "Acas\u0103"), /*#__PURE__*/React.createElement("a", {
    className: `nav-link${page === 'despre-noi' ? ' active' : ''}`,
    href: "/despre-noi",
    onClick: e => go('despre-noi', e)
  }, "Despre noi"), /*#__PURE__*/React.createElement("div", {
    className: `nav-dd${ddOpen ? ' dd-open' : ''}`,
    onMouseEnter: openDd,
    onMouseLeave: closeDd
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link nav-dd-toggle${svcPages.includes(page) || page === 'servicii' ? ' active' : ''}`,
    href: "/servicii",
    onClick: e => {
      e.preventDefault();
      go('servicii');
    }
  }, "Servicii"), /*#__PURE__*/React.createElement("div", {
    className: "nav-dd-menu",
    onMouseEnter: openDd,
    onMouseLeave: closeDd
  }, svcs.map(([p, l]) => /*#__PURE__*/React.createElement("a", {
    key: p,
    className: "nav-dd-item",
    href: `/${p}`,
    onClick: e => go(p, e)
  }, l)))), /*#__PURE__*/React.createElement("div", {
    className: `nav-dd${ddProdOpen ? ' dd-open' : ''}`,
    onMouseEnter: openDdProd,
    onMouseLeave: closeDdProd
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link nav-dd-toggle${page === 'magazin' ? ' active' : ''}`,
    href: "/magazin",
    onClick: e => {
      e.preventDefault();
      go('magazin');
    }
  }, "Produse"), /*#__PURE__*/React.createElement("div", {
    className: "nav-dd-menu",
    onMouseEnter: openDdProd,
    onMouseLeave: closeDdProd
  }, prodCats.map(({
    cat,
    label,
    green
  }) => /*#__PURE__*/React.createElement("a", {
    key: cat,
    className: "nav-dd-item",
    href: `/magazin`,
    style: green ? {
      color: '#16A34A'
    } : {},
    onClick: e => {
      e.preventDefault();
      onNav('magazin', {
        category: cat
      });
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      setDdProdOpen(false);
    }
  }, label))))), /*#__PURE__*/React.createElement("div", {
    className: "nav-end"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link nav-cta${page === 'contact' ? ' active' : ''}`,
    href: "/contact",
    onClick: e => go('contact', e)
  }, "Contact"), /*#__PURE__*/React.createElement("button", {
    className: `hamburger${open ? ' open' : ''}`,
    onClick: () => setOpen(!open),
    "aria-label": "Meniu"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))))), /*#__PURE__*/React.createElement("div", {
    className: `mobile-menu${open ? ' open' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    className: "m-link",
    href: "/",
    onClick: e => go('home', e)
  }, "Acas\u0103"), /*#__PURE__*/React.createElement("a", {
    className: "m-link",
    href: "/despre-noi",
    onClick: e => go('despre-noi', e)
  }, "Despre noi"), /*#__PURE__*/React.createElement("div", {
    className: "m-section-title"
  }, "Servicii"), svcs.map(([p, l]) => /*#__PURE__*/React.createElement("a", {
    key: p,
    className: "m-link",
    href: `/${p}`,
    style: {
      paddingLeft: '26px',
      fontSize: '14px'
    },
    onClick: e => go(p, e)
  }, l)), /*#__PURE__*/React.createElement("div", {
    className: "m-section-title"
  }, "Produse"), prodCats.map(({
    cat,
    label,
    green
  }) => /*#__PURE__*/React.createElement("a", {
    key: cat,
    className: "m-link",
    href: "/magazin",
    style: {
      paddingLeft: cat === 'all' ? '14px' : '26px',
      fontSize: cat === 'all' ? '15px' : '14px',
      ...(green ? {
        color: '#16A34A'
      } : {})
    },
    onClick: e => {
      e.preventDefault();
      onNav('magazin', {
        category: cat
      });
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      setOpen(false);
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px',
      padding: '0 2px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      justifyContent: 'center'
    },
    onClick: () => go('contact')
  }, "Contact"))));
}

/* Link de footer cu href real, ca să poată fi copiat sau deschis în tab nou. */
function FLink({
  to,
  go,
  children
}) {
  const href = to === 'home' ? '/' : '/' + to;
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: e => {
      e.preventDefault();
      go(to);
    }
  }, children);
}
function Footer({
  onNav,
  page
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const videoRef = useRef(null);
  const isHome = page === 'home' || page === undefined;
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!isHome) {
      el.pause();
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
    }, {
      threshold: 0.05
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    className: "footer-vid",
    muted: true,
    playsInline: true,
    preload: "none",
    style: {
      display: isHome ? '' : 'none'
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/videos_library/footer.mp4",
    type: "video/mp4"
  }), /*#__PURE__*/React.createElement("track", {
    kind: "captions",
    src: "",
    label: "Rom\xE2n\u0103",
    srclang: "ro",
    default: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "footer-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-gradient-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "f-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo/png/logo-no-background.png",
    alt: "INFORMS",
    style: {
      height: '28px',
      width: 'auto',
      display: 'block',
      marginBottom: '14px',
      filter: 'brightness(0) invert(1)'
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "f-desc"
  }, "Documenta\u021Bii complete, formulare \u0219i instrumente de lucru inteligente, \xEEntr-un format intuitiv, standard \u0219i u\u0219or de utilizat."), /*#__PURE__*/React.createElement("div", {
    className: "f-legal"
  }, companyRows().map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "f-legal-lbl"
  }, r.label), r.href ? /*#__PURE__*/React.createElement("a", {
    className: "f-legal-val",
    href: r.href
  }, r.val) : /*#__PURE__*/React.createElement("span", {
    className: "f-legal-val"
  }, r.val)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: 'rgba(255,255,255,.38)',
      marginBottom: '6px',
      lineHeight: '1.5'
    }
  }, "Digitalizeaz\u0103 achizi\u021Biile publice cu aplica\u021Bia"), /*#__PURE__*/React.createElement("a", {
    href: "https://agathaplus.ro/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: 'rgba(255,255,255,.75)',
      fontSize: '14.5px',
      fontWeight: 600
    }
  }, "Agatha Plus \u2197")), /*#__PURE__*/React.createElement("div", {
    className: "f-partners"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.e-licitatie.ro/pub",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/seap-sicap-logo.webp",
    alt: "SEAP / SICAP"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://netopia-payments.com/",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "NETOPIA Payments"
  }, /*#__PURE__*/React.createElement("img", {
    className: "f-netopia",
    src: "uploads/netopia-payments-white.svg",
    alt: "NETOPIA Payments, Visa, Mastercard"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://anpc.ro/ce-este-sal/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/anpc-sal.png",
    alt: "ANPC SAL"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://ec.europa.eu/consumers/odr",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/anpc-sol.png",
    alt: "ANPC SOL"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Link-uri rapide"), /*#__PURE__*/React.createElement(FLink, {
    to: "home",
    go: go
  }, "Pagina principal\u0103"), /*#__PURE__*/React.createElement(FLink, {
    to: "despre-noi",
    go: go
  }, "Despre noi"), /*#__PURE__*/React.createElement(FLink, {
    to: "magazin",
    go: go
  }, "Produse"), /*#__PURE__*/React.createElement(FLink, {
    to: "contact",
    go: go
  }, "Contact")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Servicii"), /*#__PURE__*/React.createElement(FLink, {
    to: "analiza-si-solutii",
    go: go
  }, "Analiz\u0103 \u0219i solu\u021Bii"), /*#__PURE__*/React.createElement(FLink, {
    to: "achizitii-publice",
    go: go
  }, "Achizi\u021Bii publice"), /*#__PURE__*/React.createElement(FLink, {
    to: "delegare-servicii",
    go: go
  }, "Delegare servicii"), /*#__PURE__*/React.createElement(FLink, {
    to: "modele-excel",
    go: go
  }, "Modele EXCEL"), /*#__PURE__*/React.createElement(FLink, {
    to: "modele-word",
    go: go
  }, "Modele WORD"), /*#__PURE__*/React.createElement(FLink, {
    to: "modele-pdf",
    go: go
  }, "Modele PDF")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Politici"), /*#__PURE__*/React.createElement(FLink, {
    to: "termeni-si-conditii",
    go: go
  }, "Termeni \u0219i condi\u021Bii"), /*#__PURE__*/React.createElement(FLink, {
    to: "politica-confidentialitate",
    go: go
  }, "Politica de confiden\u021Bialitate"), /*#__PURE__*/React.createElement(FLink, {
    to: "politica-gdpr",
    go: go
  }, "Politica GDPR"), /*#__PURE__*/React.createElement(FLink, {
    to: "politica-cookies",
    go: go
  }, "Politica de cookie-uri"), /*#__PURE__*/React.createElement(FLink, {
    to: "politica-livrare",
    go: go
  }, "Politica de livrare"), /*#__PURE__*/React.createElement(FLink, {
    to: "politica-anulare",
    go: go
  }, "Politica de anulare \u0219i retur"), /*#__PURE__*/React.createElement(FLink, {
    to: "dreptul-de-retragere",
    go: go
  }, "Dreptul de retragere"))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " ", COMPANY.brand, " - Toate drepturile rezervate. Parte a companiei ", COMPANY.name, "."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      opacity: .7
    }
  }, "\u201EExist\u0103 un singur tip de succes - acela de a-\u021Bi putea petrece timpul a\u0219a cum \xEE\u021Bi dore\u0219ti.\" - Chr. Morley")))));
}
function fmtTitle(text) {
  const map = {
    'EXCEL': '#177245',
    'Excel': '#177245',
    'WORD': '#1358B0',
    'Word': '#1358B0',
    'PDF': '#C23B22'
  };
  const parts = text.split(/\b(EXCEL|Excel|WORD|Word|PDF)\b/);
  return parts.map((p, i) => map[p] ? React.createElement('span', {
    key: i,
    style: {
      color: map[p]
    }
  }, p) : p);
}
Object.assign(window, {
  FadeUp,
  Nav,
  Footer,
  fmtTitle
});

})();