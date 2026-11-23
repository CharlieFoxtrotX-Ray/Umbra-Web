// Header común de toda la web: fondo al hacer scroll, menú móvil y, en las
// páginas que no lo traen, el modal de inicio de sesión que usa auth.js.
// Se carga con defer ANTES de auth.js para que el modal ya exista.
(function () {
  'use strict';
  var nav = document.getElementById('topNav');
  if (!nav) return;

  var onNav = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
  addEventListener('scroll', onNav, { passive: true }); onNav();

  var burger = document.getElementById('navBurger');
  var navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    var closeNav = function () { navMobile.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navMobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMobile.querySelectorAll('a, .drawer-login, .drawer-user-signout').forEach(function (el) { el.addEventListener('click', closeNav); });
    document.addEventListener('click', function (e) {
      if (navMobile.classList.contains('open') && !navMobile.contains(e.target) && !burger.contains(e.target)) closeNav();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 760) closeNav(); });
  }

  if (!document.getElementById('login-modal')) {
    document.body.insertAdjacentHTML('beforeend', `<!-- Login modal -->
  <div id="login-modal" class="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" hidden>
    <div class="login-modal-backdrop" aria-hidden="true"></div>
    <div class="login-modal-content">
      <button class="login-modal-close" aria-label="Cerrar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>
      <div class="login-modal-header">
        <h3 id="login-modal-title" data-i18n="auth.modal.title">Iniciar sesión en UMBRA</h3>
        <p data-i18n="auth.modal.subtitle">Empieza con tu cuenta</p>
      </div>
      <button class="btn-google-signin">
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        <span data-i18n="auth.modal.google_btn">Iniciar sesión con Google</span>
      </button>
      <p class="login-error" role="alert" hidden></p>
    </div>
  </div>`);
  }
})();
