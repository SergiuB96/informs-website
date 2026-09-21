/* ═══════════════════════════════════════════════════════════
   informs - build static

   Asamblează paginile din src/ în HTML static la rădăcină.
   Fără dependențe: rulezi `node build.mjs`.

   De ce un build și nu include-uri PHP sau injecție din JS:
   ieșirea rămâne HTML pur, deci merge pe orice găzduire, se
   indexează corect și funcționează cu JavaScript dezactivat.
   ═══════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');

/* CSS-ul comun, în ordinea în care trebuie încărcat. Paginile
   adaugă peste el ce le e propriu, prin cheia `css`. */
const BASE_CSS = ['base', 'chrome', 'components'];

/* Gazda canonică. Site-ul nu avea etichete canonical, deci /servicii
   și /servicii.html arătau ca două pagini distincte cu același text. */
const HOST = 'https://www.informs.ro';

const read = (...p) => readFileSync(join(...p), 'utf8');

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
  const scoped = (sel, decl) => {
    const parts = sel.split(',').map((s) => s.trim());
    const all = [];
    for (const r of roots) for (const p of parts) all.push(`${r} ${p}`);
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

  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${page.out}: substituții nerezolvate ${left.join(', ')}`);

  writeFileSync(join(ROOT, page.out), html, 'utf8');
  console.log(`  ${page.out.padEnd(16)} ${String(html.length).padStart(7)} bytes`);
  built++;
}

console.log(`\n${built} pagini construite din ${Object.keys(partials).length} partiale.`);

buildSpaChrome();

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

const urls = [...staticUrls, ...SPA_ROUTES];

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
  'Disallow: /api/\n\n' +
  `Sitemap: ${HOST}/sitemap.xml\n`;

writeFileSync(join(ROOT, 'robots.txt'), robots, 'utf8');

console.log(`sitemap.xml scris cu ${urls.length} adrese, robots.txt scris.`);
