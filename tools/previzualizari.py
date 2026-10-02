"""Previzualizările produselor din magazin.

Pentru fiecare produs generează cel mult 3 imagini WebP cu pagini din
document, în assets/previzualizari/<id>/, și scrie previews.js (lista
lor, citită de Shop.jsx). Rulare, după ce adaugi sau schimbi un produs:

    python tools/previzualizari.py

Sursele:
  - produsele gratuite: PDF-ul din assets (câmpul `file` din Shop.jsx);
  - produsele cu plată: fișierul Word cu același nume ca în Blob
    (api/_lib/products.js -> blobPath), luat din folderul local
    „Documents/INFORMS produse platite/...”. Nu citim nimic din Blob.
    Word -> PDF se face prin Microsoft Word (COM), fără alte programe.

Ce pagini: la procedurile tehnice sărim nota de informare (pagina 1) și
arătăm scopul, responsabilitățile și începutul tehnologiei de execuție;
la formulare, prima pagină. Produsele cu plată primesc filigran.
Numele fișierelor conțin un hash: /assets/ e cache imutabil un an.
"""
import hashlib, json, os, re, subprocess, sys, tempfile, unicodedata
from pathlib import Path
from urllib.parse import unquote

import fitz                       # PyMuPDF
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'previzualizari'
PAID_DIR = Path.home() / 'Documents' / 'INFORMS produse platite'
MAX_PAGES = 3
WIDTH = 1000
WATERMARK = 'PREVIZUALIZARE · INFORMS'
FONT = 'C:/Windows/Fonts/arialbd.ttf'

# Reperele căutate în PDF. Pagina 1 (nota de informare + scopul) nu se
# arată. Pentru responsabilități căutăm capul de tabel, nu titlul
# secțiunii, care poate cădea în josul paginii anterioare.
PTE_SECTIONS = ['2. DOCUMENTE DE REFERIN', 'RESPONSABILITATE SPECIFIC', '6.2. TEHNOLOGIA']
# Titluri de capitol folosite când PTE_SECTIONS nu dă destule pagini (alt document din serie).
PTE_SECTIONS_FALLBACK = ['2. DOCUMENTE DE REFERIN', '4. RESPONSABILIT', '6. DESCRIEREA LUCR', '7. CONTROLUL CALIT']


def fold(s):
    s = unicodedata.normalize('NFD', s)
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').upper()


def catalog():
    """Produsele vizibile din Shop.jsx, cu sursa fiecăruia."""
    js = ("const fs=require('fs'),vm=require('vm');"
          "const s=fs.readFileSync('Shop.jsx','utf8');"
          "const a=s.indexOf('const SHOP_PRODUCTS =');const st=s.indexOf('[',a);"
          "let d=0,q=null,i=st;for(;i<s.length;i++){const c=s[i];"
          "if(q){if(c==='\\\\')i++;else if(c===q)q=null;continue}"
          "if(c==='\\''||c==='\"'||c==='`')q=c;else if(c==='['||c==='{')d++;"
          "else if(c===']'||c==='}'){d--;if(!d)break}}"
          "const list=vm.runInNewContext('('+s.slice(st,i+1)+')');"
          "const {PRODUCTS}=require('./api/_lib/products.js');"
          "console.log(JSON.stringify(list.filter(p=>!p.hidden).map(p=>({id:p.id,file:p.file||null,"
          "blob:p.sku&&PRODUCTS[p.sku]?PRODUCTS[p.sku].blobPath:null}))))")
    out = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def word_to_pdf(docx, pdf):
    ps = (f"$w=New-Object -ComObject Word.Application;$w.Visible=$false;"
          f"try{{$d=$w.Documents.Open('{docx}',$false,$true);$d.ExportAsFixedFormat('{pdf}',17);$d.Close($false)}}"
          f"finally{{$w.Quit()}}")
    res = subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)
    # Word COM aruncă uneori RPC_E_DISCONNECTED după ce PDF-ul e deja scris; contează fișierul.
    if res.returncode != 0 and not (os.path.exists(pdf) and os.path.getsize(pdf) > 0):
        raise subprocess.CalledProcessError(res.returncode, 'word_to_pdf', res.stdout, res.stderr)


def find_paid_source(blob_path):
    name = Path(blob_path).name
    hits = list(PAID_DIR.rglob(name))
    return hits[0] if hits else None


def pick_pages(doc, paid):
    if not paid:
        return [0]
    texts = [fold(p.get_text()) for p in doc]
    pages = []
    for sections in (PTE_SECTIONS, PTE_SECTIONS_FALLBACK):
        if len(pages) >= MAX_PAGES:
            break
        for sec in sections:
            for i, t in enumerate(texts):
                if i > 0 and re.search(r'(^|\n)\s*' + re.escape(fold(sec)), t):
                    if i not in pages:
                        pages.append(i)
                    break
    if not pages:                                  # alt tip de document
        pages = [i for i in range(1, min(len(doc), 1 + MAX_PAGES))]
    return sorted(pages)[:MAX_PAGES]


def watermark(img):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    font = ImageFont.truetype(FONT, int(img.width * 0.055))
    tmp = Image.new('RGBA', (int(img.width * 1.4), int(img.width * 0.12)), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    box = d.textbbox((0, 0), WATERMARK, font=font)
    d.text(((tmp.width - (box[2] - box[0])) / 2, (tmp.height - (box[3] - box[1])) / 2 - box[1]),
           WATERMARK, font=font, fill=(12, 0, 50, 52))
    rot = tmp.rotate(33, expand=True, resample=Image.BICUBIC)
    for fy in (0.28, 0.72):
        layer.alpha_composite(rot, ((img.width - rot.width) // 2, int(img.height * fy - rot.height / 2)))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def render(pdf_path, product_id, paid):
    doc = fitz.open(pdf_path)
    total = len(doc)
    dest = OUT / product_id
    dest.mkdir(parents=True, exist_ok=True)
    for old in dest.glob('*.webp'):
        old.unlink()
    items = []
    for i in pick_pages(doc, paid):
        page = doc[i]
        pix = page.get_pixmap(matrix=fitz.Matrix(WIDTH / page.rect.width, WIDTH / page.rect.width), alpha=False)
        img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        if paid:
            img = watermark(img)
        tmp = dest / 'tmp.webp'
        img.save(tmp, 'WEBP', quality=72, method=6)
        h = hashlib.sha1(tmp.read_bytes()).hexdigest()[:8]
        final = dest / f'p{i + 1}-{h}.webp'
        tmp.replace(final)
        items.append({'src': final.relative_to(ROOT).as_posix(), 'page': i + 1, 'w': img.width, 'h': img.height})
    return {'total': total, 'pages': items}


def main():
    previews, missing = {}, []
    with tempfile.TemporaryDirectory() as tmpdir:
        for p in catalog():
            if p['file']:
                src, paid = ROOT / unquote(p['file']), False
            elif p['blob']:
                src, paid = find_paid_source(p['blob']), True
            else:
                continue
            if not src or not src.exists():
                missing.append(p['id'])
                continue
            pdf = src
            if src.suffix.lower() == '.docx':
                pdf = Path(tmpdir) / (p['id'] + '.pdf')
                word_to_pdf(str(src), str(pdf))
            previews[p['id']] = render(pdf, p['id'], paid)
            print(f"{p['id']}: pagini {[x['page'] for x in previews[p['id']]['pages']]} din {previews[p['id']]['total']}")

    body = json.dumps(previews, ensure_ascii=False, indent=1)
    (ROOT / 'previews.js').write_text(
        '/* GENERAT de tools/previzualizari.py. Nu edita aici. */\n'
        f'window.SHOP_PREVIEWS = {body};\n', encoding='utf-8')
    print(f'previews.js: {len(previews)} produse')
    if missing:
        print('FĂRĂ SURSĂ (sărite):', ', '.join(missing))
        sys.exit(1)


if __name__ == '__main__':
    main()
