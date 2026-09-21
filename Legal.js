(function(){
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

const {
  useState
} = React;
const S = LEGAL_STYLES;
const UPDATED = '15 septembrie 2026';
const ANPC_SAL = 'https://anpc.ro/ce-este-sal/';
const ANPC_REC = 'https://anpc.ro/';
const SOL_URL = 'https://ec.europa.eu/consumers/odr';

/* ─── Cadru comun ───────────────────────────────── */
function LegalShell({
  title,
  subtitle,
  onNav,
  children
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pg-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", null, subtitle))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      maxWidth: '800px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '40px 44px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: S.meta
  }, "Ultima actualizare: ", UPDATED), children, /*#__PURE__*/React.createElement("div", {
    style: S.divider
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => go('contact')
  }, "\xCEntreb\u0103ri? Contacteaz\u0103-ne")))));
}
function Sec({
  n,
  title,
  first,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, !first && /*#__PURE__*/React.createElement("div", {
    style: S.divider
  }), /*#__PURE__*/React.createElement("h2", {
    style: S.h2
  }, n, ". ", title), children);
}

/* Datele de identificare ale vânzătorului, dintr-o singură sursă. */
function CompanyBlock() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '18px 22px',
      marginBottom: '14px'
    }
  }, companyRows().map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '12px',
      padding: '5px 0',
      fontSize: '0.95rem',
      lineHeight: 1.7,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: '170px',
      color: 'var(--text-2)',
      fontWeight: 600
    }
  }, r.label), r.href ? /*#__PURE__*/React.createElement("a", {
    href: r.href,
    style: S.link
  }, r.val) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, r.val))));
}

/* Link intern care rămâne copiabil și deschizibil în tab nou. */
function L({
  to,
  onNav,
  children
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: '/' + to,
    style: S.link,
    onClick: e => {
      e.preventDefault();
      onNav(to);
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, children);
}
function Ext({
  href,
  children
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noopener noreferrer",
    style: S.link
  }, children);
}

/* ══════════════════════════════════════
   TERMENI ȘI CONDIȚII
══════════════════════════════════════ */
function TermsPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Termeni \u0219i condi\u021Bii",
    subtitle: "Condi\u021Biile contractuale de utilizare a platformei \u0219i de achizi\u021Bie a produselor digitale.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "V\u0103 rug\u0103m s\u0103 citi\u021Bi cu aten\u021Bie prezentul document \xEEnainte de a utiliza platforma ", /*#__PURE__*/React.createElement("strong", null, COMPANY.brand), " (", COMPANY.website, ") sau de a plasa o comand\u0103. Prin accesarea website-ului \u0219i prin finalizarea unei comenzi accepta\u021Bi integral termenii de mai jos, care au valoare de contract la distan\u021B\u0103 \xEEncheiat \xEEntre dumneavoastr\u0103 \u0219i ", COMPANY.name, "."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Identificarea v\xE2nz\u0103torului"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Produsele \u0219i serviciile prezentate pe ", COMPANY.website, " sunt comercializate de:"), /*#__PURE__*/React.createElement(CompanyBlock, null)), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Rolul companiei \xEEn procesul de comercializare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, " ac\u021Bioneaz\u0103 exclusiv \xEEn calitate de ", /*#__PURE__*/React.createElement("strong", null, "comerciant, respectiv v\xE2nz\u0103tor direct"), " al produselor digitale prezentate pe aceast\u0103 platform\u0103. Societatea este autorul, proprietarul sau licen\u021Biatul con\u021Binutului pe care \xEEl vinde."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, " ", /*#__PURE__*/React.createElement("strong", null, "nu"), " opereaz\u0103 un marketplace, ", /*#__PURE__*/React.createElement("strong", null, "nu"), " ac\u021Bioneaz\u0103 ca intermediar, agent sau distribuitor pentru ter\u021Bi \u0219i ", /*#__PURE__*/React.createElement("strong", null, "nu"), " faciliteaz\u0103 v\xE2nz\u0103ri \xEEntre al\u021Bi comercian\u021Bi \u0219i consumatori. Toate comenzile se \xEEncheie direct cu societatea, care r\u0103spunde integral pentru produsele livrate.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Entitatea care emite factura"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Factura pentru orice comand\u0103 plasat\u0103 pe ", COMPANY.website, " este emis\u0103 de ", /*#__PURE__*/React.createElement("strong", null, COMPANY.name), ", entitatea identificat\u0103 la punctul 1. Factura se transmite electronic, la adresa de e-mail indicat\u0103 \xEEn comand\u0103, \xEEn cel mult ", COMMERCE.invoiceHours, " de ore de la confirmarea pl\u0103\u021Bii. Nicio alt\u0103 entitate nu emite documente fiscale pentru v\xE2nz\u0103rile de pe aceast\u0103 platform\u0103.")), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Obiectul contractului"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.brand, " comercializeaz\u0103 produse digitale \u0219i ofer\u0103 servicii de consultan\u021B\u0103 \u0219i documentare \xEEn domeniul achizi\u021Biilor publice \u0219i al serviciilor de utilit\u0103\u021Bi publice:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Modele de documente \u0219i formulare \xEEn format Word, Excel \u0219i PDF completabil"), /*#__PURE__*/React.createElement("li", null, "Pachete complete de documenta\u021Bie de atribuire"), /*#__PURE__*/React.createElement("li", null, "Instrumente de calcul \u0219i de lucru specializate"), /*#__PURE__*/React.createElement("li", null, "Documenta\u021Bii personalizate \u0219i consultan\u021B\u0103, contractate separat"), /*#__PURE__*/React.createElement("li", null, "Materiale gratuite de informare")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Fiecare produs are, pe pagina sa din magazin, o descriere complet\u0103 a con\u021Binutului, lista fi\u0219ierelor incluse \u0219i formatul de livrare.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Pre\u021Buri \u0219i moned\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Toate pre\u021Burile afi\u0219ate pe site sunt exprimate \xEEn ", /*#__PURE__*/React.createElement("strong", null, "lei rom\xE2ne\u0219ti (", COMMERCE.currency, ")"), " \u0219i reprezint\u0103", /*#__PURE__*/React.createElement("strong", null, " pre\u021Bul final"), " datorat de cump\u0103r\u0103tor. ", COMPANY.name, " este societate ", /*#__PURE__*/React.createElement("strong", null, "nepl\u0103titoare de TVA"), ", prin urmare pre\u021Burile nu con\u021Bin TVA \u0219i nu li se adaug\u0103 TVA la plat\u0103."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Nu se percep costuri suplimentare de livrare, produsele fiind livrate exclusiv electronic. Pre\u021Bul valabil este cel afi\u0219at \xEEn momentul plas\u0103rii comenzii. Societatea \xEE\u0219i rezerv\u0103 dreptul de a modifica pre\u021Burile, modific\u0103rile neafect\xE2nd comenzile deja confirmate.")), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Modalit\u0103\u021Bi de plat\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Plata se poate efectua prin:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, COMMERCE.paymentMethods.map((m, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, m))), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Pl\u0103\u021Bile cu cardul sunt procesate de ", /*#__PURE__*/React.createElement(Ext, {
    href: "https://netopia-payments.com/"
  }, "NETOPIA Payments"), ", procesator autorizat de pl\u0103\u021Bi. Datele cardului se introduc direct \xEEn pagina securizat\u0103 a procesatorului \u0219i ", /*#__PURE__*/React.createElement("strong", null, "nu sunt transmise, vizualizate sau stocate de ", COMPANY.name), ". Tranzac\u021Biile sunt protejate prin criptare \u0219i autentificare 3-D Secure.")), /*#__PURE__*/React.createElement(Sec, {
    n: "7",
    title: "Plasarea \u0219i confirmarea comenzii"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Comanda se plaseaz\u0103 din magazinul online, select\xE2nd produsul dorit \u0219i complet\xE2nd datele de facturare. Contractul se consider\u0103 \xEEncheiat \xEEn momentul \xEEn care plata este confirmat\u0103 de procesator, moment \xEEn care primi\u021Bi pe e-mail confirmarea comenzii."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 plata este refuzat\u0103 sau nu poate fi confirmat\u0103, comanda nu produce efecte juridice \u0219i nu se emite factur\u0103.")), /*#__PURE__*/React.createElement(Sec, {
    n: "8",
    title: "Livrare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Livrarea se face exclusiv electronic, prin e-mail, imediat dup\u0103 confirmarea pl\u0103\u021Bii. Condi\u021Biile complete, termenele \u0219i procedura \xEEn caz de nelivrare sunt descrise \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-livrare",
    onNav: onNav
  }, "Politica de livrare"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "9",
    title: "Dreptul de retragere, anulare \u0219i rambursare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "\xCEn calitate de consumator beneficia\u021Bi, ca regul\u0103, de un drept de retragere de ", COMMERCE.withdrawalDays, " zile, exercitabil online, f\u0103r\u0103 justificare \u0219i f\u0103r\u0103 penalit\u0103\u021Bi. Pentru con\u021Binutul digital livrat imediat exist\u0103 \xEEns\u0103 o excep\u021Bie legal\u0103, pe care o accepta\u021Bi expres la momentul comenzii, printr-o bif\u0103 separat\u0103."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Detaliile, excep\u021Bia aplicabil\u0103 \u0219i formularul online se afl\u0103 \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "dreptul-de-retragere",
    onNav: onNav
  }, "Dreptul de retragere"), ", iar condi\u021Biile de anulare \u0219i de rambursare \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-anulare",
    onNav: onNav
  }, "Politica de anulare \u0219i retur"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "10",
    title: "Licen\u021Ba de utilizare a produselor achizi\u021Bionate"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Prin achizi\u021Bie dob\xE2ndi\u021Bi un drept de utilizare neexclusiv, netransferabil \u0219i nelimitat \xEEn timp asupra documentelor cump\u0103rate, \xEEn activitatea proprie a persoanei sau a entit\u0103\u021Bii care apare pe factur\u0103."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Nu sunt permise, f\u0103r\u0103 acordul scris prealabil al ", COMPANY.name, ":"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Rev\xE2nzarea, \xEEnchirierea sau sublicen\u021Bierea documentelor, \xEEn forma original\u0103 sau modificat\u0103"), /*#__PURE__*/React.createElement("li", null, "Publicarea sau distribuirea lor public\u0103, inclusiv pe alte platforme sau \xEEn grupuri deschise"), /*#__PURE__*/React.createElement("li", null, "Utilizarea lor pentru a crea produse concurente destinate comercializ\u0103rii"))), /*#__PURE__*/React.createElement(Sec, {
    n: "11",
    title: "Obliga\u021Biile utilizatorului"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "S\u0103 furnizeze date corecte \u0219i complete la plasarea comenzii, inclusiv datele de facturare"), /*#__PURE__*/React.createElement("li", null, "S\u0103 nu utilizeze website-ul \xEEn scopuri ilegale sau frauduloase"), /*#__PURE__*/React.createElement("li", null, "S\u0103 nu \xEEncerce accesarea, modificarea sau deteriorarea sistemelor informatice ale ", COMPANY.brand), /*#__PURE__*/React.createElement("li", null, "S\u0103 respecte condi\u021Biile de licen\u021B\u0103 de la punctul 10"))), /*#__PURE__*/React.createElement(Sec, {
    n: "12",
    title: "Proprietate intelectual\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "\xCEntregul con\u021Binut al website-ului, respectiv texte, grafic\u0103, logo-uri, instrumente, modele \u0219i structuri de documente, este proprietatea exclusiv\u0103 a ", COMPANY.name, " sau este utilizat \xEEn baza unor licen\u021Be valabile, fiind protejat de legisla\u021Bia rom\xE2n\u0103 \u0219i interna\u021Bional\u0103 privind drepturile de autor. Vizualizarea con\u021Binutului \xEEn scop personal este permis\u0103; orice alt\u0103 utilizare necesit\u0103 acord scris.")), /*#__PURE__*/React.createElement(Sec, {
    n: "13",
    title: "Limitarea r\u0103spunderii"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Depunem toate eforturile pentru ca documentele comercializate s\u0103 fie conforme legisla\u021Biei \xEEn vigoare la data public\u0103rii. Documentele r\u0103m\xE2n \xEEns\u0103 instrumente de lucru, nu consultan\u021B\u0103 juridic\u0103 pentru o situa\u021Bie concret\u0103, iar responsabilitatea adapt\u0103rii lor la spe\u021Ba proprie revine utilizatorului. Nu r\u0103spundem pentru:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Decizii luate exclusiv pe baza materialelor, f\u0103r\u0103 verificare proprie sau consultan\u021B\u0103 contractat\u0103"), /*#__PURE__*/React.createElement("li", null, "Pierderi indirecte, incidentale sau consecutive rezultate din utilizarea platformei"), /*#__PURE__*/React.createElement("li", null, "\xCEntreruperi temporare de acces cauzate de motive tehnice sau de for\u021B\u0103 major\u0103"))), /*#__PURE__*/React.createElement(Sec, {
    n: "14",
    title: "Protec\u021Bia datelor cu caracter personal"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Prelucrarea datelor este guvernat\u0103 de ", /*#__PURE__*/React.createElement(L, {
    to: "politica-confidentialitate",
    onNav: onNav
  }, "Politica de confiden\u021Bialitate"), " \u0219i de ", /*#__PURE__*/React.createElement(L, {
    to: "politica-gdpr",
    onNav: onNav
  }, "Politica GDPR"), ", iar utilizarea cookie-urilor de ", /*#__PURE__*/React.createElement(L, {
    to: "politica-cookies",
    onNav: onNav
  }, "Politica de cookie-uri"), ". Toate fac parte integrant\u0103 din prezentele condi\u021Bii.")), /*#__PURE__*/React.createElement(Sec, {
    n: "15",
    title: "Reclama\u021Bii \u0219i solu\u021Bionarea litigiilor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Orice reclama\u021Bie poate fi transmis\u0103 la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), ". R\u0103spundem \xEEn cel mult 30 de zile calendaristice de la primire."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "\xCEn calitate de consumator v\u0103 pute\u021Bi adresa \u0219i:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Ext, {
    href: ANPC_REC
  }, "Autorit\u0103\u021Bii Na\u021Bionale pentru Protec\u021Bia Consumatorilor (ANPC)")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Ext, {
    href: ANPC_SAL
  }, "Structurii de Solu\u021Bionare Alternativ\u0103 a Litigiilor (SAL) din cadrul ANPC")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Ext, {
    href: SOL_URL
  }, "Platformei europene de Solu\u021Bionare Online a Litigiilor (SOL)"))), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Prezentele condi\u021Bii sunt guvernate de legisla\u021Bia rom\xE2n\u0103. Litigiile nesolu\u021Bionate pe cale amiabil\u0103 sunt de competen\u021Ba instan\u021Belor judec\u0103tore\u0219ti din Rom\xE2nia.")), /*#__PURE__*/React.createElement(Sec, {
    n: "16",
    title: "Modificarea termenilor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, " \xEE\u0219i rezerv\u0103 dreptul de a modifica prezentele condi\u021Bii. Modific\u0103rile intr\u0103 \xEEn vigoare la data public\u0103rii pe website \u0219i nu afecteaz\u0103 comenzile deja confirmate, c\u0103rora li se aplic\u0103 versiunea \xEEn vigoare la momentul plas\u0103rii.")));
}

/* ══════════════════════════════════════
   POLITICA DE CONFIDENȚIALITATE
══════════════════════════════════════ */
function PrivacyPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Politica de confiden\u021Bialitate",
    subtitle: "Informa\u021Bii privind prelucrarea datelor cu caracter personal.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, ", operator al platformei ", /*#__PURE__*/React.createElement("strong", null, COMPANY.brand), " (", COMPANY.website, "), se angajeaz\u0103 s\u0103 protejeze confiden\u021Bialitatea \u0219i securitatea datelor cu caracter personal ale utilizatorilor s\u0103i. Prezenta politic\u0103 descrie ce date colect\u0103m, \xEEn ce scop le utiliz\u0103m \u0219i care sunt drepturile dumneavoastr\u0103, \xEEn conformitate cu Regulamentul (UE) 2016/679 (GDPR) \u0219i cu Legea nr. 190/2018."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Operatorul de date"
  }, /*#__PURE__*/React.createElement(CompanyBlock, null)), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Datele pe care le colect\u0103m"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Colect\u0103m date cu caracter personal atunci c\xE2nd ni le furniza\u021Bi voluntar:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Prin formularul de contact"), " - nume \u0219i prenume, adres\u0103 de e-mail, telefon (op\u021Bional), subiect \u0219i mesaj"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "La desc\u0103rcarea materialelor gratuite"), " - adres\u0103 de e-mail"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "La plasarea unei comenzi"), " - nume \u0219i prenume sau denumirea firmei, adres\u0103 de e-mail, telefon, adres\u0103 de facturare \u0219i, pentru persoane juridice, CUI")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Serverul nostru web \xEEnregistreaz\u0103 automat \u0219i date tehnice (adres\u0103 IP, tip de browser, pagina accesat\u0103, data \u0219i ora accesului), \xEEn scopuri de securitate \u0219i de analiz\u0103 statistic\u0103 agregat\u0103."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, /*#__PURE__*/React.createElement("strong", null, "Nu colect\u0103m \u0219i nu avem acces la datele cardului dumneavoastr\u0103."), " Acestea sunt introduse direct \xEEn pagina securizat\u0103 a procesatorului de pl\u0103\u021Bi.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Scopurile \u0219i temeiurile juridice ale prelucr\u0103rii"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Procesarea comenzilor \u0219i livrarea produselor"), " - executarea contractului (art. 6 alin. 1 lit. b GDPR)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "R\u0103spuns la solicit\u0103ri"), " - executarea unui contract sau m\u0103suri precontractuale (art. 6 alin. 1 lit. b GDPR)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Facturare, contabilitate \u0219i raportare fiscal\u0103"), " - obliga\u021Bie legal\u0103 (art. 6 alin. 1 lit. c GDPR)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Comunic\u0103ri comerciale"), " - consim\u021B\u0103m\xE2ntul dumneavoastr\u0103 explicit (art. 6 alin. 1 lit. a GDPR), retractabil oric\xE2nd"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Prevenirea fraudei \u0219i securitatea sistemelor"), " - interesul legitim al operatorului (art. 6 alin. 1 lit. f GDPR)"))), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Durata stoc\u0103rii datelor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Datele transmise prin formularul de contact se p\u0103streaz\u0103 pe durata necesar\u0103 solu\u021Bion\u0103rii solicit\u0103rii, iar ulterior maximum", /*#__PURE__*/React.createElement("strong", null, " 3 ani"), " \xEEn scopuri de eviden\u021B\u0103 intern\u0103. Documentele contabile, inclusiv facturile, se p\u0103streaz\u0103", /*#__PURE__*/React.createElement("strong", null, " 10 ani"), ", conform legisla\u021Biei fiscale. Datele pentru care v-a\u021Bi retras consim\u021B\u0103m\xE2ntul se \u0219terg \xEEn termen de 30 de zile.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Destinatarii datelor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Datele dumneavoastr\u0103 nu sunt v\xE2ndute \u0219i nu sunt cedate ter\u021Bilor \xEEn scopuri de marketing. Le divulg\u0103m exclusiv:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "NETOPIA Payments"), ", procesator de pl\u0103\u021Bi, pentru efectuarea tranzac\u021Biilor cu cardul"), /*#__PURE__*/React.createElement("li", null, "Prestatorilor de servicii IT (g\u0103zduire, e-mail, livrare newsletter), care ac\u021Bioneaz\u0103 ca ", /*#__PURE__*/React.createElement("strong", null, "persoane \xEEmputernicite"), " \u0219i sunt obliga\u021Bi contractual s\u0103 respecte GDPR"), /*#__PURE__*/React.createElement("li", null, "Contabilului \u0219i autorit\u0103\u021Bilor fiscale, \xEEn limitele obliga\u021Biilor legale"), /*#__PURE__*/React.createElement("li", null, "Autorit\u0103\u021Bilor publice, atunci c\xE2nd legea o impune")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Nu transfer\u0103m date \xEEn afara Spa\u021Biului Economic European f\u0103r\u0103 garan\u021Bii adecvate."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Detalii suplimentare privind prelucrarea \xEEn context comercial se g\u0103sesc \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-gdpr",
    onNav: onNav
  }, "Politica GDPR"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Cookie-uri \u0219i tehnologii similare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Website-ul utilizeaz\u0103 cookie-uri strict necesare pentru func\u021Bionare \u0219i, doar cu acordul dumneavoastr\u0103, cookie-uri de analiz\u0103. Detaliile complete se afl\u0103 \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-cookies",
    onNav: onNav
  }, "Politica de cookie-uri"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "7",
    title: "Drepturile dumneavoastr\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "\xCEn conformitate cu GDPR, beneficia\u021Bi de urm\u0103toarele drepturi:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul de acces"), " - confirmarea prelucr\u0103rii \u0219i o copie a datelor"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul la rectificare"), " - corectarea datelor inexacte sau completarea celor incomplete"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul la \u0219tergere"), " - \u0219tergerea datelor atunci c\xE2nd nu mai sunt necesare"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul la restric\u021Bionarea prelucr\u0103rii"), " - \xEEn situa\u021Biile prev\u0103zute de lege"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul la portabilitate"), " - primirea datelor \xEEntr-un format structurat \u0219i transferul lor"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul la opozi\u021Bie"), " - fa\u021B\u0103 de prelucrarea bazat\u0103 pe interesul legitim"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Dreptul de a retrage consim\u021B\u0103m\xE2ntul"), " - oric\xE2nd, f\u0103r\u0103 a afecta legalitatea prelucr\u0103rii anterioare")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Pentru exercitarea oric\u0103rui drept, trimite\u021Bi o cerere la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), ". R\u0103spundem \xEEn cel mult ", /*#__PURE__*/React.createElement("strong", null, "30 de zile calendaristice"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "8",
    title: "Dreptul de a depune o pl\xE2ngere"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 aprecia\u021Bi c\u0103 drepturile dumneavoastr\u0103 au fost \xEEnc\u0103lcate, pute\u021Bi depune o pl\xE2ngere la ", /*#__PURE__*/React.createElement("strong", null, "Autoritatea Na\u021Bional\u0103 de Supraveghere a Prelucr\u0103rii Datelor cu Caracter Personal (ANSPDCP)"), ", Bd. G-ral Gheorghe Magheru 28-30, sector 1, Bucure\u0219ti,", /*#__PURE__*/React.createElement(Ext, {
    href: "https://www.dataprotection.ro"
  }, " www.dataprotection.ro"), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "9",
    title: "Securitatea datelor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Implement\u0103m m\u0103suri tehnice \u0219i organizatorice adecvate pentru a proteja datele \xEEmpotriva accesului neautorizat, divulg\u0103rii, alter\u0103rii sau distrugerii, inclusiv criptarea transmisiilor prin HTTPS, restric\u021Bionarea accesului la sistemele de procesare \u0219i livrarea documentelor achizi\u021Bionate prin linkuri semnate, cu durat\u0103 de valabilitate limitat\u0103.")), /*#__PURE__*/React.createElement(Sec, {
    n: "10",
    title: "Modific\u0103ri ale politicii"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Ne rezerv\u0103m dreptul de a actualiza prezenta politic\u0103 pentru a reflecta modific\u0103rile legislative sau opera\u021Bionale. Versiunea actualizat\u0103 se public\u0103 pe aceast\u0103 pagin\u0103, \xEEmpreun\u0103 cu data revizuirii.")));
}

/* ══════════════════════════════════════
   POLITICA GDPR
══════════════════════════════════════ */
function GdprPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Politica GDPR",
    subtitle: "Prelucrarea datelor \xEEn contextul comenzilor, pl\u0103\u021Bilor \u0219i factur\u0103rii.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Prezentul document completeaz\u0103 ", /*#__PURE__*/React.createElement(L, {
    to: "politica-confidentialitate",
    onNav: onNav
  }, "Politica de confiden\u021Bialitate"), " \u0219i detaliaz\u0103 modul \xEEn care ", COMPANY.name, " prelucreaz\u0103 datele cu caracter personal atunci c\xE2nd cump\u0103ra\u021Bi un produs digital de pe ", COMPANY.website, "."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Operator \u0219i date de contact"
  }, /*#__PURE__*/React.createElement(CompanyBlock, null), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Societatea nu are obliga\u021Bia legal\u0103 de a numi un responsabil cu protec\u021Bia datelor. Solicit\u0103rile privind datele personale se transmit la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), ".")), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Categoriile de date prelucrate la o comand\u0103"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date de identificare"), " - nume \u0219i prenume sau denumirea firmei \u0219i CUI"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date de contact"), " - adres\u0103 de e-mail, telefon"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date de facturare"), " - adres\u0103, localitate, jude\u021B, cod po\u0219tal"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date despre tranzac\u021Bie"), " - produsul comandat, suma, moneda, data, identificatorul comenzii \u0219i statusul pl\u0103\u021Bii"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date tehnice"), " - adresa IP \u0219i user-agent, transmise procesatorului pentru analiza antifraud\u0103")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, /*#__PURE__*/React.createElement("strong", null, "Nu prelucr\u0103m date de card."), " Num\u0103rul cardului, data expir\u0103rii \u0219i codul CVV sunt introduse exclusiv \xEEn pagina securizat\u0103 a procesatorului de pl\u0103\u021Bi \u0219i nu ajung niciodat\u0103 pe serverele noastre.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Temeiurile juridice"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Executarea contractului"), " (art. 6 alin. 1 lit. b GDPR) - procesarea comenzii, livrarea documentului, asisten\u021Ba post-v\xE2nzare"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Obliga\u021Bia legal\u0103"), " (art. 6 alin. 1 lit. c GDPR) - emiterea facturii, eviden\u021Ba contabil\u0103, raportarea fiscal\u0103"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Interesul legitim"), " (art. 6 alin. 1 lit. f GDPR) - prevenirea fraudei la plat\u0103 \u0219i securitatea platformei"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Consim\u021B\u0103m\xE2ntul"), " (art. 6 alin. 1 lit. a GDPR) - comunic\u0103rile comerciale \u0219i cookie-urile de analiz\u0103"))), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Persoane \xEEmputernicite \u0219i destinatari"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "NETOPIA Payments"), " - procesarea pl\u0103\u021Bilor cu cardul \u0219i analiza antifraud\u0103"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Furnizorul de g\u0103zduire"), " - stocarea \u0219i livrarea site-ului \u0219i a func\u021Biilor sale"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Furnizorul de e-mail"), " - transmiterea confirm\u0103rilor de comand\u0103 \u0219i a linkurilor de desc\u0103rcare"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Furnizorul de newsletter"), " - doar pentru persoanele care \u0219i-au exprimat consim\u021B\u0103m\xE2ntul"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Contabilul societ\u0103\u021Bii"), " \u0219i autorit\u0103\u021Bile fiscale, \xEEn limita obliga\u021Biilor legale")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Fiecare \xEEmputernicit prelucreaz\u0103 datele exclusiv pe baza instruc\u021Biunilor noastre \u0219i \xEEn temeiul unui acord de prelucrare conform art. 28 GDPR.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Durata p\u0103str\u0103rii"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Facturi \u0219i documente contabile"), " - 10 ani, termen impus de legisla\u021Bia fiscal\u0103"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Date de comand\u0103 \u0219i coresponden\u021B\u0103 aferent\u0103"), " - 3 ani de la finalizarea comenzii"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Linkuri de desc\u0103rcare"), " - expir\u0103 automat, la scurt timp dup\u0103 livrare"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Adrese de e-mail pentru newsletter"), " - p\xE2n\u0103 la retragerea consim\u021B\u0103m\xE2ntului"))), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Decizii automate \u0219i profilare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Nu lu\u0103m decizii automate cu efecte juridice asupra dumneavoastr\u0103. Procesatorul de pl\u0103\u021Bi poate aplica reguli antifraud\u0103 automate la autorizarea tranzac\u021Biei; \xEEn cazul unui refuz, pute\u021Bi relua plata sau alege transferul bancar.")), /*#__PURE__*/React.createElement(Sec, {
    n: "7",
    title: "Drepturile dumneavoastr\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Drepturile de acces, rectificare, \u0219tergere, restric\u021Bionare, portabilitate, opozi\u021Bie \u0219i retragere a consim\u021B\u0103m\xE2ntului sunt descrise pe larg \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-confidentialitate",
    onNav: onNav
  }, "Politica de confiden\u021Bialitate"), ", punctul 7, \u0219i se exercit\u0103 prin cerere la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), "."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dreptul la \u0219tergere nu se aplic\u0103 datelor pe care legea ne oblig\u0103 s\u0103 le p\u0103str\u0103m, \xEEn special celor din documentele contabile, pe durata termenului legal de arhivare.")));
}

/* ══════════════════════════════════════
   POLITICA DE LIVRARE
══════════════════════════════════════ */
function DeliveryPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Politica de livrare",
    subtitle: "Cum \u0219i c\xE2nd prime\u0219ti documentele comandate.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Toate produsele comercializate pe ", COMPANY.website, " sunt ", /*#__PURE__*/React.createElement("strong", null, "produse digitale"), ". Nu exist\u0103 livrare fizic\u0103, transport sau curierat, iar livrarea se face exclusiv electronic."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Modalitatea de livrare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dup\u0103 confirmarea pl\u0103\u021Bii, la adresa de e-mail indicat\u0103 \xEEn comand\u0103 primi\u021Bi un mesaj care con\u021Bine confirmarea comenzii \u0219i un", /*#__PURE__*/React.createElement("strong", null, " link personal de desc\u0103rcare"), ". Linkul este unic, este generat pentru comanda dumneavoastr\u0103 \u0219i nu poate fi ghicit sau accesat de altcineva.")), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Termenul de livrare"
  }, /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Plat\u0103 cu cardul"), " - livrare automat\u0103, imediat dup\u0103 confirmarea pl\u0103\u021Bii de c\u0103tre procesator, \xEEn mod obi\u0219nuit \xEEn c\xE2teva minute"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Transfer bancar"), " - livrare \xEEn cel mult ", COMMERCE.deliveryMaxHours, " de ore de la confirmarea \xEEncas\u0103rii \xEEn contul societ\u0103\u021Bii, \xEEn zilele lucr\u0103toare"))), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Costuri de livrare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Livrarea este ", /*#__PURE__*/React.createElement("strong", null, "gratuit\u0103"), ". Pre\u021Bul afi\u0219at \xEEn magazin este singura sum\u0103 datorat\u0103.")), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Valabilitatea linkului de desc\u0103rcare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Din motive de securitate, linkul de desc\u0103rcare are o durat\u0103 de valabilitate limitat\u0103. V\u0103 recomand\u0103m s\u0103 desc\u0103rca\u021Bi \u0219i s\u0103 salva\u021Bi documentele imediat ce primi\u021Bi e-mailul. Dac\u0103 linkul a expirat, ne scrie\u021Bi la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), ", men\u021Bion\xE2nd num\u0103rul comenzii, \u0219i primi\u021Bi unul nou, f\u0103r\u0103 costuri.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Dac\u0103 nu prime\u0219ti e-mailul"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 \xEEn 30 de minute de la confirmarea pl\u0103\u021Bii nu ai primit e-mailul:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Verific\u0103 folderul Spam sau Promo\u021Bii din c\u0103su\u021Ba de e-mail"), /*#__PURE__*/React.createElement("li", null, "Verific\u0103 dac\u0103 adresa introdus\u0103 la comand\u0103 este scris\u0103 corect"), /*#__PURE__*/React.createElement("li", null, "Scrie-ne la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), " cu num\u0103rul comenzii; retrimitem documentul \xEEn cel mult o zi lucr\u0103toare"))), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Factura"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Factura se emite de ", COMPANY.name, " \u0219i se transmite electronic, la aceea\u0219i adres\u0103 de e-mail, \xEEn cel mult ", COMMERCE.invoiceHours, " de ore de la confirmarea pl\u0103\u021Bii.")), /*#__PURE__*/React.createElement(Sec, {
    n: "7",
    title: "Cerin\u021Be tehnice"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Documentele sunt livrate \xEEn formatele indicate pe pagina fiec\u0103rui produs. Pentru deschiderea lor sunt necesare aplica\u021Bii uzuale: Microsoft Word sau un editor compatibil pentru fi\u0219ierele .docx, Microsoft Excel sau un editor compatibil pentru .xlsx \u0219i Adobe Acrobat Reader pentru formularele PDF completabile. Formularele PDF inteligente \xEE\u0219i p\u0103streaz\u0103 toate func\u021Biile doar \xEEn Adobe Acrobat Reader.")));
}

/* ══════════════════════════════════════
   POLITICA DE ANULARE ȘI RETUR
══════════════════════════════════════ */
function CancellationPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Politica de anulare \u0219i retur",
    subtitle: "Cum anulezi o comand\u0103 \u0219i \xEEn ce condi\u021Bii prime\u0219ti banii \xEEnapoi.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Prezenta politic\u0103 se aplic\u0103 tuturor comenzilor plasate pe ", COMPANY.website, " \u0219i se completeaz\u0103 cu ", /*#__PURE__*/React.createElement(L, {
    to: "dreptul-de-retragere",
    onNav: onNav
  }, "Dreptul de retragere"), "."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Anularea comenzii \xEEnainte de livrare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Po\u021Bi anula o comand\u0103 oric\xE2nd \xEEnainte de livrarea documentului, f\u0103r\u0103 nicio justificare \u0219i f\u0103r\u0103 costuri. Trimite un e-mail la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), " cu num\u0103rul comenzii \u0219i men\u021Biunea \u201Eanulare comand\u0103\u201D. Dac\u0103 plata a fost deja procesat\u0103, suma se restituie integral.")), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Anularea dup\u0103 livrare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Documentele digitale livrate nu pot fi returnate \xEEn sens material. Dac\u0103 ai acceptat expres livrarea imediat\u0103 \u0219i ai desc\u0103rcat documentul, dreptul de retragere nu mai poate fi exercitat, conform excep\u021Biei legale explicate \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "dreptul-de-retragere",
    onNav: onNav
  }, "Dreptul de retragere"), "."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Acest lucru nu \xEE\u021Bi afecteaz\u0103 drepturile \xEEn cazul unui produs neconform, tratat la punctul 3.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Produs neconform, defect sau gre\u0219it livrat"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Ai dreptul la remediere sau la rambursare integral\u0103 dac\u0103:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Ai primit un alt document dec\xE2t cel comandat"), /*#__PURE__*/React.createElement("li", null, "Fi\u0219ierul este corupt \u0219i nu poate fi deschis, iar problema nu poate fi remediat\u0103"), /*#__PURE__*/React.createElement("li", null, "Con\u021Binutul livrat nu corespunde descrierii publicate pe pagina produsului")), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Ne scrii la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), " \xEEn termen de 14 zile de la livrare, cu num\u0103rul comenzii \u0219i descrierea problemei. \xCEncerc\u0103m \xEEnt\xE2i remedierea, prin retrimiterea sau corectarea documentului. Dac\u0103 remedierea nu este posibil\u0103, ramburs\u0103m integral pre\u021Bul pl\u0103tit.")), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Modalitatea \u0219i termenul de rambursare"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Rambursarea se face folosind ", /*#__PURE__*/React.createElement("strong", null, "aceea\u0219i modalitate de plat\u0103"), " utilizat\u0103 la comand\u0103, \xEEn termen de cel mult ", /*#__PURE__*/React.createElement("strong", null, COMMERCE.refundDays, " zile"), " de la data la care am acceptat cererea. Nu percepem comisioane pentru rambursare."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Pentru pl\u0103\u021Bile cu cardul, suma este returnat\u0103 \xEEn contul cardului folosit la plat\u0103. Intervalul \xEEn care banii apar efectiv \xEEn cont depinde de banca emitent\u0103 \u0219i poate fi de c\xE2teva zile lucr\u0103toare dup\u0103 procesarea ramburs\u0103rii.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Comenzi anulate de v\xE2nz\u0103tor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, " poate anula o comand\u0103 \xEEn cazul unei erori evidente de pre\u021B, al suspiciunii \xEEntemeiate de fraud\u0103 sau al imposibilit\u0103\u021Bii de a livra produsul. \xCEn aceste situa\u021Bii te anun\u021B\u0103m prin e-mail \u0219i ramburs\u0103m integral suma \xEEncasat\u0103, \xEEn acela\u0219i termen de ", COMMERCE.refundDays, " zile.")), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Reclama\u021Bii"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 nu e\u0219ti mul\u021Bumit de solu\u021Bie, te po\u021Bi adresa ", /*#__PURE__*/React.createElement(Ext, {
    href: ANPC_REC
  }, "ANPC"), ", structurii de ", /*#__PURE__*/React.createElement(Ext, {
    href: ANPC_SAL
  }, "Solu\u021Bionare Alternativ\u0103 a Litigiilor"), " sau platformei europene ", /*#__PURE__*/React.createElement(Ext, {
    href: SOL_URL
  }, "SOL"), ".")));
}

/* ══════════════════════════════════════
   DREPTUL DE RETRAGERE + FORMULAR ONLINE
══════════════════════════════════════ */
function WithdrawalForm() {
  const [form, setForm] = useState({
    nume: '',
    email: '',
    telefon: '',
    comanda: '',
    produs: '',
    motiv: ''
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nume.trim() || !form.email.trim() || !form.comanda.trim()) {
      setError('Completează numele, adresa de email și numărul comenzii.');
      return;
    }
    setError('');
    setLoading(true);
    const mesaj = 'Prin prezenta notific retragerea mea din contractul de vânzare încheiat la distanță.\n\n' + 'Număr comandă: ' + form.comanda + '\n' + 'Produs: ' + (form.produs || '(nespecificat)') + '\n' + 'Nume consumator: ' + form.nume + '\n' + 'Email: ' + form.email + '\n' + 'Telefon: ' + (form.telefon || '(nespecificat)') + '\n' + 'Motiv (opțional): ' + (form.motiv || '-') + '\n\n' + 'Data cererii: ' + new Date().toLocaleDateString('ro-RO');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nume: form.nume,
          email: form.email,
          telefon: form.telefon,
          subiect: 'Cerere de retragere - comanda ' + form.comanda,
          mesaj
        })
      });
      const json = await res.json();
      if (json.ok) setSent(true);else setError('Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne direct la ' + COMPANY.email + '.');
    } catch {
      setError('Eroare de rețea. Încearcă din nou sau scrie-ne direct la ' + COMPANY.email + '.');
    } finally {
      setLoading(false);
    }
  };
  if (sent) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 28px',
        background: '#F0FDF4',
        border: '1px solid #86EFAC',
        borderRadius: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        color: '#16A34A',
        fontSize: '1.05rem',
        marginBottom: '8px'
      }
    }, "Cerere \xEEnregistrat\u0103"), /*#__PURE__*/React.createElement("p", {
      style: {
        ...S.p,
        marginBottom: 0
      }
    }, "Am primit cererea ta de retragere. \xCE\u021Bi confirm\u0103m primirea pe email \u0219i \xEE\u021Bi comunic\u0103m solu\u021Bia \xEEn cel mult 14 zile."));
  }
  const field = {
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: '6px',
    fontSize: '15px',
    fontFamily: 'var(--font)',
    color: 'var(--text)',
    background: '#fff',
    outline: 'none',
    width: '100%'
  };
  const label = {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '5px',
    display: 'block'
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    noValidate: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '26px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Nume \u0219i prenume *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    style: field,
    value: form.nume,
    onChange: set('nume'),
    placeholder: "Ion Popescu"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Adres\u0103 de email folosit\u0103 la comand\u0103 *"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    style: field,
    value: form.email,
    onChange: set('email'),
    placeholder: "ion@exemplu.ro"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Num\u0103r comand\u0103 *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    style: field,
    value: form.comanda,
    onChange: set('comanda'),
    placeholder: "INF..."
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Produs"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    style: field,
    value: form.produs,
    onChange: set('produs'),
    placeholder: "Denumirea produsului comandat"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Telefon"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    style: field,
    value: form.telefon,
    onChange: set('telefon'),
    placeholder: "+40 7xx xxx xxx"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label
  }, "Motiv (op\u021Bional)"), /*#__PURE__*/React.createElement("textarea", {
    style: {
      ...field,
      minHeight: '90px',
      resize: 'vertical'
    },
    value: form.motiv,
    onChange: set('motiv'),
    placeholder: "Nu e\u0219ti obligat s\u0103 indici un motiv."
  })), error && /*#__PURE__*/React.createElement("p", {
    style: {
      color: '#c53030',
      fontSize: '14px',
      background: '#fff5f5',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #fed7d7',
      margin: 0
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    style: {
      alignSelf: 'flex-start'
    },
    disabled: loading
  }, loading ? 'Se trimite...' : 'Trimite cererea de retragere'));
}
function WithdrawalPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Dreptul de retragere",
    subtitle: "Cum te retragi din contract, online, \xEEn 14 zile.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "\xCEn calitate de consumator ai dreptul de a te retrage dintr-un contract \xEEncheiat la distan\u021B\u0103 \xEEn termen de ", /*#__PURE__*/React.createElement("strong", null, COMMERCE.withdrawalDays, " zile calendaristice"), ", f\u0103r\u0103 a fi nevoit s\u0103 justifici decizia \u0219i f\u0103r\u0103 a suporta penalit\u0103\u021Bi, conform Ordonan\u021Bei de urgen\u021B\u0103 a Guvernului nr. 34/2014 privind drepturile consumatorilor \xEEn cadrul contractelor \xEEncheiate cu profesioni\u0219tii."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, COMPANY.name, " pune la dispozi\u021Bie, conform art. 11", /*#__PURE__*/React.createElement("sup", null, "1"), " din OUG 34/2014, o modalitate online, clar\u0103 \u0219i u\u0219or accesibil\u0103 de exercitare a acestui drept: formularul de la punctul 4 al acestei pagini."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Termenul de retragere"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Termenul de ", COMMERCE.withdrawalDays, " zile curge de la data \xEEncheierii contractului, respectiv de la data confirm\u0103rii comenzii. Este suficient ca cererea s\u0103 fie transmis\u0103 \xEEnainte de expirarea termenului.")), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Excep\u021Bia pentru con\u021Binut digital livrat imediat"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Toate produsele din magazinul ", COMPANY.brand, " sunt con\u021Binut digital care nu este livrat pe un suport material. Pentru astfel de produse, art. 16 lit. m din OUG 34/2014 prevede c\u0103 dreptul de retragere se pierde dac\u0103 executarea contractului a \xEEnceput cu ", /*#__PURE__*/React.createElement("strong", null, "acordul prealabil expres al consumatorului"), " \u0219i cu confirmarea c\u0103 acesta ia cuno\u0219tin\u021B\u0103 de pierderea dreptului."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "De aceea, la finalizarea comenzii \xEE\u021Bi cerem o ", /*#__PURE__*/React.createElement("strong", null, "bif\u0103 separat\u0103"), " prin care confirmi c\u0103 e\u0219ti de acord cu livrarea imediat\u0103 a documentului \u0219i c\u0103 \xEEn\u021Belegi c\u0103, odat\u0103 \xEEnceput\u0103 desc\u0103rcarea, nu te mai po\u021Bi retrage din contract."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, /*#__PURE__*/React.createElement("strong", null, "Dac\u0103 nu bifezi acest acord, dreptul de retragere de ", COMMERCE.withdrawalDays, " zile r\u0103m\xE2ne valabil integral"), ", iar livrarea are loc dup\u0103 expirarea termenului sau la solicitarea ta expres\u0103.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Situa\u021Bii \xEEn care te po\u021Bi retrage oricum"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Excep\u021Bia de mai sus nu se aplic\u0103 \u0219i te po\u021Bi retrage dac\u0103:"), /*#__PURE__*/React.createElement("ul", {
    style: S.ul
  }, /*#__PURE__*/React.createElement("li", null, "Nu ai bifat acordul pentru livrarea imediat\u0103"), /*#__PURE__*/React.createElement("li", null, "Documentul nu \u021Bi-a fost \xEEnc\u0103 livrat"), /*#__PURE__*/React.createElement("li", null, "Ai primit un produs neconform sau diferit de descriere, caz tratat \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-anulare",
    onNav: onNav
  }, "Politica de anulare \u0219i retur")))), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Formular online de retragere"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Completeaz\u0103 formularul de mai jos. Prime\u0219ti confirmarea pe email, iar solu\u021Bia \xEEn cel mult ", COMMERCE.refundDays, " zile. Alternativ, po\u021Bi trimite aceea\u0219i cerere la ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + COMPANY.email,
    style: S.link
  }, COMPANY.email), "."), /*#__PURE__*/React.createElement(WithdrawalForm, null)), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Efectele retragerii"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 te retragi valabil, ramburs\u0103m integral suma \xEEncasat\u0103, folosind aceea\u0219i modalitate de plat\u0103, \xEEn termen de cel mult ", /*#__PURE__*/React.createElement("strong", null, COMMERCE.refundDays, " zile"), " de la data la care am fost informa\u021Bi. Nu percepem comisioane pentru rambursare.")), /*#__PURE__*/React.createElement(Sec, {
    n: "6",
    title: "Model de declara\u021Bie de retragere"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Dac\u0103 preferi s\u0103 redactezi singur cererea, po\u021Bi folosi textul urm\u0103tor:"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '20px 24px',
      fontSize: '0.95rem',
      lineHeight: 1.85,
      color: 'var(--text-2)'
    }
  }, "C\u0103tre ", COMPANY.name, ", ", COMPANY.email, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Prin prezenta notific retragerea mea din contractul de v\xE2nzare av\xE2nd ca obiect urm\u0103torul produs: ................................", /*#__PURE__*/React.createElement("br", null), "Comandat \xEEn data de: ..................... \xA0 Num\u0103r comand\u0103: .....................", /*#__PURE__*/React.createElement("br", null), "Numele consumatorului: .....................", /*#__PURE__*/React.createElement("br", null), "Adresa de email: .....................", /*#__PURE__*/React.createElement("br", null), "Data: ..................... \xA0 Semn\u0103tura (doar pentru cererea pe h\xE2rtie): .....................")));
}

/* ══════════════════════════════════════
   POLITICA DE COOKIE-URI
══════════════════════════════════════ */
function CookiePage({
  onNav
}) {
  const openPrefs = () => {
    if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
      window.CookieConsent.showPreferences();
    }
  };
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Politica de cookie-uri",
    subtitle: "Ce cookie-uri folosim \u0219i cum \xEE\u021Bi controlezi preferin\u021Bele.",
    onNav: onNav
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Cookie-urile sunt fi\u0219iere text de mici dimensiuni pe care un website le stocheaz\u0103 \xEEn browserul t\u0103u. Ele permit site-ului s\u0103 func\u021Bioneze corect \u0219i, cu acordul t\u0103u, s\u0103 \xEEn\u021Belegem cum este folosit."), /*#__PURE__*/React.createElement(Sec, {
    n: "1",
    title: "Categoriile pe care le folosim"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, /*#__PURE__*/React.createElement("strong", null, "Cookie-uri strict necesare."), " Asigur\u0103 func\u021Bionarea corect\u0103 a site-ului, inclusiv memorarea alegerii tale privind cookie-urile. Nu pot fi dezactivate \u0219i nu necesit\u0103 consim\u021B\u0103m\xE2nt."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, /*#__PURE__*/React.createElement("strong", null, "Cookie-uri de analiz\u0103."), " Folosim Google Analytics 4 pentru a \xEEn\u021Belege ce pagini sunt vizitate, c\xE2t dureaz\u0103 o sesiune \u0219i de pe ce tip de dispozitiv se acceseaz\u0103 site-ul. Datele sunt agregate \u0219i anonimizate. Aceste cookie-uri se activeaz\u0103 ", /*#__PURE__*/React.createElement("strong", null, "doar dup\u0103 acordul t\u0103u explicit"), "."), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Nu folosim cookie-uri de publicitate \u0219i nu vindem date de navigare c\u0103tre ter\u021Bi.")), /*#__PURE__*/React.createElement(Sec, {
    n: "2",
    title: "Cum \xEE\u021Bi exprimi \u0219i cum \xEE\u021Bi retragi acordul"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "La prima vizit\u0103 prime\u0219ti un banner cu op\u021Biunile \u201EAccept\u0103 toate\u201D, \u201EDoar necesare\u201D \u0219i \u201ESet\u0103ri\u201D. Alegerea se memoreaz\u0103, iar preferin\u021Bele pot fi schimbate oric\xE2nd."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: openPrefs,
    style: {
      marginBottom: '14px'
    }
  }, "Modific\u0103 preferin\u021Bele cookie"), /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Po\u021Bi de asemenea \u0219terge sau bloca cookie-urile din set\u0103rile browserului. Blocarea celor strict necesare poate afecta func\u021Bionarea site-ului.")), /*#__PURE__*/React.createElement(Sec, {
    n: "3",
    title: "Durata de via\u021B\u0103"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Cookie-ul de consim\u021B\u0103m\xE2nt se p\u0103streaz\u0103 6 luni, dup\u0103 care banerul reapare. Cookie-urile Google Analytics au durate stabilite de furnizor, de regul\u0103 p\xE2n\u0103 la 24 de luni pentru identificatorul de vizitator.")), /*#__PURE__*/React.createElement(Sec, {
    n: "4",
    title: "Cookie-uri ale ter\u021Bilor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Google Analytics este furnizat de Google Ireland Limited. Serviciul plaseaz\u0103 cookie-uri proprii, guvernate de politica de confiden\u021Bialitate a furnizorului. \xCEn timpul procesului de plat\u0103 e\u0219ti redirec\u021Bionat c\u0103tre pagina securizat\u0103 a procesatorului de pl\u0103\u021Bi, care folose\u0219te propriile cookie-uri, necesare tranzac\u021Biei.")), /*#__PURE__*/React.createElement(Sec, {
    n: "5",
    title: "Leg\u0103tura cu prelucrarea datelor"
  }, /*#__PURE__*/React.createElement("p", {
    style: S.p
  }, "Modul \xEEn care prelucr\u0103m datele cu caracter personal este descris \xEEn ", /*#__PURE__*/React.createElement(L, {
    to: "politica-confidentialitate",
    onNav: onNav
  }, "Politica de confiden\u021Bialitate"), ".")));
}

/* ══════════════════════════════════════
   DISPATCHER
══════════════════════════════════════ */
const LEGAL_PAGES = {
  'termeni-si-conditii': TermsPage,
  'politica-confidentialitate': PrivacyPage,
  'politica-gdpr': GdprPage,
  'politica-livrare': DeliveryPage,
  'politica-anulare': CancellationPage,
  'dreptul-de-retragere': WithdrawalPage,
  'politica-cookies': CookiePage
};
function PolicyPage({
  onNav,
  type
}) {
  const Page = LEGAL_PAGES[type] || TermsPage;
  return /*#__PURE__*/React.createElement(Page, {
    onNav: onNav
  });
}
Object.assign(window, {
  PolicyPage,
  LEGAL_PAGES
});

})();