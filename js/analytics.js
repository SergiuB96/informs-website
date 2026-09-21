/* ═════════════════════════════════════════════════════════
   INFORMS - Google Analytics

   Incarcat de paginile statice si de aplicatie, ca sa existe o
   singura definitie.

   Nu exista banner de consimtamant: decizie asumata. Biblioteca
   vanilla-cookieconsent a fost scoasa, pentru ca importul ei era
   gresit si bannerul nu a rulat niciodata, iar pastrarea unui banner
   nefunctional era mai rea decat lipsa lui.
   ═════════════════════════════════════════════════════════ */

const GA_ID = 'G-G2RJ4GKPJ1';

window.addEventListener('load', function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_ID);
});
