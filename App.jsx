const { useState, useEffect } = React;

const SERVICE_PAGES = ['analiza-si-solutii', 'achizitii-publice', 'delegare-servicii', 'modele-excel', 'modele-word', 'modele-pdf'];
/* Servite ca HTML static (vercel.json), nu de app.html. */
const STATIC_PAGES  = ['home', 'servicii', 'despre-noi', 'contact'];
const POLICY_PAGES  = [
  'politica-confidentialitate',
  'termeni-si-conditii',
  'politica-gdpr',
  'politica-cookies',
  'politica-livrare',
  'politica-anulare',
  'dreptul-de-retragere',
];

const PAGE_META = {
  'home':                       { title: 'INFORMS - Instrumente digitale pentru contractele publice', desc: 'Documentații de atribuire, modele Excel, Word și PDF și aplicația Agatha Plus, pentru autorități, ofertanți și cei care execută lucrări.' },
  'despre-noi':                 { title: 'Despre noi | INFORMS', desc: 'Echipă cu peste 15 ani de experiență în achiziții publice, consultanță și digitalizare pentru instituții publice și companii private.' },
  'contact':                    { title: 'Contact | INFORMS', desc: 'Contactează echipa INFORMS pentru consultanță în achiziții publice, documentații și instrumente de lucru specializate.' },
  'servicii':                   { title: 'Servicii | INFORMS', desc: 'Soluții complete pentru instituții publice, companii și liber-profesioniști: achiziții publice, delegare servicii, instrumente de lucru.' },
  'analiza-si-solutii':         { title: 'Analiză și soluții personalizate | INFORMS', desc: 'Analizăm situația prezentată și oferim soluții concrete, aplicate, care răspund tuturor cerințelor și obiectivelor stabilite.' },
  'achizitii-publice':          { title: 'Achiziții publice | INFORMS', desc: 'Documentații complete pentru proceduri de achiziție publică: atribuire contracte, evaluare oferte, contestații CNSC și curți de apel.' },
  'delegare-servicii':          { title: 'Delegare servicii de utilități publice | INFORMS', desc: 'Documentații complete pentru gestiunea serviciilor de utilități publice: salubrizare, transport, iluminat public.' },
  'modele-excel':               { title: 'Modele de lucru EXCEL | INFORMS', desc: 'Instrumente avansate în format Excel pentru eficientizarea activității instituțiilor publice și companiilor private.' },
  'modele-word':                { title: 'Modele de lucru WORD | INFORMS', desc: 'Documente tipizate și formulare personalizabile în format Word pentru administrație publică și achiziții.' },
  'modele-pdf':                 { title: 'Modele PDF inteligent | INFORMS', desc: 'Formulare electronice interactive în format PDF standardizat, compatibile Adobe Acrobat.' },
  'magazin':                    { title: 'Produse digitale | INFORMS', desc: 'Documente profesionale pentru achiziții publice și sectorul public: modele Word, Excel, PDF și pachete complete.' },
  'comanda-finalizata':         { title: 'Stare comandă | INFORMS', desc: 'Rezultatul plății și pașii următori pentru comanda ta INFORMS.' },
  'politica-confidentialitate': { title: 'Politica de confidențialitate | INFORMS', desc: 'Informații privind modul în care INFORMS colectează, utilizează și protejează datele cu caracter personal.' },
  'termeni-si-conditii':        { title: 'Termeni și condiții | INFORMS', desc: 'Termenii și condițiile care guvernează achiziția produselor digitale INFORMS, comercializate de MILBAC MANAGEMENT S.R.L.' },
  'politica-gdpr':              { title: 'Politica GDPR | INFORMS', desc: 'Prelucrarea datelor cu caracter personal în contextul comenzilor, plăților și facturării.' },
  'politica-cookies':           { title: 'Politica de cookie-uri | INFORMS', desc: 'Ce cookie-uri folosește INFORMS și cum îți poți controla preferințele.' },
  'politica-livrare':           { title: 'Politica de livrare | INFORMS', desc: 'Cum și când sunt livrate documentele digitale comandate pe informs.ro.' },
  'politica-anulare':           { title: 'Politica de anulare și retur | INFORMS', desc: 'Condițiile de anulare a comenzii, de rambursare și de soluționare a reclamațiilor.' },
  'dreptul-de-retragere':       { title: 'Dreptul de retragere | INFORMS', desc: 'Formular online de retragere din contract, conform OUG 34/2014.' },
};

/* ─── Rutare ────────────────────────────────────────
   URL-uri reale prin History API. Fiecare pagină are
   o cale proprie, ca să poată fi trimisă prin link și
   indexată. Rewrite-ul catch-all din vercel.json face
   ca orice cale să servească app.html (shell-ul SPA). */
function pageFromPath(pathname) {
  const slug = String(pathname || '/').replace(/^\/+|\/+$/g, '');
  if (!slug) return 'home';
  return PAGE_META[slug] ? slug : 'home';
}

function pathFromPage(page) {
  return page === 'home' ? '/' : '/' + page;
}

function setCanonical(page) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', COMPANY.url + pathFromPage(page));
}

function App() {
  const initial = pageFromPath(window.location.pathname);
  const [page, setPage] = useState(initial);
  const [displayPage, setDisplayPage] = useState(initial);
  const [shopCategory, setShopCategory] = useState('all');

  useEffect(() => {
    const meta = PAGE_META[displayPage] || PAGE_META['home'];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.desc);
    setCanonical(displayPage);
  }, [displayPage]);

  /* Aplicația nu mai are versiuni proprii ale paginilor statice. Dacă
     ajunge pe una (cale necunoscută = 'home', istoric vechi), o predă
     versiunii statice. */
  useEffect(() => {
    if (STATIC_PAGES.includes(displayPage)) window.location.replace(pathFromPage(displayPage));
  }, [displayPage]);

  useEffect(() => {
    const onPop = () => {
      const p = pageFromPath(window.location.pathname);
      setDisplayPage(p);
      setPage(p);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (newPage, opts = {}) => {
    const target = pathFromPage(newPage);

    /* Paginile statice au o singură versiune, cea generată din src/.
       Le deschidem cu încărcare completă, ca aplicația să nu randeze
       copiile React vechi. */
    if (STATIC_PAGES.includes(newPage)) {
      window.location.assign(target);
      return;
    }

    if (opts.category) setShopCategory(opts.category);
    else if (newPage !== 'magazin') setShopCategory('all');

    if (window.location.pathname !== target) {
      window.history.pushState({ page: newPage }, '', target);
    }
    setDisplayPage(newPage);
    setPage(newPage);
  };

  const renderPage = () => {
    if (SERVICE_PAGES.includes(displayPage)) {
      return <ServiceDetailPage onNav={navigate} service={displayPage} />;
    }
    if (POLICY_PAGES.includes(displayPage)) {
      return <PolicyPage onNav={navigate} type={displayPage} />;
    }
    switch (displayPage) {
      case 'magazin':            return <ShopPage onNav={navigate} initialCategory={shopCategory} />;
      case 'comanda-finalizata': return <OrderStatusPage onNav={navigate} />;
      default:                   return null; // pagină statică: redirecționată mai sus
    }
  };

  return (
    <div>
      <Nav onNav={navigate} page={page} />
      <main style={{ minHeight: '60vh' }}>
        {renderPage()}
      </main>
      <Footer onNav={navigate} page={displayPage} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
