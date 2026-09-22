/* ═════════════════════════════════════════════════════════
   INFORMS - consimțământ cookie + Google Analytics

   Încărcat de paginile statice și de aplicație, ca să existe o
   singură definiție. Biblioteca este vanilla-cookieconsent v3
   (MIT, gratuită, fără cont), încărcată înaintea acestui fișier.

   Google Analytics NU se încarcă până când vizitatorul nu acceptă
   categoria „analiză”. La retragerea acordului, cookie-urile _ga
   se șterg și pagina se reîncarcă, ca scriptul GA să nu mai ruleze.

   Deschiderea preferințelor: orice element cu
   data-cc="show-preferencesModal" sau CookieConsent.showPreferences().
   ═════════════════════════════════════════════════════════ */

(function () {
  const GA_ID = 'G-G2RJ4GKPJ1';
  let gaLoaded = false;

  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /* Fără acord pentru analiză, ștergem la fiecare încărcare orice
     cookie _ga rămas: GA îl poate rescrie în fereastra dintre retragerea
     acordului și reîncărcarea paginii. GA îl pune pe domeniul principal
     (.informs.ro), deci îl ștergem și acolo, nu doar pe gazda curentă. */
  function clearGA() {
    const host = location.hostname;
    const domains = ['', host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      const name = c.split('=')[0].trim();
      if (!/^_ga/.test(name) && name !== '_gid') return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function syncGA() {
    if (window.CookieConsent.acceptedCategory('analytics')) loadGA();
    else clearGA();
  }

  if (!window.CookieConsent) {
    // Biblioteca nu s-a încărcat (CDN blocat): fără acord, fără GA.
    console.warn('CookieConsent indisponibil; Google Analytics rămâne oprit.');
    return;
  }

  window.CookieConsent.run({
    cookie: { name: 'informs_consent', expiresAfterDays: 182 },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false },
    },

    onFirstConsent: syncGA,
    onConsent: syncGA,
    onChange: syncGA,

    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: '_gid' }],
          reloadPage: true,
        },
      },
    },

    language: {
      default: 'ro',
      translations: {
        ro: {
          consentModal: {
            title: 'Folosim cookie-uri',
            description:
              'Cookie-urile strict necesare țin site-ul funcțional. Cu acordul tău, folosim și ' +
              'Google Analytics, ca să vedem ce pagini sunt utile. Nu folosim cookie-uri de publicitate.',
            acceptAllBtn: 'Accept toate',
            acceptNecessaryBtn: 'Doar necesare',
            showPreferencesBtn: 'Alege',
            footer: '<a href="/politica-cookies">Politica de cookie-uri</a>',
          },
          preferencesModal: {
            title: 'Preferințe cookie',
            acceptAllBtn: 'Accept toate',
            acceptNecessaryBtn: 'Doar necesare',
            savePreferencesBtn: 'Salvează alegerea',
            closeIconLabel: 'Închide',
            sections: [
              {
                description:
                  'Alegi ce categorii de cookie-uri permiți. Poți schimba alegerea oricând, din ' +
                  'linkul „Setări cookie” din subsolul paginii.',
              },
              {
                title: 'Strict necesare',
                description:
                  'Asigură funcționarea site-ului și memorează alegerea ta privind cookie-urile. ' +
                  'Nu pot fi dezactivate.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analiză',
                description:
                  'Google Analytics 4: ce pagini sunt vizitate, cât durează o vizită și de pe ce ' +
                  'tip de dispozitiv. Datele sunt agregate.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', domain: 'Domeniu', desc: 'Rol', exp: 'Durată' },
                  body: [
                    { name: '_ga', domain: 'informs.ro', desc: 'Deosebește vizitatorii', exp: '2 ani' },
                    { name: '_ga_*', domain: 'informs.ro', desc: 'Păstrează starea sesiunii', exp: '2 ani' },
                  ],
                },
              },
              {
                title: 'Mai multe informații',
                description:
                  'Detalii în <a href="/politica-cookies">Politica de cookie-uri</a>. Pentru întrebări: ' +
                  '<a href="mailto:office@informs.ro">office@informs.ro</a>.',
              },
            ],
          },
        },
      },
    },
  });
})();
