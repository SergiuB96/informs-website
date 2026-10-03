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
  'contact':                    { title: 'Contact | INFORMS', desc: 'Contactați echipa INFORMS pentru consultanță în achiziții publice, documentații și instrumente de lucru specializate.' },
  'servicii':                   { title: 'Servicii | INFORMS', desc: 'Soluții complete pentru instituții publice, companii și liber-profesioniști: achiziții publice, delegare servicii, instrumente de lucru.' },
  'analiza-si-solutii':         { title: 'Analiză și soluții personalizate | INFORMS', desc: 'Analizăm situația prezentată și oferim soluții concrete, aplicate, care răspund tuturor cerințelor și obiectivelor stabilite.' },
  'achizitii-publice':          { title: 'Achiziții publice | INFORMS', desc: 'Documentații complete pentru proceduri de achiziție publică: atribuire contracte, evaluare oferte, contestații CNSC și curți de apel.' },
  'delegare-servicii':          { title: 'Delegare servicii de utilități publice | INFORMS', desc: 'Documentații complete pentru gestiunea serviciilor de utilități publice: salubrizare, transport, iluminat public.' },
  'modele-excel':               { title: 'Modele de lucru EXCEL | INFORMS', desc: 'Instrumente avansate în format Excel pentru eficientizarea activității instituțiilor publice și companiilor private.' },
  'modele-word':                { title: 'Modele de lucru WORD | INFORMS', desc: 'Documente tipizate și formulare personalizabile în format Word pentru administrație publică și achiziții.' },
  'modele-pdf':                 { title: 'Modele PDF inteligent | INFORMS', desc: 'Formulare electronice interactive în format PDF standardizat, compatibile Adobe Acrobat.' },
  'magazin':                    { title: 'Modele Word, Excel și PDF pentru contracte publice | INFORMS', desc: 'Modele Word, Excel și PDF pentru autorități contractante, ofertanți și profesioniști tehnici. Formulare gratuite și instrumente cu plată, livrate pe email.' },
  'comanda-finalizata':         { title: 'Stare comandă | INFORMS', desc: 'Rezultatul plății și pașii următori pentru comanda plasată pe INFORMS.' },
  'politica-confidentialitate': { title: 'Politica de confidențialitate | INFORMS', desc: 'Informații privind modul în care INFORMS colectează, utilizează și protejează datele cu caracter personal.' },
  'termeni-si-conditii':        { title: 'Termeni și condiții | INFORMS', desc: 'Termenii și condițiile care guvernează achiziția produselor digitale INFORMS, comercializate de MILBAC MANAGEMENT S.R.L.' },
  'politica-gdpr':              { title: 'Politica GDPR | INFORMS', desc: 'Prelucrarea datelor cu caracter personal în contextul comenzilor, plăților și facturării.' },
  'politica-cookies':           { title: 'Politica de cookie-uri | INFORMS', desc: 'Ce cookie-uri folosește INFORMS și cum vă puteți controla preferințele.' },
  'politica-livrare':           { title: 'Politica de livrare | INFORMS', desc: 'Cum și când sunt livrate documentele digitale comandate pe informs.ro.' },
  'politica-anulare':           { title: 'Politica de anulare și retur | INFORMS', desc: 'Comenzile plătite nu se anulează și nu se rambursează: documentele se vând ca atare, ca modele de lucru. Probleme tehnice și reclamații.' },
  'dreptul-de-retragere':       { title: 'Dreptul de retragere | INFORMS', desc: 'Formular online de retragere din contract, conform OUG 34/2014.' },
};

/* ─── Rutare ────────────────────────────────────────
   URL-uri reale prin History API. Fiecare pagină are
   o cale proprie, ca să poată fi trimisă prin link și
   indexată. Rewrite-ul catch-all din vercel.json face
   ca orice cale să servească app.html (shell-ul SPA). */
/* Paginile de produs au cale proprie, /magazin/<produs>, si nu pot fi
   listate in PAGE_META: vin din catalogul magazinului. */
function productSlug(page) {
  return page.startsWith('magazin/') ? page.slice('magazin/'.length) : null;
}

/* Titlul si descrierea unei pagini de produs vin din catalog. Descrierea
   e `metaDesc` cand produsul o are, altfel cea scurta (ca in build.mjs). */
function pageMeta(page) {
  const prod = productSlug(page);
  const p = prod && window.shopProductBySlug ? window.shopProductBySlug(prod) : null;
  if (p) return { title: p.title + ' | INFORMS', desc: p.metaDesc || p.shortDesc, product: p };
  return PAGE_META[page] || PAGE_META['home'];
}

function pageFromPath(pathname) {
  const slug = String(pathname || '/').replace(/^\/+|\/+$/g, '');
  if (!slug) return 'home';
  if (PAGE_META[slug]) return slug;
  const prod = productSlug(slug);
  if (prod && window.shopProductBySlug && window.shopProductBySlug(prod)) return slug;
  return 'home';
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

/* Numele scurt din firimituri, pentru datele structurate. Lipsa lui
   nu e o eroare: titlul fără sufixul de brand e un fallback bun. */
const CRUMB = {
  'magazin': 'Magazin',
  'comanda-finalizata': 'Stare comandă',
  'politica-confidentialitate': 'Politica de confidențialitate',
  'termeni-si-conditii': 'Termeni și condiții',
  'politica-gdpr': 'Politica GDPR',
  'politica-cookies': 'Politica de cookie-uri',
  'politica-livrare': 'Politica de livrare',
  'politica-anulare': 'Anulare și retur',
  'dreptul-de-retragere': 'Dreptul de retragere',
};

/* Organizația și site-ul sunt declarate static în app.html. Aici
   adăugăm doar pagina curentă, legată de ele prin @id. */
function setJsonLd(page) {
  const meta = pageMeta(page);
  const url = COMPANY.url + pathFromPage(page);
  const node = {
    '@type': page === 'magazin' ? 'CollectionPage' : 'WebPage',
    '@id': url + '#pagina',
    url,
    name: meta.title,
    description: meta.desc,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': COMPANY.url + '/#site' },
    about: { '@id': COMPANY.url + '/#organizatie' },
  };
  if (page !== 'home') {
    const trail = [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: COMPANY.url + '/' }];
    if (meta.product) {
      trail.push({ '@type': 'ListItem', position: 2, name: 'Magazin', item: COMPANY.url + '/magazin' });
      trail.push({ '@type': 'ListItem', position: 3, name: meta.product.title, item: url });
    } else {
      trail.push({ '@type': 'ListItem', position: 2, name: CRUMB[page] || meta.title.split(' | ')[0], item: url });
    }
    node.breadcrumb = { '@type': 'BreadcrumbList', itemListElement: trail };
  }

  const graph = [node];

  /* Produsul, cu pretul si disponibilitatea. Pretul afisat vine din
     catalogul magazinului; cel incasat il ia serverul din api/_lib. */
  if (meta.product) {
    const p = meta.product;
    /* imaginea: prima pagina din previzualizare (previews.js) */
    const pv = (window.SHOP_PREVIEWS || {})[p.id];
    const img = pv && pv.pages && pv.pages[0];
    node.mainEntity = { '@id': url + '#produs' };
    graph.push({
      '@type': 'Product',
      '@id': url + '#produs',
      name: p.title,
      description: p.longDesc || p.shortDesc,
      url,
      ...(img ? { image: COMPANY.url + '/' + img.src } : {}),
      ...(p.sku ? { sku: p.sku } : {}),
      category: 'Documente digitale',
      brand: { '@id': COMPANY.url + '/#organizatie' },
      offers: {
        '@type': 'Offer',
        url,
        price: String(p.price),
        priceCurrency: COMMERCE.currency,
        availability: 'https://schema.org/InStock',
        seller: { '@id': COMPANY.url + '/#organizatie' },
      },
    });
  }
  let tag = document.getElementById('jsonld-pagina');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'jsonld-pagina';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function App() {
  const initial = pageFromPath(window.location.pathname);
  const [page, setPage] = useState(initial);
  const [displayPage, setDisplayPage] = useState(initial);
  const [shopCategory, setShopCategory] = useState('all');

  useEffect(() => {
    const meta = pageMeta(displayPage);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.desc);
    setCanonical(displayPage);
    setJsonLd(displayPage);
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
    const prod = productSlug(displayPage);
    if (prod) return <ProductPage slug={prod} onNav={navigate} />;
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
