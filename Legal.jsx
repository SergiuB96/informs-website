/* ══════════════════════════════════════════════════
   LEGAL - toate paginile de politici ale site-ului.
   ──────────────────────────────────────────────────
   Separate de Pages.jsx pentru că paginile legale sunt
   conținut, nu interfață: se modifică din alte motive,
   la alte intervale, și ar fi umflat Pages.jsx peste
   pragul rezonabil de mărime.

   Datele firmei vin exclusiv din COMPANY / COMMERCE
   (Config.jsx). Nu rescrie aici niciun CUI, telefon
   sau termen comercial.
══════════════════════════════════════════════════ */

const { useState } = React;

const S = LEGAL_STYLES;
const UPDATED = '15 septembrie 2026';

const ANPC_SAL = 'https://anpc.ro/ce-este-sal/';
const ANPC_REC = 'https://anpc.ro/';

/* ─── Cadru comun ───────────────────────────────── */
function LegalShell({ title, subtitle, onNav, children }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <section className="sec">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px 44px' }}>
            <p style={S.meta}>Ultima actualizare: {UPDATED}</p>
            {children}
            <div style={S.divider} />
            <button className="btn btn-outline" onClick={() => go('contact')}>Întrebări? Contactează-ne</button>
          </div>
        </div>
      </section>
    </>
  );
}

function Sec({ n, title, first, children }) {
  return (
    <>
      {!first && <div style={S.divider} />}
      <h2 style={S.h2}>{n}. {title}</h2>
      {children}
    </>
  );
}

/* Datele de identificare ale vânzătorului, dintr-o singură sursă. */
function CompanyBlock() {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px 22px', marginBottom: '14px' }}>
      {companyRows().map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', padding: '5px 0', fontSize: '0.95rem', lineHeight: 1.7, flexWrap: 'wrap' }}>
          <span style={{ minWidth: '170px', color: 'var(--text-2)', fontWeight: 600 }}>{r.label}</span>
          {r.href
            ? <a href={r.href} style={S.link}>{r.val}</a>
            : <span style={{ color: 'var(--text)' }}>{r.val}</span>}
        </div>
      ))}
    </div>
  );
}

/* Link intern care rămâne copiabil și deschizibil în tab nou. */
function L({ to, onNav, children }) {
  return (
    <a href={'/' + to} style={S.link} onClick={(e) => { e.preventDefault(); onNav(to); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
      {children}
    </a>
  );
}

function Ext({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={S.link}>{children}</a>;
}

/* ══════════════════════════════════════
   TERMENI ȘI CONDIȚII
══════════════════════════════════════ */
function TermsPage({ onNav }) {
  return (
    <LegalShell
      title="Termeni și condiții"
      subtitle="Condițiile contractuale de utilizare a platformei și de achiziție a produselor digitale."
      onNav={onNav}
    >
      <p style={S.p}>
        Vă rugăm să citiți cu atenție prezentul document înainte de a utiliza platforma <strong>{COMPANY.brand}</strong> ({COMPANY.website})
        sau de a plasa o comandă. Prin accesarea website-ului și prin finalizarea unei comenzi acceptați integral termenii de mai jos,
        care au valoare de contract la distanță încheiat între dumneavoastră și {COMPANY.name}.
      </p>

      <Sec n="1" title="Identificarea vânzătorului">
        <p style={S.p}>Produsele și serviciile prezentate pe {COMPANY.website} sunt comercializate de:</p>
        <CompanyBlock />
      </Sec>

      <Sec n="2" title="Rolul companiei în procesul de comercializare">
        <p style={S.p}>
          {COMPANY.name} acționează exclusiv în calitate de <strong>comerciant, respectiv vânzător direct</strong> al produselor digitale
          prezentate pe această platformă. Societatea este autorul, proprietarul sau licențiatul conținutului pe care îl vinde.
        </p>
        <p style={S.p}>
          {COMPANY.name} <strong>nu</strong> operează un marketplace, <strong>nu</strong> acționează ca intermediar, agent sau distribuitor
          pentru terți și <strong>nu</strong> facilitează vânzări între alți comercianți și consumatori. Toate comenzile se încheie direct cu
          societatea, care răspunde integral pentru produsele livrate.
        </p>
      </Sec>

      <Sec n="3" title="Entitatea care emite factura">
        <p style={S.p}>
          Factura pentru orice comandă plasată pe {COMPANY.website} este emisă de <strong>{COMPANY.name}</strong>, entitatea identificată
          la punctul 1. Factura se transmite electronic, la adresa de e-mail indicată în comandă, în cel mult {COMMERCE.invoiceHours} de ore
          de la confirmarea plății. Nicio altă entitate nu emite documente fiscale pentru vânzările de pe această platformă.
        </p>
      </Sec>

      <Sec n="4" title="Obiectul contractului">
        <p style={S.p}>
          {COMPANY.brand} comercializează produse digitale și oferă servicii de consultanță și documentare în domeniul achizițiilor publice
          și al serviciilor de utilități publice:
        </p>
        <ul style={S.ul}>
          <li>Modele de documente și formulare în format Word, Excel și PDF completabil</li>
          <li>Pachete complete de documentație de atribuire</li>
          <li>Instrumente de calcul și de lucru specializate</li>
          <li>Documentații personalizate și consultanță, contractate separat</li>
          <li>Materiale gratuite de informare</li>
        </ul>
        <p style={S.p}>
          Fiecare produs are, pe pagina sa din magazin, o descriere completă a conținutului, lista fișierelor incluse și formatul de livrare.
        </p>
      </Sec>

      <Sec n="5" title="Prețuri și monedă">
        <p style={S.p}>
          Toate prețurile afișate pe site sunt exprimate în <strong>lei românești ({COMMERCE.currency})</strong> și reprezintă
          <strong> prețul final</strong> datorat de cumpărător. {COMPANY.name} este societate <strong>neplătitoare de TVA</strong>,
          prin urmare prețurile nu conțin TVA și nu li se adaugă TVA la plată.
        </p>
        <p style={S.p}>
          Nu se percep costuri suplimentare de livrare, produsele fiind livrate exclusiv electronic. Prețul valabil este cel afișat în
          momentul plasării comenzii. Societatea își rezervă dreptul de a modifica prețurile, modificările neafectând comenzile deja confirmate.
        </p>
      </Sec>

      <Sec n="6" title="Modalități de plată">
        <p style={S.p}>Plata se poate efectua prin:</p>
        <ul style={S.ul}>
          {COMMERCE.paymentMethods.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <p style={S.p}>
          Plățile cu cardul sunt procesate de <Ext href="https://netopia-payments.com/">NETOPIA Payments</Ext>, procesator autorizat de plăți.
          Datele cardului se introduc direct în pagina securizată a procesatorului și <strong>nu sunt transmise, vizualizate sau stocate
          de {COMPANY.name}</strong>. Tranzacțiile sunt protejate prin criptare și autentificare 3-D Secure.
        </p>
      </Sec>

      <Sec n="7" title="Plasarea și confirmarea comenzii">
        <p style={S.p}>
          Comanda se plasează din magazinul online, selectând produsul dorit și completând datele de facturare. Contractul se consideră
          încheiat în momentul în care plata este confirmată de procesator, moment în care primiți pe e-mail confirmarea comenzii.
        </p>
        <p style={S.p}>
          Dacă plata este refuzată sau nu poate fi confirmată, comanda nu produce efecte juridice și nu se emite factură.
        </p>
      </Sec>

      <Sec n="8" title="Livrare">
        <p style={S.p}>
          Livrarea se face exclusiv electronic, prin e-mail, imediat după confirmarea plății. Condițiile complete, termenele și procedura
          în caz de nelivrare sunt descrise în <L to="politica-livrare" onNav={onNav}>Politica de livrare</L>.
        </p>
      </Sec>

      <Sec n="9" title="Dreptul de retragere, anulare și rambursare">
        <p style={S.p}>
          În calitate de consumator beneficiați, ca regulă, de un drept de retragere de {COMMERCE.withdrawalDays} zile, exercitabil online,
          fără justificare și fără penalități. Pentru conținutul digital livrat imediat există însă o excepție legală, pe care o acceptați
          expres la momentul comenzii, printr-o bifă separată.
        </p>
        <p style={S.p}>
          Detaliile, excepția aplicabilă și formularul online se află în <L to="dreptul-de-retragere" onNav={onNav}>Dreptul de retragere</L>,
          iar condițiile de anulare și de rambursare în <L to="politica-anulare" onNav={onNav}>Politica de anulare și retur</L>.
        </p>
      </Sec>

      <Sec n="10" title="Licența de utilizare a produselor achiziționate">
        <p style={S.p}>
          Prin achiziție dobândiți un drept de utilizare neexclusiv, netransferabil și nelimitat în timp asupra documentelor cumpărate,
          în activitatea proprie a persoanei sau a entității care apare pe factură.
        </p>
        <p style={S.p}>
          Activitatea proprie include completarea și adaptarea documentelor, publicarea lor în SEAP/SICAP sau pe alte platforme de
          achiziții, ca parte a unei proceduri a cumpărătorului, și transmiterea lor către autorități contractante, ofertanți, operatori
          economici sau organe de control, în legătură cu o procedură, o ofertă sau un contract al cumpărătorului.
        </p>
        <p style={S.p}>Nu sunt permise, fără acordul scris prealabil al {COMPANY.name}:</p>
        <ul style={S.ul}>
          <li>Revânzarea, închirierea sau sublicențierea documentelor, în forma originală sau modificată</li>
          <li>Distribuirea modelelor ca atare, necompletate, în afara unei proceduri, oferte sau unui contract propriu, inclusiv pe alte
            platforme sau în grupuri deschise</li>
          <li>Utilizarea lor pentru a crea produse concurente destinate comercializării</li>
        </ul>
      </Sec>

      <Sec n="11" title="Obligațiile utilizatorului">
        <ul style={S.ul}>
          <li>Să furnizeze date corecte și complete la plasarea comenzii, inclusiv datele de facturare</li>
          <li>Să nu utilizeze website-ul în scopuri ilegale sau frauduloase</li>
          <li>Să nu încerce accesarea, modificarea sau deteriorarea sistemelor informatice ale {COMPANY.brand}</li>
          <li>Să respecte condițiile de licență de la punctul 10</li>
        </ul>
      </Sec>

      <Sec n="12" title="Proprietate intelectuală">
        <p style={S.p}>
          Întregul conținut al website-ului, respectiv texte, grafică, logo-uri, instrumente, modele și structuri de documente, este
          proprietatea exclusivă a {COMPANY.name} sau este utilizat în baza unor licențe valabile, fiind protejat de legislația română și
          internațională privind drepturile de autor. Vizualizarea conținutului în scop personal este permisă; orice altă utilizare necesită
          acord scris.
        </p>
      </Sec>

      <Sec n="13" title="Limitarea răspunderii">
        <p style={S.p}>
          Depunem toate eforturile pentru ca documentele comercializate să fie conforme legislației în vigoare la data publicării. Documentele
          rămân însă instrumente de lucru, nu consultanță juridică pentru o situație concretă, iar responsabilitatea adaptării lor la speța
          proprie revine utilizatorului. Nu răspundem pentru:
        </p>
        <ul style={S.ul}>
          <li>Decizii luate exclusiv pe baza materialelor, fără verificare proprie sau consultanță contractată</li>
          <li>Pierderi indirecte, incidentale sau consecutive rezultate din utilizarea platformei</li>
          <li>Întreruperi temporare de acces cauzate de motive tehnice sau de forță majoră</li>
        </ul>
      </Sec>

      <Sec n="14" title="Protecția datelor cu caracter personal">
        <p style={S.p}>
          Prelucrarea datelor este guvernată de <L to="politica-confidentialitate" onNav={onNav}>Politica de confidențialitate</L> și
          de <L to="politica-gdpr" onNav={onNav}>Politica GDPR</L>, iar utilizarea cookie-urilor
          de <L to="politica-cookies" onNav={onNav}>Politica de cookie-uri</L>. Toate fac parte integrantă din prezentele condiții.
        </p>
      </Sec>

      <Sec n="15" title="Reclamații și soluționarea litigiilor">
        <p style={S.p}>
          Orice reclamație poate fi transmisă la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>. Răspundem în cel mult
          30 de zile calendaristice de la primire.
        </p>
        <p style={S.p}>În calitate de consumator vă puteți adresa și:</p>
        <ul style={S.ul}>
          <li><Ext href={ANPC_REC}>Autorității Naționale pentru Protecția Consumatorilor (ANPC)</Ext></li>
          <li><Ext href={ANPC_SAL}>Structurii de Soluționare Alternativă a Litigiilor (SAL) din cadrul ANPC</Ext></li>
        </ul>
        <p style={S.p}>
          Prezentele condiții sunt guvernate de legislația română. Litigiile nesoluționate pe cale amiabilă sunt de competența instanțelor
          judecătorești din România.
        </p>
      </Sec>

      <Sec n="16" title="Modificarea termenilor">
        <p style={S.p}>
          {COMPANY.name} își rezervă dreptul de a modifica prezentele condiții. Modificările intră în vigoare la data publicării pe website
          și nu afectează comenzile deja confirmate, cărora li se aplică versiunea în vigoare la momentul plasării.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   POLITICA DE CONFIDENȚIALITATE
══════════════════════════════════════ */
function PrivacyPage({ onNav }) {
  return (
    <LegalShell
      title="Politica de confidențialitate"
      subtitle="Informații privind prelucrarea datelor cu caracter personal."
      onNav={onNav}
    >
      <p style={S.p}>
        {COMPANY.name}, operator al platformei <strong>{COMPANY.brand}</strong> ({COMPANY.website}), se angajează să protejeze
        confidențialitatea și securitatea datelor cu caracter personal ale utilizatorilor săi. Prezenta politică descrie ce date colectăm,
        în ce scop le utilizăm și care sunt drepturile dumneavoastră, în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și cu Legea
        nr. 190/2018.
      </p>

      <Sec n="1" title="Operatorul de date">
        <CompanyBlock />
      </Sec>

      <Sec n="2" title="Datele pe care le colectăm">
        <p style={S.p}>Colectăm date cu caracter personal atunci când ni le furnizați voluntar:</p>
        <ul style={S.ul}>
          <li><strong>Prin formularul de contact</strong> - nume și prenume, adresă de e-mail, telefon (opțional), subiect și mesaj</li>
          <li><strong>La descărcarea materialelor gratuite</strong> - nicio dată obligatorie; adresa de e-mail doar dacă bifați, separat,
            abonarea la noutăți</li>
          <li><strong>La plasarea unei comenzi</strong> - nume și prenume sau denumirea firmei, adresă de e-mail, telefon, adresă de facturare
            și, pentru persoane juridice, CUI</li>
        </ul>
        <p style={S.p}>
          Serverul nostru web înregistrează automat și date tehnice (adresă IP, tip de browser, pagina accesată, data și ora accesului),
          în scopuri de securitate și de analiză statistică agregată.
        </p>
        <p style={S.p}>
          <strong>Nu colectăm și nu avem acces la datele cardului dumneavoastră.</strong> Acestea sunt introduse direct în pagina securizată
          a procesatorului de plăți.
        </p>
      </Sec>

      <Sec n="3" title="Scopurile și temeiurile juridice ale prelucrării">
        <ul style={S.ul}>
          <li><strong>Procesarea comenzilor și livrarea produselor</strong> - executarea contractului (art. 6 alin. 1 lit. b GDPR)</li>
          <li><strong>Răspuns la solicitări</strong> - executarea unui contract sau măsuri precontractuale (art. 6 alin. 1 lit. b GDPR)</li>
          <li><strong>Facturare, contabilitate și raportare fiscală</strong> - obligație legală (art. 6 alin. 1 lit. c GDPR)</li>
          <li><strong>Comunicări comerciale</strong> - consimțământul dumneavoastră explicit (art. 6 alin. 1 lit. a GDPR), retractabil oricând</li>
          <li><strong>Prevenirea fraudei și securitatea sistemelor</strong> - interesul legitim al operatorului (art. 6 alin. 1 lit. f GDPR)</li>
        </ul>
      </Sec>

      <Sec n="4" title="Durata stocării datelor">
        <p style={S.p}>
          Datele transmise prin formularul de contact se păstrează pe durata necesară soluționării solicitării, iar ulterior maximum
          <strong> 3 ani</strong> în scopuri de evidență internă. Documentele contabile, inclusiv facturile, se păstrează
          <strong> 10 ani</strong>, conform legislației fiscale. Datele pentru care v-ați retras consimțământul se șterg în termen de 30 de zile.
        </p>
      </Sec>

      <Sec n="5" title="Destinatarii datelor">
        <p style={S.p}>Datele dumneavoastră nu sunt vândute și nu sunt cedate terților în scopuri de marketing. Le divulgăm exclusiv:</p>
        <ul style={S.ul}>
          <li><strong>NETOPIA Payments</strong>, procesator de plăți, pentru efectuarea tranzacțiilor cu cardul</li>
          <li>Prestatorilor de servicii IT (găzduire, e-mail, livrare newsletter), care acționează ca <strong>persoane împuternicite</strong> și
            sunt obligați contractual să respecte GDPR</li>
          <li>Contabilului și autorităților fiscale, în limitele obligațiilor legale</li>
          <li>Autorităților publice, atunci când legea o impune</li>
        </ul>
        <p style={S.p}>Nu transferăm date în afara Spațiului Economic European fără garanții adecvate.</p>
        <p style={S.p}>
          Detalii suplimentare privind prelucrarea în context comercial se găsesc în <L to="politica-gdpr" onNav={onNav}>Politica GDPR</L>.
        </p>
      </Sec>

      <Sec n="6" title="Cookie-uri și tehnologii similare">
        <p style={S.p}>
          Website-ul utilizează cookie-uri strict necesare pentru funcționare și, doar cu acordul dumneavoastră, cookie-uri de analiză.
          Detaliile complete se află în <L to="politica-cookies" onNav={onNav}>Politica de cookie-uri</L>.
        </p>
      </Sec>

      <Sec n="7" title="Drepturile dumneavoastră">
        <p style={S.p}>În conformitate cu GDPR, beneficiați de următoarele drepturi:</p>
        <ul style={S.ul}>
          <li><strong>Dreptul de acces</strong> - confirmarea prelucrării și o copie a datelor</li>
          <li><strong>Dreptul la rectificare</strong> - corectarea datelor inexacte sau completarea celor incomplete</li>
          <li><strong>Dreptul la ștergere</strong> - ștergerea datelor atunci când nu mai sunt necesare</li>
          <li><strong>Dreptul la restricționarea prelucrării</strong> - în situațiile prevăzute de lege</li>
          <li><strong>Dreptul la portabilitate</strong> - primirea datelor într-un format structurat și transferul lor</li>
          <li><strong>Dreptul la opoziție</strong> - față de prelucrarea bazată pe interesul legitim</li>
          <li><strong>Dreptul de a retrage consimțământul</strong> - oricând, fără a afecta legalitatea prelucrării anterioare</li>
        </ul>
        <p style={S.p}>
          Pentru exercitarea oricărui drept, trimiteți o cerere la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>.
          Răspundem în cel mult <strong>30 de zile calendaristice</strong>.
        </p>
      </Sec>

      <Sec n="8" title="Dreptul de a depune o plângere">
        <p style={S.p}>
          Dacă apreciați că drepturile dumneavoastră au fost încălcate, puteți depune o plângere la <strong>Autoritatea Națională de
          Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</strong>, Bd. G-ral Gheorghe Magheru 28-30, sector 1, București,
          <Ext href="https://www.dataprotection.ro"> www.dataprotection.ro</Ext>.
        </p>
      </Sec>

      <Sec n="9" title="Securitatea datelor">
        <p style={S.p}>
          Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele împotriva accesului neautorizat, divulgării,
          alterării sau distrugerii, inclusiv criptarea transmisiilor prin HTTPS, restricționarea accesului la sistemele de procesare și
          livrarea documentelor achiziționate prin linkuri semnate, cu durată de valabilitate limitată.
        </p>
      </Sec>

      <Sec n="10" title="Modificări ale politicii">
        <p style={S.p}>
          Ne rezervăm dreptul de a actualiza prezenta politică pentru a reflecta modificările legislative sau operaționale. Versiunea
          actualizată se publică pe această pagină, împreună cu data revizuirii.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   POLITICA GDPR
══════════════════════════════════════ */
function GdprPage({ onNav }) {
  return (
    <LegalShell
      title="Politica GDPR"
      subtitle="Prelucrarea datelor în contextul comenzilor, plăților și facturării."
      onNav={onNav}
    >
      <p style={S.p}>
        Prezentul document completează <L to="politica-confidentialitate" onNav={onNav}>Politica de confidențialitate</L> și detaliază
        modul în care {COMPANY.name} prelucrează datele cu caracter personal atunci când cumpărați un produs digital de pe {COMPANY.website}.
      </p>

      <Sec n="1" title="Operator și date de contact">
        <CompanyBlock />
        <p style={S.p}>
          Societatea nu are obligația legală de a numi un responsabil cu protecția datelor. Solicitările privind datele personale se
          transmit la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>.
        </p>
      </Sec>

      <Sec n="2" title="Categoriile de date prelucrate la o comandă">
        <ul style={S.ul}>
          <li><strong>Date de identificare</strong> - nume și prenume sau denumirea firmei și CUI</li>
          <li><strong>Date de contact</strong> - adresă de e-mail, telefon</li>
          <li><strong>Date de facturare</strong> - adresă, localitate, județ, cod poștal</li>
          <li><strong>Date despre tranzacție</strong> - produsul comandat, suma, moneda, data, identificatorul comenzii și statusul plății</li>
          <li><strong>Date tehnice</strong> - adresa IP și user-agent, transmise procesatorului pentru analiza antifraudă</li>
        </ul>
        <p style={S.p}>
          <strong>Nu prelucrăm date de card.</strong> Numărul cardului, data expirării și codul CVV sunt introduse exclusiv în pagina
          securizată a procesatorului de plăți și nu ajung niciodată pe serverele noastre.
        </p>
      </Sec>

      <Sec n="3" title="Temeiurile juridice">
        <ul style={S.ul}>
          <li><strong>Executarea contractului</strong> (art. 6 alin. 1 lit. b GDPR) - procesarea comenzii, livrarea documentului, asistența
            post-vânzare</li>
          <li><strong>Obligația legală</strong> (art. 6 alin. 1 lit. c GDPR) - emiterea facturii, evidența contabilă, raportarea fiscală</li>
          <li><strong>Interesul legitim</strong> (art. 6 alin. 1 lit. f GDPR) - prevenirea fraudei la plată și securitatea platformei</li>
          <li><strong>Consimțământul</strong> (art. 6 alin. 1 lit. a GDPR) - comunicările comerciale și cookie-urile de analiză</li>
        </ul>
      </Sec>

      <Sec n="4" title="Persoane împuternicite și destinatari">
        <ul style={S.ul}>
          <li><strong>NETOPIA Payments</strong> - procesarea plăților cu cardul și analiza antifraudă</li>
          <li><strong>Furnizorul de găzduire</strong> - stocarea și livrarea site-ului și a funcțiilor sale</li>
          <li><strong>Furnizorul de e-mail</strong> - transmiterea confirmărilor de comandă și a linkurilor de descărcare</li>
          <li><strong>Furnizorul de newsletter</strong> - doar pentru persoanele care și-au exprimat consimțământul</li>
          <li><strong>Contabilul societății</strong> și autoritățile fiscale, în limita obligațiilor legale</li>
        </ul>
        <p style={S.p}>
          Fiecare împuternicit prelucrează datele exclusiv pe baza instrucțiunilor noastre și în temeiul unui acord de prelucrare conform
          art. 28 GDPR.
        </p>
      </Sec>

      <Sec n="5" title="Durata păstrării">
        <ul style={S.ul}>
          <li><strong>Facturi și documente contabile</strong> - 10 ani, termen impus de legislația fiscală</li>
          <li><strong>Date de comandă și corespondență aferentă</strong> - 3 ani de la finalizarea comenzii</li>
          <li><strong>Linkuri de descărcare</strong> - expiră automat, la scurt timp după livrare</li>
          <li><strong>Adrese de e-mail pentru newsletter</strong> - până la retragerea consimțământului</li>
        </ul>
      </Sec>

      <Sec n="6" title="Decizii automate și profilare">
        <p style={S.p}>
          Nu luăm decizii automate cu efecte juridice asupra dumneavoastră. Procesatorul de plăți poate aplica reguli antifraudă automate la
          autorizarea tranzacției; în cazul unui refuz, puteți relua plata sau alege transferul bancar.
        </p>
      </Sec>

      <Sec n="7" title="Drepturile dumneavoastră">
        <p style={S.p}>
          Drepturile de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și retragere a consimțământului sunt descrise
          pe larg în <L to="politica-confidentialitate" onNav={onNav}>Politica de confidențialitate</L>, punctul 7, și se exercită prin cerere
          la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>.
        </p>
        <p style={S.p}>
          Dreptul la ștergere nu se aplică datelor pe care legea ne obligă să le păstrăm, în special celor din documentele contabile,
          pe durata termenului legal de arhivare.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   POLITICA DE LIVRARE
══════════════════════════════════════ */
function DeliveryPage({ onNav }) {
  return (
    <LegalShell
      title="Politica de livrare"
      subtitle="Cum și când primești documentele comandate."
      onNav={onNav}
    >
      <p style={S.p}>
        Toate produsele comercializate pe {COMPANY.website} sunt <strong>produse digitale</strong>. Nu există livrare fizică, transport sau
        curierat, iar livrarea se face exclusiv electronic.
      </p>

      <Sec n="1" title="Modalitatea de livrare">
        <p style={S.p}>
          După confirmarea plății, la adresa de e-mail indicată în comandă primiți un mesaj care conține confirmarea comenzii și un
          <strong> link personal de descărcare</strong>. Linkul este unic, este generat pentru comanda dumneavoastră și nu poate fi ghicit
          sau accesat de altcineva.
        </p>
      </Sec>

      <Sec n="2" title="Termenul de livrare">
        <ul style={S.ul}>
          <li><strong>Plată cu cardul</strong> - livrare automată, imediat după confirmarea plății de către procesator, în mod obișnuit în
            câteva minute</li>
          <li><strong>Transfer bancar</strong> - livrare în cel mult {COMMERCE.deliveryMaxHours} de ore de la confirmarea încasării în contul
            societății, în zilele lucrătoare</li>
        </ul>
      </Sec>

      <Sec n="3" title="Costuri de livrare">
        <p style={S.p}>
          Livrarea este <strong>gratuită</strong>. Prețul afișat în magazin este singura sumă datorată.
        </p>
      </Sec>

      <Sec n="4" title="Valabilitatea linkului de descărcare">
        <p style={S.p}>
          Din motive de securitate, linkul de descărcare are o durată de valabilitate limitată. Vă recomandăm să descărcați și să salvați
          documentele imediat ce primiți e-mailul. Dacă linkul a expirat, ne scrieți
          la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>, menționând numărul comenzii, și primiți unul nou,
          fără costuri.
        </p>
      </Sec>

      <Sec n="5" title="Dacă nu primești e-mailul">
        <p style={S.p}>Dacă în 30 de minute de la confirmarea plății nu ai primit e-mailul:</p>
        <ul style={S.ul}>
          <li>Verifică folderul Spam sau Promoții din căsuța de e-mail</li>
          <li>Verifică dacă adresa introdusă la comandă este scrisă corect</li>
          <li>Scrie-ne la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a> cu numărul comenzii; retrimitem documentul
            în cel mult o zi lucrătoare</li>
        </ul>
      </Sec>

      <Sec n="6" title="Factura">
        <p style={S.p}>
          Factura se emite de {COMPANY.name} și se transmite electronic, la aceeași adresă de e-mail, în cel mult {COMMERCE.invoiceHours} de ore
          de la confirmarea plății.
        </p>
      </Sec>

      <Sec n="7" title="Cerințe tehnice">
        <p style={S.p}>
          Documentele sunt livrate în formatele indicate pe pagina fiecărui produs. Pentru deschiderea lor sunt necesare aplicații uzuale:
          Microsoft Word sau un editor compatibil pentru fișierele .docx, Microsoft Excel sau un editor compatibil pentru .xlsx și Adobe
          Acrobat Reader pentru formularele PDF completabile. Formularele PDF inteligente își păstrează toate funcțiile doar în Adobe Acrobat
          Reader.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   POLITICA DE ANULARE ȘI RETUR
══════════════════════════════════════ */
function CancellationPage({ onNav }) {
  return (
    <LegalShell
      title="Politica de anulare și retur"
      subtitle="Cum anulezi o comandă și în ce condiții primești banii înapoi."
      onNav={onNav}
    >
      <p style={S.p}>
        Prezenta politică se aplică tuturor comenzilor plasate pe {COMPANY.website} și se completează
        cu <L to="dreptul-de-retragere" onNav={onNav}>Dreptul de retragere</L>.
      </p>

      <Sec n="1" title="Anularea comenzii înainte de livrare">
        <p style={S.p}>
          Poți anula o comandă oricând înainte de livrarea documentului, fără nicio justificare și fără costuri. Trimite un e-mail
          la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a> cu numărul comenzii și mențiunea „anulare comandă”.
          Dacă plata a fost deja procesată, suma se restituie integral.
        </p>
      </Sec>

      <Sec n="2" title="Anularea după livrare">
        <p style={S.p}>
          Documentele digitale livrate nu pot fi returnate în sens material. Dacă ai acceptat expres livrarea imediată și ai început
          descărcarea documentului, dreptul de retragere nu mai poate fi exercitat, conform excepției legale explicate
          în <L to="dreptul-de-retragere" onNav={onNav}>Dreptul de retragere</L>.
        </p>
        <p style={S.p}>
          Acest lucru nu îți afectează drepturile în cazul unui produs neconform, tratat la punctul 3.
        </p>
      </Sec>

      <Sec n="3" title="Produs neconform, defect sau greșit livrat">
        <p style={S.p}>Ai dreptul la remediere sau la rambursare integrală dacă:</p>
        <ul style={S.ul}>
          <li>Ai primit un alt document decât cel comandat</li>
          <li>Fișierul este corupt și nu poate fi deschis, iar problema nu poate fi remediată</li>
          <li>Conținutul livrat nu corespunde descrierii publicate pe pagina produsului</li>
        </ul>
        <p style={S.p}>
          Ne scrii la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a> cu numărul comenzii și descrierea problemei.
          Dacă ești consumator, răspundem pentru lipsa de conformitate care se manifestă în termen de doi ani de la livrare, conform
          OUG nr. 141/2021. Încercăm întâi aducerea în conformitate, prin retrimiterea sau corectarea documentului. Dacă aceasta nu este
          posibilă sau nu o facem într-un termen rezonabil, poți alege o reducere proporțională a prețului sau rambursarea integrală.
        </p>
      </Sec>

      <Sec n="4" title="Modalitatea și termenul de rambursare">
        <p style={S.p}>
          Rambursarea se face folosind <strong>aceeași modalitate de plată</strong> utilizată la comandă, în termen de cel
          mult <strong>{COMMERCE.refundDays} zile</strong> de la data la care am acceptat cererea. Nu percepem comisioane pentru rambursare.
        </p>
        <p style={S.p}>
          Pentru plățile cu cardul, suma este returnată în contul cardului folosit la plată. Intervalul în care banii apar efectiv în cont
          depinde de banca emitentă și poate fi de câteva zile lucrătoare după procesarea rambursării.
        </p>
      </Sec>

      <Sec n="5" title="Comenzi anulate de vânzător">
        <p style={S.p}>
          {COMPANY.name} poate anula o comandă în cazul unei erori evidente de preț, al suspiciunii întemeiate de fraudă sau al
          imposibilității de a livra produsul. În aceste situații te anunțăm prin e-mail și rambursăm integral suma încasată, în același
          termen de {COMMERCE.refundDays} zile.
        </p>
      </Sec>

      <Sec n="6" title="Reclamații">
        <p style={S.p}>
          Dacă nu ești mulțumit de soluție, te poți adresa <Ext href={ANPC_REC}>ANPC</Ext> sau structurii
          de <Ext href={ANPC_SAL}>Soluționare Alternativă a Litigiilor</Ext>.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   DREPTUL DE RETRAGERE + FORMULAR ONLINE
══════════════════════════════════════ */
function WithdrawalForm() {
  const [form, setForm] = useState({ nume: '', email: '', telefon: '', comanda: '', produs: '', motiv: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nume.trim() || !form.email.trim() || !form.comanda.trim()) {
      setError('Completează numele, adresa de email și numărul comenzii.');
      return;
    }
    setError('');
    setLoading(true);
    const mesaj =
      'Prin prezenta notific retragerea mea din contractul de vânzare încheiat la distanță.\n\n' +
      'Număr comandă: ' + form.comanda + '\n' +
      'Produs: ' + (form.produs || '(nespecificat)') + '\n' +
      'Nume consumator: ' + form.nume + '\n' +
      'Email: ' + form.email + '\n' +
      'Telefon: ' + (form.telefon || '(nespecificat)') + '\n' +
      'Motiv (opțional): ' + (form.motiv || '-') + '\n\n' +
      'Data cererii: ' + new Date().toLocaleDateString('ro-RO');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume: form.nume,
          email: form.email,
          telefon: form.telefon,
          subiect: 'Cerere de retragere - comanda ' + form.comanda,
          mesaj,
          tip: 'retragere',
          comanda: form.comanda,
        }),
      });
      const json = await res.json();
      if (json.ok) setSent(true);
      else setError('Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne direct la ' + COMPANY.email + '.');
    } catch {
      setError('Eroare de rețea. Încearcă din nou sau scrie-ne direct la ' + COMPANY.email + '.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ padding: '32px 28px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px' }}>
        <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '1.05rem', marginBottom: '8px' }}>Cerere înregistrată</div>
        <p style={{ ...S.p, marginBottom: 0 }}>
          Am primit cererea ta de retragere. Îți confirmăm primirea pe email și îți comunicăm soluția în cel mult 14 zile.
        </p>
      </div>
    );
  }

  const field = { padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '6px', fontSize: '15px', fontFamily: 'var(--font)', color: 'var(--text)', background: '#fff', outline: 'none', width: '100%' };
  const label = { fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '5px', display: 'block' };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '26px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px' }}>
      <div>
        <label style={label}>Nume și prenume *</label>
        <input type="text" style={field} value={form.nume} onChange={set('nume')} placeholder="Ion Popescu" />
      </div>
      <div>
        <label style={label}>Adresă de email folosită la comandă *</label>
        <input type="email" style={field} value={form.email} onChange={set('email')} placeholder="ion@exemplu.ro" />
      </div>
      <div>
        <label style={label}>Număr comandă *</label>
        <input type="text" style={field} value={form.comanda} onChange={set('comanda')} placeholder="INF..." />
      </div>
      <div>
        <label style={label}>Produs</label>
        <input type="text" style={field} value={form.produs} onChange={set('produs')} placeholder="Denumirea produsului comandat" />
      </div>
      <div>
        <label style={label}>Telefon</label>
        <input type="tel" style={field} value={form.telefon} onChange={set('telefon')} placeholder="+40 7xx xxx xxx" />
      </div>
      <div>
        <label style={label}>Motiv (opțional)</label>
        <textarea style={{ ...field, minHeight: '90px', resize: 'vertical' }} value={form.motiv} onChange={set('motiv')} placeholder="Nu ești obligat să indici un motiv." />
      </div>
      {error && (
        <p style={{ color: '#c53030', fontSize: '14px', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fed7d7', margin: 0 }}>
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loading}>
        {loading ? 'Se trimite...' : 'Trimite cererea de retragere'}
      </button>
    </form>
  );
}

function WithdrawalPage({ onNav }) {
  return (
    <LegalShell
      title="Dreptul de retragere"
      subtitle="Cum te retragi din contract, online, în 14 zile."
      onNav={onNav}
    >
      <p style={S.p}>
        În calitate de consumator ai dreptul de a te retrage dintr-un contract încheiat la distanță în
        termen de <strong>{COMMERCE.withdrawalDays} zile calendaristice</strong>, fără a fi nevoit să justifici decizia și fără a suporta
        penalități, conform Ordonanței de urgență a Guvernului nr. 34/2014 privind drepturile consumatorilor în cadrul contractelor
        încheiate cu profesioniștii.
      </p>
      <p style={S.p}>
        {COMPANY.name} pune la dispoziție, conform art. 11<sup>1</sup> din OUG 34/2014, o modalitate online, clară și ușor accesibilă de
        exercitare a acestui drept: formularul de la punctul 4 al acestei pagini.
      </p>

      <Sec n="1" title="Termenul de retragere">
        <p style={S.p}>
          Termenul de {COMMERCE.withdrawalDays} zile curge de la data încheierii contractului, respectiv de la data confirmării comenzii.
          Este suficient ca cererea să fie transmisă înainte de expirarea termenului.
        </p>
      </Sec>

      <Sec n="2" title="Excepția pentru conținut digital livrat imediat">
        <p style={S.p}>
          Toate produsele din magazinul {COMPANY.brand} sunt conținut digital care nu este livrat pe un suport material. Pentru astfel de
          produse, art. 16 lit. m din OUG 34/2014 prevede că dreptul de retragere se pierde dacă executarea contractului a început
          cu <strong>acordul prealabil expres al consumatorului</strong> și cu confirmarea că acesta ia cunoștință de pierderea dreptului.
        </p>
        <p style={S.p}>
          De aceea, la finalizarea comenzii îți cerem o <strong>bifă separată</strong> prin care confirmi că ești de acord cu livrarea
          imediată a documentului și că înțelegi că, odată începută descărcarea, nu te mai poți retrage din contract.
        </p>
        <p style={S.p}>
          Fără acest acord comanda online nu poate fi finalizată, pentru că documentul se livrează imediat după plată. Dacă vrei să
          păstrezi dreptul de retragere, scrie-ne la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a> înainte de
          a comanda: îți trimitem documentul după expirarea celor {COMMERCE.withdrawalDays} zile.
        </p>
        <p style={S.p}>
          Chiar și cu acordul dat, dreptul de retragere se pierde abia în momentul în care <strong>începi descărcarea</strong> documentului.
          Până atunci te poți retrage în continuare.
        </p>
      </Sec>

      <Sec n="3" title="Situații în care te poți retrage oricum">
        <p style={S.p}>Excepția de mai sus nu se aplică și te poți retrage dacă:</p>
        <ul style={S.ul}>
          <li>Nu ai bifat acordul pentru livrarea imediată</li>
          <li>Nu ai început încă descărcarea documentului</li>
          <li>Ai primit un produs neconform sau diferit de descriere, caz tratat
            în <L to="politica-anulare" onNav={onNav}>Politica de anulare și retur</L></li>
        </ul>
      </Sec>

      <Sec n="4" title="Formular online de retragere">
        <p style={S.p}>
          Completează formularul de mai jos. Primești confirmarea pe email, iar soluția în cel mult {COMMERCE.refundDays} zile.
          Alternativ, poți trimite aceeași cerere la <a href={'mailto:' + COMPANY.email} style={S.link}>{COMPANY.email}</a>.
        </p>
        <WithdrawalForm />
      </Sec>

      <Sec n="5" title="Efectele retragerii">
        <p style={S.p}>
          Dacă te retragi valabil, rambursăm integral suma încasată, folosind aceeași modalitate de plată, în termen de cel
          mult <strong>{COMMERCE.refundDays} zile</strong> de la data la care am fost informați. Nu percepem comisioane pentru rambursare.
        </p>
      </Sec>

      <Sec n="6" title="Model de declarație de retragere">
        <p style={S.p}>
          Dacă preferi să redactezi singur cererea, poți folosi textul următor:
        </p>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px 24px', fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-2)' }}>
          Către {COMPANY.name}, {COMPANY.email}<br /><br />
          Prin prezenta notific retragerea mea din contractul de vânzare având ca obiect următorul produs: ................................<br />
          Comandat în data de: ..................... &nbsp; Număr comandă: .....................<br />
          Numele consumatorului: .....................<br />
          Adresa de email: .....................<br />
          Data: ..................... &nbsp; Semnătura (doar pentru cererea pe hârtie): .....................
        </div>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   POLITICA DE COOKIE-URI
══════════════════════════════════════ */
function CookiePage({ onNav }) {
  const openPrefs = () => {
    if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
      window.CookieConsent.showPreferences();
    }
  };
  return (
    <LegalShell
      title="Politica de cookie-uri"
      subtitle="Ce cookie-uri folosim și cum îți controlezi preferințele."
      onNav={onNav}
    >
      <p style={S.p}>
        Cookie-urile sunt fișiere text de mici dimensiuni pe care un website le stochează în browserul tău. Ele permit site-ului să
        funcționeze corect și, cu acordul tău, să înțelegem cum este folosit.
      </p>

      <Sec n="1" title="Categoriile pe care le folosim">
        <p style={S.p}><strong>Cookie-uri strict necesare.</strong> Asigură funcționarea corectă a site-ului, inclusiv memorarea alegerii
          tale privind cookie-urile. Nu pot fi dezactivate și nu necesită consimțământ.</p>
        <p style={S.p}><strong>Cookie-uri de analiză.</strong> Folosim Google Analytics 4 pentru a înțelege ce pagini sunt vizitate, cât
          durează o sesiune și de pe ce tip de dispozitiv se accesează site-ul. Datele sunt agregate și anonimizate. Aceste cookie-uri se
          activează <strong>doar după acordul tău explicit</strong>.</p>
        <p style={S.p}>
          Nu folosim cookie-uri de publicitate și nu vindem date de navigare către terți.
        </p>
      </Sec>

      <Sec n="2" title="Cum îți exprimi și cum îți retragi acordul">
        <p style={S.p}>
          La prima vizită primești un banner cu opțiunile „Acceptă toate”, „Doar necesare” și „Setări”. Alegerea se memorează, iar preferințele
          pot fi schimbate oricând.
        </p>
        <button className="btn btn-outline" onClick={openPrefs} style={{ marginBottom: '14px' }}>
          Modifică preferințele cookie
        </button>
        <p style={S.p}>
          Poți de asemenea șterge sau bloca cookie-urile din setările browserului. Blocarea celor strict necesare poate afecta funcționarea
          site-ului.
        </p>
      </Sec>

      <Sec n="3" title="Durata de viață">
        <p style={S.p}>
          Cookie-ul de consimțământ se păstrează 6 luni, după care banerul reapare. Cookie-urile Google Analytics au durate stabilite de
          furnizor, de regulă până la 24 de luni pentru identificatorul de vizitator.
        </p>
      </Sec>

      <Sec n="4" title="Cookie-uri ale terților">
        <p style={S.p}>
          Google Analytics este furnizat de Google Ireland Limited. Serviciul plasează cookie-uri proprii, guvernate de politica de
          confidențialitate a furnizorului. În timpul procesului de plată ești redirecționat către pagina securizată a procesatorului de
          plăți, care folosește propriile cookie-uri, necesare tranzacției.
        </p>
      </Sec>

      <Sec n="5" title="Legătura cu prelucrarea datelor">
        <p style={S.p}>
          Modul în care prelucrăm datele cu caracter personal este descris
          în <L to="politica-confidentialitate" onNav={onNav}>Politica de confidențialitate</L>.
        </p>
      </Sec>
    </LegalShell>
  );
}

/* ══════════════════════════════════════
   DISPATCHER
══════════════════════════════════════ */
const LEGAL_PAGES = {
  'termeni-si-conditii':        TermsPage,
  'politica-confidentialitate': PrivacyPage,
  'politica-gdpr':              GdprPage,
  'politica-livrare':           DeliveryPage,
  'politica-anulare':           CancellationPage,
  'dreptul-de-retragere':       WithdrawalPage,
  'politica-cookies':           CookiePage,
};

function PolicyPage({ onNav, type }) {
  const Page = LEGAL_PAGES[type] || TermsPage;
  return <Page onNav={onNav} />;
}

Object.assign(window, { PolicyPage, LEGAL_PAGES });
