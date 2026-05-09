// hero-3d.js — rotating 3D `#` brand mark beside the hero headline.
// Loaded only on home pages, only on viewports >=768px, only if WebGL is
// available. Pauses when offscreen or tab hidden. Reduced-motion friendly:
// renders one static frame instead of animating.

import * as THREE from 'three';

(function () {
  const canvas = document.querySelector('#hero-3d');
  if (!canvas) return;

  // Skip on small screens — there's no horizontal room beside the headline,
  // and a WebGL canvas on a phone hero costs battery for marginal payoff.
  if (window.matchMedia('(max-width: 767px)').matches) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    return; // No WebGL — leave the slot empty, page still works.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  // Lighting — warm key from upper-right, cool fill from below-left.
  // Mirrors the FireRed-on-cream palette: faces in light read fully red,
  // shaded faces sink toward the dark neutral.
  scene.add(new THREE.AmbientLight(0xfbe8b8, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x14171f, 0.4);
  fill.position.set(-3, -2, 3);
  scene.add(fill);

  // Build the `#` from 4 boxes (2 horizontal + 2 vertical strokes).
  // Chunky low-poly, no bevels — game-card aesthetic, not glossy spheres.
  const FIRE_RED = 0xD62828;
  const mat = new THREE.MeshLambertMaterial({ color: FIRE_RED });
  const group = new THREE.Group();

  const SW = 0.7;       // stroke width
  const LEN = 4.4;      // bar length
  const DEPTH = 0.7;    // extrude depth — stays chunky from the side
  const OFF = 1.0;      // bar offset from centre (controls bar spacing)

  const beamH = new THREE.BoxGeometry(LEN, SW, DEPTH);
  const beamV = new THREE.BoxGeometry(SW, LEN, DEPTH);

  const top = new THREE.Mesh(beamH, mat); top.position.y = +OFF;
  const bot = new THREE.Mesh(beamH, mat); bot.position.y = -OFF;
  const left = new THREE.Mesh(beamV, mat); left.position.x = -OFF;
  const right = new THREE.Mesh(beamV, mat); right.position.x = +OFF;
  group.add(top, bot, left, right);

  // Default angle — slight tilt so depth is visible at rest.
  const REST_X = -0.12;
  const REST_Y = 0.42;
  group.rotation.set(REST_X, REST_Y, 0);
  scene.add(group);

  // Resize handling.
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  // Reduced-motion path: render one static frame and exit. No RAF loop.
  if (reduce) {
    renderer.render(scene, camera);
    return;
  }

  // Cursor parallax — subtle lean toward pointer position relative to viewport.
  let targetX = REST_Y;
  let targetY = REST_X;
  window.addEventListener('pointermove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = REST_Y + ((e.clientX - cx) / cx) * 0.45;
    targetY = REST_X + ((e.clientY - cy) / cy) * 0.30;
  }, { passive: true });

  // Pause when hero is offscreen — saves battery during scroll.
  let inView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.05 }).observe(canvas);
  }

  // Pause when tab is hidden.
  let tabVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    tabVisible = !document.hidden;
  });

  // Animation loop.
  let raf;
  function tick() {
    if (tabVisible && inView) {
      // Ease toward cursor target.
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;
      // Slow idle drift on top of the parallax — adds liveness when the
      // cursor is still.
      group.rotation.y += 0.003;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);
  }
  tick();

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
  });
})();
