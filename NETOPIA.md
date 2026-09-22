# NETOPIA Payments - punere în funcțiune

Integrare cu **Payment API v2** (JSON + API key + IPN semnat RSA). Nu confunda cu v1
(mobilPay: XML criptat, `env_key`/`data`/`cipher`). Tot ce găsești online și menționează
`env_key` sau `sandboxsecure.mobilpay.ro` este v1 și nu se aplică aici. Atenție: pagina
„Node.js SDK” de pe doc.netopia-payments.com documentează tot v1, deși e listată sub v2.

## Ce trebuie completat înainte de a merge live

### 1. Datele firmei

Editează **`Config.jsx`**, obiectul `COMPANY`. Câmpurile cu valoarea `«TODO»` nu se
afișează nicăieri pe site, tocmai ca să nu apară date de identificare false. Cât timp
rămân necompletate, NETOPIA **respinge** validarea punctului de vânzare, pentru că lipsesc
„datele de contact complete ale companiei”.

Completate deja, verificate în registrul ANAF la 15.09.2026:

```js
cui:     '44991231',        // fără prefix RO: societatea nu e înregistrată în scopuri de TVA
regCom:  'J26/1603/2021',
address: 'Bld. Pandurilor nr. 86, et. 3, ap. 11, Târgu Mureș, jud. Mureș, 540487',
```

Mai lipsește un singur câmp obligatoriu pentru NETOPIA:

```js
phone:   '+40 7xx xxx xxx',
```

Opționale, utile în Termeni și condiții: `shareCapital`, `iban`, `bank`.

După orice editare de `.jsx`: **`npm run build`**. Vercel servește `.js`-ul compilat, nu
sursa, și nu rulează niciun build pas.

### 2. Produsele

Prețurile trăiesc în două locuri și trebuie ținute sincronizate:

| Fișier | Rol |
|---|---|
| `Shop.jsx` → `SHOP_PRODUCTS` | afișare în magazin |
| `api/_lib/products.js` → `PRODUCTS` | **prețul folosit la plată** |

Serverul nu are încredere în prețul trimis de browser: îl citește după `sku` din
`products.js`. Dacă cele două diferă, clientul plătește prețul din `products.js`.

Cele trei produse cu preț adăugate acum sunt un punct de plecare. Înlocuiește titlurile,
descrierile și prețurile cu cele reale.

### 3. Fișierele livrate

Documentele plătite **nu** stau în repository și nu stau sub `assets/`, ca să nu poată fi
descărcate de cine ghicește URL-ul. Se încarcă în Vercel Blob privat, la căile din
`blobPath`:

```
produse/caiet-sarcini-produse.docx
produse/strategie-contractare.docx
produse/pachet-documentatie-servicii.zip
```

Creează un store Blob în proiectul Vercel; `BLOB_READ_WRITE_TOKEN` se injectează automat.

### 4. Variabile de mediu în Vercel

| Variabilă | De unde |
|---|---|
| `NETOPIA_API_KEY` | admin NETOPIA → Profile → Security. Cheia de sandbox nu merge pe live și invers. |
| `NETOPIA_POS_SIGNATURE` | `XXXX-XXXX-XXXX-XXXX-XXXX`, din punctul de vânzare |
| `NETOPIA_PUBLIC_KEY` | **opțional.** Cheia cu care NETOPIA semnează IPN-ul e deja în cod (`NETOPIA_IPN_PUBLIC_KEY` în `api/_lib/netopia.js`), aceeași pentru sandbox și live. Variabila e acceptată în plus, doar dacă NETOPIA rotește cheia. ⚠️ **Nu** pune aici certificatul din „Punct de vânzare → Setări securitate”: are 1024 de biți, semnătura IPN are 2048, deci orice notificare ar fi respinsă cu `E_VERIFICATION_FAILED_SIGNATURE` (s-a întâmplat la primul test, 21.09.2026). |
| `NETOPIA_LIVE` | `0` pentru sandbox, `1` pentru producție |
| `NETOPIA_BASE_URL` | opțional, suprascrie URL-ul dacă NETOPIA îți dă altul |
| `SITE_URL` | **`https://www.informs.ro`**, cu www. Apex-ul `informs.ro` face 307 către www, iar un webhook POST pe un URL care redirecționează este o sursă sigură de probleme. Din el se construiesc `notifyUrl` și `redirectUrl`. Nu se folosește `req.headers.host`, ca să nu fie posibilă injecția de host. |
| `ORDER_SECRET` | 32 de octeți aleatori: `openssl rand -hex 32` |
| `DOWNLOAD_SECRET` | alți 32 de octeți, diferiți de `ORDER_SECRET` |
| `BLOB_READ_WRITE_TOKEN` | injectat automat de Vercel |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | ⚠️ **NU sunt setate în proiect.** Vezi secțiunea de mai jos. |

## Cum funcționează

```
Magazin (Shop.jsx)
  └─ POST /api/netopia-start
       ├─ verifică cele două acorduri obligatorii
       ├─ ia prețul din api/_lib/products.js, nu din cererea clientului
       ├─ generează orderID semnat HMAC
       └─ POST {base}/payment/card/start  →  paymentURL
  └─ redirect către pagina securizată NETOPIA (3-D Secure)

NETOPIA
  ├─ POST /api/netopia-ipn      ← singura sursă de livrare
  │    ├─ verifică JWT RS512 din header-ul Verification-token
  │    ├─ POST {base}/operation/status  → status + sumă + email real
  │    ├─ marcaj de idempotență în Blob (IPN vine de două ori: PAID, apoi CONFIRMED)
  │    ├─ email cu link /api/download?t=<token semnat, 72h>
  │    └─ factură prin API-ul Oblio (nu poate bloca livrarea)
  └─ GET  /api/netopia-return?orderId=...  ← doar cosmetic
       └─ 303 → /comanda-finalizata?s=ok|pending|fail
```

Livrarea se face **exclusiv din IPN**. Pagina de întoarcere nu livrează nimic: este
singurul canal pe care îl poate falsifica un utilizator.

## Detalii care nu sunt evidente din documentație

1. **IPN-ul se semnează peste octeții bruți.** `sub` din JWT este
   `base64(sha512(raw_body))`, base64 standard, nu base64url. De aceea
   `api/netopia-ipn.js` are `export const config = { api: { bodyParser: false } }` — dacă
   Vercel parsează corpul, hash-ul nu mai corespunde și fiecare notificare e respinsă.
2. **Timpii din JWT sunt în milisecunde.** SDK-ul PHP oficial conține
   `JWT::$timestamp = time() * 1000`, ceea ce confirmă asta. O bibliotecă JWT obișnuită
   ar vedea `nbf` cu ~50.000 de ani în viitor și ar arunca. Verificăm semnătura manual cu
   `node:crypto` și ignorăm claim-urile de timp; protecția la replay vine din legarea
   `sub` de hash-ul corpului plus marcajul de idempotență.
3. **`orderID` este unic pentru totdeauna.** Refolosirea lui dă eroarea `56`, iar același
   ID cu alt preț dă `99`. Fiecare reîncercare generează un ID nou.
4. **`countryName` e obligatoriu** în schema `Address`, deși lipsește din tabelul din
   documentație și din pluginul oficial de WooCommerce. Îl trimitem.
5. **Răspunsul webhook-ului** trebuie să fie HTTP 200 cu exact
   `{"errorType":0,"errorCode":null,"errorMessage":""}`. Documentația OpenAPI spune
   altceva; SDK-urile oficiale, care rulează în producție, spun asta.
6. **Suma se trimite în unități majore** (`249` = 249 lei). Descrierea câmpului din
   `PaymentNotify` sugerează contrariul. **Testează întâi cu 0,10 RON în sandbox.**
7. **`instrument.type`**: folosim `"card"`, ca în aplicația exemplu oficială. Pluginul de
   WooCommerce trimite `"credit_card"`. Dacă `start` întoarce 400 pe acest câmp, încearcă
   varianta cealaltă.
8. **Cheia de verificare a IPN-ului nu e în contul tău.** Certificatul descărcabil din
   „Punct de vânzare” nu verifică semnătura. Cheia corectă e cea hardcodată în pluginul
   oficial [netopiapayments/woocommerce](https://github.com/netopiapayments/woocommerce),
   `v2/wc-netopiapayments-gateway.php`, câmpul `publicKeyStr`. Am verificat-o cu tokenul
   real al unei plăți din sandbox.
9. **Butonul „Notifică” din admin nu retrimite IPN-ul original.** Trimite
   `{"action":0,"amount":0,"id":"<ntpID>"}`, fără `orderID`, pe care webhook-ul îl ignoră.
   După o notificare respinsă, testul se reia cu o plată nouă.
11. **Butonul „Înapoi la magazin” din pagina de succes NETOPIA merge pe `cancelUrl`**, fără
   `orderId` (verificat în sandbox, 22.09.2026). `redirectUrl` se folosește doar după
   3-D Secure. De aceea `cancelUrl` nu înseamnă „plată eșuată”: magazinul ține orderID-ul
   în `sessionStorage`, iar „Stare comandă” îl verifică prin
   `/api/netopia-return?format=json`. Răspunsul „ok” vine întâi din marcajul de livrare
   scris de IPN, apoi din `/operation/status`.
10. **`X-Frame-Options: SAMEORIGIN`** din `vercel.json` nu deranjează: mergem pe redirect
   top-level către pagina găzduită NETOPIA, nu pe iframe.

## Carduri de test în sandbox

Titular `Test Test`, CVV `111`, expirare oricând în viitor.

| Card | Rezultat |
|---|---|
| `9900004810225098` | aprobat |
| `99110059532258` | aprobat |
| `9900541631437790` | card expirat (19) |
| `9900518572831942` | fonduri insuficiente (20) |
| `9900827979991500` | CVV greșit (21/22) |
| `9900005786662552` | verificare antifraudă (13) |
| `9900576270414197` | tranzacție nepermisă (34) |

Admin sandbox: https://sandbox.netopia-payments.com · Admin producție: https://admin.netopia-payments.com

## Ordinea recomandată

1. Completează `COMPANY` în `Config.jsx`, rulează `npm run build`, dă deploy.
2. Bifează lista de condiții obligatorii din contul NETOPIA și cere validarea.
3. Între timp, setează variabilele de sandbox și testează plata cu 0,10 RON.
4. Verifică în logurile Vercel că IPN-ul trece de verificarea semnăturii și că emailul
   de livrare ajunge.
5. Setează variabilele Oblio și verifică prima factură emisă automat, în special cota de TVA.
6. După aprobare, schimbă `NETOPIA_LIVE=1` și cele trei valori de producție
   (API key, POS signature, public key).

## ⚠️ Blocant: SMTP nu este configurat

Verificat cu `vercel env pull`: în proiect nu există `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`
sau `SMTP_PASS`, în niciun mediu. `api/contact.js` le citește direct din `process.env`,
deci **formularul de contact nu poate trimite niciun email în acest moment.** Commit-ul
`6f69637` a trecut formularul pe SMTP cPanel, dar variabilele nu au fost adăugate niciodată.

Pentru plăți asta este blocant: livrarea documentului se face prin același transport. Fără
SMTP, clientul plătește și nu primește nimic, iar notificarea de eroare către
`office@informs.ro` ar eșua și ea, pentru că folosește tot SMTP. Singura urmă ar rămâne în
logurile Vercel.

Adaugă cele patru variabile înainte de primul test de plată:

```
vercel env add SMTP_HOST production <gitbranch> --value mail.informs.ro --yes
vercel env add SMTP_PORT production <gitbranch> --value 465 --yes
vercel env add SMTP_USER production <gitbranch> --value office@informs.ro --yes
vercel env add SMTP_PASS production <gitbranch> --value '<parola>' --yes
```

Valorile exacte de host și port sunt în cPanel, la Email Accounts → Connect Devices.

## De rezolvat înainte de a pune chei de plată în proiect

`api/key.js` returnează `GROQ_API_KEY` în clar oricui o cere. Antetul CORS restricționează
doar JavaScript-ul din browser, nu și `curl`. Aceeași cheie este scrisă în clar și în
`spete/chat.php`. Șterge endpoint-ul și rotește cheia înainte de a adăuga secrete de plată
în același proiect.

## Facturare automată prin Oblio

### Atenție la direcție

Pagina [oblio.eu/integrari/netopia](https://www.oblio.eu/integrari/netopia) descrie fluxul
**invers** față de ce are informs.ro. Acolo, factura se emite prima în Oblio, primește un
buton „Plătește cu cardul", iar clientul plătește din factură. La noi plata se întâmplă
prima, în magazin, iar factura trebuie emisă **după** confirmarea plății.

Nu configura un punct de vânzare separat „Oblio" în NETOPIA: ai avea două puncte de
vânzare și un al doilea flux de plată, paralel cu magazinul. Ce trebuie folosit este
**API-ul Oblio**, apelat din webhook-ul nostru. Asta este implementat în
`api/_lib/oblio.js`.

### Cum funcționează

După ce plata e confirmată și documentul e livrat, `api/netopia-ipn.js` cere un token de
la Oblio și emite factura fiscală, cu `sendEmail: 1`, deci clientul o primește direct pe
email. Datele de firmă (denumire și CUI), care nu încap în `billing`-ul NETOPIA, călătoresc
prin `order.data` și se recuperează din răspunsul `/operation/status`.

**Facturarea nu poate bloca livrarea.** Clientul a plătit, deci primește documentul chiar
dacă Oblio e indisponibil. Un eșec la facturare trimite o notificare la `office@informs.ro`
cu toate datele necesare pentru emiterea manuală.

### Variabile de mediu

| Variabilă | De unde |
|---|---|
| `OBLIO_EMAIL` | emailul contului Oblio (este `client_id`) |
| `OBLIO_SECRET` | Setări cont → Date Cont (este `client_secret`) |
| `OBLIO_CIF` | CIF-ul firmei, `44991231` |
| `OBLIO_SERIES` | seria de facturi. Contul are o singură serie de tip Factura: **`MIL`**. Verifică oricând cu `GET /api/nomenclature/series?cif=44991231`. |
| `OBLIO_VAT_NAME` | opțional. Lăsat gol, se aplică setarea contului Oblio. Completează-l doar dacă Oblio respinge factura pe cota de TVA. |
| `OBLIO_SPV` | `1` ca să trimitem explicit în SPV după emitere |

Cât timp lipsesc `OBLIO_EMAIL`, `OBLIO_SECRET` sau `OBLIO_CIF`, modulul este inert:
plățile și livrarea merg normal, doar factura nu se emite automat.

În sandbox (`NETOPIA_LIVE` diferit de `1`) factura nu se emite niciodată, chiar dacă
variabilele Oblio sunt setate: o plată de test nu consumă un număr din seria `MIL`.
Prima factură automată apare la prima vânzare reală, după trecerea pe live.

### e-Factura / SPV

Cel mai simplu este să activezi „Trimite automat e-Factura în SPV" în preferințele contului
Oblio și să lași `OBLIO_SPV` nesetat. Dacă preferi controlul explicit, pune `OBLIO_SPV=1`
și apelăm noi `POST /api/docs/einvoice` după fiecare factură.

### Ce am verificat direct în cont

Interogând API-ul Oblio cu cheile primite:

- autentificarea funcționează, token valabil 3600 s;
- contul are o singură firmă, `44991231` MILBAC MANAGEMENT S.R.L., cu `vatPayer: 0`,
  deci neplătitoare de TVA, ceea ce confirmă și ANAF (`scpTVA: false`);
- singura serie de tip Factura este **`MIL`**, implicită, următorul număr `0021`.

Nu am emis nicio factură de test: ar fi consumat un număr real din seria fiscală.

### De verificat la prima factură reală

Trimitem `vatPercentage: 0` și lăsăm numele cotei pe seama contului, care este oricum
configurat ca neplătitor. Dacă prima factură iese cu o cotă greșită sau Oblio o respinge,
pune `OBLIO_VAT_NAME`. Cotele disponibile în cont sunt `Normala` (21), `Redusa` (11),
`Scutita` (0), `SFDD`, `SDD`, `TVA Inclus`, `Taxare inversa`.

## Limitări asumate (fără bază de date)

- Nu putem limita numărul de descărcări și nu putem revoca un link înainte de expirare.
  De aceea durata de viață e scurtă (72 de ore).
- Nu există istoric de comenzi în aplicație. El rămâne în panoul NETOPIA și pe email.
- Marcajul de idempotență din Blob face `head` apoi `put`, deci nu e atomic. Fereastra de
  cursă e de ordinul milisecundelor, iar cel mai rău caz e un email dublu.
- **e-Factura** se emite prin Oblio (vezi secțiunea de facturare). Trimiterea în SPV depinde de setarea contului Oblio sau de `OBLIO_SPV=1`.
