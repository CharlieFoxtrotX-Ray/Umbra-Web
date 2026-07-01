// ───────────────────────────────────────────────────────────────
// UMBRA by CFX — Google OAuth en la web
// Reutiliza el backend del server (auth.ts) con el flujo popup +
// postMessage al opener + polling de respaldo. Mismo flow que usa
// el desktop app — único ground truth.
// ───────────────────────────────────────────────────────────────

(function () {
  'use strict'

  // ─── Config ────────────────────────────────────────────────
  // API base configurable vía <meta name="umbra-api-base" content="...">
  // Default localhost:3000 para dev. Cambiar a producción en deploy.
  const API_BASE =
    document.querySelector('meta[name="umbra-api-base"]')?.content?.replace(/\/$/, '') ||
    'http://localhost:3000'

  const STORAGE_KEY = 'umbra:auth'
  const POLL_INTERVAL = 2000
  const POPUP_W = 480
  const POPUP_H = 640
  const TIMEOUT_MS = 5 * 60 * 1000  // 5 min

  // ─── Estado ────────────────────────────────────────────────

  let currentUser = null

  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (parsed && parsed.token && parsed.user) return parsed
    } catch (e) {}
    return null
  }

  function saveStored(token, user) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } catch (e) {}
  }

  function clearStored() {
    try { localStorage.removeItem(STORAGE_KEY) } catch (e) {}
  }

  // ─── Programa de Partners: atribución del referido ─────────────
  // Si el usuario llega con ?ref=CODIGO (en cualquier página que cargue
  // auth.js), guardamos el código. Cuando se loguea (o si ya está logueado),
  // llamamos a /api/partners/attribute para dejarlo atribuido al creador.
  // Ventana de 60 días. El endpoint es idempotente y anti self-referral.
  const REF_KEY = 'umbra:ref'
  const REF_TTL_DAYS = 60

  function captureRef() {
    try {
      const params = new URLSearchParams(window.location.search)
      let ref = params.get('ref') || params.get('r')
      if (!ref) return
      ref = ref.trim().slice(0, 64)
      if (!ref) return
      localStorage.setItem(REF_KEY, JSON.stringify({ code: ref, exp: Date.now() + REF_TTL_DAYS * 864e5 }))
    } catch (e) {}
  }

  function getRef() {
    try {
      const raw = localStorage.getItem(REF_KEY)
      if (!raw) return null
      const p = JSON.parse(raw)
      if (!p || !p.code) return null
      if (p.exp && Date.now() > p.exp) { localStorage.removeItem(REF_KEY); return null }
      return p.code
    } catch (e) { return null }
  }

  function clearRef() { try { localStorage.removeItem(REF_KEY) } catch (e) {} }

  // Intenta atribuir el referido. token = JWT del usuario logueado.
  function tryAttribute(token) {
    const code = getRef()
    if (!code || !token) return
    fetch(API_BASE + '/api/partners/attribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ code: code }),
    })
      .then(function (r) { return r.ok ? r.json() : null })
      .then(function (res) {
        // Cualquier respuesta OK (atribuido, ya-atribuido, código inválido,
        // self-referral) cierra el intento: no reintentamos ni acumulamos.
        if (res && res.ok) clearRef()
      })
      .catch(function () { /* red caída: se reintenta en el próximo login/carga */ })
  }

  // ─── UI helpers ────────────────────────────────────────────

  function getInitial(name) {
    if (!name) return '?'
    return String(name).trim().charAt(0).toUpperCase()
  }

  // Genera color determinístico para el avatar fallback
  function avatarColor(seed) {
    const hues = [12, 32, 188, 220, 270, 320]
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
    return hues[Math.abs(h) % hues.length]
  }

  function setAvatar(imgEl, user) {
    if (!imgEl) return
    if (user.avatarUrl) {
      imgEl.src = user.avatarUrl
      imgEl.classList.remove('no-image')
      imgEl.style.removeProperty('--avatar-h')
      imgEl.removeAttribute('data-initial')
      return
    }
    // Fallback: avatar generado con la inicial
    imgEl.removeAttribute('src')
    imgEl.classList.add('no-image')
    imgEl.setAttribute('data-initial', getInitial(user.username || user.email || '?'))
    imgEl.style.setProperty('--avatar-h', avatarColor(user.username || user.email || '?'))
  }

  function updateAuthUI(user) {
    currentUser = user || null

    // Toggle Login button vs User menu en navbar
    document.querySelectorAll('.btn-login').forEach((b) => {
      b.hidden = !!user
    })
    document.querySelectorAll('.user-menu').forEach((m) => {
      m.hidden = !user
      if (user) {
        const nameEl = m.querySelector('.user-name')
        const avatarEl = m.querySelector('.user-avatar')
        if (nameEl) nameEl.textContent = user.username || (user.email || '').split('@')[0]
        setAvatar(avatarEl, user)
      }
    })

    // Toggle drawer mobile equivalents
    document.querySelectorAll('.drawer-login').forEach((b) => { b.hidden = !!user })
    document.querySelectorAll('.drawer-user').forEach((d) => {
      d.hidden = !user
      if (user) {
        const nameEl = d.querySelector('.drawer-user-name')
        const emailEl = d.querySelector('.drawer-user-email')
        const avatarEl = d.querySelector('.user-avatar')
        if (nameEl) nameEl.textContent = user.username || (user.email || '').split('@')[0]
        if (emailEl) emailEl.textContent = user.email || ''
        setAvatar(avatarEl, user)
      }
    })

    // Pre-llenar el form de signup con el email
    if (user && user.email) {
      const input = document.querySelector('.signup-form input[type="email"]')
      if (input && !input.value) input.value = user.email
    }
  }

  // ─── Modal ─────────────────────────────────────────────────

  let lastFocusedBeforeModal = null

  function openLoginModal() {
    const modal = document.getElementById('login-modal')
    if (!modal) return
    lastFocusedBeforeModal = document.activeElement
    modal.hidden = false
    requestAnimationFrame(() => modal.classList.add('open'))
    // Focus en el botón de Google
    setTimeout(() => modal.querySelector('.btn-google-signin')?.focus(), 60)
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden'
    setError(null)
  }

  function closeLoginModal() {
    const modal = document.getElementById('login-modal')
    if (!modal) return
    modal.classList.remove('open')
    setTimeout(() => {
      modal.hidden = true
      document.body.style.overflow = ''
      lastFocusedBeforeModal?.focus?.()
    }, 220)
  }

  function setError(msgKey) {
    const errEl = document.querySelector('#login-modal .login-error')
    if (!errEl) return
    if (!msgKey) {
      errEl.textContent = ''
      errEl.removeAttribute('data-i18n')
      errEl.hidden = true
      return
    }
    errEl.setAttribute('data-i18n', msgKey)
    // Si i18n está disponible, traducir al idioma activo
    if (window.umbraI18n && typeof window.umbraI18n.t === 'function') {
      errEl.textContent = window.umbraI18n.t(msgKey)
    } else {
      errEl.textContent = msgKey  // fallback
    }
    errEl.hidden = false
  }

  // ─── OAuth flow ────────────────────────────────────────────

  function makeSessionId() {
    if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
    // Fallback razonable
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
  }

  function startGoogleLogin() {
    setError(null)
    const sessionId = makeSessionId()
    const url = `${API_BASE}/api/auth/google/start?session_id=${encodeURIComponent(sessionId)}`

    // Centrar el popup
    const left = (screen.width  - POPUP_W) / 2
    const top  = (screen.height - POPUP_H) / 2
    const features = `width=${POPUP_W},height=${POPUP_H},left=${left},top=${top},popup=yes,noopener=no`

    let popup
    try {
      popup = window.open(url, 'umbra-google-auth', features)
    } catch (e) {
      popup = null
    }

    if (!popup) {
      setError('auth.error.popup')
      return
    }

    let done = false

    const finish = (token, user) => {
      if (done) return
      done = true
      cleanup()
      try { popup.close() } catch (e) {}
      saveStored(token, user)
      updateAuthUI(user)
      closeLoginModal()
      tryAttribute(token)  // partners: atribuir si venía con ?ref
    }

    const fail = (msgKey) => {
      if (done) return
      done = true
      cleanup()
      try { popup.close() } catch (e) {}
      setError(msgKey)
    }

    // 1) postMessage del callback al opener (camino rápido)
    const onMessage = (e) => {
      const data = e.data
      if (!data || data.type !== 'UMBRA_AUTH') return
      if (!data.token || !data.user) return
      finish(data.token, data.user)
    }
    window.addEventListener('message', onMessage)

    // 2) Polling de fallback (en caso de que postMessage no llegue por
    //    razones de origen)
    const pollInterval = setInterval(async () => {
      if (done) return
      try {
        const r = await fetch(
          `${API_BASE}/api/auth/google/poll?session_id=${encodeURIComponent(sessionId)}`,
          { credentials: 'omit' }
        )
        if (!r.ok) return
        const data = await r.json()
        if (data.status === 'done' && data.token && data.user) {
          finish(data.token, data.user)
        }
      } catch (e) { /* network glitch — seguimos */ }
    }, POLL_INTERVAL)

    // 3) Detectar si el usuario cierra el popup sin completar
    const closeCheck = setInterval(() => {
      if (done) return
      if (popup.closed) fail('auth.error.cancelled')
    }, 500)

    // 4) Timeout duro
    const timeoutId = setTimeout(() => fail('auth.error.failed'), TIMEOUT_MS)

    function cleanup() {
      window.removeEventListener('message', onMessage)
      clearInterval(pollInterval)
      clearInterval(closeCheck)
      clearTimeout(timeoutId)
    }
  }

  function signOut() {
    clearStored()
    updateAuthUI(null)
  }

  // ─── User dropdown handlers ────────────────────────────────

  function setupUserMenu() {
    document.querySelectorAll('.user-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const wrap = btn.closest('.user-menu')
        const dd = wrap?.querySelector('.user-dropdown')
        const isOpen = dd?.classList.contains('open')
        document.querySelectorAll('.user-dropdown').forEach((d) => d.classList.remove('open'))
        document.querySelectorAll('.user-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'))
        if (!isOpen && dd) {
          dd.classList.add('open')
          btn.setAttribute('aria-expanded', 'true')
        }
      })
    })

    document.addEventListener('click', () => {
      document.querySelectorAll('.user-dropdown').forEach((d) => d.classList.remove('open'))
      document.querySelectorAll('.user-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'))
    })

    document.querySelectorAll('[data-action="signout"]').forEach((btn) => {
      btn.addEventListener('click', signOut)
    })
  }

  // ─── Modal handlers ────────────────────────────────────────

  function setupModal() {
    document.querySelectorAll('.btn-login, .drawer-login').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        // Si el click vino del drawer, cerrarlo primero
        document.querySelector('.mobile-drawer')?.classList.remove('open')
        openLoginModal()
      })
    })

    document.querySelectorAll('.btn-google-signin').forEach((btn) => {
      btn.addEventListener('click', startGoogleLogin)
    })

    document.querySelectorAll('.login-modal-close, .login-modal-backdrop').forEach((el) => {
      el.addEventListener('click', closeLoginModal)
    })

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      const modal = document.getElementById('login-modal')
      if (modal && !modal.hidden) closeLoginModal()
    })
  }

  // ─── Init ──────────────────────────────────────────────────

  function init() {
    captureRef()  // partners: guardar ?ref si vino en la URL (cualquier página)
    const stored = loadStored()
    if (stored) { updateAuthUI(stored.user); tryAttribute(stored.token) }  // ya logueado + ?ref → atribuir
    else updateAuthUI(null)
    setupUserMenu()
    setupModal()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Exponer mínima API por si otros scripts la necesitan
  window.umbraAuth = {
    getUser: () => currentUser,
    signOut,
    open: openLoginModal,
  }
})()
