/* Derulare lină (Lenis, vendor/lenis.min.js), pe paginile statice și
   în aplicație. Doar rotița și trackpad-ul: pe telefon derularea
   rămâne cea nativă (syncTouch implicit oprit), ca și pentru cine a
   cerut animații reduse în sistem.

   `prevent`: zonele care se derulează singure (fereastra de produs,
   bannerul de cookie-uri, meniul mobil) primesc rotița nativ, altfel
   Lenis ar derula pagina din spatele lor.
   `anchors`: linkurile #ancoră derulează lin și țin cont de
   scroll-margin-top (bara lipicioasă de pe Servicii). */
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELF_SCROLLING = '.shop-modal-overlay, .pv-overlay, #cc-main, .drawer, [data-lenis-prevent]';

  window.lenis = new Lenis({
    lerp: 0.08,
    anchors: true,
    autoRaf: true,
    prevent: function (node) {
      return !!(node && node.closest && node.closest(SELF_SCROLLING));
    },
  });
})();
