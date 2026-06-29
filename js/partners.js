// ───────────────────────────────────────────────────────────────
// UMBRA — Programa de Partners (creadores de contenido)
//
// Dos responsabilidades en el cliente:
//   1) Captura de referido: si la URL trae ?ref=CODIGO, lo guarda en
//      localStorage para que viaje al registro/compra (el backend lo
//      atribuye al partner cuando el usuario se loguea y compra).
//   2) Formulario de solicitud: POST a /api/partners/apply. Si el
//      endpoint todavía no existe (Fase 2 backend) o falla la red,
//      degrada a un mailto con los datos para no perder al creador.
//
// Endpoint backend a implementar (Fase 2):
//   POST {API_BASE}/api/partners/apply
//   body JSON: { name, email, platform, channel, audience, games, message, ref }
//   → 200 { ok: true }   |   4xx { ok:false, error }
// ───────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // Email donde caen las solicitudes mientras el endpoint no esté listo.
  // TODO(backend): cuando /api/partners/apply esté en producción esto solo
  // se usa como fallback si la API falla.
  var PARTNERS_EMAIL = 'partners@cfx-software.com';

  var REF_KEY = 'umbra:ref';
  var REF_TTL_DAYS = 60;

  var API_BASE = (
    (document.querySelector('meta[name="umbra-api-base"]') || {}).content || ''
  ).replace(/\/$/, '') || 'http://localhost:3000';

  // ─── 1) Captura de referido ───────────────────────────────────
  function captureRef() {
    try {
      var params = new URLSearchParams(window.location.search);
      var ref = params.get('ref') || params.get('r');
      if (!ref) return;
      ref = ref.trim().slice(0, 64);
      if (!ref) return;
      // Guardamos con caducidad (ventana de atribución de 60 días).
      var payload = { code: ref, exp: Date.now() + REF_TTL_DAYS * 864e5 };
      localStorage.setItem(REF_KEY, JSON.stringify(payload));
    } catch (e) { /* sin storage: ignoramos */ }
  }

  function getRef() {
    try {
      var raw = localStorage.getItem(REF_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (!p || !p.code) return null;
      if (p.exp && Date.now() > p.exp) { localStorage.removeItem(REF_KEY); return null; }
      return p.code;
    } catch (e) { return null; }
  }

  // ─── 2) Formulario ────────────────────────────────────────────
  var form = document.getElementById('partner-form');
  var msgEl = document.getElementById('pf-msg');
  var submitBtn = document.getElementById('pf-submit');
  var formWrap = document.getElementById('form-wrap');
  var thanks = document.getElementById('form-thanks');

  function lang() { return document.documentElement.lang || 'es'; }
  function tr(key, fallback) {
    try {
      return (window.UmbraI18n && window.UmbraI18n.T &&
        window.UmbraI18n.T[lang()] && window.UmbraI18n.T[lang()][key]) || fallback;
    } catch (e) { return fallback; }
  }

  function showMsg(kind, text) {
    if (!msgEl) return;
    msgEl.className = 'form-msg ' + kind;
    msgEl.textContent = text;
    msgEl.hidden = false;
  }

  function buildMailtoFallback(data) {
    var subject = 'Solicitud Partner — ' + (data.name || '');
    var lines = [
      'Nombre: ' + (data.name || ''),
      'Email: ' + (data.email || ''),
      'Plataforma: ' + (data.platform || ''),
      'Canal: ' + (data.channel || ''),
      'Audiencia: ' + (data.audience || ''),
      'Juegos/contenido: ' + (data.games || ''),
      'Mensaje: ' + (data.message || ''),
      data.ref ? 'Ref: ' + data.ref : ''
    ].filter(Boolean);
    return 'mailto:' + PARTNERS_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function succeed() {
    if (formWrap) formWrap.hidden = true;
    if (thanks) thanks.hidden = false;
    window.scrollTo({ top: thanks ? thanks.getBoundingClientRect().top + window.scrollY - 120 : 0, behavior: 'smooth' });
  }

  function collect() {
    var user = (window.umbraAuth && window.umbraAuth.getUser && window.umbraAuth.getUser()) || null;
    return {
      name: (form.name.value || '').trim(),
      email: (form.email.value || '').trim(),
      platform: form.platform.value || '',
      channel: (form.channel.value || '').trim(),
      audience: form.audience.value || '',
      games: (form.games.value || '').trim(),
      message: (form.message.value || '').trim(),
      ref: getRef() || null,
      userId: user && user.id ? user.id : null
    };
  }

  if (form) {
    // Prefill del email si el creador ya está logueado (auth.js no emite
    // evento en la misma pestaña → reintentamos un par de veces).
    var tries = 0;
    var prefill = setInterval(function () {
      tries++;
      var user = (window.umbraAuth && window.umbraAuth.getUser && window.umbraAuth.getUser()) || null;
      if (user && user.email && !form.email.value) form.email.value = user.email;
      if (user || tries > 6) clearInterval(prefill);
    }, 600);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (msgEl) msgEl.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = collect();
      submitBtn.disabled = true;
      var prevLabel = submitBtn.textContent;
      submitBtn.textContent = tr('pp.form.sending', 'Enviando…');

      var done = false;
      var finish = function () { if (done) return; done = true; succeed(); };

      fetch(API_BASE + '/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'omit'
      })
        .then(function (r) {
          if (r.ok) { finish(); return; }
          throw new Error('bad status ' + r.status);
        })
        .catch(function () {
          // Fallback: abrir mailto con los datos. Damos por buena la
          // solicitud (el creador completa el envío en su cliente de correo).
          try { window.location.href = buildMailtoFallback(data); } catch (e) {}
          finish();
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = prevLabel;
        });
    });
  }

  // Init
  captureRef();
})();
