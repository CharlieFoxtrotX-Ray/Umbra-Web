// ───────────────────────────────────────────────────────────────
// UMBRA — Tienda de packs de aporte (PayPal)
//
// El usuario compra lingotes de aporte por PayPal; el custom_id lleva su
// UserID, y el webhook del server (POST /api/webhooks/paypal) acredita la
// wallet server-to-server. Esta página NO toca la wallet directamente — solo
// inicia el pago con el custom_id correcto.
//
// Packs sincronizados con PACKS_BY_CENTS del webhook (server/src/api/webhooks.ts).
// Client-id de PayPal vía <meta name="paypal-client-id">; si es PLACEHOLDER,
// muestra "tienda en preparación" en vez de botones rotos (seguro para prod).
// ───────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // Totales sincronizados con PACKS_BY_CENTS del webhook (no cambian);
  // base + bonus es sólo presentación ("llevate X + Y de regalo").
  const PACKS = [
    { id: 'p5',   usd: 5,   base: 2,  bonus: 0,  ling: 2  },
    { id: 'p10',  usd: 10,  base: 4,  bonus: 1,  ling: 5  },
    { id: 'p20',  usd: 20,  base: 8,  bonus: 3,  ling: 11 },
    { id: 'p50',  usd: 50,  base: 20, bonus: 10, ling: 30 },
    { id: 'p100', usd: 100, base: 40, bonus: 25, ling: 65 },
  ];

  const clientId = (document.querySelector('meta[name="paypal-client-id"]')?.content || '').trim();
  const configured = !!clientId && clientId !== 'PLACEHOLDER';

  const el = (id) => document.getElementById(id);
  const getUser = () => (window.umbraAuth && window.umbraAuth.getUser && window.umbraAuth.getUser()) || null;
  const lang = () => document.documentElement.lang || 'es';
  const tr = (key, fallback) => {
    try { return (window.UmbraI18n && window.UmbraI18n.T[lang()] && window.UmbraI18n.T[lang()][key]) || fallback; }
    catch (e) { return fallback; }
  };

  // ─── PayPal SDK (carga diferida, solo si está configurado) ──────
  let sdkPromise = null;
  function loadPaypalSdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`;
      s.onload = resolve;
      s.onerror = () => reject(new Error('No se pudo cargar el SDK de PayPal'));
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  let cardsRendered = false;
  let buttonsAttached = false;

  // Las cards (precios) se pintan ENSEGUIDA; los botones de PayPal se inyectan
  // cuando el SDK termina de cargar. Mejor UX: el usuario ve los packs sin
  // esperar a PayPal.
  function renderCards() {
    if (cardsRendered) return;
    const grid = el('packs');
    grid.innerHTML = '';
    PACKS.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'pack';
      card.innerHTML =
        '<div class="usd">$' + p.usd + '</div>' +
        '<div class="ling">' + p.ling + ' <span data-i18n="t.ling.word">lingotes</span></div>' +
        (p.bonus
          ? '<div class="bonus">' + p.base + ' + ' + p.bonus + ' <span data-i18n="t.gift">de regalo</span> &#127873;</div>'
          : '<div class="bonus base-only">&nbsp;</div>') +
        '<div class="pp-btns" id="pp-' + p.id + '"></div>';
      grid.appendChild(card);
    });
    // traducir los nodos recién creados (data-i18n dinámicos)
    if (window.UmbraI18n && window.UmbraI18n.setLang) window.UmbraI18n.setLang(lang());
    cardsRendered = true;
  }

  function attachButtons(userId) {
    if (buttonsAttached || !window.paypal) return;
    PACKS.forEach((p) => {
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', height: 40, label: 'paypal' },
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{
            amount: { value: p.usd.toFixed(2), currency_code: 'USD' },
            custom_id: userId,
            description: 'UMBRA — ' + p.ling + ' lingotes de aporte',
          }],
        }),
        onApprove: (data, actions) => actions.order.capture().then(showThanks),
        onError: () => alert(tr('t.error', 'Hubo un problema con el pago. Prueba de nuevo.')),
      }).render('#pp-' + p.id);
    });
    buttonsAttached = true;
  }

  function markButtonsUnavailable() {
    PACKS.forEach((p) => {
      const slot = el('pp-' + p.id);
      if (slot) slot.innerHTML = '<div class="pp-disabled">' + tr('t.pp.unavailable', 'Pago no disponible ahora mismo.') + '</div>';
    });
  }

  function showThanks() {
    ['packs', 'packs-note', 'user-line', 'login-gate'].forEach((id) => { el(id).hidden = true; });
    el('state-thanks').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function refreshUI() {
    const user = getUser();

    if (!configured) {
      el('state-unconfigured').hidden = false;
      ['login-gate', 'packs', 'packs-note', 'user-line'].forEach((id) => { el(id).hidden = true; });
      return;
    }
    if (!user) {
      el('login-gate').hidden = false;
      ['packs', 'packs-note', 'user-line', 'state-unconfigured'].forEach((id) => { el(id).hidden = true; });
      return;
    }
    // configurado + logueado
    el('login-gate').hidden = true;
    el('state-unconfigured').hidden = true;
    el('user-line').hidden = false;
    el('user-line-name').textContent = user.username || (user.email || '').split('@')[0] || 'vos';
    el('packs').hidden = false;
    el('packs-note').hidden = false;
    renderCards();  // precios visibles enseguida
    loadPaypalSdk()
      .then(() => attachButtons(user.id))
      .catch(markButtonsUnavailable);
  }

  // auth.js no emite evento de login en la misma pestaña → polleamos getUser()
  let lastUserId = null;
  function init() {
    lastUserId = getUser() && getUser().id || null;
    refreshUI();
    setInterval(() => {
      const id = (getUser() && getUser().id) || null;
      if (id !== lastUserId) { lastUserId = id; cardsRendered = false; buttonsAttached = false; refreshUI(); }
    }, 800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
