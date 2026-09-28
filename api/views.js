import crypto from 'node:crypto';
import { Redis } from '@upstash/redis';

/* Vizualizări unice pe produs.
 *
 * POST {id}      înregistrează o vizualizare (deschiderea produsului)
 * GET ?ids=a,b   întoarce {counts: {a: 128, b: null}}
 *
 * „Unic” = aceeași persoană, în aceeași zi, pe același produs. Nu
 * stocăm IP-ul și nu punem nimic în browser: din IP + browser + zi
 * calculăm o amprentă HMAC, iar HyperLogLog-ul din Redis păstrează
 * doar numărul aproximativ de amprente distincte (eroare ~0,8%).
 *
 * Sub VIEWS_MIN_SHOWN întoarcem null: un „3 vizualizări” pe un
 * magazin nou descurajează, deci cifra apare doar de la prag în sus. */

const VIEWS_MIN_SHOWN = 50;
const MAX_IDS = 60;
const ID_RE = /^[a-z0-9-]{1,80}$/;
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|axios|node-fetch/i;

let client = null;
function redis() {
  if (!client) {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
    client = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
  }
  return client;
}

const key = id => 'views:' + id;

/* Cheia HMAC vine din ORDER_SECRET, derivată cu o etichetă proprie, ca
   amprentele să nu poată fi recalculate de cineva care vede Redis-ul. */
function fingerprint(req) {
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ua = String(req.headers['user-agent'] || '');
  const day = new Date().toISOString().slice(0, 10);
  const secret = crypto.createHmac('sha256', process.env.ORDER_SECRET || 'informs').update('views').digest();
  return crypto.createHmac('sha256', secret).update(ip + '|' + ua + '|' + day).digest('hex').slice(0, 24);
}

async function record(req, res, db) {
  res.setHeader('Cache-Control', 'no-store');
  const id = String((req.body && req.body.id) || '');
  if (!ID_RE.test(id)) return res.status(400).json({ ok: false });
  if (BOT_RE.test(String(req.headers['user-agent'] || ''))) return res.status(204).end();

  await db.pfadd(key(id), fingerprint(req));
  return res.status(204).end();
}

async function counts(req, res, db) {
  const ids = String((req.query && req.query.ids) || '')
    .split(',').map(s => s.trim()).filter(s => ID_RE.test(s)).slice(0, MAX_IDS);
  if (!ids.length) return res.status(400).json({ counts: {} });

  const p = db.pipeline();
  ids.forEach(id => p.pfcount(key(id)));
  const values = await p.exec();

  const out = {};
  ids.forEach((id, i) => {
    const n = Number(values[i]) || 0;
    out[id] = n >= VIEWS_MIN_SHOWN ? n : null;
  });

  /* Cifrele nu trebuie să fie la secundă: 5 minute în CDN țin
     consumul de comenzi Redis departe de limita planului gratuit. */
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({ counts: out });
}

export default async function handler(req, res) {
  const db = redis();
  /* Fără Redis configurat, numărătoarea tace: magazinul merge normal. */
  if (!db) {
    res.setHeader('Cache-Control', 'no-store');
    return req.method === 'POST' ? res.status(204).end() : res.status(200).json({ counts: {} });
  }

  try {
    if (req.method === 'POST') return await record(req, res, db);
    if (req.method === 'GET') return await counts(req, res, db);
    return res.status(405).json({ ok: false });
  } catch (err) {
    console.error('views error', { method: req.method, message: err.message });
    res.setHeader('Cache-Control', 'no-store');
    return req.method === 'POST' ? res.status(204).end() : res.status(200).json({ counts: {} });
  }
}
