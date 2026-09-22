/* ═════════════════════════════════════════════════════════
   INFORMS - apariție eșalonată în aplicație (magazin, politici,
   stare comandă). Același efect ca js/main.js pe paginile statice.

   React adaugă elementele după încărcare și la fiecare filtrare, deci
   nu le putem marca în HTML. Un MutationObserver le marchează cu
   data-sr înainte de randare (fără clipire), iar un
   IntersectionObserver le arată când ajung în ecran: cele care intră
   împreună apar pe rând, la STEP ms una după alta.

   Se încarcă înaintea App.js (defer păstrează ordinea), ca observatorul
   să existe când React desenează prima dată.
   ═════════════════════════════════════════════════════════ */

(function () {
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var TARGETS = [
    '.sp-seap', '.sp-profile', '.shop-tabs', '.shop-product-card',
    '.shop-empty', '.shop-cta-banner', 'main .sec .card'
  ].join(',');
  var STEP = 90;
  var MAX_DELAY = 450;
  var DURATION = 800;

  var queue = [];
  var flushing = false;

  function show(el, delay) {
    if (delay) el.style.transitionDelay = delay + 'ms';
    el.setAttribute('data-sr', 'in');
    /* după apariție scoatem marcajul, ca hover-ul cardurilor să rămână rapid */
    setTimeout(function () {
      el.style.transitionDelay = '';
      el.removeAttribute('data-sr');
    }, delay + DURATION);
  }

  /* toate intrările din același cadru primesc întârzieri crescătoare,
     în ordinea din pagină */
  function flush() {
    flushing = false;
    queue.sort(function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    queue.forEach(function (el, i) { show(el, Math.min(i * STEP, MAX_DELAY)); });
    queue = [];
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      queue.push(e.target);
    });
    if (queue.length && !flushing) {
      flushing = true;
      requestAnimationFrame(flush);
    }
  }, { rootMargin: '0px 0px -8% 0px' });

  function tag(node) {
    if (node.nodeType !== 1) return;
    var found = node.matches(TARGETS) ? [node] : [];
    found = found.concat(Array.prototype.slice.call(node.querySelectorAll(TARGETS)));
    found.forEach(function (el) {
      if (el.hasAttribute('data-sr')) return;
      el.setAttribute('data-sr', '');
      io.observe(el);
    });
  }

  function start() {
    var root = document.getElementById('root');
    if (!root) return;
    tag(root);
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, tag);
      });
    }).observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
