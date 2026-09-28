/* ═══════════════════════════════════════════════════════════
   informs - build static

   Asamblează paginile din src/ în HTML static la rădăcină.
   Fără dependențe: rulezi `node build.mjs`.

   De ce un build și nu include-uri PHP sau injecție din JS:
   ieșirea rămâne HTML pur, deci merge pe orice găzduire, se
   indexează corect și funcționează cu JavaScript dezactivat.
   ═══════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import vm from 'node:vm';
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

const SERVICES = [
  ['Analiză și consultanță în achiziții publice', '/servicii#analiza'],
  ['Documentații de atribuire', '/servicii#achizitii'],
  ['Delegarea serviciilor de utilități publice', '/servicii#delegare'],
  ['Digitalizare la comandă', '/servicii#digitalizare'],
  ['Instrumente de lucru Excel, Word și PDF', '/servicii#instrumente'],
];

function jsonLd(page, path) {
  const c = companyData();
  const url = HOST + path;
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

  const graph = [
    {
      '@type': 'Organization',
      '@id': org,
      name: c.name,
      alternateName: c.brand,
      legalName: c.name,
      url: HOST + '/',
      logo: {
        '@type': 'ImageObject',
        url: HOST + '/assets/brand/logo-email.png',
        width: 374,
        height: 76,
      },
      email: c.email,
      telephone: c.phone,
      taxID: c.cui,
      vatID: c.cui,
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
      inLanguage: 'ro-RO',
      publisher: { '@id': org },
    },
    {
      '@type': page.schemaType || 'WebPage',
      '@id': url + '#pagina',
      url,
      name: page.title,
      description: page.desc,
      inLanguage: 'ro-RO',
      isPartOf: { '@id': site },
      about: { '@id': org },
      ...(path === '/' ? {} : {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Acasă', item: HOST + '/' },
            { '@type': 'ListItem', position: 2, name: page.crumb || page.title, item: url },
          ],
        },
      }),
    },
  ];

  /* Serviciile sunt oferta reala a firmei, enumerate pe pagina Servicii. */
  if (page.out === 'servicii.html') {
    graph.push(...SERVICES.map(([name, href]) => ({
      '@type': 'Service',
      '@id': HOST + href,
      name,
      serviceType: name,
      provider: { '@id': org },
      areaServed: { '@type': 'Country', name: 'România' },
    })));
  }

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
   să fie ale fișierelor finale. Idempotent: rescrie doar ?v=. */
{
  const appPath = join(ROOT, 'app.html');
  const before = readFileSync(appPath, 'utf8');
  const after = stampAssets(before);
  if (after !== before) writeFileSync(appPath, after, 'utf8');
  console.log(`app.html: versiuni ${after !== before ? 'actualizate' : 'neschimbate'}.`);
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
    node.mainEntity = { '@id': url + '#produs' };
    graph.push({
      '@type': 'Product',
      '@id': url + '#produs',
      name: product.title,
      description: product.longDesc || product.shortDesc,
      url,
      brand: { '@id': HOST + '/#organizatie' },
      inLanguage: 'ro-RO',
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

function productBody(p) {
  const sec = (label, inner) => `<div class="shop-modal-sec"><div class="shop-modal-lbl">${label}</div>${inner}</div>`;
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
    sec('Detalii tehnice', `<p class="sp-modal-text">${details}</p>`) +
    sec('Preț', `<p class="sp-modal-text">${fmtPrice(p)}</p>`) +
    '</div></div></section>';
}

/* app.html + meta-ul și conținutul paginii. */
function spaPage({ path, meta, body, jsonld, noindex }) {
  for (const k of ['title', 'desc']) {
    if (/["<>]/.test(meta[k])) throw new Error(`${path}: ${k} conține caractere nepermise ("<>)`);
  }
  let chrome = ['header', 'footer'].map((n) => partials[n]);
  chrome = chrome.map((h) => cleanUrls(h.replace('{{company}}', companyRowsHtml())));

  const html = readFileSync(join(ROOT, 'app.html'), 'utf8')
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>\n  <link rel="canonical" href="${HOST}${path}" />\n  <meta property="og:url" content="${HOST}${path}" />\n  ` +
      (noindex ? '<meta name="robots" content="noindex, follow" />\n  ' : '') + jsonld)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${meta.desc}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${meta.title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${meta.desc}`)
    .replace('<div id="root"></div>',
      `<div id="root">${chrome[0]}<main id="main" style="min-height:60vh">${body}</main>${chrome[1]}</div>`);

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
    const meta = { title: p.title + ' | INFORMS', desc: p.shortDesc };
    return {
      file: `magazin/${p.id}.html`, path, meta, noindex: !!p.hidden,
      body: productBody(p), jsonld: spaJsonLd({ path, meta, product: p }),
    };
  }),
  ...LEGAL_PAGES.map((k) => {
    const meta = PAGE_META[k];
    const crumb = CRUMB[k] || meta.title.split(' | ')[0];
    return {
      file: k + '.html',
      path: '/' + k,
      meta,
      body: heroHtml({ title: meta.title.split(' | ')[0], lead: meta.desc }),
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
const SPA_ROUTES = [
  { path: '/magazin', priority: '0.9', freq: 'weekly' },
  { path: '/politica-confidentialitate', priority: '0.3', freq: 'yearly' },
  { path: '/termeni-si-conditii', priority: '0.3', freq: 'yearly' },
  { path: '/politica-gdpr', priority: '0.3', freq: 'yearly' },
  { path: '/politica-cookies', priority: '0.3', freq: 'yearly' },
  { path: '/politica-livrare', priority: '0.3', freq: 'yearly' },
  { path: '/politica-anulare', priority: '0.3', freq: 'yearly' },
  { path: '/dreptul-de-retragere', priority: '0.3', freq: 'yearly' }
];

const today = new Date().toISOString().slice(0, 10);

const staticUrls = pages
  .filter((p) => !p.noindex)
  .map((p) => ({
    path: p.out === 'index.html' ? '/' : '/' + p.out.replace(/\.html$/, ''),
    priority: p.out === 'index.html' ? '1.0' : '0.8',
    freq: 'monthly'
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
    .map((id) => ({ path: '/magazin/' + id, priority: '0.7', freq: 'monthly' }));
}

const urls = [...staticUrls, ...SPA_ROUTES, ...productRoutes()];

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${HOST}${u.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
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
