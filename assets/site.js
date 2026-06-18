/* ============================================================
   CARDINAL STUDIO — shared site behavior
   Header/footer injection, nav, motion, animated background.
   ============================================================ */
(function () {
  'use strict';

  // ---- Brand mark (Cardinal Studio phoenix icon) ----
  var MARK = '<img src="assets/icon.png" alt="" aria-hidden="true">';

  var WA = '<svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.02 8.02 0 0 1 2.37 5.72c0 4.48-3.65 8.12-8.12 8.12a8.13 8.13 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.05 8.05 0 0 1-1.25-4.32c0-4.48 3.64-8.12 8.12-8.12Zm-2.7 4.42c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41-.14-.01-.3-.01-.46-.01Z"/></svg>';

  var ARR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  // ---- Theme toggle icons (moon = switch to light · sun = switch to dark) ----
  var THEME_BTN = '' +
    '<button class="theme-toggle" id="themeToggle" aria-label="Toggle light or dark theme" title="Toggle theme">' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>' +
    '</button>';

  var WA_LINK = 'https://wa.me/351911112884';

  var NAV = [
    ['Home', 'index.html'],
    ['About', 'about.html'],
    ['Services', 'services.html'],
    ['Contact', 'contact.html']
  ];

  function current() {
    var p = location.pathname.split('/').pop();
    return (!p || p === '') ? 'index.html' : p;
  }

  // ---------- Build header ----------
  function buildHeader() {
    var here = current();
    // active link also gets aria-current="page" for screen readers
    var navItem = function (n) {
      var active = (n[1] === here) ? ' class="active" aria-current="page"' : '';
      return '<a href="' + n[1] + '"' + active + '>' + n[0] + '</a>';
    };
    var links = NAV.map(navItem).join('');
    var mlinks = NAV.map(navItem).join('');

    var html =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header" id="siteHeader">' +
        '<div class="wrap nav">' +
          '<a class="brand" href="index.html" aria-label="Cardinal Studio home">' +
            '<span class="brand-mark">' + MARK + '</span>' +
            '<span>Cardinal Studio<small>One builder · full stack</small></span>' +
          '</a>' +
          '<nav class="nav-links" aria-label="Primary">' + links + '</nav>' +
          '<div class="nav-tools">' +
            THEME_BTN +
            '<a class="btn btn--primary btn--sm nav-cta desktop-cta" href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA + 'WhatsApp</a>' +
            '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<nav class="mnav" id="mnav" aria-label="Mobile">' + mlinks +
        '<a class="btn btn--primary" href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA + 'Message on WhatsApp</a>' +
      '</nav>';

    var host = document.getElementById('site-header') || document.body;
    if (host.id === 'site-header') host.outerHTML = html;
    else host.insertAdjacentHTML('afterbegin', html);
  }

  // ---------- Build footer ----------
  function buildFooter() {
    var year = new Date().getFullYear();
    var col = function (title, items) {
      return '<div class="footer-col"><h2>' + title + '</h2>' +
        items.map(function (i) { return '<a href="' + i[1] + '"' + (i[2] || '') + '>' + i[0] + '</a>'; }).join('') +
        '</div>';
    };
    var html =
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div class="footer-col">' +
              '<a class="brand" href="index.html"><span class="brand-mark">' + MARK + '</span><span>Cardinal Studio</span></a>' +
              '<p class="footer-brandline">One technical partner who builds your entire digital layer — site, CRM, and automation — end to end.</p>' +
            '</div>' +
            col('Studio', [['About', 'about.html'], ['Services', 'services.html']]) +
            '<div class="footer-col"><h2>Contact</h2>' +
              '<a href="' + WA_LINK + '" target="_blank" rel="noopener">WhatsApp ↗</a>' +
              '<a href="contact.html">Start a project</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>© ' + year + ' Cardinal Studio — Built end to end by one person.</span>' +
            '<span style="display:flex;gap:18px;flex-wrap:wrap">' +
              '<a href="privacy.html">Privacy</a><a href="cookies.html">Cookies</a>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</footer>';

    var host = document.getElementById('site-footer');
    if (host) host.outerHTML = html;
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  // ---------- Background canvas: drifting node/flow field ----------
  function initCanvas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Perf: the node field is decorative + pointer-driven. Skip it on small
    // viewports and touch/coarse pointers, where the per-frame O(n²) link loop
    // only burns battery and there's no cursor to interact with.
    if (window.innerWidth < 760 || window.matchMedia('(pointer: coarse)').matches) return;
    var canvas = document.querySelector('canvas.bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, nodes = [], links = [];
    var COUNT = 0;
    // pointer state: target (mx,my), smoothed (sx,sy), presence ramps 0..1
    var mx = -9999, my = -9999, sx = -9999, sy = -9999, present = 0;
    var R = 200;        // interaction radius (px)
    var R2 = R * R;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (sx < -9000) { sx = mx; sy = my; } // snap on first move
    }, { passive: true });
    window.addEventListener('pointerleave', function () { mx = -9999; my = -9999; });
    window.addEventListener('blur', function () { mx = -9999; my = -9999; });

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      COUNT = Math.max(26, Math.min(56, Math.floor(W * H / 26000)));
      seed();
    }
    function seed() {
      nodes = [];
      for (var i = 0; i < COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() < 0.12 ? 1.8 : 1.0,
          red: Math.random() < 0.16
        });
      }
    }
    var pulse = 0;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      pulse += 0.006;

      // smooth the pointer + ramp its presence in/out
      var active = (mx > -9000);
      present += ((active ? 1 : 0) - present) * 0.06;
      if (active) { sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12; }

      // soft glow halo that trails the cursor
      if (present > 0.01) {
        var hr = R * 1.15;
        var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, hr);
        g.addColorStop(0, 'rgba(124,155,190,' + (0.06 * present).toFixed(3) + ')');
        g.addColorStop(0.55, 'rgba(37,99,235,' + (0.03 * present).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(124,155,190,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx, sy, hr, 0, Math.PI * 2);
        ctx.fill();
      }

      // edges
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        // gentle attraction toward the cursor when within reach
        a.glow = 0;
        if (present > 0.01) {
          var mdx = sx - a.x, mdy = sy - a.y;
          var md2 = mdx * mdx + mdy * mdy;
          if (md2 < R2) {
            var pull = (1 - md2 / R2);
            a.glow = pull * present;
            var md = Math.sqrt(md2) || 1;
            a.x += (mdx / md) * pull * pull * 0.6 * present;
            a.y += (mdy / md) * pull * pull * 0.6 * present;
            // connector line from node to cursor
            ctx.strokeStyle = a.red
              ? 'rgba(226,54,54,' + (pull * 0.32 * present).toFixed(3) + ')'
              : 'rgba(124,155,190,' + (pull * 0.3 * present).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(sx, sy);
            ctx.stroke();
          }
        }

        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 19000) {
            var o = (1 - d2 / 19000) * 0.3;
            ctx.strokeStyle = 'rgba(124,155,190,' + o.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        var tw = 0.55 + 0.45 * Math.sin(pulse * 4 + k);
        var gl = n.glow || 0;
        ctx.save();
        if (gl > 0.04) { ctx.shadowBlur = 8 * gl; ctx.shadowColor = n.red ? 'rgba(226,54,54,0.7)' : 'rgba(124,155,190,0.7)'; }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + gl * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = n.red
          ? 'rgba(226,54,54,' + Math.min(1, 0.38 + 0.3 * tw + gl * 0.4).toFixed(3) + ')'
          : 'rgba(124,155,190,' + Math.min(1, 0.26 + 0.26 * tw + gl * 0.45).toFixed(3) + ')';
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
    // Safety: if IO is throttled (e.g. hidden/background iframe) reveal anything
    // already in/near the viewport so the page is never left blank.
    setTimeout(function () {
      els.forEach(function (e) {
        if (e.classList.contains('in')) return;
        var r = e.getBoundingClientRect();
        if (r.top < (window.innerHeight + 200)) e.classList.add('in');
      });
    }, 900);
  }

  // ---------- Animated counters ----------
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    // Honour reduced-motion: skip the count-up, show the final value immediately.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nums.forEach(function (el) {
        var t = parseFloat(el.getAttribute('data-count'));
        var v = (el.getAttribute('data-dec') === '1') ? t.toFixed(1) : Math.round(t).toString();
        el.firstChild ? (el.childNodes[0].nodeValue = v) : (el.textContent = v);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var dec = (el.getAttribute('data-dec') === '1');
        var dur = 1400, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          el.firstChild ? (el.childNodes[0].nodeValue = dec ? v.toFixed(1) : Math.round(v).toString())
                        : (el.textContent = dec ? v.toFixed(1) : Math.round(v).toString());
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  // ---------- Card pointer glow ----------
  function initCardGlow() {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest ? e.target.closest('.card') : null;
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  // ---------- Header behaviors ----------
  function initHeader() {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('navToggle');
    var mnav = document.getElementById('mnav');
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    if (toggle && mnav) {
      toggle.addEventListener('click', function () {
        var open = mnav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mnav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mnav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ---------- expose small helpers ----------
  window.CARDINAL = { WA_LINK: WA_LINK, ARR: ARR, WA: WA };

  // ---------- Auto-wire declarative CTAs ----------
  function initCtas() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      el.setAttribute('href', WA_LINK);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      var label = el.getAttribute('data-wa') || 'Message on WhatsApp';
      el.innerHTML = WA + '<span>' + label + '</span>';
    });
  }

  // ---------- Theme toggle ----------
  // Keep the mobile browser chrome (<meta name="theme-color">) in sync with the
  // active theme. Values match --carbon in each theme.
  function syncThemeColor() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'theme-color'); document.head.appendChild(m); }
    m.setAttribute('content', isLight ? '#E4E6EC' : '#0B0E14');
  }

  function initTheme() {
    syncThemeColor();
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      var next = isLight ? 'dark' : 'light';
      if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('cardinal-theme', next); } catch (e) {}
      syncThemeColor();
    });
    // Dark is the brand default; only an explicit toggle (stored above) switches
    // to light. We intentionally do NOT follow the OS scheme.
  }

  // ---------- Skip-link target ----------
  function initMainTarget() {
    var main = document.querySelector('main');
    if (main && !main.id) { main.id = 'main'; main.setAttribute('tabindex', '-1'); }
  }

  // ---------- boot ----------
  function boot() {
    buildHeader();
    buildFooter();
    initMainTarget();
    initHeader();
    initTheme();
    initCtas();
    initCanvas();
    initReveal();
    initCounters();
    initCardGlow();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
