// ============================================================
// Cardinal Studio — "One flow, end to end" 3D scene
// Glowing nodes + tubes + streaming pulses, gentle orbit + bloom.
// ============================================================
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const COL = {
  bone:    0xF4F6FB,
  blue:    0x2563EB,
  blueLt:  0x60A5FF,
  red:     0xE23636,
  glow:    0x7C9BBE,
  carbon:  0x0B0E14,
};

const NODES = [
  { id: 'visitor',  pos: [-7.6,  0.0,  0.0], accent: 'neutral', t: 'VISITOR',      s: 'fills a form'     },
  { id: 'website',  pos: [-2.5,  0.0,  0.0], accent: 'blue',    t: 'WEBSITE',      s: 'captures + posts' },
  { id: 'crm',      pos: [ 2.5,  0.0,  0.0], accent: 'blue',    t: 'CRM',          s: 'creates record'   },
  { id: 'ai',       pos: [ 7.8,  2.7, -1.3], accent: 'red',     t: 'AI FOLLOW-UP', s: 'drafts reply'     },
  { id: 'calendar', pos: [ 7.8, -2.7,  1.3], accent: 'red',     t: 'CALENDAR',     s: 'books slot'       },
];

// connections: [fromId, toId, accent, extra control points]
const CONN = [
  { from: 'visitor',  to: 'website',  accent: 'red'     },
  { from: 'website',  to: 'crm',      accent: 'red'     },
  { from: 'crm',      to: 'ai',       accent: 'blueLt', lift:  1.1 },
  { from: 'crm',      to: 'calendar', accent: 'blueLt', lift: -1.1 },
];

const HALF_W = 1.55; // card half width for edge anchoring

function accentColor(a) {
  if (a === 'red') return COL.red;
  if (a === 'blue') return COL.blue;
  if (a === 'blueLt') return COL.blueLt;
  if (a === 'neutral') return COL.glow;
  return COL.glow;
}

function boot() {
  const root = document.getElementById('flow3d');
  if (!root) return;
  const canvas = root.querySelector('.flow3d-canvas');
  const labelLayer = root.querySelector('.flow3d-labels');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    root.classList.add('flow3d--nogl');
    return;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  // group holds everything so we can orbit it as one
  const world = new THREE.Group();
  world.rotation.x = -0.13;
  scene.add(world);

  // ---- lights ----
  const ambient = new THREE.AmbientLight(0x33405e, 1.1);
  scene.add(ambient);
  const lBlue = new THREE.PointLight(COL.blueLt, 60, 60); lBlue.position.set(-7, 5, 9); scene.add(lBlue);
  const lRed  = new THREE.PointLight(COL.red,    45, 60); lRed.position.set(9, -4, 7);  scene.add(lRed);

  // ---- theme palettes + material registry ----
  const PAL = {
    dark: {
      clear: 0x010103,
      chassis: 0x0c111c, panel: 0x141c2b, panelEdge: 0x2a3550, handle: 0x4a5872,
      chassisMetal: 0.55, panelMetal: 0.4, handleMetal: 0.7,
      neutral: 0x7C9BBE, ambient: 0x33405e, ambientI: 0.65,
      blueLightI: 60, redLightI: 45,
      dust: 0x7C9BBE, dustOp: 0.22,
      bloom: 0.62, bloomThresh: 0.18, bloomRadius: 0.4, ledScale: 0.8, tubeEm: 0.9, tubeOp: 0.6, slitEm: 0.5, particleEm: 1.7,
    },
    light: {
      clear: 0x010103,
      chassis: 0x2A3A52, panel: 0x33455F, handle: 0x7E889B, panelEdge: 0x55708F,
      chassisMetal: 0.3, panelMetal: 0.2, handleMetal: 0.45,
      neutral: 0x9DB4D0, ambient: 0x4A6080, ambientI: 1.6,
      blueLightI: 36, redLightI: 28,
      dust: 0xDCE6F4, dustOp: 0.72,
      bloom: 0.55, bloomThresh: 0.18, bloomRadius: 0.36, ledScale: 0.9, tubeEm: 1.0, tubeOp: 0.7, slitEm: 0.6, particleEm: 1.8,
    },
  };
  let ledScale = 1.0; // applied to LED emissive each frame
  const reg = { edges: [], chassis: [], panels: [], panelEdges: [], handles: [], slits: [], tubes: [], particles: [] };

  const nodeById = {};
  NODES.forEach(n => { nodeById[n.id] = n; });

  // ---- nodes: rack-mount server units ----
  const blink = []; // blinking status LEDs
  NODES.forEach(n => {
    const g = new THREE.Group();
    g.position.set(n.pos[0], n.pos[1], n.pos[2]);
    const acc = accentColor(n.accent);

    const W = 2.8, H = 1.85, D = 1.05, frontZ = D / 2;

    // chassis
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0c111c, metalness: 0.55, roughness: 0.45 });
    reg.chassis.push(chassisMat);
    g.add(new THREE.Mesh(new THREE.BoxGeometry(W, H, D), chassisMat));
    // accent edge frame
    const edgeMat = new THREE.LineBasicMaterial({ color: acc, transparent: true, opacity: 0.85 });
    reg.edges.push({ mat: edgeMat, accent: n.accent });
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), edgeMat));

    // stacked rack-unit blades
    const units = 3, gap = 0.09;
    const bladeH = (H - gap * (units + 1)) / units;
    const ledColors = [0x36E27A, acc, 0xE2A436]; // green / accent / amber
    for (let u = 0; u < units; u++) {
      const y = H / 2 - gap - bladeH / 2 - u * (bladeH + gap);

      // face panel
      const panelGeo = new THREE.BoxGeometry(W - 0.16, bladeH, 0.07);
      const panelMat = new THREE.MeshStandardMaterial({ color: 0x141c2b, metalness: 0.4, roughness: 0.6 });
      reg.panels.push(panelMat);
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, y, frontZ - 0.015);
      g.add(panel);
      const poMat = new THREE.LineBasicMaterial({ color: 0x2a3550, transparent: true, opacity: 0.55 });
      reg.panelEdges.push(poMat);
      const po = new THREE.LineSegments(new THREE.EdgesGeometry(panelGeo), poMat);
      po.position.copy(panel.position);
      g.add(po);

      // drive handle (left bar)
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x4a5872, metalness: 0.7, roughness: 0.4 });
      reg.handles.push(handleMat);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, bladeH * 0.62, 0.06), handleMat);
      handle.position.set(-W / 2 + 0.18, y, frontZ + 0.02);
      g.add(handle);

      // status LEDs
      for (let l = 0; l < 3; l++) {
        const lc = ledColors[l];
        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.052, 12, 12),
          new THREE.MeshStandardMaterial({ color: lc, emissive: lc, emissiveIntensity: 2.2 })
        );
        led.position.set(-W / 2 + 0.46 + l * 0.17, y + bladeH * 0.18, frontZ + 0.04);
        g.add(led);
        blink.push({ mesh: led, base: 0.75 + Math.random() * 0.6, amp: 0.5, phase: Math.random() * 6.28, speed: 1.1 + Math.random() * 2.4 });
      }

      // vent slits (right side)
      for (let s = 0; s < 4; s++) {
        const slitMat = new THREE.MeshStandardMaterial({ color: acc, emissive: acc, emissiveIntensity: 0.7, transparent: true, opacity: 0.65 });
        reg.slits.push(slitMat);
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.02), slitMat);
        slit.position.set(W / 2 - 0.55, y + (s - 1.5) * (bladeH * 0.22), frontZ + 0.025);
        g.add(slit);
      }
    }

    world.add(g);
  });

  // ---- connections: build curves, tubes, particles ----
  const conns = [];
  CONN.forEach(c => {
    const a = nodeById[c.from], b = nodeById[c.to];
    const start = new THREE.Vector3(a.pos[0] + HALF_W, a.pos[1], a.pos[2]);
    let end, pts;
    if (c.from === 'crm') {
      // arc up/down toward ai / calendar
      end = new THREE.Vector3(b.pos[0] - 1.4, b.pos[1] - Math.sign(c.lift) * 0.5, b.pos[2]);
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2 + 0.4,
        (start.y + end.y) / 2 + c.lift,
        (start.z + end.z) / 2
      );
      pts = [start, mid, end];
    } else {
      end = new THREE.Vector3(b.pos[0] - HALF_W, b.pos[1], b.pos[2]);
      const mid = new THREE.Vector3((start.x + end.x) / 2, start.y + 0.001, start.z);
      pts = [start, mid, end];
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const acc = accentColor(c.accent);

    // glowing tube
    const tubeMat = new THREE.MeshStandardMaterial({
      color: acc, emissive: acc, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.55,
    });
    reg.tubes.push(tubeMat);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.035, 8, false), tubeMat);
    world.add(tube);

    // faint guide line on top for crispness
    const len = curve.getLength();
    const count = Math.max(2, Math.round(len * 0.7));
    const particles = [];
    const pColor = c.accent === 'blueLt' ? COL.blueLt : COL.red;
    for (let i = 0; i < count; i++) {
      const pmat = new THREE.MeshStandardMaterial({ color: pColor, emissive: pColor, emissiveIntensity: 3.0 });
      reg.particles.push(pmat);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), pmat);
      world.add(m);
      particles.push(m);
    }
    conns.push({ curve, particles, count, len, speed: 0.22 / Math.max(2.2, len) * 4 });
  });

  // ---- background dust for depth ----
  const dustN = 360;
  const dpos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    dpos[i * 3]     = (Math.random() - 0.5) * 34;
    dpos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    dpos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: COL.glow, size: 0.06, transparent: true, opacity: 0.5, depthWrite: false,
  }));
  world.add(dust);

  // ---- labels (HTML overlay) ----
  const labels = NODES.map(n => {
    const el = document.createElement('div');
    el.className = 'n3-label n3-' + n.accent;
    el.innerHTML = '<span class="n3-t">' + n.t + '</span><span class="n3-s">' + n.s + '</span>';
    labelLayer.appendChild(el);
    return { el, v: new THREE.Vector3() };
  });

  // ---- composer / bloom ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.78, 0.55, 0.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---- theme adaptation ----
  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }
  function applyTheme() {
    const P = isLightTheme() ? PAL.light : PAL.dark;
    renderer.setClearColor(P.clear, 1);
    reg.chassis.forEach(m => { m.color.setHex(P.chassis); m.metalness = P.chassisMetal; });
    reg.panels.forEach(m => { m.color.setHex(P.panel); m.metalness = P.panelMetal; });
    reg.panelEdges.forEach(m => m.color.setHex(P.panelEdge));
    reg.handles.forEach(m => { m.color.setHex(P.handle); m.metalness = P.handleMetal; });
    reg.edges.forEach(e => e.mat.color.setHex(e.accent === 'neutral' ? P.neutral : accentColor(e.accent)));
    reg.slits.forEach(m => { m.emissiveIntensity = P.slitEm; });
    reg.tubes.forEach(m => { m.emissiveIntensity = P.tubeEm; m.opacity = P.tubeOp; });
    reg.particles.forEach(m => { m.emissiveIntensity = P.particleEm; });
    ledScale = P.ledScale;
    ambient.color.setHex(P.ambient); ambient.intensity = P.ambientI;
    lBlue.intensity = P.blueLightI; lRed.intensity = P.redLightI;
    dust.material.color.setHex(P.dust); dust.material.opacity = P.dustOp;
    bloom.strength = P.bloom; bloom.threshold = P.bloomThresh; bloom.radius = P.bloomRadius;
    renderOnce();
  }
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---- sizing ----
  function fitCamera(aspect) {
    const fovV = THREE.MathUtils.degToRad(camera.fov);
    const tanV = Math.tan(fovV / 2);
    const W = 20.5, H = 8.6; // content bounds to frame
    const distH = (H / 2) / tanV;
    const distW = (W / 2) / (tanV * aspect);
    camera.position.set(0, 0.6, Math.max(distH, distW) * 1.1);
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    const r = root.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    composer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    fitCamera(camera.aspect);
    camera.updateProjectionMatrix();
    if (reduce) renderOnce();
  }

  // ---- drag to rotate ----
  const BASE_X = -0.13;
  const rot = { y: 0, x: 0, vy: 0, vx: 0 };
  let dragging = false, lastX = 0, lastY = 0;
  root.style.cursor = 'grab';
  if (!reduce) {
    root.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      rot.vy = 0; rot.vx = 0;
      root.style.cursor = 'grabbing';
      root.setPointerCapture && root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = (e.clientX - lastX), dy = (e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      rot.vy = dx * 0.006;
      rot.vx = dy * 0.006;
      rot.y += rot.vy;
      rot.x += rot.vx;
      rot.x = Math.max(-0.6, Math.min(0.6, rot.x));
    });
    const end = e => {
      dragging = false;
      root.style.cursor = 'grab';
      root.releasePointerCapture && e && e.pointerId != null && root.releasePointerCapture(e.pointerId);
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);
    root.addEventListener('pointerleave', () => { dragging = false; root.style.cursor = 'grab'; });
  }

  function updateLabels() {
    const r = root.getBoundingClientRect();
    labels.forEach((L, i) => {
      const p = NODES[i].pos;
      const off = p[1] < -1 ? 1.5 : -1.5; // calendar label above, others below
      L.v.set(p[0], p[1] + off, p[2]);
      world.localToWorld(L.v);
      L.v.project(camera);
      const x = (L.v.x * 0.5 + 0.5) * r.width;
      const y = (-L.v.y * 0.5 + 0.5) * r.height;
      L.el.style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      L.el.style.opacity = L.v.z < 1 ? '1' : '0';
    });
  }

  function placeParticles(time) {
    conns.forEach(cn => {
      for (let i = 0; i < cn.count; i++) {
        let t = (i / cn.count + time * cn.speed) % 1;
        const p = cn.curve.getPoint(t);
        cn.particles[i].position.copy(p);
        // fade in/out at ends
        const fade = Math.min(1, Math.min(t, 1 - t) * 6);
        cn.particles[i].material.opacity = fade;
        cn.particles[i].material.transparent = true;
      }
    });
  }

  function renderFrame(time) {
   try {
    // rotation: drag-driven with light inertia, no auto-spin
    if (!dragging) {
      rot.y += rot.vy;
      rot.x += rot.vx;
      rot.x = Math.max(-0.6, Math.min(0.6, rot.x));
      rot.vy *= 0.92;
      rot.vx *= 0.92;
      if (Math.abs(rot.vy) < 0.00002) rot.vy = 0;
      if (Math.abs(rot.vx) < 0.00002) rot.vx = 0;
    }
    world.rotation.y = rot.y;
    world.rotation.x = BASE_X + rot.x;
    dust.rotation.y = time * 0.02;

    // status LED blink
    blink.forEach(b => {
      b.mesh.material.emissiveIntensity = ledScale * Math.max(0.25, b.base + Math.sin(time * b.speed + b.phase) * b.amp);
    });

    placeParticles(time);
    composer.render();
    updateLabels();
   } catch (err) { console.error('flow3d renderFrame error:', err); }
  }

  function renderOnce() {
    renderFrame(0);
  }

  let raf;
  const t0 = performance.now();
  function loop() {
    const time = (performance.now() - t0) / 1000;
    renderFrame(time);
    raf = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(root);
  applyTheme();
  resize();

  if (reduce) {
    renderOnce();
  } else {
    renderOnce();
    loop();
    // pause when fully offscreen to save battery
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { if (!raf) loop(); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      });
    }, { threshold: 0 });
    io.observe(root);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
