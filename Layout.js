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

/* Sageata folosita in linkurile de tip „vezi mai mult”. */
function Arrow() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "ico-arrow",
    viewBox: "0 0 16 16",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 8h12M9 4l4 4-4 4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function Caret() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "ico-caret",
    viewBox: "0 0 10 6",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l4 4 4-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }));
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

const PROD_CATS = [{
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
  label: 'Management de proiect'
}, {
  cat: 'monitorizare',
  label: 'Monitorizare și raportare'
}, {
  cat: 'gratuite',
  label: 'Gratuite'
}];

/* Categoriile fără produse nu apar în meniu (vezi hasProducts în Shop.jsx).
   Shop.js se încarcă după Layout.js, deci funcția se citește la randare. */
const prodCats = () => PROD_CATS.filter(c => !window.shopHasProducts || window.shopHasProducts(c.cat));
const SVC_LINKS = [['/servicii#analiza', 'Analiză și consultanță'], ['/servicii#achizitii', 'Documentații de atribuire'], ['/servicii#delegare', 'Delegare servicii de utilități publice'], ['/servicii#digitalizare', 'Digitalizare la comandă'], ['/servicii#excel', 'Modele de lucru EXCEL'], ['/servicii#word', 'Modele de lucru WORD'], ['/servicii#pdf', 'Formulare PDF interactive']];
function Nav({
  onNav,
  page
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null); // 'servicii' | 'produse' | null
  const closeTimer = useRef(null);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', h, {
      passive: true
    });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    const esc = e => {
      if (e.key === 'Escape') {
        setMenu(null);
        setOpen(false);
      }
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  /* Aceeasi intarziere la inchidere ca pe paginile statice, ca sa poti
     trece cu mouse-ul de pe buton pe panou fara sa se inchida. */
  const enter = id => {
    clearTimeout(closeTimer.current);
    setMenu(id);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };
  const goShop = (cat, e) => {
    e.preventDefault();
    onNav('magazin', {
      category: cat
    });
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    setMenu(null);
    setOpen(false);
  };
  const item = (id, extra = '') => `nav__item${extra}${menu === id ? ' is-open' : ''}`;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: `hdr${scrolled ? ' is-stuck' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "/",
    "aria-label": "INFORMS - acas\u0103"
  }, /*#__PURE__*/React.createElement("img", {
    className: "logo__img",
    src: "assets/brand/logo-white.svg",
    alt: "INFORMS",
    width: "1000",
    height: "166"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "nav",
    "aria-label": "Navigare principal\u0103"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav__list"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: "/"
  }, "Acas\u0103")), /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: "/despre-noi"
  }, "Despre noi")), /*#__PURE__*/React.createElement("li", {
    className: item('servicii', ' has-menu'),
    onMouseEnter: () => enter('servicii'),
    onMouseLeave: leave
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav__link",
    "aria-expanded": menu === 'servicii',
    onClick: () => setMenu(menu === 'servicii' ? null : 'servicii')
  }, "Servicii ", /*#__PURE__*/React.createElement(Caret, null)), /*#__PURE__*/React.createElement("div", {
    className: "mega"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__inner mega__inner--2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mega__label"
  }, "Servicii"), /*#__PURE__*/React.createElement("ul", {
    className: "mega__links"
  }, SVC_LINKS.slice(0, 4).map(([h, l]) => /*#__PURE__*/React.createElement("li", {
    key: h
  }, /*#__PURE__*/React.createElement("a", {
    href: h
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "mega__col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mega__label"
  }, "Instrumente de lucru"), /*#__PURE__*/React.createElement("ul", {
    className: "mega__links"
  }, SVC_LINKS.slice(4).map(([h, l]) => /*#__PURE__*/React.createElement("li", {
    key: h
  }, /*#__PURE__*/React.createElement("a", {
    href: h
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "mega__promo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__promo-art mega__promo-art--servicii",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "mega__promo-kicker"
  }, "Primul pas"), /*#__PURE__*/React.createElement("p", {
    className: "mega__promo-title"
  }, "Descrie procedura \u0219i \xEE\u021Bi spunem ce documente \xEE\u021Bi trebuie"), /*#__PURE__*/React.createElement("a", {
    className: "lnk",
    href: "/contact"
  }, "Scrie-ne ", /*#__PURE__*/React.createElement(Arrow, null)))))), /*#__PURE__*/React.createElement("li", {
    className: item('produse', ' has-menu'),
    onMouseEnter: () => enter('produse'),
    onMouseLeave: leave
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav__link",
    "aria-expanded": menu === 'produse',
    onClick: () => setMenu(menu === 'produse' ? null : 'produse')
  }, "Produse ", /*#__PURE__*/React.createElement(Caret, null)), /*#__PURE__*/React.createElement("div", {
    className: "mega"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__inner mega__inner--1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mega__label"
  }, "Catalog"), /*#__PURE__*/React.createElement("ul", {
    className: "mega__links"
  }, prodCats().map(({
    cat,
    label
  }) => /*#__PURE__*/React.createElement("li", {
    key: cat
  }, /*#__PURE__*/React.createElement("a", {
    className: page === 'magazin' && cat === 'all' ? 'is-active' : undefined,
    href: "/magazin",
    onClick: e => goShop(cat, e)
  }, label))))), /*#__PURE__*/React.createElement("div", {
    className: "mega__promo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mega__promo-art mega__promo-art--produse",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "mega__promo-kicker"
  }, "F\u0103r\u0103 cost"), /*#__PURE__*/React.createElement("p", {
    className: "mega__promo-title"
  }, "Modele gratuite, desc\u0103rcabile imediat"), /*#__PURE__*/React.createElement("a", {
    className: "lnk",
    href: "/magazin",
    onClick: e => goShop('gratuite', e)
  }, "Vezi modelele ", /*#__PURE__*/React.createElement(Arrow, null)))))), /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: "/contact"
  }, "Contact")))), /*#__PURE__*/React.createElement("button", {
    className: "burger",
    type: "button",
    "aria-expanded": open,
    "aria-label": open ? 'Închide meniul' : 'Deschide meniul',
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))), open && /*#__PURE__*/React.createElement("div", {
    className: "drawer"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "drawer__nav",
    "aria-label": "Navigare mobil\u0103"
  }, /*#__PURE__*/React.createElement("a", {
    className: "drawer__solo",
    href: "/"
  }, "Acas\u0103"), /*#__PURE__*/React.createElement("a", {
    className: "drawer__solo",
    href: "/despre-noi"
  }, "Despre noi"), /*#__PURE__*/React.createElement("details", {
    className: "drawer__group"
  }, /*#__PURE__*/React.createElement("summary", null, "Servicii"), SVC_LINKS.map(([h, l]) => /*#__PURE__*/React.createElement("a", {
    key: h,
    href: h
  }, l))), /*#__PURE__*/React.createElement("details", {
    className: "drawer__group",
    open: page === 'magazin'
  }, /*#__PURE__*/React.createElement("summary", null, "Produse"), prodCats().map(({
    cat,
    label
  }) => /*#__PURE__*/React.createElement("a", {
    key: cat,
    href: "/magazin",
    onClick: e => goShop(cat, e)
  }, label))), /*#__PURE__*/React.createElement("a", {
    className: "drawer__solo",
    href: "/contact"
  }, "Contact"))));
}
function Footer() {
  const rows = companyRows();
  const byLabel = l => rows.find(r => r.label === l);
  const link = r => r.href ? /*#__PURE__*/React.createElement("a", {
    href: r.href
  }, r.val) : /*#__PURE__*/React.createElement("span", null, r.val);
  return /*#__PURE__*/React.createElement("footer", {
    className: "ftr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__brand"
  }, /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "/",
    "aria-label": "INFORMS - acas\u0103"
  }, /*#__PURE__*/React.createElement("img", {
    className: "logo__img",
    src: "assets/brand/logo-white.svg",
    alt: "INFORMS",
    width: "1000",
    height: "166"
  })), /*#__PURE__*/React.createElement("p", {
    className: "ftr__tag"
  }, "Documenta\u021Bii de atribuire, instrumente Excel, Word \u0219i PDF \u0219i digitalizare la comand\u0103, pentru contractele publice, de la planificare la recep\u021Bie."), /*#__PURE__*/React.createElement("a", {
    className: "ftr__cross",
    href: "https://www.agathaplus.ro/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("span", null, "Planifici achizi\u021Biile \u0219i urm\u0103re\u0219ti contractele? Vezi platforma ", /*#__PURE__*/React.createElement("strong", null, "Agatha Plus")), /*#__PURE__*/React.createElement(Arrow, null))), /*#__PURE__*/React.createElement("nav", {
    className: "ftr__cols",
    "aria-label": "Navigare subsol"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h2", {
    class: "ftr__h"
  }, "Date firm\u0103"), /*#__PURE__*/React.createElement("ul", null, rows.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, link(r))))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h2", {
    class: "ftr__h"
  }, "Navigare"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, "Acas\u0103")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/despre-noi"
  }, "Despre noi")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/servicii"
  }, "Servicii")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/magazin"
  }, "Produse")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.agathaplus.ro/",
    target: "_blank",
    rel: "noopener"
  }, "Agatha Plus")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/contact"
  }, "Contact")))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h2", {
    class: "ftr__h"
  }, "Servicii"), /*#__PURE__*/React.createElement("ul", null, SVC_LINKS.map(([h, l]) => /*#__PURE__*/React.createElement("li", {
    key: h
  }, /*#__PURE__*/React.createElement("a", {
    href: h
  }, l.replace('Modele de lucru ', 'Modele ').replace(' personalizate', '')))))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h2", {
    class: "ftr__h"
  }, "Politici"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/termeni-si-conditii"
  }, "Termeni \u0219i condi\u021Bii")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/politica-confidentialitate"
  }, "Politica de confiden\u021Bialitate")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/politica-gdpr"
  }, "Politica GDPR")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/politica-cookies"
  }, "Politica de cookie-uri")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cc-link",
    "data-cc": "show-preferencesModal"
  }, "Set\u0103ri cookie")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/politica-livrare"
  }, "Politica de livrare")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/politica-anulare"
  }, "Anulare \u0219i retur")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/dreptul-de-retragere"
  }, "Dreptul de retragere")))))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__badges"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__badge-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ftr__badge",
    href: "https://www.e-licitatie.ro/pub",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/seap-sicap-logo-h102.webp",
    alt: "SEAP / SICAP",
    width: "250",
    height: "102",
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("a", {
    className: "ftr__badge",
    href: "https://netopia-payments.com/",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "NETOPIA Payments"
  }, /*#__PURE__*/React.createElement("img", {
    className: "ftr__badge-img--pay",
    src: "uploads/netopia-payments-white.svg",
    alt: "NETOPIA Payments, Visa, Mastercard",
    width: "418",
    height: "75",
    loading: "lazy"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__badge-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ftr__badge",
    href: "https://anpc.ro/ce-este-sal/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/anpc-sal-h102.webp",
    alt: "ANPC SAL",
    width: "398",
    height: "102",
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("a", {
    className: "ftr__badge",
    href: "https://ec.europa.eu/consumers/odr",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/anpc-sol-h102.webp",
    alt: "ANPC SOL",
    width: "366",
    height: "102",
    loading: "lazy"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__legal"
  }, /*#__PURE__*/React.createElement("p", {
    className: "ftr__copy"
  }, "\xA9 ", new Date().getFullYear(), " ", COMPANY.name, ". ", COMPANY.brand, " este un brand al ", COMPANY.name, ". Toate drepturile rezervate."))));
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