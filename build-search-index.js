// Generează search-index.json (rădăcină) din datele Spețe, pentru căutarea
// din navbar. Rulează: `node build-search-index.js` (sau `npm run build:search`).
// Site-ul principal încarcă doar acest index compact (~2MB, gzip ~600KB),
// NU fișierele mari din spete/ (spete_anap.json 10MB).
const fs = require('fs');

const ANAP_ANS_LIMIT = 1800; // caractere din răspuns păstrate pentru citire inline
const CNSC_ANS_LIMIT = 2400;

const strip = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

function read(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const records = [];

// ── ANAP: biblioteca de spețe (active + arhivate) ──
try {
  const anap = read('spete/spete_anap.json');
  const pushAnap = (arr, archived) => {
    (arr || []).forEach((q) => {
      const t = strip(q.questionText);
      if (!t) return;
      records.push({
        s: 'anap',
        id: q.questionId,
        cod: q.questionCode || '',
        t,
        c: q._categoryName || '',
        tg: (q.questionTags || []).map((x) => x.tagName).filter(Boolean),
        a: strip(q.questionAnswer || q.questionAnswerHTML).slice(0, ANAP_ANS_LIMIT),
        ar: archived ? 1 : 0,
      });
    });
  };
  pushAnap(anap.questions_active, false);
  pushAnap(anap.questions_archived, true);
  console.log(`ANAP: ${records.length} spețe`);
} catch (e) {
  console.error('ANAP skip:', e.message);
}

// ── CNSC: decizii ──
try {
  const cnsc = read('spete/decizii_cnsc.json');
  let n = 0;
  (Array.isArray(cnsc) ? cnsc : []).forEach((d) => {
    const t = strip(d.obiect) || strip(d.categorie) || d.cod;
    records.push({
      s: 'cnsc',
      id: d.cod,
      nr: d.nr_decizie || '',
      data: d.data || '',
      t,
      c: d.categorie || '',
      ac: d.autoritate_contractanta || '',
      sol: strip(d.solutie),
      a: strip(d.continut_complet || d.motivare).slice(0, CNSC_ANS_LIMIT),
    });
    n++;
  });
  console.log(`CNSC: ${n} decizii`);
} catch (e) {
  console.error('CNSC skip:', e.message);
}

const out = { generat: new Date().toISOString().slice(0, 10), total: records.length, r: records };
const json = JSON.stringify(out);
fs.writeFileSync('search-index.json', json, 'utf8');
console.log(`search-index.json scris: ${records.length} înregistrări, ${(json.length / 1048576).toFixed(2)}MB`);
