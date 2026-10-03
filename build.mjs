/* ═══════════════════════════════════════════════════════════
   informs - build static

   Asamblează paginile din src/ în HTML static la rădăcină.
   Rulezi `node build.mjs`. Singura dependență e de dezvoltare:
   react și react-dom, pentru pre-randarea paginilor legale.

   De ce un build și nu include-uri PHP sau injecție din JS:
   ieșirea rămâne HTML pur, deci merge pe orice găzduire, se
   indexează corect și funcționează cu JavaScript dezactivat.
   ═══════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');

/* CSS-ul comun, în ordinea în care trebuie încărcat. Paginile
   adaugă peste el ce le e propriu, prin cheia `css`. */
const BASE_CSS = ['base', 'chrome', 'components'];

/* Gazda canonică. Site-ul nu avea etichete canonical, deci /servicii
   și /servicii.html arătau ca două pagini distincte cu același text. */
const HOST = 'https://www.informs.ro';

const read = (...p) => readFileSync(join(...p), 'utf8');

/* ── Versiuni pe fișierele proprii ────────────────────────────
   vercel.json dă .js-urilor `stale-while-revalidate` de 7 zile, deci
   un browser poate folosi o copie veche la prima vizită după un
   deploy: CSS nou peste JS vechi. Adăugăm ?v=<hash de conținut> la
   CSS/JS-urile locale; adresa se schimbă doar când se schimbă
   fișierul. vendor/ are deja cache imutabil și nu se atinge.
   Hash-ul ignoră sfârșitul de rând, ca să iasă la fel pe Windows
   (autocrlf) și pe Vercel. */
const ASSET_REF = /(src|href)="((?:css\/|js\/|vendor\/)?[A-Za-z0-9_.-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"/g;

function stampAssets(html) {
  return html.replace(ASSET_REF, (m, attr, file) => {
    const path = join(ROOT, file);
    if (!existsSync(path)) return m;
    const body = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
    const v = createHash('sha1').update(body).digest('hex').slice(0, 8);
    return `${attr}="${file}?v=${v}"`;
  });
}

/* ── CSS pentru aplicatia React ───────────────────────────────
   app.html incarca in continuare main.css, care isi are proprii
   tokeni. Trei dintre ei se numesc la fel ca ai nostri dar au alte
   valori (--blue, --ease), deci un :root global ar schimba culorile
   si animatiile magazinului.

   Generam spa-chrome.css din aceleasi surse ca site-ul static, cu
   tokenii limitati la radacinile de chrome. Fiind generat, nu poate
   ramane in urma fata de base.css si chrome.css.
   ───────────────────────────────────────────────────────────── */
const CHROME_ROOTS = '.hdr, .drawer, .ftr, .cookie, .skip-link';

// primitivele de care are nevoie markup-ul de chrome
const NEEDED = ['.skip-link', '.btn', '.lnk', '.ico-arrow', '.ico-caret', '.visually-hidden'];

function cssRules(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const ws = /^\s+/.exec(src.slice(i));
    if (ws) { i += ws[0].length; continue; }
    if (src.startsWith('/*', i)) { const j = src.indexOf('*/', i + 2); i = j === -1 ? src.length : j + 2; continue; }
    let j = i, depth = 0, started = false;
    while (j < src.length) {
      const c = src[j];
      if (c === '{') { depth++; started = true; }
      else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
      else if (c === ';' && !started) { j++; break; }
      j++;
    }
    const block = src.slice(i, j).trim();
    if (block) out.push({ sel: block.split('{')[0].trim(), block });
    i = j;
  }
  return out;
}

function buildSpaChrome() {
  const base = read(ROOT, 'css', 'base.css');
  const chrome = read(ROOT, 'css', 'chrome.css');
  const rules = cssRules(base);

  const root = rules.find((r) => r.sel === ':root');
  const tokens = root.block.slice(root.block.indexOf('{') + 1, root.block.lastIndexOf('}'));

  /* base.css rescrie o parte din tokeni la ecrane mici (--gutter trece de
     la 40px la 24px, apoi la 20px). Fara ei, antetul si subsolul din
     aplicatie raman cu marginea de desktop si se vede ca sunt alte
     componente decat pe paginile statice. */
  const mediaTokens = rules
    .filter((r) => r.sel.startsWith('@media') && r.block.includes(':root'))
    .map((r) => {
      const inner = r.block.slice(r.block.indexOf(':root'));
      const decl = inner.slice(inner.indexOf('{') + 1, inner.indexOf('}')).trim();
      return `${r.sel} {\n  ${CHROME_ROOTS} {\n    ${decl}\n  }\n}`;
    })
    .join('\n\n');

  const roots = CHROME_ROOTS.split(',').map((s) => s.trim());

  const prims = rules
    .filter((r) => !r.sel.startsWith('@') && !r.sel.startsWith(':root'))
    .filter((r) => NEEDED.some((n) => r.sel.split(',').some((s) => s.trim().startsWith(n))))
    .map((r) => {
      /* Si primitivele trebuie limitate. `.btn` la nivel global schimba
         butoanele din magazin, care folosesc aceeasi clasa: masurat,
         18px in loc de 13.5px si colturi drepte in loc de 6px. */
      const body = r.block.slice(r.block.indexOf('{'));
      const sel = r.sel
        .split(',')
        .map((s) => s.trim())
        .flatMap((p) =>
          roots.some((rt) => p === rt || p.startsWith(rt + ':') || p.startsWith(rt + '.'))
            ? [p]
            : roots.map((rt) => `${rt} ${p}`)
        )
        .join(',\n');
      return `${sel} ${body}`;
    });

  /* Reset-ul global din base.css nu se incarca in aplicatie, iar fara el
     listele din subsol apar cu buline si marginile implicite revin. Il
     reproducem limitat la chrome, ca sa nu atinga continutul magazinului. */

  /* Fiecare parte din lista primeste prefixul. Altfel `${root} ul, ol`
     s-ar citi ca `.hdr ul` plus un `ol` global, iar reset-ul ar scapa
     peste tot: exact asa ajunsesera h2..h5 si svg resetate in magazin. */
  /* :where() tine reset-ul la specificitatea unui element simplu, ca
     `a { }` din base.css. Cu `.hdr a` (0,1,1) reset-ul batea regulile
     cu o singura clasa, `.nav__link` si `.drawer__solo`, iar linkurile
     mosteneau textul inchis al paginii: pe /magazin nu se vedeau. */
  const scoped = (sel, decl) => {
    const parts = sel.split(',').map((s) => s.trim());
    const all = [];
    for (const r of roots) for (const p of parts) all.push(`:where(${r}) ${p}`);
    return all.join(',\n') + ` {\n  ${decl}\n}`;
  };

  const reset = [
    scoped('ul, ol', 'margin: 0; padding: 0; list-style: none;'),
    scoped('p', 'margin: 0;'),
    scoped('h1, h2, h3, h4, h5', 'margin: 0; font-weight: 400;'),
    scoped('a', 'color: inherit; text-decoration: none;'),
    scoped('img, svg', 'display: block; max-width: 100%;'),
    scoped('button', 'font: inherit; color: inherit; background: none; border: 0; cursor: pointer;')
  ].join('\n\n');

  const css =
    '/* GENERAT de build.mjs din base.css + chrome.css. Nu edita aici. */\n\n' +
    `${CHROME_ROOTS} {\n${tokens}\n}\n\n` +
    (mediaTokens ? mediaTokens + '\n\n' : '') +
    '/* reset limitat la chrome */\n' + reset + '\n\n' +
    prims.join('\n\n') + '\n\n' +
    '/* doar subsolul foloseste .container din sistemul nou */\n' +
    '.ftr .container {\n  width: 100%;\n  max-width: var(--container);\n' +
    '  margin-inline: auto;\n  padding-inline: var(--gutter);\n}\n\n' +
    chrome.replace(/^\/\*[\s\S]*?\*\/\n*/, '');

  writeFileSync(join(ROOT, 'css', 'spa-chrome.css'), css, 'utf8');
  console.log(`spa-chrome.css: ${prims.length} primitive + chrome, tokeni limitati la chrome.`);
}

/* ── Datele firmei, citite din Config.jsx ─────────────────────
   Sunt date legale afisate pe un site care incaseaza: nu au voie sa
   difere intre paginile statice si cele servite de aplicatie. In loc
   sa le copiem, le citim din aceeasi sursa pe care o foloseste
   companyRows(). Campurile marcate TODO sunt sarite, ca acolo.
   ───────────────────────────────────────────────────────────── */
function companyRowsHtml() {
  const cfg = read(ROOT, 'Config.jsx');
  const block = cfg.slice(cfg.indexOf('const COMPANY = {'));
  const field = (k) => {
    const m = new RegExp(`\\b${k}:\\s*'([^']*)'`).exec(block.slice(0, block.indexOf('};')));
    return m ? m[1] : null;
  };

  const rows = [
    ['name', (v) => `<span>${v}</span>`],
    ['cui', (v) => `<span>CUI ${v}</span>`],
    ['regCom', (v) => `<span>${v}</span>`],
    ['address', (v) => `<span>${v.replace(', Târgu', '<br>Târgu')}</span>`],
    ['phone', (v) => `<a href="tel:${v.replace(/\s/g, '')}">${v}</a>`],
    ['email', (v) => `<a href="mailto:${v}">${v}</a>`],
    ['schedule', (v) => `<span>${v}</span>`]
  ];

  const out = rows
    .map(([k, fmt]) => {
      const v = field(k);
      return v ? `            <li>${fmt(v)}</li>` : null;
    })
    .filter(Boolean);

  if (!out.length) throw new Error('Config.jsx: nu am putut citi datele firmei');
  return out.join('\n');
}

/* ── Date structurate (JSON-LD) ───────────────────────────────
   Google nu are de unde sti cine e INFORMS: cine il opereaza, unde e,
   ce servicii vinde. Le declaram o singura data, din aceeasi sursa ca
   datele din subsol (Config.jsx), ca sa nu divergheze.

   Nodurile primesc @id, ca paginile sa se lege de aceeasi organizatie
   in loc sa o redeclare. Nu punem marcare de tip FAQ: rezultatele
   imbogatite pentru ea au fost retrase in mai 2026.
   ───────────────────────────────────────────────────────────── */
/* Marcajul din Config.jsx pentru campurile necompletate. */
const TODO_MARK = '«TODO»';

function companyData() {
  const cfg = read(ROOT, 'Config.jsx');
  const block = cfg.slice(cfg.indexOf('const COMPANY = {'));
  const body = block.slice(0, block.indexOf('};'));
  const field = (k) => {
    const m = new RegExp(`\\b${k}:\\s*'([^']*)'`).exec(body);
    return m && m[1] !== TODO_MARK ? m[1] : null;
  };
  return {
    name: field('name'),
    brand: field('brand'),
    cui: field('cui'),
    regCom: field('regCom'),
    address: field('address'),
    phone: field('phone'),
    email: field('email'),
  };
}

/* Serviciile cu pagină proprie trimit la ea; celelalte, la secțiunea
   lor din /servicii. */
const SERVICES = [
  ['Analiză și consultanță în achiziții publice', '/servicii#analiza'],
  ['Documentații de atribuire', '/documentatii-de-atribuire'],
  ['Delegarea serviciilor de utilități publice', '/delegare-servicii'],
  ['Digitalizare la comandă', '/digitalizare'],
  ['Instrumente de lucru Excel, Word și PDF', '/servicii#instrumente'],
];

/* Nodul unui serviciu. Același @id pe /servicii și pe pagina proprie a
   serviciului, ca să fie o singură entitate. Adresa unei pagini poartă
   deja nodul paginii (#pagina), deci serviciul primește #serviciu. */
const serviceId = (href) => HOST + href + (href.includes('#') ? '' : '#serviciu');

function serviceNode([name, href]) {
  return {
    '@type': 'Service',
    '@id': serviceId(href),
    name,
    url: HOST + href,
    serviceType: name,
    provider: { '@id': HOST + '/#organizatie' },
    areaServed: { '@type': 'Country', name: 'România' },
  };
}

/* Firma și site-ul. Aceleași două noduri ajung pe paginile statice
   și în app.html (scrise de build, mai jos), deci nu pot diverge. */
function orgNodes() {
  const c = companyData();
  const site = HOST + '/#site';
  const org = HOST + '/#organizatie';

  /* Adresa e tinuta ca un singur sir in Config.jsx, pentru subsol.
     Aici o desfacem in campurile cerute de schema.org. */
  const addr = (c.address || '').split(',').map((x) => x.trim());
  const postal = {
    '@type': 'PostalAddress',
    streetAddress: addr.slice(0, 3).join(', '),
    addressLocality: addr[3] || 'Târgu Mureș',
    addressRegion: (addr[4] || 'jud. Mureș').replace('jud. ', ''),
    postalCode: addr[5] || '',
    addressCountry: 'RO',
  };

  /* `name` e brandul, cum e căutată firma; denumirea societății stă în
     legalName. Fără vatID: societatea nu e înregistrată în scopuri de
     TVA (Config.jsx), deci CUI-ul e doar cod fiscal. Logo-ul e simbolul
     pătrat; Google cere cel puțin 112x112. */
  return [
    {
      '@type': 'Organization',
      '@id': org,
      name: c.brand,
      legalName: c.name,
      alternateName: [c.brand + ' România', 'informs.ro', c.name],
      description: `${c.brand} este brandul sub care ${c.name} din Târgu Mureș oferă consultanță în ` +
        'achiziții publice în România: documentații de atribuire, delegarea serviciilor de utilități ' +
        'publice, sprijin pentru ofertanți și modele Word, Excel și PDF.',
      url: HOST + '/',
      logo: {
        '@type': 'ImageObject',
        url: HOST + '/assets/brand/apple-touch-icon.png',
        width: 180,
        height: 180,
      },
      email: c.email,
      telephone: c.phone,
      taxID: c.cui,
      identifier: c.regCom,
      address: postal,
      areaServed: { '@type': 'Country', name: 'România' },
      knowsLanguage: 'ro',
    },
    {
      '@type': 'WebSite',
      '@id': site,
      url: HOST + '/',
      name: c.brand,
      alternateName: 'informs.ro',
      inLanguage: 'ro-RO',
      publisher: { '@id': org },
    },
  ];
}

function jsonLd(page, path) {
  const url = HOST + path;
  const site = HOST + '/#site';
  const org = HOST + '/#organizatie';

  /* Pagina-părinte din firimituri (`parent` în pages.json), pentru
     paginile de sub Servicii: Acasă, Servicii, pagina. */
  const parent = page.parent ? pages.find((p) => p.out === page.parent) : null;
  if (page.parent && !parent) throw new Error(`${page.out}: parent necunoscut ${page.parent}`);
  const trail = [
    { name: 'Acasă', item: HOST + '/' },
    ...(parent ? [{ name: parent.crumb || parent.title, item: HOST + '/' + parent.out.replace(/\.html$/, '') }] : []),
    { name: page.crumb || page.title, item: url },
  ];

  /* Serviciul descris de pagină, dacă are pagină proprie. */
  const ownService = SERVICES.find(([, href]) => href === path);

  const graph = [
    ...orgNodes(),
    {
      '@type': page.schemaType || 'WebPage',
      '@id': url + '#pagina',
      url,
      name: page.title,
      description: page.desc,
      inLanguage: 'ro-RO',
      isPartOf: { '@id': site },
      about: { '@id': org },
      ...(ownService ? { mainEntity: { '@id': serviceId(ownService[1]) } } : {}),
      ...(path === '/' ? {} : {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, ...t })),
        },
      }),
    },
  ];

  /* Serviciile sunt oferta reala a firmei, enumerate pe pagina Servicii. */
  if (page.out === 'servicii.html') graph.push(...SERVICES.map(serviceNode));
  if (ownService) graph.push(serviceNode(ownService));

  return '<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) +
    '</script>';
}

/* ── partiale ─────────────────────────────────────────────── */
const partials = {};
for (const file of readdirSync(join(SRC, 'partials'))) {
  if (!file.endsWith('.html')) continue;
  partials[file.replace(/\.html$/, '')] = read(SRC, 'partials', file).trim();
}

/* ── starea activă din navigație ──────────────────────────── */
function applyActive(html, page) {
  if (page.nav) {
    // <li ... data-nav="servicii"> primește is-current.
    // Prinde și elementele simple, fără megamenu: clasa e captată,
    // nu scrisă de mână, altfel un <li class="nav__item"> era ignorat.
    html = html.replace(
      new RegExp(`<li class="(nav__item[^"]*)"( data-nav="${page.nav}")`, 'g'),
      '<li class="$1 is-current"$2'
    );
    // secțiunea corespunzătoare din drawer se deschide
    html = html.replace(
      new RegExp(`(<details class="drawer__group")( data-nav="${page.nav}")`, 'g'),
      '<details class="drawer__group" open$2'
    );
  }
  if (page.navlink) {
    html = html.replace(
      new RegExp(`<a( data-navlink="${page.navlink}")`, 'g'),
      '<a class="is-active"$1'
    );
  }
  return html;
}

/* ── asamblare ────────────────────────────────────────────── */
const layout = read(SRC, 'layout.html');
const pages = JSON.parse(read(SRC, 'pages.json'));

/* Sursele se leagă între ele prin nume de fișier, ca să se poată
   deschide direct de pe disc. În producție adresele sunt curate
   (/servicii, nu /servicii.html) și sunt deja indexate așa, deci
   le convertim la build. Numele permise vin din pages.json, ca să
   nu atingem din greșeală alte linkuri. */
function cleanUrls(html) {
  const names = pages.map((p) => p.out.replace(/\.html$/, ''));
  for (const name of names) {
    const target = name === 'index' ? '/' : '/' + name;
    html = html.replace(
      new RegExp(`href="${name}\\.html(#[^"]*)?"`, 'g'),
      (m, frag) => `href="${target}${frag || ''}"`
    );
  }
  return html;
}

let built = 0;
for (const page of pages) {
  const body = read(SRC, 'pages', page.src).trim();

  const cssTags = [...BASE_CSS, ...(page.css || [])]
    .map((n) => `<link rel="stylesheet" href="css/${n}.css">`)
    .join('\n');

  const path = page.out === 'index.html' ? '/' : '/' + page.out.replace(/\.html$/, '');

  // pagina de eroare nu are ce cauta in index
  const robots = page.noindex
    ? '\n<meta name="robots" content="noindex, follow">'
    : '';

  // titlul și descrierea ajung și în atribute (og:*), unde o ghilimea
  // dublă ar închide atributul
  for (const k of ['title', 'desc']) {
    if (/["<>]/.test(page[k])) throw new Error(`${page.out}: ${k} conține caractere nepermise ("<>)`);
  }

  // replaceAll: aceleași valori apar și în <title>/description și în og:*
  let html = layout
    .replaceAll('{{title}}', page.title)
    .replaceAll('{{desc}}', page.desc)
    .replaceAll('{{canonical}}', HOST + path)
    .replace('{{robots}}', robots)
    .replace('{{css}}', cssTags)
    .replace('{{jsonld}}', page.noindex ? '' : jsonLd(page, path))
    .replace('{{body}}', body);

  // partialele se injectează după body, ca un {{>x}} din conținut
  // să fie tratat la fel ca unul din layout
  html = html.replace(/\{\{>(\w+)\}\}/g, (m, name) => {
    if (!(name in partials)) throw new Error(`Partial lipsă: ${name}`);
    return partials[name];
  });

  // dupa injectarea partialelor, ca {{company}} din footer sa fie prins
  html = html.replace('{{company}}', companyRowsHtml());

  /* O pagină scoasă din index nu are adresă canonică de declarat. */
  if (page.noindex) {
    html = html
      .replace(/\n<link rel="canonical"[^>]*>/, '')
      .replace(/\n<meta property="og:url"[^>]*>/, '');
  }

  html = applyActive(html, page);
  html = cleanUrls(html);
  html = stampAssets(html);

  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${page.out}: substituții nerezolvate ${left.join(', ')}`);

  writeFileSync(join(ROOT, page.out), html, 'utf8');
  console.log(`  ${page.out.padEnd(16)} ${String(html.length).padStart(7)} bytes`);
  built++;
}

console.log(`\n${built} pagini construite din ${Object.keys(partials).length} partiale.`);

buildSpaChrome();

/* app.html nu e generat, dar își ia versiunile tot de aici. Rulează
   după buildSpaChrome() și după babel (npm run build), ca hash-urile
   să fie ale fișierelor finale. Tot aici primește firma și site-ul din
   orgNodes(), ca blocul lui static să fie același cu al paginilor
   generate. Idempotent: rescrie doar ?v= și acel bloc JSON-LD. */
{
  const appPath = join(ROOT, 'app.html');
  const before = readFileSync(appPath, 'utf8');
  const ORG_BLOCK = /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/;
  if (!ORG_BLOCK.test(before)) throw new Error('app.html: nu găsesc blocul JSON-LD al firmei');
  const eol = before.includes('\r\n') ? '\r\n' : '\n';
  const nodes = orgNodes().map((n) => '    ' + JSON.stringify(n)).join(',' + eol);
  const block = `${eol}  {"@context":"https://schema.org","@graph":[${eol}${nodes}${eol}  ]}${eol}  `;
  const after = stampAssets(before.replace(ORG_BLOCK, (m, open, close) => open + block + close));
  if (after !== before) writeFileSync(appPath, after, 'utf8');
  console.log(`app.html: ${after !== before ? 'actualizat' : 'neschimbat'} (versiuni, date structurate).`);
}

/* ── Paginile aplicației, pre-randate ─────────────────────────
   /magazin, paginile de produs și cele legale sunt randate de React.
   Fără JavaScript (Bing, previzualizările din WhatsApp/LinkedIn,
   crawlerele asistenților AI) vedeau doar shell-ul gol din app.html,
   cu același titlu peste tot. Pentru fiecare generăm spa/<cale>.html:
   app.html cu titlul, descrierea, canonica și JSON-LD-ul paginii, plus
   antetul, conținutul și subsolul în HTML. vercel.json trimite adresa
   curată la fișierul ei; React înlocuiește conținutul din #root la
   pornire, deci pentru vizitatori nu se schimbă nimic.

   Datele vin din aceleași surse ca aplicația: PAGE_META și CRUMB din
   App.jsx, SHOP_PRODUCTS din Shop.jsx.
   ───────────────────────────────────────────────────────────── */

/* Literalul care începe la `marker` (obiect sau listă), evaluat izolat.
   Sursele sunt ale noastre și conțin doar date. */
function sourceLiteral(file, marker) {
  const src = read(ROOT, file);
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`${file}: nu găsesc ${marker}`);
  const start = src.slice(at).search(/[[{]/) + at;
  let depth = 0;
  let quote = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) return vm.runInNewContext('(' + src.slice(start, i + 1) + ')');
    }
  }
  throw new Error(`${file}: literal neînchis după ${marker}`);
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGE_META = sourceLiteral('App.jsx', 'const PAGE_META =');
const CRUMB = sourceLiteral('App.jsx', 'const CRUMB =');
const SHOP_PRODUCTS = sourceLiteral('Shop.jsx', 'const SHOP_PRODUCTS =');
const FORMAT_LABEL = { word: 'Word', excel: 'Excel', pdf: 'PDF', pachet: 'Pachet' };
const LEGAL_PAGES = Object.keys(PAGE_META).filter((k) =>
  k.startsWith('politica-') || k === 'termeni-si-conditii' || k === 'dreptul-de-retragere');

const fmtPrice = (p) => (p.price === 0 ? 'Gratuit' : `${p.price} lei`);

/* Descrierea din <meta>: cea scurtă a produsului, sau `metaDesc` când
   cea scurtă trece de lungimea pe care o afișează motoarele de căutare. */
const productDesc = (p) => p.metaDesc || p.shortDesc;

/* Previzualizările, din același previews.js pe care îl încarcă
   aplicația (generat de tools/previzualizari.py). */
const SHOP_PREVIEWS = (() => {
  const file = join(ROOT, 'previews.js');
  if (!existsSync(file)) return {};
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(file, 'utf8'), ctx);
  return ctx.window.SHOP_PREVIEWS || {};
})();
const previewPages = (p) => (SHOP_PREVIEWS[p.id] && SHOP_PREVIEWS[p.id].pages) || [];

/* Textul alternativ al miniaturilor, identic cu previewAlt() din Shop.jsx. */
const previewAlt = (p, pg, k) => (k === 0
  ? `Prima pagină din previzualizarea documentului ${p.title}`
  : `Pagina ${pg.page} din documentul ${p.title}`);

/* „Alte documente…”: celelalte produse vizibile cu același public sau
   de pe același raft. Aceeași regulă ca relatedProducts() din Shop.jsx,
   cu titlurile citite de acolo. */
const RELATED_TITLES = sourceLiteral('Shop.jsx', 'const RELATED_TITLES =');
function relatedProducts(p) {
  const others = SHOP_PRODUCTS.filter((o) => !o.hidden && o.id !== p.id);
  const groups = (p.audiences || []).map((a) => ({
    title: RELATED_TITLES[a],
    items: others.filter((o) => (o.audiences || []).includes(a)),
  }));
  if (p.shelf) groups.push({ title: RELATED_TITLES[p.shelf], items: others.filter((o) => o.shelf === p.shelf) });
  /* grupul cel mai bogat; la egalitate, primul public al produsului */
  return groups.filter((g) => g.title && g.items.length).sort((a, b) => b.items.length - a.items.length)[0] || null;
}

/* Nodul paginii, identic cu setJsonLd() din App.jsx. Organizația și
   site-ul sunt deja declarate static în app.html. */
function spaJsonLd({ path, meta, crumb, product, collection }) {
  const url = HOST + path;
  const node = {
    '@type': collection ? 'CollectionPage' : 'WebPage',
    '@id': url + '#pagina',
    url,
    name: meta.title,
    description: meta.desc,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': HOST + '/#site' },
    about: { '@id': HOST + '/#organizatie' },
  };
  const trail = [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: HOST + '/' }];
  if (product) {
    trail.push({ '@type': 'ListItem', position: 2, name: 'Magazin', item: HOST + '/magazin' });
    trail.push({ '@type': 'ListItem', position: 3, name: product.title, item: url });
  } else {
    trail.push({ '@type': 'ListItem', position: 2, name: crumb, item: url });
  }
  node.breadcrumb = { '@type': 'BreadcrumbList', itemListElement: trail };

  const graph = [node];
  if (product) {
    const img = previewPages(product)[0];
    node.mainEntity = { '@id': url + '#produs' };
    graph.push({
      '@type': 'Product',
      '@id': url + '#produs',
      name: product.title,
      description: product.longDesc || product.shortDesc,
      url,
      ...(img ? { image: HOST + '/' + img.src } : {}),
      ...(product.sku ? { sku: product.sku } : {}),
      category: 'Documente digitale',
      brand: { '@id': HOST + '/#organizatie' },
      offers: {
        '@type': 'Offer',
        url,
        price: String(product.price),
        priceCurrency: 'RON',
        availability: 'https://schema.org/InStock',
        seller: { '@id': HOST + '/#organizatie' },
      },
    });
  }
  /* id-ul e cel pe care îl reia App.jsx, ca să nu apară de două ori */
  return '<script type="application/ld+json" id="jsonld-pagina">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') +
    '</script>';
}

function heroHtml({ label, title, lead, crumbs, cls = 'pg-hero' }) {
  const nav = crumbs
    ? `<nav class="sp-crumbs" aria-label="Firimituri">${crumbs}</nav>`
    : '';
  return `<div class="${cls}"><div class="container">${nav}` +
    (label ? `<div class="tag-label">${esc(label)}</div>` : '') +
    `<h1>${esc(title)}</h1>` + (lead ? `<p>${esc(lead)}</p>` : '') +
    '</div></div>';
}

function shopBody(products) {
  const items = products.map((p) =>
    `<li><h2><a href="/magazin/${p.id}">${esc(p.title)}</a></h2>` +
    `<p>${esc(p.shortDesc)}</p>` +
    `<p>${FORMAT_LABEL[p.format] || ''} · ${fmtPrice(p)}</p></li>`).join('');
  return heroHtml({
    cls: 'pg-hero pg-hero--shop',
    label: 'Magazin',
    title: 'Documente profesionale pentru sectorul public și privat',
    lead: 'Fiecare model indică formatul, versiunea și ce conține. Câteva formulare sunt gratuite.',
  }) + `<section class="sec"><div class="container"><ul class="sp-prerender">${items}</ul></div></section>`;
}

/* Același marcaj ca ProductDetails din Shop.jsx: etichetele de secțiune
   sunt titluri h2, cu fontul și interlinia moștenite, ca să arate ca
   înainte (SEC_LABEL_STYLE în Shop.jsx). */
function productBody(p) {
  const sec = (label, inner, style = '') =>
    `<div class="shop-modal-sec"${style}><h2 class="shop-modal-lbl" style="font-family:inherit;line-height:inherit">${label}</h2>${inner}</div>`;
  const thumbs = previewPages(p).map((pg, k) =>
    `<span class="pv-strip__item"><img src="${esc(pg.src)}" width="${pg.w}" height="${pg.h}" ` +
    `alt="${esc(previewAlt(p, pg, k))}" loading="lazy"><span>Pag. ${pg.page}</span></span>`).join('');
  const related = relatedProducts(p);
  const details = [
    p.version ? `Versiunea ${esc(p.version)}${p.updated ? ', ' + esc(p.updated) : ''}` : '',
    p.stats && p.stats.pages ? `${p.stats.pages} pagini` : '',
    FORMAT_LABEL[p.format] || '',
  ].filter(Boolean).join(' · ');
  return heroHtml({
    crumbs: `<a href="/magazin">Magazin</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span>`,
    label: (FORMAT_LABEL[p.format] || '') + (p.price === 0 ? ' · Gratuit' : ''),
    title: p.title,
    lead: p.shortDesc,
  }) +
    '<section class="sec sp-detail-wrap"><div class="container"><div class="sp-detail">' +
    sec('Descriere', `<p class="sp-modal-text">${esc(p.longDesc)}</p>`) +
    (p.forWhom ? sec('Pentru cine', `<p class="sp-modal-text">${esc(p.forWhom)}</p>`) : '') +
    sec('Ce include', `<ul class="shop-modal-includes">${(p.includes || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`) +
    (thumbs ? sec('Previzualizare', `<div class="pv-strip">${thumbs}</div>`) : '') +
    sec('Detalii tehnice', `<p class="sp-modal-text">${details}</p>`) +
    sec('Preț', `<p class="sp-modal-text">${fmtPrice(p)}</p>`) +
    (related ? sec(esc(related.title), '<ul class="shop-modal-includes">' +
      related.items.map((o) => `<li><a href="/magazin/${o.id}" style="color:var(--blue)">${esc(o.title)}</a></li>`).join('') +
      '</ul>', ' style="margin-top:28px;margin-bottom:0"') : '') +
    '<p class="sp-modal-text--note">Aveți nevoie de documentul adaptat pe firma dumneavoastră? <a href="/contact">Scrieți-ne.</a></p>' +
    '</div></div></section>';
}

/* ── Textul paginilor legale ──────────────────────────────────
   Fără JavaScript, paginile legale aveau doar titlul și o frază. Aici
   randăm componentele reale din Legal.js (cel compilat, pe care îl
   încarcă și browserul) cu react-dom/server, într-un context izolat în
   care Config.js își pune datele pe `window`, ca în pagină. Rezultatul
   e HTML simplu; în browser, createRoot().render() din App.jsx
   înlocuiește conținutul din #root, deci textul nu apare de două ori. */
const legalHtml = (() => {
  const require = createRequire(import.meta.url);
  let React, renderToStaticMarkup;
  try {
    React = require('react');
    ({ renderToStaticMarkup } = require('react-dom/server'));
  } catch (e) {
    throw new Error('Lipsesc react și react-dom (devDependencies). Rulează `npm install`. ' + e.message);
  }
  const ctx = { React };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of ['Config.js', 'Legal.js']) vm.runInContext(read(ROOT, f), ctx, { filename: f });
  return (type) => {
    if (!ctx.LEGAL_PAGES || !ctx.LEGAL_PAGES[type]) throw new Error(`Legal.js: nu există pagina ${type}`);
    return renderToStaticMarkup(React.createElement(ctx.PolicyPage, { type, onNav() {} }));
  };
})();

/* Imaginea din linkurile distribuite: cea a site-ului, iar la produse
   prima pagină din previzualizare. */
const OG_DEFAULT = { type: 'website' };

/* app.html + meta-ul și conținutul paginii. */
function spaPage({ path, meta, body, jsonld, noindex, og = OG_DEFAULT }) {
  for (const k of ['title', 'desc']) {
    if (/["<>]/.test(meta[k])) throw new Error(`${path}: ${k} conține caractere nepermise ("<>)`);
  }
  let chrome = ['header', 'footer'].map((n) => partials[n]);
  chrome = chrome.map((h) => cleanUrls(h.replace('{{company}}', companyRowsHtml())));

  /* O pagină scoasă din index nu primește canonică și nici og:url. */
  const address = noindex
    ? '<meta name="robots" content="noindex, follow" />\n  '
    : `<link rel="canonical" href="${HOST}${path}" />\n  <meta property="og:url" content="${HOST}${path}" />\n  `;
  const setMeta = (html, attr, value) => {
    const re = new RegExp(`(<meta ${attr} content=")[^"]*`);
    if (!re.test(html)) throw new Error(`app.html: lipsește <meta ${attr}>`);
    return html.replace(re, (m, open) => open + value);
  };

  /* Înlocuirile se fac prin funcții: un `$` din text ar fi altfel citit
     ca referință la grupul capturat. */
  let html = readFileSync(join(ROOT, 'app.html'), 'utf8')
    .replace(/<title>[^<]*<\/title>/, () => `<title>${meta.title}</title>\n  ${address}${jsonld}`)
    .replace('<div id="root"></div>', () =>
      `<div id="root">${chrome[0]}<main id="main" style="min-height:60vh">${body}</main>${chrome[1]}</div>`);
  html = setMeta(html, 'name="description"', meta.desc);
  html = setMeta(html, 'property="og:title"', meta.title);
  html = setMeta(html, 'property="og:description"', meta.desc);
  html = setMeta(html, 'property="og:type"', og.type);
  if (og.image) {
    html = setMeta(html, 'property="og:image"', og.image);
    html = setMeta(html, 'property="og:image:width"', og.width);
    html = setMeta(html, 'property="og:image:height"', og.height);
    html = setMeta(html, 'property="og:image:alt"', esc(og.alt));
  }

  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${path}: substituții nerezolvate ${left.join(', ')}`);
  return html;
}

const visibleProducts = SHOP_PRODUCTS.filter((p) => !p.hidden);
const SPA_DIR = join(ROOT, 'spa');
rmSync(SPA_DIR, { recursive: true, force: true });
mkdirSync(join(SPA_DIR, 'magazin'), { recursive: true });

const spaOut = [
  {
    file: 'magazin.html',
    path: '/magazin',
    meta: PAGE_META.magazin,
    body: shopBody(visibleProducts),
    jsonld: spaJsonLd({ path: '/magazin', meta: PAGE_META.magazin, crumb: CRUMB.magazin, collection: true }),
  },
  /* Și cele ascunse: vercel.json nu are altă rută pentru ele, iar
     /magazin/<produs>?test=1 trebuie să meargă. Ies din index. */
  ...SHOP_PRODUCTS.map((p) => {
    const path = '/magazin/' + p.id;
    const meta = { title: p.title + ' | INFORMS', desc: productDesc(p) };
    const img = previewPages(p)[0];
    return {
      file: `magazin/${p.id}.html`, path, meta, noindex: !!p.hidden,
      body: productBody(p), jsonld: spaJsonLd({ path, meta, product: p }),
      og: {
        type: 'product',
        ...(img ? { image: HOST + '/' + img.src, width: img.w, height: img.h, alt: previewAlt(p, img, 0) } : {}),
      },
    };
  }),
  ...LEGAL_PAGES.map((k) => {
    const meta = PAGE_META[k];
    const crumb = CRUMB[k] || meta.title.split(' | ')[0];
    return {
      file: k + '.html',
      path: '/' + k,
      meta,
      body: legalHtml(k),
      jsonld: spaJsonLd({ path: '/' + k, meta, crumb }),
    };
  }),
];

for (const o of spaOut) writeFileSync(join(SPA_DIR, o.file), spaPage(o), 'utf8');
console.log(`spa/: ${spaOut.length} pagini pre-randate (magazin, ${visibleProducts.length} produse, ${LEGAL_PAGES.length} legale).`);

/* ── sitemap.xml + robots.txt ─────────────────────────────────
   Site-ul nu avea niciunul. Le generăm din aceeași sursă ca
   paginile, ca să nu ajungă să divergă de conținutul real.

   Rutele SPA sunt enumerate explicit: sunt randate pe client, deci
   nu pot fi descoperite citind fișiere de pe disc.
   ───────────────────────────────────────────────────────────── */
// rute servite în continuare de aplicația React
/* `src` e fișierul din care vine conținutul paginii; de la el luăm lastmod. */
const SPA_ROUTES = [
  { path: '/magazin', priority: '0.9', freq: 'weekly', src: 'Shop.jsx' },
  { path: '/politica-confidentialitate', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/termeni-si-conditii', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/politica-gdpr', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/politica-cookies', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/politica-livrare', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/politica-anulare', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' },
  { path: '/dreptul-de-retragere', priority: '0.3', freq: 'yearly', src: 'Legal.jsx' }
];

const today = new Date().toISOString().slice(0, 10);

/* ── lastmod ──────────────────────────────────────────────────
   Data build-ului pe toate adresele spunea „totul s-a schimbat azi” la
   fiecare deploy, iar motoarele de căutare ignoră un lastmod în care nu
   se pot încrede. Luăm data ultimului commit al fișierului sursă; un
   fișier cu modificări necomise contează ca schimbat azi.

   Într-o clonă superficială (cum face un build la găzduire) sau fără
   git, istoricul nu e de încredere: păstrăm data din sitemap.xml-ul
   deja urcat în repo, iar în lipsa ei cădem pe data build-ului. */
const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};
const gitUsable = git('rev-parse', '--is-shallow-repository') === 'false';
const prevSitemap = existsSync(join(ROOT, 'sitemap.xml')) ? read(ROOT, 'sitemap.xml') : '';
const fileDates = new Map();

function lastmod(u) {
  const date = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '');
  if (gitUsable) {
    if (!fileDates.has(u.src)) {
      const dirty = git('status', '--porcelain', '--', u.src) !== '';
      fileDates.set(u.src, dirty ? today : date(git('log', '-1', '--format=%cs', '--', u.src)));
    }
    return fileDates.get(u.src) || today;
  }
  const at = prevSitemap.indexOf(`<loc>${HOST}${u.path}</loc>`);
  const prev = at < 0 ? null : /^<loc>[^<]*<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/.exec(prevSitemap.slice(at));
  return (prev && date(prev[1])) || today;
}

const staticUrls = pages
  .filter((p) => !p.noindex)
  .map((p) => ({
    path: p.out === 'index.html' ? '/' : '/' + p.out.replace(/\.html$/, ''),
    priority: p.out === 'index.html' ? '1.0' : '0.8',
    freq: 'monthly',
    src: 'src/pages/' + p.src
  }));

/* Paginile de produs: adresele lor vin din catalogul magazinului
   (Shop.jsx), ca sa nu fie nevoie sa le tinem in doua locuri. Produsele
   ascunse sunt sarite, la fel ca in lista. */
function productRoutes() {
  const src = read(ROOT, 'Shop.jsx');
  const start = src.indexOf('const SHOP_PRODUCTS = [');
  const list = src.slice(start, src.indexOf('const SHOW_HIDDEN', start));
  /* Un produs pe bloc: taiem la fiecare `id:` si citim ce urmeaza. */
  return list
    .split(/\bid:\s*'/)
    .slice(1)
    .map((chunk) => {
      const id = chunk.slice(0, chunk.indexOf("'"));
      const body = chunk.slice(0, chunk.indexOf('\n  },'));
      return /hidden:\s*true/.test(body) ? null : id;
    })
    .filter(Boolean)
    .map((id) => ({ path: '/magazin/' + id, priority: '0.7', freq: 'monthly', src: 'Shop.jsx' }));
}

const urls = [...staticUrls, ...SPA_ROUTES, ...productRoutes()];

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${HOST}${u.path}</loc>\n` +
        `    <lastmod>${lastmod(u)}</lastmod>\n` +
        `    <changefreq>${u.freq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n') +
  '\n</urlset>\n';

writeFileSync(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

/* /comanda-finalizata apare doar după o plată, nu are ce căuta în
   index; /app.html e shell-ul, servit prin rewrite. */
const robots =
  'User-agent: *\n' +
  'Allow: /\n' +
  'Disallow: /comanda-finalizata\n' +
  'Disallow: /app.html\n' +
  'Disallow: /spa/\n' +
  'Disallow: /api/\n\n' +
  `Sitemap: ${HOST}/sitemap.xml\n`;

writeFileSync(join(ROOT, 'robots.txt'), robots, 'utf8');

console.log(`sitemap.xml scris cu ${urls.length} adrese, robots.txt scris.`);

/* ── llms.txt ─────────────────────────────────────────────────
   Rezumatul site-ului pentru asistenții AI (llmstxt.org): cine
   suntem, paginile care contează și catalogul cu prețuri. Din
   aceleași surse ca sitemap-ul, ca să nu rămână în urmă. */
{
  const c = companyData();
  const staticLinks = pages
    .filter((p) => !p.noindex && p.out !== 'index.html')
    .map((p) => `- [${p.crumb || p.title}](${HOST}/${p.out.replace(/\.html$/, '')}): ${p.desc}`);
  const productLinks = visibleProducts.map((p) =>
    `- [${p.title}](${HOST}/magazin/${p.id}): ${p.shortDesc} ${FORMAT_LABEL[p.format] || ''}, ${fmtPrice(p)}.`);
  const legalLinks = LEGAL_PAGES.map((k) =>
    `- [${CRUMB[k] || PAGE_META[k].title.split(' | ')[0]}](${HOST}/${k})`);

  const llms = [
    '# INFORMS',
    '',
    `> ${c.brand} este brandul ${c.name} din Târgu Mureș. Pregătește documentații de atribuire, ` +
      'modele Word, Excel și PDF și instrumente digitale pentru ciclul contractului public din România: ' +
      'autorități contractante, ofertanți și executanți de lucrări.',
    '',
    /* Numele coincide cu al unei asociații americane; asistenții le confundă. */
    'Nu are legătură cu INFORMS (Institute for Operations Research and the Management Sciences, informs.org).',
    '',
    'Aceeași echipă dezvoltă Agatha Plus (https://www.agathaplus.ro/), platformă pentru planificarea achizițiilor și urmărirea contractelor.',
    '',
    'Produsele cu plată se cumpără online, cu cardul, și se livrează pe email ca link de descărcare. ' +
      'Instituțiile pot cumpăra și pe bază de comandă, cu factură prin e-Factura și plată prin ordin de plată.',
    '',
    '## Pagini',
    '',
    ...staticLinks,
    `- [Magazin](${HOST}/magazin): ${PAGE_META.magazin.desc}`,
    '',
    '## Produse',
    '',
    ...productLinks,
    '',
    '## Informații legale',
    '',
    ...legalLinks,
    '',
    '## Contact',
    '',
    `- Email: ${c.email}`,
    `- Telefon: ${c.phone}`,
    `- ${c.name}, CUI ${c.cui}, ${c.regCom}, ${c.address}`,
    '',
  ].join('\n');

  writeFileSync(join(ROOT, 'llms.txt'), llms, 'utf8');
  console.log(`llms.txt scris (${visibleProducts.length} produse).`);
}
