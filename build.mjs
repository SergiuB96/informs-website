/* ═══════════════════════════════════════════════════════════
   informs — build static

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

  let html = layout
    .replace('{{title}}', page.title)
    .replace('{{desc}}', page.desc)
    .replace('{{canonical}}', HOST + path)
    .replace('{{robots}}', robots)
    .replace('{{css}}', cssTags)
    .replace('{{body}}', body);

  // partialele se injectează după body, ca un {{>x}} din conținut
  // să fie tratat la fel ca unul din layout
  html = html.replace(/\{\{>(\w+)\}\}/g, (m, name) => {
    if (!(name in partials)) throw new Error(`Partial lipsă: ${name}`);
    return partials[name];
  });

  html = applyActive(html, page);
  html = cleanUrls(html);

  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${page.out}: substituții nerezolvate ${left.join(', ')}`);

  writeFileSync(join(ROOT, page.out), html, 'utf8');
  console.log(`  ${page.out.padEnd(16)} ${String(html.length).padStart(7)} bytes`);
  built++;
}

console.log(`\n${built} pagini construite din ${Object.keys(partials).length} partiale.`);

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
