// ───────────────────────────────────────────────────────────────
// UMBRA by CFX — Landing JS
// Mantenido mínimo a propósito: splash, reveal-on-scroll, nav scroll
// state, mobile drawer y signup form local.
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict'

  // ─── Splash de carga ──────────────────────────────────────────
  // Esconde el splash cuando termina el video, o tras un timeout
  // de seguridad de 4.5s si el video falla / autoplay bloqueado.

  const splash = document.getElementById('splash')
  const splashVideo = splash?.querySelector('video')

  const hideSplash = () => {
    if (!splash || splash.classList.contains('hidden')) return
    splash.classList.add('hidden')
    document.body.style.overflow = ''
    setTimeout(() => splash?.remove(), 900)
  }

  // Bloquear scroll mientras el splash está visible
  document.body.style.overflow = 'hidden'

  // Duración del splash. El video está en loop para no congelar nunca,
  // así que controlamos la salida con un timer fijo.
  const SPLASH_DURATION = 2600

  if (splashVideo) {
    splashVideo.addEventListener('error', () => {
      splash.classList.add('no-video')
    }, { once: true })

    const playPromise = splashVideo.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => splash.classList.add('no-video'))
    }
  }

  setTimeout(hideSplash, SPLASH_DURATION)

  // Fail-safe absoluto
  setTimeout(hideSplash, 5000)

  // Click/tap para skip
  splash?.addEventListener('click', hideSplash)


  // ─── Nav scroll state ─────────────────────────────────────────

  const nav = document.querySelector('nav.main-nav')
  const onScroll = () => {
    if (!nav) return
    if (window.scrollY > 12) nav.classList.add('scrolled')
    else nav.classList.remove('scrolled')
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()


  // ─── Mobile drawer ────────────────────────────────────────────

  const menuToggle = document.querySelector('.menu-toggle')
  const drawer = document.querySelector('.mobile-drawer')

  menuToggle?.addEventListener('click', () => {
    drawer?.classList.toggle('open')
    const open = drawer?.classList.contains('open')
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  })

  // Cerrar drawer al hacer click en un link
  drawer?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => drawer.classList.remove('open'))
  })


  // ─── Reveal on scroll ─────────────────────────────────────────

  const revealEls = document.querySelectorAll('.reveal')

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    revealEls.forEach((el) => io.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add('in'))
  }


  // ─── Signup form (local — sin backend) ────────────────────────
  // Por ahora guarda el email en localStorage y muestra confirmación.
  // Cuando esté el backend listo, se reemplaza el handler por un POST.

  const signupForm = document.querySelector('.signup-form')
  const signupSuccess = document.querySelector('.signup-success')

  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = signupForm.querySelector('input[type="email"]')
    if (!input || !input.value) return
    const email = input.value.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#d4a06a'
      input.focus()
      return
    }

    try {
      const stored = JSON.parse(localStorage.getItem('umbra:beta-signups') || '[]')
      if (!stored.includes(email)) stored.push(email)
      localStorage.setItem('umbra:beta-signups', JSON.stringify(stored))
    } catch { /* ignore quota */ }

    signupForm.style.display = 'none'
    signupSuccess?.classList.add('show')
  })


  // ─── Year en footer ───────────────────────────────────────────

  const yearEl = document.getElementById('current-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString()
})()
