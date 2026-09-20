/* ═════════════════════════════════════════════════════════
   INFORMS — analytics si consimțământ cookie-uri

   Folosit si de paginile statice, si de aplicatie, ca sa nu existe
   doua comportamente diferite pe acelasi site.

   Google Analytics se incarca DOAR dupa ce vizitatorul accepta
   categoria „analiza”. Inainte se incarca neconditionat, desi
   bannerul declara categoria dezactivata implicit: interfata promitea
   o alegere pe care implementarea nu o respecta.
   ═════════════════════════════════════════════════════════ */

const GA_ID = 'G-G2RJ4GKPJ1';
let gaPornit = false;

function pornesteAnalytics() {
  if (gaPornit) return;
  gaPornit = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_ID);
}

/* Daca cineva retrage consimtamantul dupa ce l-a dat, scriptul e deja
   incarcat. Ii spunem sa nu mai scrie cookie-uri; la urmatoarea
   incarcare a paginii nici nu mai porneste. */
function opresteAnalytics() {
  if (!gaPornit || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', { analytics_storage: 'denied' });
}

function aplica() {
  if (window.CookieConsent && CookieConsent.acceptedCategory('analytics')) {
    pornesteAnalytics();
  } else {
    opresteAnalytics();
  }
}

window.addEventListener('load', async function () {
  await import('https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.0.1/dist/cookieconsent.esm.js');

  CookieConsent.run({
    /* Se apeleaza la incarcare, cu alegerea deja salvata, si de
       fiecare data cand vizitatorul si-o schimba. */
    onConsent: aplica,
    onChange: aplica,

    guiOptions: {
      consentModal: {
        layout: 'bar',
        position: 'bottom',
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: { enabled: false },
    },
    language: {
      default: 'ro',
      translations: {
        ro: {
          consentModal: {
            title: 'Folosim cookie-uri',
            description: 'Utilizăm cookie-uri necesare pentru funcționarea site-ului și, opțional, cookie-uri de analiză (Google Analytics) pentru a înțelege cum este utilizat site-ul. Datele de analiză sunt anonimizate.',
            acceptAllBtn: 'Acceptă toate',
            acceptNecessaryBtn: 'Doar necesare',
            showPreferencesBtn: 'Setări',
            footer: '<a href="/politica-confidentialitate">Politica de confidențialitate</a> · <a href="/termeni-si-conditii">Termeni și condiții</a> · <a href="/politica-cookies">Politica de cookie-uri</a>',
          },
          preferencesModal: {
            title: 'Preferințe cookie-uri',
            acceptAllBtn: 'Acceptă toate',
            acceptNecessaryBtn: 'Doar necesare',
            savePreferencesBtn: 'Salvează preferințele',
            closeIconLabel: 'Închide',
            sections: [
              {
                title: 'Cookie-uri necesare',
                description: 'Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului și nu pot fi dezactivate.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookie-uri de analiză',
                description: 'Utilizăm Google Analytics pentru a înțelege cum este utilizat site-ul (pagini vizitate, durata sesiunii, dispozitiv). Datele sunt anonimizate și nu sunt partajate cu terți în scop comercial.',
                linkedCategory: 'analytics',
              },
            ],
          },
        },
      },
    },
  });
});
