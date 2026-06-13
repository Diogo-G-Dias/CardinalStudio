/* ============================================================
   CARDINAL STUDIO — hero "one system" demo
   A lead packet travels SITE -> CRM -> AUTOMATION -> CALENDAR,
   activating each node. Ambient loop + interactive input.
   Vanilla, dependency-free. Degrades to a static filled state
   under prefers-reduced-motion and to the noscript hero with JS off.
   ============================================================ */
(function () {
  'use strict';

  var root = document.getElementById('sysflow');
  if (!root) return;

  var stage  = root.querySelector('.sysflow__stage');
  var svg    = root.querySelector('.sysflow__wires');
  var packet = root.querySelector('[data-sf-packet]');
  var form   = root.querySelector('[data-sf-form]');
  var input  = root.querySelector('[data-sf-input]');

  var order = ['site', 'crm', 'auto', 'cal'];
  var nodes = order.map(function (k) { return root.querySelector('.sf-node[data-node="' + k + '"]'); });
  var crmName = root.querySelector('[data-sf-out="crm"] .sf-card__name');
  var calName = root.querySelector('[data-sf-out="cal"] .sf-card__name');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var AMBIENT = ['Sofia M.', 'New enquiry', 'Marco R.', 'A. Silva', 'James P.', 'Priya N.'];
  var SLOTS   = ['Tue · 10:30', 'Thu · 15:00', 'Wed · 09:15', 'Fri · 14:45', 'Mon · 11:00'];
  var ai = 0, si = 0;

  var anchors = [], segs = [];
  var gen = 0;            // bumped to abort the current run / ambient loop
  var raf = null, timer = null;

  // ---------- geometry ----------
  function layout() {
    var sr = stage.getBoundingClientRect();
    var cx = sr.width / 2;
    anchors = nodes.map(function (n) {
      var r = n.getBoundingClientRect();
      return { x: cx, y: (r.top - sr.top) + r.height / 2 };
    });
    svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
    svg.setAttribute('width', sr.width);
    svg.setAttribute('height', sr.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    segs = [];
    for (var i = 0; i < anchors.length - 1; i++) {
      var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', anchors[i].x);     ln.setAttribute('y1', anchors[i].y);
      ln.setAttribute('x2', anchors[i + 1].x); ln.setAttribute('y2', anchors[i + 1].y);
      ln.setAttribute('class', 'sf-wire');
      svg.appendChild(ln);
      segs.push(ln);
    }
    place(anchors[0]);
  }
  function place(p) { packet.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%)'; }

  // ---------- helpers ----------
  function wait(ms) { return new Promise(function (r) { timer = setTimeout(r, ms); }); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function travel(from, to, dur) {
    return new Promise(function (res) {
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), e = easeInOut(p);
        place({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
        if (p < 1) raf = requestAnimationFrame(step); else res();
      }
      raf = requestAnimationFrame(step);
    });
  }

  function reset() {
    nodes.forEach(function (n, i) { if (i > 0) n.classList.remove('is-active'); });
    nodes[0].classList.add('is-active');
    segs.forEach(function (s) { s.classList.remove('is-lit'); });
    crmName.textContent = '—';
    calName.textContent = '—';
    packet.classList.remove('is-on');
    if (anchors[0]) place(anchors[0]);
  }

  // ---------- one full pass ----------
  function step(i, myGen) {
    if (myGen !== gen) return Promise.resolve();
    if (i >= anchors.length - 1) {
      return wait(reduce ? 0 : 1500).then(function () { if (myGen === gen) packet.classList.remove('is-on'); });
    }
    var move = reduce ? Promise.resolve() : travel(anchors[i], anchors[i + 1], 620);
    return move.then(function () {
      if (myGen !== gen) return;
      segs[i].classList.add('is-lit');
      nodes[i + 1].classList.add('is-active');
      return wait(reduce ? 0 : 520).then(function () { return step(i + 1, myGen); });
    });
  }
  function run(name, myGen) {
    reset();
    crmName.textContent = name;
    calName.textContent = SLOTS[(si++) % SLOTS.length];
    return wait(reduce ? 0 : 350).then(function () {
      if (myGen !== gen) return;
      packet.classList.add('is-on');
      return step(0, myGen);
    });
  }

  // ---------- ambient loop ----------
  function startAmbient() {
    if (reduce) { run(AMBIENT[(ai++) % AMBIENT.length], gen); return; }  // static, no loop
    var myGen = ++gen;
    (function loop() {
      if (myGen !== gen) return;
      run(AMBIENT[(ai++) % AMBIENT.length], myGen).then(function () {
        if (myGen !== gen) return;
        timer = setTimeout(loop, 1700);
      });
    })();
  }

  function abort() {
    gen++;
    if (timer) clearTimeout(timer);
    if (raf) cancelAnimationFrame(raf);
  }

  // ---------- interactive input ----------
  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (input.value || '').trim() || 'Your lead';
      abort();
      var myGen = gen;
      input.blur();
      run(name, myGen).then(function () {
        if (myGen !== gen) return;
        input.value = '';
        startAmbient();
      });
    });
  }

  // ---------- lifecycle ----------
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) abort();
    else startAmbient();
  });
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(layout, 200);
  }, { passive: true });

  function init() { layout(); reset(); startAmbient(); }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
