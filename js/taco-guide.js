/*
  UMBRA — Taco, guía de la landing.

  Taco en 3D (js/taco-3d.js) camina por el borde inferior de la ventana y, al
  llegar a cada sección, hace un gesto y suelta una frase sobre lo que hay en
  pantalla. Las frases viven en el diccionario de i18n (claves `tg.*`).

  Solo se enciende donde no molesta: pantallas anchas, con WebGL2 acelerado,
  sin «reducir movimiento» ni ahorro de datos, y si la persona no lo ha
  apagado. En cualquier otro caso la página se queda con sus Tacos de dibujo,
  que es como estaba. El modelo y las animaciones (≈1,7 MB) se piden cuando la
  página ya ha terminado de cargar.
*/
(function () {
  'use strict';

  var KEY = 'umbra:taco';
  // sección · lado donde se planta · gesto al llegar
  var STOPS = [
    ['hero', 'R', 'wave'], ['compromiso', 'R', 'cheer'], ['problema', 'L', ''], ['comunicacion', 'R', 'jump'],
    ['calendario', 'R', ''], ['comunidad', 'L', 'sit'], ['canvas', 'R', ''], ['plugins', 'L', 'wave'], ['estilo', 'L', 'cheer'],
    ['movil', 'R', ''], ['juego', 'L', 'jump'], ['novedades', 'L', ''], ['planes', 'R', 'sit'],
    ['faq', 'L', ''], ['descarga', 'R', 'wave']
  ];
  var ACTOR_W = 190, WALK = 150, RUN = 380;

  var root = document.documentElement;
  var wide = matchMedia('(min-width: 1000px)');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var live = null;

  function eligible() {
    var conn = navigator.connection;
    return wide.matches && !reduce.matches && !(conn && conn.saveData) && localStorage.getItem(KEY) !== 'off';
  }
  function text(key) {
    var api = window.UmbraI18n, d = api && api.T[root.lang];
    return (d && d[key]) || (api && api.T.es[key]) || '';
  }
  function loadEngine() {
    if (window.Taco3D) return Promise.resolve();
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = 'js/taco-3d.js?v=20261122a'; s.onload = ok; s.onerror = function () { fail(new Error('motor')); };
      document.head.appendChild(s);
    });
  }

  function start() {
    if (live || !eligible()) return;
    var guide = document.createElement('div');
    guide.className = 'taco-guide';
    guide.setAttribute('aria-hidden', 'true');
    guide.innerHTML = '<div class="tg-actor at-right"><div class="tg-bubble"></div><span class="tg-shadow"></span><canvas></canvas>' +
      '<button type="button" class="tg-hit" tabindex="-1"></button><button type="button" class="tg-close" tabindex="-1">✕</button></div>';
    var actor = guide.firstChild, bubble = actor.querySelector('.tg-bubble'), canvas = actor.querySelector('canvas');
    var state = { guide: guide, taco: null, dead: false };
    live = state;

    loadEngine().then(function () {
      if (state.dead) return null;
      document.body.appendChild(guide);
      return window.Taco3D.create(canvas, { model: 'assets/3d/taco.glb', anims: 'assets/3d/taco-anims.bin' });
    }).then(function (taco) {
      if (!taco) return;
      if (state.dead) { taco.dispose(); return; }
      state.taco = taco;
      run(state, taco, actor, bubble);
    }).catch(function () { stop(false); });
  }

  function run(state, taco, actor, bubble) {
    var current = 0, moving = false, x = 0, goal = 0, lastT = 0, bubbleTimer = 0, sitTimer = 0, raf = 0;
    var visible = new Set();

    function sideX(side) {
      var gutter = Math.max(0, (innerWidth - 1280) / 2);
      // El dibujo ocupa el centro del lienzo (≈105 de 190 px): se mete en el
      // margen todo lo que puede para pisar el texto lo menos posible.
      var inset = Math.max(-36, gutter - 74);
      return side === 'L' ? inset : innerWidth - ACTOR_W - inset;
    }
    function place() { actor.style.transform = 'translate3d(' + Math.round(x) + 'px,0,0)'; }
    function say(key, ms) {
      var t = text(key);
      clearTimeout(bubbleTimer);
      if (!t) { bubble.classList.remove('show'); return; }
      bubble.textContent = t;
      bubble.classList.add('show');
      bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, ms || 6500);
    }
    function idle() { if (!moving) taco.play('idle'); }
    function arrive() {
      var stop = STOPS[current];
      moving = false;
      x = goal; place();
      actor.classList.toggle('at-left', stop[1] === 'L');
      actor.classList.toggle('at-right', stop[1] === 'R');
      taco.setYaw(stop[1] === 'L' ? 0.4 : -0.4);
      clearTimeout(sitTimer);
      if (stop[2] === 'sit') taco.play('sit', { then: function () { sitTimer = setTimeout(idle, 2600); } });
      else if (stop[2]) taco.play(stop[2], { then: idle });
      else taco.play('idle');
      say('tg.' + stop[0]);
    }
    function go(index) {
      if (index === current && !moving && Math.abs(sideX(STOPS[index][1]) - x) < 4) return;
      current = index;
      goal = sideX(STOPS[index][1]);
      if (Math.abs(goal - x) < 4) { arrive(); return; }
      clearTimeout(sitTimer);
      bubble.classList.remove('show');
      moving = true;
    }
    function tick(now) {
      raf = requestAnimationFrame(tick);
      var t = now / 1000, dt = lastT ? Math.min(0.05, t - lastT) : 0;
      lastT = t;
      if (!moving) return;
      var d = goal - x, dist = Math.abs(d), dir = d < 0 ? -1 : 1, fast = dist > 560;
      taco.play(fast ? 'run' : 'walk');
      taco.setYaw(dir * 1.32);
      x += dir * Math.min(dist, (fast ? RUN : WALK) * dt);
      place();
      if (Math.abs(goal - x) < 1) arrive();
    }

    // Qué sección manda: la última del documento que cruza la franja central.
    // Los paneles apilados siguen «pegados» arriba mientras entra el siguiente,
    // así que puede haber varios a la vez.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id); });
      var best = -1;
      STOPS.forEach(function (s, i) { if (visible.has(s[0])) best = i; });
      if (best >= 0) go(best);
    }, { rootMargin: '-46% 0px -46% 0px' });
    STOPS.forEach(function (s) { var el = document.getElementById(s[0]); if (el) io.observe(el); });

    var quips = 0;
    actor.querySelector('.tg-hit').addEventListener('click', function () {
      if (moving) return;
      clearTimeout(sitTimer);
      taco.play('jump', { restart: true, then: idle });
      say('tg.click' + (quips++ % 3 + 1), 3200);
    });
    actor.querySelector('.tg-close').addEventListener('click', function () { stop(true); });

    function onResize() { if (!wide.matches) { stop(false); return; } goal = sideX(STOPS[current][1]); if (!moving) { x = goal; place(); } }
    function onVisibility() { if (document.hidden) { taco.stop(); cancelAnimationFrame(raf); raf = 0; } else { taco.start(); lastT = 0; if (!raf) raf = requestAnimationFrame(tick); } }
    addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    state.cleanup = function () {
      io.disconnect(); cancelAnimationFrame(raf); clearTimeout(bubbleTimer); clearTimeout(sitTimer);
      removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVisibility);
    };

    // Entra ya colocado en la esquina del hero y saluda.
    x = goal = sideX('R'); place();
    taco.setYaw(-0.4, true).play('idle', { fade: 0 }).start();
    root.classList.add('taco-live');
    state.guide.classList.add('ready');
    raf = requestAnimationFrame(tick);
    setTimeout(function () { if (!state.dead && !moving && current === 0) arrive(); }, 900);
  }

  /** Apaga a Taco. Con `remember`, no vuelve hasta que lo pidan desde el pie de página. */
  function stop(remember) {
    if (remember) { localStorage.setItem(KEY, 'off'); root.classList.add('taco-off'); }
    if (!live) return;
    var s = live; live = null; s.dead = true;
    if (s.cleanup) s.cleanup();
    if (s.taco) s.taco.dispose();
    if (s.guide.parentNode) s.guide.parentNode.removeChild(s.guide);
    root.classList.remove('taco-live');
  }

  function boot() {
    if (localStorage.getItem(KEY) === 'off') root.classList.add('taco-off');
    var back = document.getElementById('tacoBack');
    if (back) back.addEventListener('click', function () {
      localStorage.removeItem(KEY); root.classList.remove('taco-off'); start();
    });
    var later = window.requestIdleCallback || function (fn) { return setTimeout(fn, 600); };
    later(start);
    wide.addEventListener('change', function () { if (wide.matches) start(); });
  }
  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);
})();
