/* ═══════════════════════════════════════════════════════════
   informs - comportament UI
   Fără dependențe, fără backend.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MOBILE_BP = 1023;
  var COUNT_DURATION = 1600;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header sticky state ──────────────────────────────── */
  function initStickyHeader() {
    var hdr = document.getElementById('hdr');
    if (!hdr) return;

    var ticking = false;
    function update() {
      hdr.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ── Megamenu (hover pe desktop, click oriunde) ───────── */
  function initMegaMenu() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item.has-menu'));
    if (!items.length) return;

    var closeTimer = null;

    function closeAll(except) {
      items.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        var btn = item.querySelector('.nav__link');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    function open(item) {
      window.clearTimeout(closeTimer);
      closeAll(item);
      item.classList.add('is-open');
      var btn = item.querySelector('.nav__link');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    items.forEach(function (item) {
      var btn = item.querySelector('.nav__link');

      item.addEventListener('mouseenter', function () { open(item); });
      item.addEventListener('mouseleave', function () {
        closeTimer = window.setTimeout(function () { closeAll(null); }, 140);
      });

      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (item.classList.contains('is-open')) closeAll(null);
          else open(item);
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__item.has-menu')) closeAll(null);
    });
  }

  /* ── Selector de limbă ────────────────────────────────── */
  function initLangMenu() {
    var lang = document.querySelector('.lang');
    if (!lang) return;
    var btn = lang.querySelector('.lang__btn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      lang.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      lang.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── Drawer mobil ─────────────────────────────────────── */
  function initDrawer() {
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
      drawer.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE_BP) setOpen(false);
    });
  }

  /* ── Scroll reveal + counters ─────────────────────────────
     Verificare pe scroll în loc de IntersectionObserver: un salt
     brusc (deep-link, restaurarea poziției, captură full-page)
     lăsa secțiunile sărite invizibile pentru totdeauna.
     ───────────────────────────────────────────────────────── */
  var VISIBLE_MARGIN = 0.9;   // cât din viewport trebuie atins
  var watchers = [];          // { el, hit }

  /* Elementele care intră în ecran în același cadru apar pe rând,
     nu toate deodată: fiecare cu REVEAL_STEP ms după precedentul. */
  var REVEAL_STEP = 90;
  var REVEAL_MAX_DELAY = 450;

  function sweep() {
    var limit = window.innerHeight * VISIBLE_MARGIN;
    var remaining = [];
    var batch = 0;

    watchers.forEach(function (w) {
      var top = w.el.getBoundingClientRect().top;
      if (top < limit) {
        w.hit(w.el, Math.min(batch * REVEAL_STEP, REVEAL_MAX_DELAY));
        if (w.stagger) batch += 1;
      } else {
        remaining.push(w);
      }
    });

    watchers = remaining;
  }

  function initSweep() {
    var scheduled = false;
    function onScroll() {
      if (scheduled || !watchers.length) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        sweep();
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sweep();
  }

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    els.forEach(function (el) {
      watchers.push({
        el: el,
        stagger: true,
        hit: function (node, delay) {
          if (delay) node.style.transitionDelay = delay + 'ms';
          node.classList.add('is-in');
          /* După apariție scoatem marcajul: întârzierea și tranziția lentă
             nu au voie să rămână pe hover-ul cardurilor. */
          setTimeout(function () {
            node.style.transitionDelay = '';
            node.removeAttribute('data-reveal');
            node.classList.remove('is-in');
          }, (delay || 0) + 800);
        }
      });
    });
  }

  /* Titlurile, etichetele și textele de introducere din secțiuni primesc
     efectul automat, fără data-reveal scris în fiecare pagină. Doar cele
     aflate sub primul ecran: cele deja vizibile ar clipi (apar, dispar,
     reapar) pentru că scriptul rulează după prima randare. */
  var AUTO_REVEAL = [
    'main .sect .kicker', 'main .sect .h2', 'main .sect h2', 'main .sect .lead',
    'main .band__head', 'main .sect .proc__step', 'main .sect .issue'
  ].join(',');

  function autoReveal() {
    if (reduceMotion) return;
    var fold = window.innerHeight;
    Array.prototype.slice.call(document.querySelectorAll(AUTO_REVEAL)).forEach(function (el) {
      if (el.hasAttribute('data-reveal') || el.closest('[data-reveal]')) return;
      if (el.getBoundingClientRect().top < fold) return;
      el.setAttribute('data-reveal', '');
    });
  }

  function initCounters() {
    var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length) return;

    function format(n) { return n.toLocaleString('ro-RO'); }

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';

      if (reduceMotion) {
        el.textContent = format(target) + suffix;
        return;
      }

      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / COUNT_DURATION, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(Math.round(target * eased)) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    /* HTML-ul conține valoarea finală, ca s-o vadă previzualizările de
       link și oricine fără JavaScript. Pornim de la zero doar aici. */
    nums.forEach(function (el) {
      if (!reduceMotion) el.textContent = format(0) + (el.getAttribute('data-suffix') || '');
      watchers.push({ el: el, hit: run });
    });
  }

  /* ── Marquee: dublează conținutul pentru buclă continuă ─ */
  function initMarquee() {
    var row = document.getElementById('marqueeRow');
    if (!row) return;
    row.innerHTML += row.innerHTML;

    var btn = document.getElementById('marqueePause');
    var marquee = row.closest('.marquee');
    if (!btn || !marquee) return;
    if (reduceMotion) { btn.hidden = true; return; }

    btn.addEventListener('click', function () {
      var paused = marquee.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Pornește derularea benzii' : 'Oprește derularea benzii');
    });
  }

  /* ── Carusel de carduri ──────────────────────────────────
     Derularea e nativă (scroll-snap în CSS); aici doar punctele
     și săgețile, sincronizate cu poziția. Un punct = o poziție la
     care se poate ajunge, nu un card: pe desktop se văd trei odată.
     Fără derulare automată.
     ───────────────────────────────────────────────────────── */
  function initCarousel() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (root) {
      var track = root.querySelector('.car__track');
      var dotsWrap = root.querySelector('.car__dots');
      var prev = root.querySelector('.car__arrow[data-dir="-1"]');
      var next = root.querySelector('.car__arrow[data-dir="1"]');
      var slides = track ? track.querySelectorAll('.car__slide') : [];
      if (!track || slides.length < 2) return;

      var dots = [];
      var count = 0;

      function step() { return slides[1].offsetLeft - slides[0].offsetLeft; }
      function maxScroll() { return track.scrollWidth - track.clientWidth; }

      function current() {
        if (track.scrollLeft >= maxScroll() - 2) return count - 1;
        return Math.round(track.scrollLeft / step());
      }

      function go(i) {
        var left = Math.min(i * step(), maxScroll());
        track.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
      }

      function paint() {
        var i = current();
        dots.forEach(function (d, n) { d.setAttribute('aria-current', n === i ? 'true' : 'false'); });
        if (prev) prev.disabled = i <= 0;
        if (next) next.disabled = i >= count - 1;
      }

      function build() {
        var max = maxScroll();
        root.classList.toggle('is-static', max <= 2);
        count = max <= 2 ? 1 : Math.round(max / step()) + 1;
        if (dotsWrap) {
          dotsWrap.innerHTML = '';
          dots = [];
          for (var n = 0; n < count; n++) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'car__dot';
            dot.setAttribute('aria-label', 'Poziția ' + (n + 1) + ' din ' + count);
            dot.addEventListener('click', go.bind(null, n));
            dotsWrap.appendChild(dot);
            dots.push(dot);
          }
        }
        paint();
      }

      if (prev) prev.addEventListener('click', function () { go(current() - 1); });
      if (next) next.addEventListener('click', function () { go(current() + 1); });

      var ticking = false;
      track.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; paint(); });
      }, { passive: true });

      var resizeTimer = null;
      window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(build, 150);
      });

      build();
    });
  }

  /* ── Scrollspy pentru bara de ancore ──────────────────────
     Prezent doar pe paginile interioare; pe homepage iese imediat.
     ───────────────────────────────────────────────────────── */
  function initScrollSpy() {
    var bar = document.getElementById('anchors');
    if (!bar) return;

    var links = Array.prototype.slice.call(bar.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var targets = links
      .map(function (a) {
        var el = document.getElementById(a.getAttribute('href').slice(1));
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    function offset() {
      // înălțimea header-ului plus a barei de ancore, amândouă lipite
      return bar.getBoundingClientRect().bottom + 8;
    }

    function update() {
      var line = offset();
      var current = null;

      targets.forEach(function (t) {
        if (t.el.getBoundingClientRect().top <= line) current = t;
      });

      // sub ultima secțiune marcăm tot ultima, nu nimic
      var atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) current = targets[targets.length - 1];

      targets.forEach(function (t) {
        t.link.classList.toggle('is-active', t === current);
      });
    }

    var scheduled = false;
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        update();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ── Listare filtrabilă ───────────────────────────────────
     Prezentă doar pe paginile de tip listă; altfel iese imediat.
     Datele stau în DOM, nu într-un JSON separat: fără backend,
     cardurile trebuie oricum să existe în HTML pentru indexare.
     ───────────────────────────────────────────────────────── */
  var PAGE_SIZE = 9;
  var PAGE_STEP = 6;

  // "Politică" și "politica" trebuie să se potrivească
  function fold(s) {
    var t = String(s).toLowerCase();
    try {
      t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    } catch (err) { /* browser vechi: căutăm cu diacritice */ }
    return t.replace(/\s+/g, ' ').trim();
  }

  function initListing() {
    var grid = document.getElementById('lgrid');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.wcard'));
    if (!cards.length) return;

    var input = document.getElementById('q');
    var clear = document.getElementById('qclear');
    var search = document.getElementById('lsearch');
    var chipBox = document.getElementById('fchips');
    var sortSel = document.getElementById('sort');
    var count = document.getElementById('lcount');
    var empty = document.getElementById('lempty');
    var reset = document.getElementById('lreset');
    var more = document.getElementById('lmore');
    var moreBtn = document.getElementById('lmorebtn');

    // indexăm o dată, nu la fiecare tastă
    var items = cards.map(function (el) {
      var title = el.querySelector('.wcard__title');
      var tag = el.querySelector('.wcard__tag');
      return {
        el: el,
        type: el.getAttribute('data-type') || '',
        date: el.getAttribute('data-date') || '',
        title: title ? title.textContent : '',
        hay: fold((title ? title.textContent : '') + ' ' + (tag ? tag.textContent : ''))
      };
    });

    var state = { type: 'toate', q: '', sort: 'recent', shown: PAGE_SIZE };

    function matching() {
      var q = fold(state.q);
      return items.filter(function (it) {
        if (state.type !== 'toate' && it.type !== state.type) return false;
        if (q && it.hay.indexOf(q) === -1) return false;
        return true;
      });
    }

    function sorted(list) {
      var out = list.slice();
      if (state.sort === 'titlu') {
        out.sort(function (a, b) { return a.title.localeCompare(b.title, 'ro'); });
      } else if (state.sort === 'vechi') {
        out.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      } else {
        out.sort(function (a, b) { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
      }
      return out;
    }

    function plural(n) {
      if (n === 1) return '1 material';
      return n + ' materiale';
    }

    function render() {
      var list = sorted(matching());

      // ordinea vizuală = ordinea în DOM, ca tabularea să urmeze ochiul
      list.forEach(function (it) { grid.appendChild(it.el); });

      var visible = list.slice(0, state.shown);
      var shownSet = new Set ? new Set(visible.map(function (i) { return i.el; })) : null;

      items.forEach(function (it) {
        var on = shownSet ? shownSet.has(it.el) : visible.indexOf(it) !== -1;
        it.el.hidden = !on;
      });

      if (count) {
        count.innerHTML = visible.length < list.length
          ? '<strong>' + visible.length + '</strong> din ' + plural(list.length)
          : '<strong>' + list.length + '</strong> ' + (list.length === 1 ? 'material' : 'materiale');
      }
      if (empty) empty.classList.toggle('is-on', list.length === 0);

      if (more) {
        var rest = list.length - visible.length;
        more.hidden = rest <= 0;
        if (moreBtn && rest > 0) {
          moreBtn.textContent = 'Încarcă încă ' + Math.min(PAGE_STEP, rest);
        }
      }

      // cardurile noi intră cu aceeași animație ca restul paginii
      if (!reduceMotion) {
        visible.forEach(function (it) { it.el.classList.add('is-in'); });
      }
    }

    function setType(type) {
      state.type = type;
      state.shown = PAGE_SIZE;
      if (chipBox) {
        chipBox.querySelectorAll('.fchip').forEach(function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-filter') === type ? 'true' : 'false');
        });
      }
      render();
    }

    if (chipBox) {
      chipBox.addEventListener('click', function (e) {
        var btn = e.target.closest('.fchip');
        if (btn) setType(btn.getAttribute('data-filter'));
      });
    }

    if (input) {
      var t = null;
      input.addEventListener('input', function () {
        if (search) search.classList.toggle('has-value', input.value !== '');
        window.clearTimeout(t);
        t = window.setTimeout(function () {
          state.q = input.value;
          state.shown = PAGE_SIZE;
          render();
        }, 140);
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); }
      });
    }

    if (clear) {
      clear.addEventListener('click', function () {
        if (!input) return;
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.focus();
      });
    }

    if (sortSel) {
      sortSel.addEventListener('change', function () {
        state.sort = sortSel.value;
        render();
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        state.shown += PAGE_STEP;
        render();
      });
    }

    if (reset) {
      reset.addEventListener('click', function () {
        if (input) { input.value = ''; }
        if (search) search.classList.remove('has-value');
        state.q = '';
        setType('toate');
      });
    }

    // linkurile din meniu vin cu filtrul in hash: resurse.html#blog
    function fromHash() {
      var h = (window.location.hash || '').replace(/^#/, '');
      if (!h) return false;
      var known = chipBox && chipBox.querySelector('.fchip[data-filter="' + h + '"]');
      if (!known) return false;
      setType(h);
      return true;
    }
    window.addEventListener('hashchange', function () {
      if (!fromHash()) setType('toate');
    });

    if (!fromHash()) render();
  }

  /* ── Newsletter (machetă: validează, nu trimite) ──────────── */
  function initNewsletter() {
    var form = document.getElementById('nltform');
    if (!form) return;
    var mail = document.getElementById('nltmail');
    var note = document.getElementById('nltnote');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!mail || !note) return;
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
      note.textContent = ok
        ? 'Machetă demonstrativă: adresa e validă, dar nu se trimite nimic.'
        : 'Adresa nu pare validă. Verific-o și încearcă din nou.';
      note.style.color = ok ? 'var(--muted-2)' : '#FF7AA8';
    });
  }

  /* ── Formular de contact ──────────────────────────────────
     Succesul se afișează NUMAI după un răspuns bun de la server.
     Orice altceva (rețea picată, 4xx, 5xx, endpoint absent) este
     raportat ca eroare, cu adresa de email ca alternativă.
     ───────────────────────────────────────────────────────── */
  var CONTACT_ENDPOINT = '/api/contact';
  var MIN_MESAJ = 20;

  function initContactForm() {
    var form = document.getElementById('cform');
    if (!form) return;

    var note = document.getElementById('cnote');
    var submit = document.getElementById('csubmit');

    function box(name) { return form.querySelector('[data-field="' + name + '"]'); }
    function mark(name, bad) {
      var b = box(name);
      if (b) b.classList.toggle('is-bad', !!bad);
    }

    function say(kind, text) {
      if (!note) return;
      note.textContent = text;
      note.className = 'fnote is-on ' + (kind === 'ok' ? 'is-ok' : 'is-err');
    }

    function validate(data) {
      var bad = [];
      if (!data.nume || data.nume.length < 2) bad.push('nume');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '')) bad.push('email');
      // telefonul e optional, dar daca e completat trebuie sa arate a numar
      if (data.telefon && !/^[+()\d\s.-]{7,}$/.test(data.telefon)) bad.push('telefon');
      if (!data.subiect) bad.push('subiect');
      if (!data.mesaj || data.mesaj.length < MIN_MESAJ) bad.push('mesaj');
      if (!data.acord) bad.push('acord');
      return bad;
    }

    // curata marcajul de eroare de indata ce omul corecteaza
    form.addEventListener('input', function (e) {
      var b = e.target.closest('[data-field]');
      if (b) b.classList.remove('is-bad');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        nume: (form.nume.value || '').trim(),
        organizatie: (form.organizatie.value || '').trim(),
        email: (form.email.value || '').trim(),
        telefon: (form.telefon.value || '').trim(),
        subiect: form.subiect.value || '',
        mesaj: (form.mesaj.value || '').trim(),
        acord: form.acord.checked
      };

      ['nume', 'email', 'telefon', 'subiect', 'mesaj', 'acord'].forEach(function (n) { mark(n, false); });

      var bad = validate(data);
      if (bad.length) {
        bad.forEach(function (n) { mark(n, true); });
        say('err', 'Mai sunt ' + bad.length + (bad.length === 1 ? ' câmp de corectat.' : ' câmpuri de corectat.'));
        var first = box(bad[0]);
        if (first) {
          var input = first.querySelector('input, select, textarea');
          if (input) input.focus();
        }
        return;
      }

      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Se trimite...';
      say('err', '');
      if (note) note.className = 'fnote';

      window.fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return {}; });
      }).then(function (out) {
        // un 200 cu {ok:false} tot inseamna esec
        if (out && out.ok === false) throw new Error(out.error || 'respins de server');
        say('ok', 'Mesajul a fost trimis. Îți răspundem în cel mult o zi lucrătoare, la ' + data.email + '.');
        form.reset();
      }).catch(function (err) {
        say('err', 'Mesajul nu a putut fi trimis (' + err.message + '). Scrie-ne direct la office@informs.ro și îți răspundem la fel de repede.');
      }).then(function () {
        submit.disabled = false;
        submit.textContent = original;
      });
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function boot() {
    initStickyHeader();
    initMegaMenu();
    initLangMenu();
    initDrawer();
    initMarquee();
    initCarousel();
    autoReveal();
    initReveal();
    initCounters();
    initSweep();
    initScrollSpy();
    initListing();
    initNewsletter();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
