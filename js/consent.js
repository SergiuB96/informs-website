/* ═════════════════════════════════════════════════════════
   INFORMS — analytics si consimțământ cookie-uri

   Mutat din app.html ca sa fie identic pe paginile statice si pe
   cele servite de aplicatie. Comportamentul este neschimbat fata de
   varianta de dinainte.
   ═════════════════════════════════════════════════════════ */

/* ── Google Analytics ── */
window.addEventListener('load', function() {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-G2RJ4GKPJ1';
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-G2RJ4GKPJ1');
    });

/* ── Banner de consimțământ ── */
window.addEventListener('load', async function() {
    await import('https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.0.1/dist/cookieconsent.esm.js');

    CookieConsent.run({
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
    }); // end load listener
