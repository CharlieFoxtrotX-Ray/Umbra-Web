// ───────────────────────────────────────────────────────────────
// UMBRA by CFX — i18n
// 6 idiomas: ES (fuente), EN, FR, DE, PT-BR, ZH-CN
// Persistencia en localStorage. Detección de browser language en primera visita.
// Las traducciones FR/DE/ZH son drafts — recomendamos pasarlas por un native
// speaker antes del lanzamiento público.
// ───────────────────────────────────────────────────────────────

(function () {
  'use strict'

  const SUPPORTED = ['es', 'en', 'fr', 'de', 'pt', 'zh']
  const DEFAULT_LANG = 'en'
  const STORAGE_KEY = 'umbra:lang'

  const LANG_META = {
    es: { code: 'ES', name: 'Español' },
    en: { code: 'EN', name: 'English' },
    fr: { code: 'FR', name: 'Français' },
    de: { code: 'DE', name: 'Deutsch' },
    pt: { code: 'PT', name: 'Português' },
    zh: { code: 'ZH', name: '中文' },
  }

  // ─── Diccionarios ───────────────────────────────────────────

  const T = {

    // ═══════════════════════════════════════════════════════════
    es: {
      'meta.title': 'UMBRA by CFX — Comms tácticos para gaming serio',
      'meta.description': 'Plataforma de comunicación de voz para gaming táctico. Whisper cross-canal, hotkeys globales con gamepad, multi-sala simultánea. Construido para squads competitivos y orgs que coordinan ops reales.',
      'splash.online': 'SYSTEMS · ONLINE',

      'nav.problem': 'El problema',
      'nav.product': 'Producto',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': 'Precios',
      'nav.cfx': 'CFX',
      'nav.cta': 'Únete a la beta',
      'nav.menu': 'Abrir menú',
      'nav.lang': 'Cambiar idioma',

      'hero.badge': 'BETA · ACCESO ANTICIPADO 2026',
      'hero.h1.html': 'La voz que tu <span class="stroke">squad</span> necesita.',
      'hero.lead': 'Comms tácticos con whisper cross-canal, hotkeys globales (incluso con gamepad) y multi-sala simultánea. Construido para gaming serio — para los squads que coordinan ops reales.',
      'hero.cta1': 'Descargar Beta',
      'hero.cta2': 'Ver el producto',
      'hero.stat1.label': 'Latencia táctica',
      'hero.stat2.label': 'Salas simultáneas',
      'hero.stat3.label': 'Plataformas pronto',

      'problem.eyebrow': 'El problema',
      'problem.h2.html': 'Las apps de chat son buenas para hablar.<br />Umbra es para coordinar.',
      'problem.lead': 'Hay una diferencia gigante entre charlar con amigos y comandar 50 personas en una operación de varias squads. Las apps de comms generalistas nunca fueron diseñadas para lo segundo. Nosotros sí.',
      'problem.casual.title': 'Lo que hacen las apps casuales',
      'problem.casual.text': 'Una sala. Una voz. Si quieres escuchar a otra squad, te vas. Si quieres coordinar entre dos, abres dos ventanas y rezas.',
      'problem.umbra.title': 'Lo que hace UMBRA',
      'problem.umbra.text': 'Estás en tu sala. Mantienes pulsado un botón y hablas a otra sala — o a todas al mismo tiempo — sin moverte. Sueltas y vuelves al instante. Tu squad nunca te perdió.',
      'problem.vs': 'vs',

      'features.eyebrow': 'Producto',
      'features.h2': 'Pensado para el caos del combate.',
      'features.lead': 'Cuatro decisiones de diseño que ningún competidor ofrece junto. Cada una nace de un dolor real de coordinar squads en juegos tácticos.',
      'features.f1.label': '01 · DIFERENCIADOR',
      'features.f1.title': 'Whisper cross-canal en tiempo real',
      'features.f1.text': 'Mantienes pulsado un atajo y tu voz llega a otra sala sin abandonar la tuya. Los miembros de la sala destino te escuchan etiquetado como whisper, sin interrumpir su conversación. Sueltas el atajo y todo vuelve a su sitio.',
      'features.f1.arrow': '— whisper →',
      'features.f2.title': 'Hotkeys globales reales',
      'features.f2.text': 'Tu PTT funciona aunque el juego tenga el foco. Vinculas cualquier botón de tu teclado, ratón o gamepad — incluso esos que el juego ignora.',
      'features.f2.note.html': 'Compatible con <kbd>Mouse 4/5</kbd> · <kbd>Stick R3</kbd> · <kbd>Pedales</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': 'Presencia multi-sala',
      'features.f3.text': 'Ves a quién hay en cada sala del canal en tiempo real. Asignas un atajo distinto a cada destino y disparas whispers como si fuera selección de target en un HUD.',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Audio Opus 48 kHz',
      'features.f4.text': 'SFU dedicado con codec Opus a calidad táctica. Sin compresión salvaje, sin pérdida de inteligibilidad cuando todos hablan al mismo tiempo. Latencia bajo 40 ms en condiciones normales.',
      'features.f4.note': 'Mediasoup · WebRTC · UDP nativo',

      'whisper.eyebrow': 'Cómo funciona',
      'whisper.h2': 'El whisper, paso a paso.',
      'whisper.lead': 'Sin abandonar tu sala, tu voz llega a otra etiquetada como whisper. Los miembros del destino la escuchan superpuesta a su conversación normal, con un indicador visual de quién y desde dónde habla.',
      'whisper.r1.label': 'Sala origen · BRIDGE',
      'whisper.r1.title': 'Mando táctico',
      'whisper.r1.m1': 'Xolii · hablando',
      'whisper.r2.label': 'Sala destino · SQUAD ALPHA',
      'whisper.r2.title': 'Pelotón en combate',
      'whisper.arrow': 'Whisper',

      'mobile.eyebrow': 'App móvil',
      'mobile.h2': 'Cuando la sala de squad es un campo real.',
      'mobile.lead': 'La app móvil de Umbra (próximamente iOS y Android) lleva las mismas comms tácticas a cualquier escenario. Donde tu equipo opera, ahí estamos — el whisper cross-canal funciona donde haya señal.',
      'mobile.c1.title': 'Airsoft & Milsim',
      'mobile.c1.text': 'Cinco squads dispersas en el campo. El comandante coordina por sectores con whisper sin saturar el canal general. La radio se queda en el bolsillo.',
      'mobile.c2.title': 'Paintball táctico',
      'mobile.c2.text': 'Coordinación rápida entre flancos. Llamas cobertura a tu compañero al otro lado del campo sin que el resto del equipo escuche el setup.',
      'mobile.c3.title': 'Producción audiovisual',
      'mobile.c3.text': 'Director, cámara, sonido y luces — cada uno en su sala, con whispers privados al talento sin interrumpir la toma. Sin walkie clásico.',
      'mobile.c4.title': 'FPV & Drone racing',
      'mobile.c4.text': 'Piloto en goggles, spotter relayando obstáculos en tiempo real. Latencia bajo 40 ms — la diferencia entre cruzar el gate o estrellar el quad.',
      'mobile.c5.title': 'Outdoor & expediciones',
      'mobile.c5.text': 'Esquí off-piste, vela, escalada de equipo. Grupos divididos en posiciones, líder coordinando rutas y emergencias sin gritar al viento.',
      'mobile.c6.title': 'Equipos profesionales',
      'mobile.c6.text': 'Security en eventos, training de respuesta, coaching deportivo. Donde haya equipos coordinándose, Umbra reemplaza al chat WhatsApp con algo serio.',
      'mobile.coming.label': 'App móvil',
      'mobile.coming.value': 'iOS y Android · Próximamente',

      'tactical.eyebrow': 'Para gaming serio',
      'tactical.h2': 'Construido para ops multi-squad de verdad.',
      'tactical.lead': 'Las orgs grandes que hacen operaciones reales sufren con apps generalistas: una sala por squad, comandantes con cinco ventanas abiertas, llegando tarde a las jugadas. Umbra resuelve ese problema en su raíz, sin importar el juego.',
      'tactical.p1.html': '<strong>Operaciones multi-squad reales.</strong> Un comandante puede hablar simultáneamente a Alpha, Bravo, Recon o Capital con un atajo por escuadrón.',
      'tactical.p2.html': '<strong>Roles jerárquicos integrados.</strong> Squad leader, officer, miembro — los permisos reflejan tu org, no la app de chat de turno.',
      'tactical.p3.html': '<strong>Privacidad para tu org.</strong> Servidor dedicado o self-hosted. Tus comms no se mezclan con el resto de la comunidad de internet.',
      'tactical.p4.html': '<strong>Pronto: integraciones con APIs de juegos.</strong> Ver a tus miembros in-game, su estado, sus stats — directamente en Umbra.',
      'tactical.cta': 'Reservar lugar para tu org',

      'pricing.eyebrow': 'Precios',
      'pricing.h2': 'Free para gamers. Suscripción para orgs.',
      'pricing.lead': 'Si juegas casual, Umbra es gratis para siempre. La org paga, los miembros se conectan. Sin ads, sin cosmetics, sin tonterías — tu suscripción cubre infraestructura y equipo.',
      'pricing.community.tagline': 'Para squads casuales y grupos pequeños.',
      'pricing.community.note': 'Free para siempre',
      'pricing.community.f1': 'Hasta 10 miembros',
      'pricing.community.f2': 'Whisper limitado (2 destinos)',
      'pricing.community.f3': 'Hotkeys teclado/ratón',
      'pricing.community.f4': 'Audio Opus standard',
      'pricing.community.cta': 'Empezar gratis',
      'pricing.squad.badge': 'Nuevo',
      'pricing.squad.tagline': 'Para squads competitivos con coach.',
      'pricing.squad.note': 'o $120/año · ahorra $24',
      'pricing.squad.f1': 'Hasta 25 miembros',
      'pricing.squad.f2': 'Whisper sin límites',
      'pricing.squad.f3': 'Soporte gamepad/HOTAS',
      'pricing.squad.f4': 'Audio Opus HD',
      'pricing.squad.cta': 'Probar 30 días',
      'pricing.org.featured': 'Más elegido',
      'pricing.org.tagline': 'Para orgs y clanes con ops reales.',
      'pricing.org.note': 'o $300/año · 2 meses gratis',
      'pricing.org.f1': 'Hasta 100 miembros',
      'pricing.org.f2': 'Stream Deck nativo',
      'pricing.org.f3': 'Roles jerárquicos completos',
      'pricing.org.f4': 'Branding del invite',
      'pricing.org.f5': 'Audit log',
      'pricing.org.cta': 'Reservar org',
      'pricing.enterprise.tagline': 'Esports, milsim grande, producción.',
      'pricing.enterprise.note': 'Anual con descuento',
      'pricing.enterprise.f1': 'Hasta 500 miembros',
      'pricing.enterprise.f2': 'Región dedicada · SLA 99.9%',
      'pricing.enterprise.f3': 'Grabación + transcripción AAR',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · Audit avanzado',
      'pricing.enterprise.cta': 'Hablar con ventas',
      'pricing.pro.eta': 'Q3 2026',
      'pricing.pro.desc': '$4.99/mes individual. Hotkey profiles cloud-sync entre PC + tablet + Stream Deck, soundboard personal, badge founder. Sin features pay-to-win.',
      'pricing.boost.eta': 'Q4 2026',
      'pricing.boost.desc': '$3.99/mes por boost. Un miembro aporta al plan de su org. 5 boosts = upgrade automático del tier. Como Server Boost de Discord, pero para algo que importa.',
      'pricing.period': '/mes',

      'about.eyebrow': 'CFX',
      'about.h2': 'Construido por gamers, para gamers.',
      'about.lead.html': 'UMBRA es un producto de <strong>CFX</strong>, un estudio de tecnología fundado por tres jugadores que pasaron demasiadas noches gritando coordenadas en cinco ventanas a la vez.',
      'about.p2': 'Vivimos dentro de las comunidades que usan Umbra y somos parte de las orgs que la prueban a diario. Cada decisión de producto la tomamos desde el lado del que se calza el casco y entra al combate, no desde una sala de juntas.',
      'about.p3': 'No vamos a vender datos, no vamos a meter anuncios en tus comms, no vamos a pivotar a NFTs cuando estemos aburridos. Esto es un negocio simple: haces un producto que funciona, lo cobras justo, lo mantienes vivo.',
      'about.role.title': 'Co-founder · All-rounder',
      'about.signature': 'CFX · 2026 · Independent studio',
      'about.frame.tag': 'CFX-CORP // GAMING TECHNOLOGY',

      'faq.eyebrow': 'FAQ',
      'faq.h2': 'Preguntas que ya nos hicieron.',
      'faq.q1': '¿Por qué usar Umbra en lugar de las apps que ya conozco?',
      'faq.a1.html': '<p>No tienes que dejar de usar las apps de chat de siempre — esas seguirán siendo donde el mundo charla. Umbra entra cuando hay coordinación seria de por medio: ops multi-squad, eventos competitivos, comms tácticos donde la fluidez vale la pena.</p><p>Muchas orgs lo usan en paralelo: la app generalista para lo casual, Umbra para las ops.</p>',
      'faq.q2': '¿Funciona con anti-cheat (EAC, BattlEye)?',
      'faq.a2.html': '<p>Sí. Umbra es una app desktop independiente que no se inyecta en el proceso del juego. No usa hooks ni overlays in-game, así que es 100% compatible con cualquier anti-cheat.</p><p>Los hotkeys globales se manejan al nivel del sistema operativo, no del juego.</p>',
      'faq.q3': '¿Mi org necesita auto-hostearlo?',
      'faq.a3.html': '<p>No. Por defecto Umbra es SaaS — corre en nuestra infra. Te suscribes y empiezas a usarlo en menos de un minuto.</p><p>El plan Enterprise ofrece self-hosting con licencia para orgs que requieren control total sobre su infraestructura (privacidad estricta, compliance, latencia regional muy específica).</p>',
      'faq.q4': '¿Hay versión Mac y Linux?',
      'faq.a4.html': '<p>Windows está disponible en beta hoy. Mac y Linux están en la hoja de ruta para los próximos meses. La base de Umbra (Tauri + Rust) es cross-platform por diseño, así que el port es directo, no un rewrite.</p>',
      'faq.q5': '¿Mis llamadas son privadas?',
      'faq.a5.html': '<p>Sí. Tu audio pasa por nuestro SFU y se reenvía a los miembros de la sala — no se graba ni se almacena. La única persistencia es metadata mínima (quién entró, quién hizo whisper a quién, para que el dueño de la org tenga visibilidad de su comunidad).</p><p>El plan Enterprise con grabación opt-in es explícito y solo funciona si el dueño lo activa para una sesión específica.</p>',
      'faq.q6': '¿Cuánto dinero mueve esto en infraestructura?',
      'faq.a6.html': '<p>Una pregunta honesta merece una respuesta honesta. Una sala de 50 personas con 5 hablando simultáneamente cuesta ~$0,07/hora en ancho de banda con nuestro stack actual (Mediasoup + Fly.io). Una org pesada haciendo 4 ops semanales de 2 horas: $2-3/mes. La suscripción cubre eso ~10x — el resto va a soporte, devs y servidores en buenas regiones.</p>',
      'faq.q7': '¿Por qué se llama Umbra?',
      'faq.a7.html': '<p>Umbra es la sombra más oscura de un eclipse — donde la luz está completamente bloqueada. Para nosotros simboliza el espacio privado donde tu org coordina sin que se filtre nada hacia afuera. El triángulo del logo (un Penrose imposible) representa los flujos de audio que conectan salas que en teoría no deberían poder conectarse.</p>',

      'cta.eyebrow': 'Beta',
      'cta.h2': 'Reserva tu plaza en la beta cerrada.',
      'cta.lead': 'Les damos prioridad a las orgs activas con ops periódicas. Déjanos tu email y te avisamos cuando se abra el cupo para tu equipo.',
      'cta.email.placeholder': 'comandante@tu-org.com',
      'cta.email.label': 'Email',
      'cta.button': 'Reservar acceso',
      'cta.success': 'Reservado. Te avisamos en cuanto liberemos cupos para tu org.',
      'cta.note': 'SIN SPAM · SIN VENTA DE DATOS · SOLO TE AVISAMOS CUANDO ABRA TU CUPO',

      'footer.brand': 'Comms tácticos para gaming serio. Producto de CFX, un estudio de tecnología independiente fundado por gamers de carrera.',
      'footer.col1.title': 'Producto',
      'footer.col1.l1': 'Features',
      'footer.col1.l2': 'Whisper',
      'footer.col1.l3': 'Precios',
      'footer.col1.l4': 'Beta',
      'footer.col2.title': 'Recursos',
      'footer.col2.l1': 'Para orgs',
      'footer.col2.l2': 'Roadmap (pronto)',
      'footer.col2.l3': 'Estado del servicio',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': 'Quiénes somos',
      'footer.col3.l2': 'Contacto',
      'footer.col3.l3': 'Soporte',
      'footer.copyright': '· Todos los derechos reservados',
      'footer.legal.privacy': 'Privacidad',
      'footer.legal.terms': 'Términos',
      'footer.legal.status': 'Estado',

      'auth.login': 'Iniciar sesión',
      'auth.modal.title': 'Iniciar sesión en UMBRA',
      'auth.modal.subtitle': 'Empieza con tu cuenta',
      'auth.modal.google_btn': 'Iniciar sesión con Google',
      'auth.modal.note': 'Usamos Google para login seguro sin contraseña. Nunca vemos tu contraseña.',
      'auth.modal.close': 'Cerrar',
      'auth.user.signout': 'Cerrar sesión',
      'auth.error.popup': 'Popup bloqueado. Permite popups para este sitio.',
      'auth.error.cancelled': 'Login cancelado.',
      'auth.error.failed': 'Falló el inicio de sesión. Inténtalo de nuevo.',
      'auth.error.network': 'No se pudo conectar al servidor de autenticación.',
    },

    // ═══════════════════════════════════════════════════════════
    en: {
      'meta.title': 'UMBRA by CFX — Tactical comms for serious gaming',
      'meta.description': 'Voice comms for tactical gaming. Cross-channel whisper, global hotkeys with gamepad support, multi-room presence. Built for competitive squads and orgs running real ops.',
      'splash.online': 'SYSTEMS · ONLINE',

      'nav.problem': 'The problem',
      'nav.product': 'Product',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': 'Pricing',
      'nav.cfx': 'CFX',
      'nav.cta': 'Join the beta',
      'nav.menu': 'Open menu',
      'nav.lang': 'Change language',

      'hero.badge': 'BETA · EARLY ACCESS 2026',
      'hero.h1.html': 'The voice your <span class="stroke">squad</span> needs.',
      'hero.lead': 'Tactical comms with cross-channel whisper, global hotkeys (gamepad too) and multi-room presence. Built for serious gaming — for squads running real ops.',
      'hero.cta1': 'Download Beta',
      'hero.cta2': 'See the product',
      'hero.stat1.label': 'Tactical latency',
      'hero.stat2.label': 'Concurrent rooms',
      'hero.stat3.label': 'Platforms soon',

      'problem.eyebrow': 'The problem',
      'problem.h2.html': 'Chat apps are great for talking.<br />Umbra is for coordinating.',
      'problem.lead': 'There’s a huge gap between chatting with friends and commanding 50 people across multiple squads. General-purpose comms apps were never built for the second case. We are.',
      'problem.casual.title': 'What casual apps do',
      'problem.casual.text': 'One room. One voice. To listen to another squad, you have to leave. To coordinate between two, you open two windows and pray.',
      'problem.umbra.title': 'What UMBRA does',
      'problem.umbra.text': 'You stay in your room. Hold a key and your voice reaches another room — or all of them at once — without moving. Release and you’re back instantly. Your squad never lost you.',
      'problem.vs': 'vs',

      'features.eyebrow': 'Product',
      'features.h2': 'Built for the chaos of combat.',
      'features.lead': 'Four design decisions that no competitor offers together. Each one comes from a real pain point of coordinating squads in tactical games.',
      'features.f1.label': '01 · DIFFERENTIATOR',
      'features.f1.title': 'Real-time cross-channel whisper',
      'features.f1.text': 'Hold a hotkey and your voice reaches another room without leaving yours. Members of the destination room hear you tagged as a whisper, without interrupting their conversation. Release and everything snaps back.',
      'features.f1.arrow': '— whisper →',
      'features.f2.title': 'Real global hotkeys',
      'features.f2.text': 'Your PTT works even when the game has focus. Bind any keyboard, mouse or gamepad button — even the ones the game ignores.',
      'features.f2.note.html': 'Works with <kbd>Mouse 4/5</kbd> · <kbd>Stick R3</kbd> · <kbd>Pedals</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': 'Multi-room presence',
      'features.f3.text': 'See who’s in every room of the channel in real time. Bind a different hotkey to each destination and fire whispers like target selection in a HUD.',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Opus 48 kHz audio',
      'features.f4.text': 'Dedicated SFU with Opus codec at tactical quality. No brutal compression, no loss of intelligibility when everyone’s talking at once. Sub-40 ms latency under normal conditions.',
      'features.f4.note': 'Mediasoup · WebRTC · native UDP',

      'whisper.eyebrow': 'How it works',
      'whisper.h2': 'Whisper, step by step.',
      'whisper.lead': 'Without leaving your room, your voice reaches another tagged as a whisper. Members of the destination hear it overlaid on their normal conversation, with a visual indicator of who’s speaking and from where.',
      'whisper.r1.label': 'Source room · BRIDGE',
      'whisper.r1.title': 'Tactical command',
      'whisper.r1.m1': 'Xolii · speaking',
      'whisper.r2.label': 'Target room · SQUAD ALPHA',
      'whisper.r2.title': 'Platoon in combat',
      'whisper.arrow': 'Whisper',

      'mobile.eyebrow': 'Mobile app',
      'mobile.h2': 'When the squad room is a real field.',
      'mobile.lead': 'The Umbra mobile app (coming soon to iOS and Android) brings the same tactical comms to any scenario. Wherever your team operates, we’re there — cross-channel whisper works wherever there’s signal.',
      'mobile.c1.title': 'Airsoft & Milsim',
      'mobile.c1.text': 'Five squads scattered across the field. The commander coordinates by sector with whispers, never saturating the main channel. The radio stays in your pocket.',
      'mobile.c2.title': 'Tactical paintball',
      'mobile.c2.text': 'Quick coordination between flanks. Call cover to a teammate across the field without the rest of the squad hearing the setup.',
      'mobile.c3.title': 'Film & live production',
      'mobile.c3.text': 'Director, camera, sound and lights — each in their own room, with private whispers to talent without breaking the take. Walkie-free.',
      'mobile.c4.title': 'FPV & drone racing',
      'mobile.c4.text': 'Pilot in goggles, spotter relaying obstacles in real time. Sub-40 ms latency — the difference between hitting the gate or crashing the quad.',
      'mobile.c5.title': 'Outdoor & expeditions',
      'mobile.c5.text': 'Off-piste skiing, sailing, climbing teams. Groups split across positions, leader coordinating routes and emergencies without shouting into the wind.',
      'mobile.c6.title': 'Pro teams',
      'mobile.c6.text': 'Event security, response training, sports coaching. Wherever there are teams coordinating, Umbra replaces WhatsApp chat with something serious.',
      'mobile.coming.label': 'Mobile app',
      'mobile.coming.value': 'iOS & Android · Coming soon',

      'tactical.eyebrow': 'For serious gaming',
      'tactical.h2': 'Built for real multi-squad ops.',
      'tactical.lead': 'Large orgs running real operations suffer with general-purpose apps: one room per squad, commanders with five windows open, late to the play. Umbra solves that at the root, regardless of the game.',
      'tactical.p1.html': '<strong>Real multi-squad operations.</strong> A commander can speak simultaneously to Alpha, Bravo, Recon or Capital with one hotkey per squad.',
      'tactical.p2.html': '<strong>Built-in role hierarchy.</strong> Squad leader, officer, member — permissions reflect your org, not the chat app of the day.',
      'tactical.p3.html': '<strong>Privacy for your org.</strong> Dedicated or self-hosted server. Your comms don’t mix with the rest of the internet community.',
      'tactical.p4.html': '<strong>Coming soon: game API integrations.</strong> See your members in-game, their status, their stats — directly in Umbra.',
      'tactical.cta': 'Reserve a slot for your org',

      'pricing.eyebrow': 'Pricing',
      'pricing.h2': 'Free for gamers. Subscription for orgs.',
      'pricing.lead': 'If you play casual, Umbra is free forever. The org pays, the members connect. No ads, no cosmetics, no nonsense — your subscription covers infra and team.',
      'pricing.community.tagline': 'For casual squads and small groups.',
      'pricing.community.note': 'Free forever',
      'pricing.community.f1': 'Up to 10 members',
      'pricing.community.f2': 'Whisper limited (2 targets)',
      'pricing.community.f3': 'Keyboard/mouse hotkeys',
      'pricing.community.f4': 'Standard Opus audio',
      'pricing.community.cta': 'Start free',
      'pricing.squad.badge': 'New',
      'pricing.squad.tagline': 'For competitive squads with a coach.',
      'pricing.squad.note': 'or $120/year · save $24',
      'pricing.squad.f1': 'Up to 25 members',
      'pricing.squad.f2': 'Unlimited whisper',
      'pricing.squad.f3': 'Gamepad/HOTAS support',
      'pricing.squad.f4': 'HD Opus audio',
      'pricing.squad.cta': 'Try 30 days',
      'pricing.org.featured': 'Most chosen',
      'pricing.org.tagline': 'For orgs and clans with real ops.',
      'pricing.org.note': 'or $300/year · 2 months free',
      'pricing.org.f1': 'Up to 100 members',
      'pricing.org.f2': 'Native Stream Deck',
      'pricing.org.f3': 'Full role hierarchy',
      'pricing.org.f4': 'Invite branding',
      'pricing.org.f5': 'Audit log',
      'pricing.org.cta': 'Reserve org',
      'pricing.enterprise.tagline': 'Esports, large milsim, production.',
      'pricing.enterprise.note': 'Annual with discount',
      'pricing.enterprise.f1': 'Up to 500 members',
      'pricing.enterprise.f2': 'Dedicated region · 99.9% SLA',
      'pricing.enterprise.f3': 'Recording + AAR transcription',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · Advanced audit',
      'pricing.enterprise.cta': 'Talk to sales',
      'pricing.pro.eta': 'Q3 2026',
      'pricing.pro.desc': '$4.99/mo individual. Hotkey profiles cloud-sync across PC + tablet + Stream Deck, personal soundboard, founder badge. No pay-to-win features.',
      'pricing.boost.eta': 'Q4 2026',
      'pricing.boost.desc': '$3.99/mo per boost. A member contributes to their org\'s plan. 5 boosts = automatic tier upgrade. Like Discord Server Boost, but for something that matters.',
      'pricing.period': '/mo',

      'about.eyebrow': 'CFX',
      'about.h2': 'Built by gamers, for gamers.',
      'about.lead.html': 'UMBRA is a product of <strong>CFX</strong>, a tech studio founded by three players who spent too many nights shouting coordinates across five windows at once.',
      'about.p2': 'We live inside the communities that use Umbra and we’re part of the orgs that test it daily. Every product decision is made from the perspective of someone gearing up and entering combat — not from a boardroom.',
      'about.p3': 'We won’t sell your data, we won’t put ads in your comms, we won’t pivot to NFTs when we get bored. This is a simple business: build a product that works, charge fairly, keep it alive.',
      'about.role.title': 'Co-founder · All-rounder',
      'about.signature': 'CFX · 2026 · Independent studio',
      'about.frame.tag': 'CFX-CORP // GAMING TECHNOLOGY',

      'faq.eyebrow': 'FAQ',
      'faq.h2': 'Questions we’ve already gotten.',
      'faq.q1': 'Why use Umbra instead of the apps I already know?',
      'faq.a1.html': '<p>You don’t have to drop the chat apps you already use — those will keep being where the world chats. Umbra steps in when serious coordination is on the line: multi-squad ops, competitive events, tactical comms where smoothness pays off.</p><p>Many orgs run them in parallel: the general app for casual stuff, Umbra for the ops.</p>',
      'faq.q2': 'Does it work with anti-cheat (EAC, BattlEye)?',
      'faq.a2.html': '<p>Yes. Umbra is a standalone desktop app that doesn’t inject into the game process. It uses no in-game hooks or overlays, so it’s 100% compatible with any anti-cheat.</p><p>Global hotkeys are handled at the OS level, not at the game level.</p>',
      'faq.q3': 'Does my org need to self-host it?',
      'faq.a3.html': '<p>No. By default Umbra is SaaS — runs on our infra. You subscribe and start using it in under a minute.</p><p>The Enterprise plan offers licensed self-hosting for orgs that require full control over their infrastructure (strict privacy, compliance, very specific regional latency).</p>',
      'faq.q4': 'Are Mac and Linux versions available?',
      'faq.a4.html': '<p>Windows is in beta today. Mac and Linux are on the roadmap for the coming months. Umbra’s foundation (Tauri + Rust) is cross-platform by design, so the port is straightforward, not a rewrite.</p>',
      'faq.q5': 'Are my calls private?',
      'faq.a5.html': '<p>Yes. Your audio passes through our SFU and is forwarded to room members — it’s not recorded or stored. The only persistence is minimal metadata (who joined, who whispered to whom, so the org owner has visibility into their community).</p><p>The Enterprise plan with opt-in recording is explicit and only works if the owner enables it for a specific session.</p>',
      'faq.q6': 'How much does the infrastructure actually cost?',
      'faq.a6.html': '<p>An honest question deserves an honest answer. A 50-person room with 5 talking simultaneously costs ~$0.07/hour in bandwidth on our current stack (Mediasoup + Fly.io). A heavy org doing 4 weekly 2-hour ops: $2-3/month. The subscription covers that ~10x — the rest goes to support, devs and servers in good regions.</p>',
      'faq.q7': 'Why is it called Umbra?',
      'faq.a7.html': '<p>Umbra is the darkest shadow of an eclipse — where the light is fully blocked. To us it symbolizes the private space where your org coordinates without anything leaking out. The logo’s triangle (an impossible Penrose) represents the audio flows connecting rooms that in theory shouldn’t be able to connect.</p>',

      'cta.eyebrow': 'Beta',
      'cta.h2': 'Reserve your seat in the closed beta.',
      'cta.lead': 'We give priority to active orgs with regular ops. Drop your email and we’ll let you know when a slot opens for your team.',
      'cta.email.placeholder': 'commander@your-org.com',
      'cta.email.label': 'Email',
      'cta.button': 'Reserve access',
      'cta.success': 'Reserved. We’ll let you know as soon as we open slots for your org.',
      'cta.note': 'NO SPAM · NO DATA SELLING · WE ONLY EMAIL WHEN YOUR SLOT OPENS',

      'footer.brand': 'Tactical comms for serious gaming. A product of CFX, an independent tech studio founded by career gamers.',
      'footer.col1.title': 'Product',
      'footer.col1.l1': 'Features',
      'footer.col1.l2': 'Whisper',
      'footer.col1.l3': 'Pricing',
      'footer.col1.l4': 'Beta',
      'footer.col2.title': 'Resources',
      'footer.col2.l1': 'For orgs',
      'footer.col2.l2': 'Roadmap (soon)',
      'footer.col2.l3': 'Service status',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': 'Who we are',
      'footer.col3.l2': 'Contact',
      'footer.col3.l3': 'Support',
      'footer.copyright': '· All rights reserved',
      'footer.legal.privacy': 'Privacy',
      'footer.legal.terms': 'Terms',
      'footer.legal.status': 'Status',

      'auth.login': 'Login',
      'auth.modal.title': 'Sign in to UMBRA',
      'auth.modal.subtitle': 'Get started with your account',
      'auth.modal.google_btn': 'Sign in with Google',
      'auth.modal.note': 'We use Google for secure passwordless login. We never see your password.',
      'auth.modal.close': 'Close',
      'auth.user.signout': 'Sign out',
      'auth.error.popup': 'Popup blocked. Please allow popups for this site.',
      'auth.error.cancelled': 'Sign-in cancelled.',
      'auth.error.failed': 'Sign-in failed. Please try again.',
      'auth.error.network': 'Could not reach the authentication server.',
    },

    // ═══════════════════════════════════════════════════════════
    fr: {
      'meta.title': 'UMBRA by CFX — Comms tactiques pour gaming sérieux',
      'meta.description': 'Plateforme de communication vocale pour gaming tactique. Whisper inter-salons, raccourcis globaux avec gamepad, multi-salons simultanés. Conçu pour les squads compétitifs et les orgs qui mènent de vraies ops.',
      'splash.online': 'SYSTÈMES · EN LIGNE',

      'nav.problem': 'Le problème',
      'nav.product': 'Produit',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': 'Tarifs',
      'nav.cfx': 'CFX',
      'nav.cta': 'Rejoindre la beta',
      'nav.menu': 'Ouvrir le menu',
      'nav.lang': 'Changer de langue',

      'hero.badge': 'BETA · ACCÈS ANTICIPÉ 2026',
      'hero.h1.html': 'La voix dont ta <span class="stroke">squad</span> a besoin.',
      'hero.lead': 'Comms tactiques avec whisper inter-salons, raccourcis globaux (même au gamepad) et multi-salons simultanés. Conçu pour le gaming sérieux — pour les squads qui mènent de vraies ops.',
      'hero.cta1': 'Télécharger la Beta',
      'hero.cta2': 'Voir le produit',
      'hero.stat1.label': 'Latence tactique',
      'hero.stat2.label': 'Salons simultanés',
      'hero.stat3.label': 'Plateformes bientôt',

      'problem.eyebrow': 'Le problème',
      'problem.h2.html': 'Les apps de chat sont bonnes pour discuter.<br />Umbra est pour coordonner.',
      'problem.lead': 'Il y a un gouffre entre discuter avec des amis et commander 50 personnes sur une opération multi-squads. Les apps de comms généralistes n’ont jamais été conçues pour le second cas. Nous, oui.',
      'problem.casual.title': 'Ce que font les apps casuelles',
      'problem.casual.text': 'Un salon. Une voix. Pour écouter une autre squad, tu dois partir. Pour coordonner entre deux, tu ouvres deux fenêtres et tu pries.',
      'problem.umbra.title': 'Ce que fait UMBRA',
      'problem.umbra.text': 'Tu restes dans ton salon. Tu maintiens un bouton et ta voix arrive dans un autre salon — ou tous à la fois — sans bouger. Tu relâches et tu reviens instantanément. Ta squad ne t’a jamais perdu.',
      'problem.vs': 'vs',

      'features.eyebrow': 'Produit',
      'features.h2': 'Pensé pour le chaos du combat.',
      'features.lead': 'Quatre choix de design qu’aucun concurrent ne propose ensemble. Chacun naît d’une vraie douleur de coordination de squads en jeux tactiques.',
      'features.f1.label': '01 · DIFFÉRENCIATEUR',
      'features.f1.title': 'Whisper inter-salons en temps réel',
      'features.f1.text': 'Tu maintiens un raccourci et ta voix atteint un autre salon sans quitter le tien. Les membres du salon de destination t’entendent étiqueté comme whisper, sans interrompre leur conversation. Tu relâches et tout revient en place.',
      'features.f1.arrow': '— whisper →',
      'features.f2.title': 'Vrais raccourcis globaux',
      'features.f2.text': 'Ton PTT marche même si le jeu a le focus. Tu bind n’importe quel bouton de clavier, souris ou gamepad — même ceux que le jeu ignore.',
      'features.f2.note.html': 'Compatible <kbd>Souris 4/5</kbd> · <kbd>Stick R3</kbd> · <kbd>Pédales</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': 'Présence multi-salons',
      'features.f3.text': 'Tu vois qui est dans chaque salon du canal en temps réel. Tu bind un raccourci par destination et tu déclenches des whispers comme une sélection de cible dans un HUD.',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Audio Opus 48 kHz',
      'features.f4.text': 'SFU dédié avec codec Opus à qualité tactique. Pas de compression brutale, pas de perte d’intelligibilité quand tout le monde parle en même temps. Latence sous 40 ms en conditions normales.',
      'features.f4.note': 'Mediasoup · WebRTC · UDP natif',

      'whisper.eyebrow': 'Comment ça marche',
      'whisper.h2': 'Le whisper, étape par étape.',
      'whisper.lead': 'Sans quitter ton salon, ta voix arrive dans un autre étiquetée comme whisper. Les membres de la destination l’entendent superposée à leur conversation normale, avec un indicateur visuel de qui parle et d’où.',
      'whisper.r1.label': 'Salon source · BRIDGE',
      'whisper.r1.title': 'Commandement tactique',
      'whisper.r1.m1': 'Xolii · parle',
      'whisper.r2.label': 'Salon cible · SQUAD ALPHA',
      'whisper.r2.title': 'Peloton en combat',
      'whisper.arrow': 'Whisper',

      'mobile.eyebrow': 'Application mobile',
      'mobile.h2': 'Quand la salle de squad est un vrai terrain.',
      'mobile.lead': 'L’application mobile d’Umbra (bientôt sur iOS et Android) apporte les mêmes comms tactiques à n’importe quel scénario. Où ton équipe opère, on est là — le whisper inter-salons fonctionne partout où il y a du signal.',
      'mobile.c1.title': 'Airsoft & Milsim',
      'mobile.c1.text': 'Cinq squads dispersées sur le terrain. Le commandant coordonne par secteur avec des whispers, sans saturer le canal général. La radio reste dans la poche.',
      'mobile.c2.title': 'Paintball tactique',
      'mobile.c2.text': 'Coordination rapide entre flancs. Appelle une couverture à ton coéquipier de l’autre côté du terrain sans que le reste de l’équipe entende le plan.',
      'mobile.c3.title': 'Production audiovisuelle',
      'mobile.c3.text': 'Réalisateur, caméra, son et lumières — chacun dans sa salle, avec des whispers privés au talent sans interrompre la prise. Sans walkie classique.',
      'mobile.c4.title': 'FPV & drone racing',
      'mobile.c4.text': 'Pilote en goggles, spotter relayant les obstacles en temps réel. Latence sous 40 ms — la différence entre passer le gate ou crasher le quad.',
      'mobile.c5.title': 'Outdoor & expéditions',
      'mobile.c5.text': 'Ski hors-piste, voile, équipes d’escalade. Groupes divisés en positions, leader coordonnant routes et urgences sans crier au vent.',
      'mobile.c6.title': 'Équipes pro',
      'mobile.c6.text': 'Sécurité événementielle, training de réponse, coaching sportif. Partout où des équipes se coordonnent, Umbra remplace le chat WhatsApp par quelque chose de sérieux.',
      'mobile.coming.label': 'App mobile',
      'mobile.coming.value': 'iOS et Android · Bientôt',

      'tactical.eyebrow': 'Pour le gaming sérieux',
      'tactical.h2': 'Conçu pour de vraies ops multi-squads.',
      'tactical.lead': 'Les grandes orgs qui mènent de vraies opérations souffrent avec les apps généralistes : un salon par squad, des commandants avec cinq fenêtres ouvertes, en retard sur l’action. Umbra règle ça à la racine, peu importe le jeu.',
      'tactical.p1.html': '<strong>Vraies opérations multi-squads.</strong> Un commandant peut parler simultanément à Alpha, Bravo, Recon ou Capital avec un raccourci par escouade.',
      'tactical.p2.html': '<strong>Hiérarchie de rôles intégrée.</strong> Squad leader, officier, membre — les permissions reflètent ton org, pas l’app de chat du moment.',
      'tactical.p3.html': '<strong>Confidentialité pour ton org.</strong> Serveur dédié ou self-hosted. Tes comms ne se mélangent pas avec le reste de la communauté internet.',
      'tactical.p4.html': '<strong>Bientôt : intégrations API de jeux.</strong> Voir tes membres in-game, leur statut, leurs stats — directement dans Umbra.',
      'tactical.cta': 'Réserver une place pour ton org',

      'pricing.eyebrow': 'Tarifs',
      'pricing.h2': 'Gratuit pour les gamers. Abonnement pour les orgs.',
      'pricing.lead': 'Si tu joues casual, Umbra est gratuit pour toujours. L’org paie, les membres se connectent. Pas de pubs, pas de cosmétiques, pas de bêtises — ton abonnement couvre infra et équipe.',
      'pricing.community.tagline': 'Pour squads casuels et petits groupes.',
      'pricing.community.note': 'Gratuit pour toujours',
      'pricing.community.f1': 'Jusqu’à 10 membres',
      'pricing.community.f2': 'Whisper limité (2 cibles)',
      'pricing.community.f3': 'Raccourcis clavier/souris',
      'pricing.community.f4': 'Audio Opus standard',
      'pricing.community.cta': 'Commencer gratuitement',
      'pricing.squad.badge': 'Nouveau',
      'pricing.squad.tagline': 'Pour squads compétitifs avec coach.',
      'pricing.squad.note': 'ou 120 $/an · économise 24 $',
      'pricing.squad.f1': 'Jusqu’à 25 membres',
      'pricing.squad.f2': 'Whisper illimité',
      'pricing.squad.f3': 'Support gamepad/HOTAS',
      'pricing.squad.f4': 'Audio Opus HD',
      'pricing.squad.cta': 'Essai 30 jours',
      'pricing.org.featured': 'Plus choisi',
      'pricing.org.tagline': 'Pour orgs et clans avec de vraies ops.',
      'pricing.org.note': 'ou 300 $/an · 2 mois gratuits',
      'pricing.org.f1': 'Jusqu’à 100 membres',
      'pricing.org.f2': 'Stream Deck natif',
      'pricing.org.f3': 'Hiérarchie de rôles complète',
      'pricing.org.f4': 'Branding de l’invitation',
      'pricing.org.f5': 'Audit log',
      'pricing.org.cta': 'Réserver l’org',
      'pricing.enterprise.tagline': 'Esport, milsim de taille, production.',
      'pricing.enterprise.note': 'Annuel avec remise',
      'pricing.enterprise.f1': 'Jusqu’à 500 membres',
      'pricing.enterprise.f2': 'Région dédiée · SLA 99,9 %',
      'pricing.enterprise.f3': 'Enregistrement + transcription AAR',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · Audit avancé',
      'pricing.enterprise.cta': 'Parler aux ventes',
      'pricing.pro.eta': 'T3 2026',
      'pricing.pro.desc': '4,99 $/mois individuel. Profils de raccourcis cloud-sync entre PC + tablette + Stream Deck, soundboard personnel, badge fondateur. Pas de features pay-to-win.',
      'pricing.boost.eta': 'T4 2026',
      'pricing.boost.desc': '3,99 $/mois par boost. Un membre contribue au plan de son org. 5 boosts = upgrade automatique du tier. Comme le Server Boost de Discord, mais pour quelque chose qui compte.',
      'pricing.period': '/mois',

      'about.eyebrow': 'CFX',
      'about.h2': 'Construit par des gamers, pour des gamers.',
      'about.lead.html': 'UMBRA est un produit de <strong>CFX</strong>, un studio tech fondé par trois joueurs qui ont passé trop de nuits à hurler des coordonnées sur cinq fenêtres à la fois.',
      'about.p2': 'Nous vivons dans les communautés qui utilisent Umbra et nous faisons partie des orgs qui le testent au quotidien. Chaque décision produit, on la prend depuis la place de celui qui enfile le casque et entre au combat — pas depuis une salle de réunion.',
      'about.p3': 'On ne vendra pas tes données, on ne mettra pas de pubs dans tes comms, on ne pivotera pas vers les NFT par ennui. C’est un business simple : tu fais un produit qui marche, tu le factures juste, tu le maintiens vivant.',
      'about.role.title': 'Co-fondateur · Polyvalent',
      'about.signature': 'CFX · 2026 · Studio indépendant',
      'about.frame.tag': 'CFX-CORP // TECHNOLOGIE GAMING',

      'faq.eyebrow': 'FAQ',
      'faq.h2': 'Questions qu’on nous a déjà posées.',
      'faq.q1': 'Pourquoi utiliser Umbra plutôt que les apps que je connais déjà ?',
      'faq.a1.html': '<p>Tu n’as pas à abandonner les apps de chat habituelles — elles continueront d’être où le monde discute. Umbra entre en jeu quand il y a de la vraie coordination en jeu : ops multi-squads, événements compétitifs, comms tactiques où la fluidité paie.</p><p>Beaucoup d’orgs les utilisent en parallèle : l’app généraliste pour le casual, Umbra pour les ops.</p>',
      'faq.q2': 'Est-ce que ça marche avec les anti-cheat (EAC, BattlEye) ?',
      'faq.a2.html': '<p>Oui. Umbra est une app desktop indépendante qui ne s’injecte pas dans le processus du jeu. Elle n’utilise ni hooks ni overlays in-game, donc elle est 100% compatible avec n’importe quel anti-cheat.</p><p>Les raccourcis globaux sont gérés au niveau de l’OS, pas du jeu.</p>',
      'faq.q3': 'Mon org doit-elle s’auto-héberger ?',
      'faq.a3.html': '<p>Non. Par défaut Umbra est SaaS — tourne sur notre infra. Tu t’abonnes et tu commences à l’utiliser en moins d’une minute.</p><p>Le plan Enterprise propose le self-hosting avec licence pour les orgs qui exigent un contrôle total sur leur infrastructure (confidentialité stricte, conformité, latence régionale très spécifique).</p>',
      'faq.q4': 'Y a-t-il des versions Mac et Linux ?',
      'faq.a4.html': '<p>Windows est en beta aujourd’hui. Mac et Linux sont sur la roadmap pour les prochains mois. La base d’Umbra (Tauri + Rust) est cross-platform par design, donc le port est direct, pas une réécriture.</p>',
      'faq.q5': 'Mes appels sont-ils privés ?',
      'faq.a5.html': '<p>Oui. Ton audio passe par notre SFU et est retransmis aux membres du salon — il n’est ni enregistré ni stocké. La seule persistance est une métadonnée minimale (qui a rejoint, qui a whispered à qui, pour que le propriétaire de l’org ait de la visibilité sur sa communauté).</p><p>Le plan Enterprise avec enregistrement opt-in est explicite et ne fonctionne que si le propriétaire l’active pour une session spécifique.</p>',
      'faq.q6': 'Combien coûte vraiment l’infrastructure ?',
      'faq.a6.html': '<p>Une question honnête mérite une réponse honnête. Un salon de 50 personnes avec 5 qui parlent simultanément coûte ~0,07 $/heure en bande passante avec notre stack actuel (Mediasoup + Fly.io). Une org chargée faisant 4 ops hebdomadaires de 2 h : 2-3 $/mois. L’abonnement couvre ça ~10x — le reste va au support, aux devs et aux serveurs dans de bonnes régions.</p>',
      'faq.q7': 'Pourquoi ça s’appelle Umbra ?',
      'faq.a7.html': '<p>Umbra est l’ombre la plus sombre d’une éclipse — où la lumière est totalement bloquée. Pour nous ça symbolise l’espace privé où ton org coordonne sans rien laisser fuiter. Le triangle du logo (un Penrose impossible) représente les flux audio qui connectent des salons qui en théorie ne devraient pas pouvoir se connecter.</p>',

      'cta.eyebrow': 'Beta',
      'cta.h2': 'Réserve ta place dans la beta fermée.',
      'cta.lead': 'On donne la priorité aux orgs actives avec des ops régulières. Laisse ton email et on te prévient quand un slot s’ouvre pour ton équipe.',
      'cta.email.placeholder': 'commandant@ton-org.com',
      'cta.email.label': 'Email',
      'cta.button': 'Réserver l’accès',
      'cta.success': 'Réservé. On te prévient dès qu’on libère des slots pour ton org.',
      'cta.note': 'PAS DE SPAM · PAS DE VENTE DE DONNÉES · ON N’ENVOIE QUE QUAND TON SLOT OUVRE',

      'footer.brand': 'Comms tactiques pour gaming sérieux. Un produit de CFX, studio tech indépendant fondé par des gamers de carrière.',
      'footer.col1.title': 'Produit',
      'footer.col1.l1': 'Features',
      'footer.col1.l2': 'Whisper',
      'footer.col1.l3': 'Tarifs',
      'footer.col1.l4': 'Beta',
      'footer.col2.title': 'Ressources',
      'footer.col2.l1': 'Pour les orgs',
      'footer.col2.l2': 'Roadmap (bientôt)',
      'footer.col2.l3': 'État du service',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': 'Qui nous sommes',
      'footer.col3.l2': 'Contact',
      'footer.col3.l3': 'Support',
      'footer.copyright': '· Tous droits réservés',
      'footer.legal.privacy': 'Confidentialité',
      'footer.legal.terms': 'Conditions',
      'footer.legal.status': 'État',

      'auth.login': 'Connexion',
      'auth.modal.title': 'Se connecter à UMBRA',
      'auth.modal.subtitle': 'Démarrez avec votre compte',
      'auth.modal.google_btn': 'Se connecter avec Google',
      'auth.modal.note': 'Nous utilisons Google pour une connexion sécurisée sans mot de passe. Nous ne voyons jamais votre mot de passe.',
      'auth.modal.close': 'Fermer',
      'auth.user.signout': 'Se déconnecter',
      'auth.error.popup': 'Popup bloquée. Veuillez autoriser les popups pour ce site.',
      'auth.error.cancelled': 'Connexion annulée.',
      'auth.error.failed': 'Échec de la connexion. Veuillez réessayer.',
      'auth.error.network': 'Impossible de joindre le serveur d’authentification.',
    },

    // ═══════════════════════════════════════════════════════════
    de: {
      'meta.title': 'UMBRA by CFX — Taktische Comms für ernsthaftes Gaming',
      'meta.description': 'Voice-Plattform für taktisches Gaming. Cross-Channel-Whisper, globale Hotkeys mit Gamepad-Support, gleichzeitige Multi-Räume. Gebaut für Wettbewerbs-Squads und Orgs, die echte Ops koordinieren.',
      'splash.online': 'SYSTEME · ONLINE',

      'nav.problem': 'Das Problem',
      'nav.product': 'Produkt',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': 'Preise',
      'nav.cfx': 'CFX',
      'nav.cta': 'Zur Beta',
      'nav.menu': 'Menü öffnen',
      'nav.lang': 'Sprache wechseln',

      'hero.badge': 'BETA · EARLY ACCESS 2026',
      'hero.h1.html': 'Die Stimme, die deine <span class="stroke">Squad</span> braucht.',
      'hero.lead': 'Taktische Comms mit Cross-Channel-Whisper, globale Hotkeys (auch per Gamepad) und gleichzeitige Multi-Räume. Gebaut für ernsthaftes Gaming — für Squads, die echte Ops fahren.',
      'hero.cta1': 'Beta herunterladen',
      'hero.cta2': 'Produkt ansehen',
      'hero.stat1.label': 'Taktische Latenz',
      'hero.stat2.label': 'Gleichzeitige Räume',
      'hero.stat3.label': 'Plattformen bald',

      'problem.eyebrow': 'Das Problem',
      'problem.h2.html': 'Chat-Apps sind gut zum Reden.<br />Umbra ist zum Koordinieren.',
      'problem.lead': 'Es gibt einen riesigen Unterschied zwischen mit Freunden plaudern und 50 Leute über mehrere Squads kommandieren. Allzweck-Comms-Apps wurden nie für Letzteres gebaut. Wir schon.',
      'problem.casual.title': 'Was Casual-Apps tun',
      'problem.casual.text': 'Ein Raum. Eine Stimme. Um eine andere Squad zu hören, musst du gehen. Um zwischen zwei zu koordinieren, öffnest du zwei Fenster und betest.',
      'problem.umbra.title': 'Was UMBRA tut',
      'problem.umbra.text': 'Du bleibst in deinem Raum. Halte eine Taste und deine Stimme erreicht einen anderen Raum — oder alle gleichzeitig — ohne dich zu bewegen. Loslassen und du bist sofort zurück. Deine Squad hat dich nie verloren.',
      'problem.vs': 'vs',

      'features.eyebrow': 'Produkt',
      'features.h2': 'Gebaut für das Chaos des Gefechts.',
      'features.lead': 'Vier Design-Entscheidungen, die kein Konkurrent zusammen anbietet. Jede entstammt einem realen Schmerzpunkt beim Koordinieren von Squads in taktischen Spielen.',
      'features.f1.label': '01 · UNTERSCHIED',
      'features.f1.title': 'Echtzeit-Cross-Channel-Whisper',
      'features.f1.text': 'Halte einen Hotkey und deine Stimme erreicht einen anderen Raum, ohne dass du deinen verlässt. Mitglieder im Zielraum hören dich als Whisper markiert, ohne ihre Konversation zu unterbrechen. Loslassen und alles springt zurück.',
      'features.f1.arrow': '— whisper →',
      'features.f2.title': 'Echte globale Hotkeys',
      'features.f2.text': 'Dein PTT funktioniert auch wenn das Spiel den Fokus hat. Bind beliebige Tasten von Tastatur, Maus oder Gamepad — auch die, die das Spiel ignoriert.',
      'features.f2.note.html': 'Funktioniert mit <kbd>Maus 4/5</kbd> · <kbd>Stick R3</kbd> · <kbd>Pedale</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': 'Multi-Raum-Präsenz',
      'features.f3.text': 'Sieh in Echtzeit, wer in jedem Raum des Kanals ist. Bind einen anderen Hotkey für jedes Ziel und feure Whisper wie eine Zielauswahl im HUD.',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Opus 48 kHz Audio',
      'features.f4.text': 'Dedizierte SFU mit Opus-Codec in taktischer Qualität. Keine brutale Kompression, keine Verständlichkeitsverluste, wenn alle gleichzeitig sprechen. Latenz unter 40 ms unter Normalbedingungen.',
      'features.f4.note': 'Mediasoup · WebRTC · natives UDP',

      'whisper.eyebrow': 'So funktioniert es',
      'whisper.h2': 'Whisper, Schritt für Schritt.',
      'whisper.lead': 'Ohne deinen Raum zu verlassen, erreicht deine Stimme einen anderen, als Whisper markiert. Mitglieder am Ziel hören sie über ihre normale Konversation gelegt, mit visueller Anzeige, wer von wo spricht.',
      'whisper.r1.label': 'Quellraum · BRIDGE',
      'whisper.r1.title': 'Taktisches Kommando',
      'whisper.r1.m1': 'Xolii · spricht',
      'whisper.r2.label': 'Zielraum · SQUAD ALPHA',
      'whisper.r2.title': 'Zug im Gefecht',
      'whisper.arrow': 'Whisper',

      'mobile.eyebrow': 'Mobile App',
      'mobile.h2': 'Wenn der Squad-Raum ein echtes Feld ist.',
      'mobile.lead': 'Die Umbra-Mobile-App (bald für iOS und Android) bringt dieselben taktischen Comms in jedes Szenario. Wo dein Team operiert, sind wir da — Cross-Channel-Whisper funktioniert überall, wo es Signal gibt.',
      'mobile.c1.title': 'Airsoft & Milsim',
      'mobile.c1.text': 'Fünf Squads über das Feld verteilt. Der Kommandant koordiniert nach Sektoren mit Whispers, ohne den Hauptkanal zu überfluten. Das Funkgerät bleibt in der Tasche.',
      'mobile.c2.title': 'Taktisches Paintball',
      'mobile.c2.text': 'Schnelle Koordination zwischen Flanken. Ruf Deckung von einem Teamkollegen auf der anderen Seite des Feldes, ohne dass der Rest des Teams den Plan hört.',
      'mobile.c3.title': 'Film- & Live-Produktion',
      'mobile.c3.text': 'Regie, Kamera, Ton und Licht — jeder in seinem Raum, mit privaten Whispers zum Talent, ohne den Take zu unterbrechen. Ohne klassisches Walkie.',
      'mobile.c4.title': 'FPV & Drone Racing',
      'mobile.c4.text': 'Pilot in Goggles, Spotter relayed Hindernisse in Echtzeit. Latenz unter 40 ms — der Unterschied zwischen Gate-Pass oder Quad-Crash.',
      'mobile.c5.title': 'Outdoor & Expeditionen',
      'mobile.c5.text': 'Off-Piste-Skiing, Segeln, Kletterteams. Gruppen verteilt auf Positionen, Leader koordiniert Routen und Notfälle ohne in den Wind zu schreien.',
      'mobile.c6.title': 'Profi-Teams',
      'mobile.c6.text': 'Event-Security, Response-Training, Sport-Coaching. Wo Teams sich koordinieren, ersetzt Umbra den WhatsApp-Chat mit etwas Ernsthaftem.',
      'mobile.coming.label': 'Mobile App',
      'mobile.coming.value': 'iOS & Android · Demnächst',

      'tactical.eyebrow': 'Für ernsthaftes Gaming',
      'tactical.h2': 'Gebaut für echte Multi-Squad-Ops.',
      'tactical.lead': 'Große Orgs, die echte Operationen fahren, leiden mit Allzweck-Apps: ein Raum pro Squad, Kommandanten mit fünf offenen Fenstern, die zu spät zur Action kommen. Umbra löst das an der Wurzel, egal welches Spiel.',
      'tactical.p1.html': '<strong>Echte Multi-Squad-Operationen.</strong> Ein Kommandant kann gleichzeitig zu Alpha, Bravo, Recon oder Capital sprechen — ein Hotkey pro Squad.',
      'tactical.p2.html': '<strong>Eingebaute Rollenhierarchie.</strong> Squad Leader, Officer, Member — Berechtigungen spiegeln deine Org wider, nicht die Chat-App des Tages.',
      'tactical.p3.html': '<strong>Privatsphäre für deine Org.</strong> Dedizierter oder selbst gehosteter Server. Deine Comms vermischen sich nicht mit dem Rest der Internet-Community.',
      'tactical.p4.html': '<strong>Bald: Game-API-Integrationen.</strong> Sieh deine Mitglieder in-game, ihren Status, ihre Stats — direkt in Umbra.',
      'tactical.cta': 'Platz für deine Org reservieren',

      'pricing.eyebrow': 'Preise',
      'pricing.h2': 'Free für Gamer. Abo für Orgs.',
      'pricing.lead': 'Wenn du casual spielst, ist Umbra für immer kostenlos. Die Org zahlt, die Mitglieder verbinden sich. Keine Werbung, keine Kosmetik, kein Quatsch — dein Abo deckt Infra und Team.',
      'pricing.community.tagline': 'Für Casual-Squads und kleine Gruppen.',
      'pricing.community.note': 'Für immer kostenlos',
      'pricing.community.f1': 'Bis zu 10 Mitglieder',
      'pricing.community.f2': 'Whisper begrenzt (2 Ziele)',
      'pricing.community.f3': 'Tastatur-/Maus-Hotkeys',
      'pricing.community.f4': 'Standard Opus Audio',
      'pricing.community.cta': 'Kostenlos starten',
      'pricing.squad.badge': 'Neu',
      'pricing.squad.tagline': 'Für kompetitive Squads mit Coach.',
      'pricing.squad.note': 'oder $120/Jahr · spare $24',
      'pricing.squad.f1': 'Bis zu 25 Mitglieder',
      'pricing.squad.f2': 'Whisper ohne Limit',
      'pricing.squad.f3': 'Gamepad/HOTAS-Support',
      'pricing.squad.f4': 'HD Opus Audio',
      'pricing.squad.cta': '30 Tage testen',
      'pricing.org.featured': 'Am beliebtesten',
      'pricing.org.tagline': 'Für Orgs und Clans mit echten Ops.',
      'pricing.org.note': 'oder $300/Jahr · 2 Monate gratis',
      'pricing.org.f1': 'Bis zu 100 Mitglieder',
      'pricing.org.f2': 'Natives Stream Deck',
      'pricing.org.f3': 'Vollständige Rollenhierarchie',
      'pricing.org.f4': 'Invite-Branding',
      'pricing.org.f5': 'Audit-Log',
      'pricing.org.cta': 'Org reservieren',
      'pricing.enterprise.tagline': 'Esports, große Milsim, Produktion.',
      'pricing.enterprise.note': 'Jährlich mit Rabatt',
      'pricing.enterprise.f1': 'Bis zu 500 Mitglieder',
      'pricing.enterprise.f2': 'Dedizierte Region · SLA 99,9 %',
      'pricing.enterprise.f3': 'Aufnahme + AAR-Transkription',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · Erweiterter Audit',
      'pricing.enterprise.cta': 'Mit Sales sprechen',
      'pricing.pro.eta': 'Q3 2026',
      'pricing.pro.desc': '$4,99/Monat individuell. Hotkey-Profile cloud-sync zwischen PC + Tablet + Stream Deck, persönliches Soundboard, Founder-Badge. Keine Pay-to-Win-Features.',
      'pricing.boost.eta': 'Q4 2026',
      'pricing.boost.desc': '$3,99/Monat pro Boost. Ein Mitglied trägt zum Org-Plan bei. 5 Boosts = automatisches Tier-Upgrade. Wie Discord Server Boost, aber für etwas, das zählt.',
      'pricing.period': '/Mo',

      'about.eyebrow': 'CFX',
      'about.h2': 'Von Gamern für Gamer gebaut.',
      'about.lead.html': 'UMBRA ist ein Produkt von <strong>CFX</strong>, einem Tech-Studio gegründet von drei Spielern, die zu viele Nächte damit verbracht haben, Koordinaten in fünf Fenstern gleichzeitig zu schreien.',
      'about.p2': 'Wir leben in den Communities, die Umbra nutzen, und sind Teil der Orgs, die es täglich testen. Jede Produktentscheidung treffen wir aus der Sicht von jemandem, der den Helm aufsetzt und ins Gefecht zieht — nicht aus einem Sitzungssaal.',
      'about.p3': 'Wir verkaufen deine Daten nicht, wir packen keine Werbung in deine Comms, wir pivotieren nicht zu NFTs aus Langeweile. Das ist ein einfaches Geschäft: Bau ein Produkt, das funktioniert, verlange einen fairen Preis, halte es am Leben.',
      'about.role.title': 'Co-Founder · All-rounder',
      'about.signature': 'CFX · 2026 · Unabhängiges Studio',
      'about.frame.tag': 'CFX-CORP // GAMING TECHNOLOGY',

      'faq.eyebrow': 'FAQ',
      'faq.h2': 'Fragen, die wir schon bekommen haben.',
      'faq.q1': 'Warum Umbra statt der Apps, die ich schon kenne?',
      'faq.a1.html': '<p>Du musst die gewohnten Chat-Apps nicht aufgeben — die bleiben, wo die Welt plaudert. Umbra kommt ins Spiel, wenn ernsthafte Koordination dranhängt: Multi-Squad-Ops, Wettkampf-Events, taktische Comms, wo Geschmeidigkeit zählt.</p><p>Viele Orgs nutzen sie parallel: die Allzweck-App fürs Casual, Umbra für die Ops.</p>',
      'faq.q2': 'Funktioniert es mit Anti-Cheat (EAC, BattlEye)?',
      'faq.a2.html': '<p>Ja. Umbra ist eine eigenständige Desktop-App, die sich nicht in den Spielprozess injiziert. Sie nutzt keine In-Game-Hooks oder Overlays, ist also 100% kompatibel mit jedem Anti-Cheat.</p><p>Globale Hotkeys werden auf OS-Ebene verwaltet, nicht auf Spiel-Ebene.</p>',
      'faq.q3': 'Muss meine Org selbst hosten?',
      'faq.a3.html': '<p>Nein. Standardmäßig ist Umbra SaaS — läuft auf unserer Infra. Du abonnierst und nutzt es in unter einer Minute.</p><p>Der Enterprise-Plan bietet lizenziertes Self-Hosting für Orgs, die volle Kontrolle über ihre Infrastruktur brauchen (strenge Privatsphäre, Compliance, sehr spezifische regionale Latenz).</p>',
      'faq.q4': 'Gibt es Mac- und Linux-Versionen?',
      'faq.a4.html': '<p>Windows ist heute in der Beta. Mac und Linux sind in den nächsten Monaten auf der Roadmap. Umbras Basis (Tauri + Rust) ist cross-platform by design, der Port ist also direkt, kein Rewrite.</p>',
      'faq.q5': 'Sind meine Anrufe privat?',
      'faq.a5.html': '<p>Ja. Dein Audio läuft durch unsere SFU und wird an die Raum-Mitglieder weitergeleitet — es wird nicht aufgenommen oder gespeichert. Die einzige Persistenz ist minimale Metadaten (wer beigetreten ist, wer wem gewhispered hat, damit der Org-Owner Sicht auf seine Community hat).</p><p>Der Enterprise-Plan mit Opt-in-Aufnahme ist explizit und funktioniert nur, wenn der Owner ihn für eine bestimmte Sitzung aktiviert.</p>',
      'faq.q6': 'Was kostet die Infrastruktur tatsächlich?',
      'faq.a6.html': '<p>Eine ehrliche Frage verdient eine ehrliche Antwort. Ein 50-Personen-Raum mit 5 gleichzeitig Sprechenden kostet ~0,07 $/Stunde Bandbreite auf unserem aktuellen Stack (Mediasoup + Fly.io). Eine schwere Org mit 4 wöchentlichen 2-h-Ops: 2-3 $/Monat. Das Abo deckt das ~10x — der Rest geht in Support, Devs und Server in guten Regionen.</p>',
      'faq.q7': 'Warum heißt es Umbra?',
      'faq.a7.html': '<p>Umbra ist der dunkelste Schatten einer Sonnenfinsternis — wo das Licht vollständig blockiert ist. Für uns symbolisiert es den privaten Raum, in dem deine Org koordiniert, ohne dass etwas nach außen dringt. Das Dreieck im Logo (ein unmögliches Penrose-Dreieck) repräsentiert die Audio-Flüsse, die Räume verbinden, die theoretisch nicht verbunden sein dürften.</p>',

      'cta.eyebrow': 'Beta',
      'cta.h2': 'Sichere dir einen Platz in der Closed Beta.',
      'cta.lead': 'Wir geben aktiven Orgs mit regelmäßigen Ops Vorrang. Lass uns deine E-Mail da und wir melden uns, wenn ein Slot für dein Team frei wird.',
      'cta.email.placeholder': 'kommandant@deine-org.com',
      'cta.email.label': 'E-Mail',
      'cta.button': 'Zugang reservieren',
      'cta.success': 'Reserviert. Wir melden uns, sobald wir Slots für deine Org freigeben.',
      'cta.note': 'KEIN SPAM · KEIN DATENVERKAUF · WIR MAILEN NUR, WENN DEIN SLOT FREI WIRD',

      'footer.brand': 'Taktische Comms für ernsthaftes Gaming. Ein Produkt von CFX, einem unabhängigen Tech-Studio gegründet von Gamern aus Leidenschaft.',
      'footer.col1.title': 'Produkt',
      'footer.col1.l1': 'Features',
      'footer.col1.l2': 'Whisper',
      'footer.col1.l3': 'Preise',
      'footer.col1.l4': 'Beta',
      'footer.col2.title': 'Ressourcen',
      'footer.col2.l1': 'Für Orgs',
      'footer.col2.l2': 'Roadmap (bald)',
      'footer.col2.l3': 'Service-Status',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': 'Wer wir sind',
      'footer.col3.l2': 'Kontakt',
      'footer.col3.l3': 'Support',
      'footer.copyright': '· Alle Rechte vorbehalten',
      'footer.legal.privacy': 'Datenschutz',
      'footer.legal.terms': 'Bedingungen',
      'footer.legal.status': 'Status',

      'auth.login': 'Anmelden',
      'auth.modal.title': 'Bei UMBRA anmelden',
      'auth.modal.subtitle': 'Starte mit deinem Konto',
      'auth.modal.google_btn': 'Mit Google anmelden',
      'auth.modal.note': 'Wir verwenden Google für sicheres passwortloses Login. Wir sehen dein Passwort nie.',
      'auth.modal.close': 'Schließen',
      'auth.user.signout': 'Abmelden',
      'auth.error.popup': 'Popup blockiert. Bitte erlaube Popups für diese Seite.',
      'auth.error.cancelled': 'Anmeldung abgebrochen.',
      'auth.error.failed': 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
      'auth.error.network': 'Authentifizierungsserver nicht erreichbar.',
    },

    // ═══════════════════════════════════════════════════════════
    pt: {
      'meta.title': 'UMBRA by CFX — Comms táticos para gaming sério',
      'meta.description': 'Plataforma de comunicação por voz para gaming tático. Whisper entre canais, hotkeys globais com gamepad, multi-sala simultânea. Construído para squads competitivos e orgs que coordenam ops reais.',
      'splash.online': 'SISTEMAS · ONLINE',

      'nav.problem': 'O problema',
      'nav.product': 'Produto',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': 'Preços',
      'nav.cfx': 'CFX',
      'nav.cta': 'Entrar na beta',
      'nav.menu': 'Abrir menu',
      'nav.lang': 'Mudar idioma',

      'hero.badge': 'BETA · ACESSO ANTECIPADO 2026',
      'hero.h1.html': 'A voz que sua <span class="stroke">squad</span> precisa.',
      'hero.lead': 'Comms táticos com whisper entre canais, hotkeys globais (até com gamepad) e multi-sala simultânea. Feito para gaming sério — para os squads que coordenam ops reais.',
      'hero.cta1': 'Baixar Beta',
      'hero.cta2': 'Ver o produto',
      'hero.stat1.label': 'Latência tática',
      'hero.stat2.label': 'Salas simultâneas',
      'hero.stat3.label': 'Plataformas em breve',

      'problem.eyebrow': 'O problema',
      'problem.h2.html': 'Apps de chat são boas pra conversar.<br />Umbra é pra coordenar.',
      'problem.lead': 'Existe um abismo entre bater papo com amigos e comandar 50 pessoas numa operação multi-squad. Apps de comms generalistas nunca foram feitas para o segundo caso. A gente foi.',
      'problem.casual.title': 'O que apps casuais fazem',
      'problem.casual.text': 'Uma sala. Uma voz. Pra ouvir outra squad, você sai. Pra coordenar entre duas, abre duas janelas e reza.',
      'problem.umbra.title': 'O que UMBRA faz',
      'problem.umbra.text': 'Você fica na sua sala. Segura um botão e sua voz chega em outra sala — ou em todas ao mesmo tempo — sem se mexer. Solta e volta na hora. Sua squad nunca te perdeu.',
      'problem.vs': 'vs',

      'features.eyebrow': 'Produto',
      'features.h2': 'Pensado pro caos do combate.',
      'features.lead': 'Quatro decisões de design que nenhum concorrente oferece junto. Cada uma nasce de uma dor real de coordenar squads em jogos táticos.',
      'features.f1.label': '01 · DIFERENCIAL',
      'features.f1.title': 'Whisper entre canais em tempo real',
      'features.f1.text': 'Você segura um atalho e sua voz chega em outra sala sem sair da sua. Os membros da sala destino te ouvem marcado como whisper, sem interromper a conversa deles. Solta o atalho e tudo volta ao lugar.',
      'features.f1.arrow': '— whisper →',
      'features.f2.title': 'Hotkeys globais de verdade',
      'features.f2.text': 'Seu PTT funciona mesmo com o jogo em foco. Você binda qualquer botão de teclado, mouse ou gamepad — até os que o jogo ignora.',
      'features.f2.note.html': 'Compatível com <kbd>Mouse 4/5</kbd> · <kbd>Stick R3</kbd> · <kbd>Pedais</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': 'Presença multi-sala',
      'features.f3.text': 'Você vê quem está em cada sala do canal em tempo real. Binda um atalho diferente pra cada destino e dispara whispers como seleção de alvo num HUD.',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Áudio Opus 48 kHz',
      'features.f4.text': 'SFU dedicado com codec Opus em qualidade tática. Sem compressão brutal, sem perda de inteligibilidade quando todo mundo fala junto. Latência abaixo de 40 ms em condições normais.',
      'features.f4.note': 'Mediasoup · WebRTC · UDP nativo',

      'whisper.eyebrow': 'Como funciona',
      'whisper.h2': 'O whisper, passo a passo.',
      'whisper.lead': 'Sem sair da sua sala, sua voz chega em outra marcada como whisper. Os membros do destino ouvem ela sobreposta à conversa normal deles, com indicador visual de quem fala e de onde.',
      'whisper.r1.label': 'Sala origem · BRIDGE',
      'whisper.r1.title': 'Comando tático',
      'whisper.r1.m1': 'Xolii · falando',
      'whisper.r2.label': 'Sala destino · SQUAD ALPHA',
      'whisper.r2.title': 'Pelotão em combate',
      'whisper.arrow': 'Whisper',

      'mobile.eyebrow': 'App móvel',
      'mobile.h2': 'Quando a sala da squad é um campo real.',
      'mobile.lead': 'O app móvel do Umbra (em breve no iOS e Android) leva as mesmas comms táticas pra qualquer cenário. Onde a sua equipe opera, a gente tá lá — o whisper entre canais funciona onde tiver sinal.',
      'mobile.c1.title': 'Airsoft & Milsim',
      'mobile.c1.text': 'Cinco squads dispersas no campo. O comandante coordena por setores com whisper sem saturar o canal geral. O rádio fica no bolso.',
      'mobile.c2.title': 'Paintball tático',
      'mobile.c2.text': 'Coordenação rápida entre flancos. Você chama cobertura pro seu parceiro do outro lado do campo sem o resto da squad ouvir o setup.',
      'mobile.c3.title': 'Produção audiovisual',
      'mobile.c3.text': 'Direção, câmera, som e luzes — cada um na sua sala, com whispers privados pro talento sem interromper a tomada. Sem walkie clássico.',
      'mobile.c4.title': 'FPV & drone racing',
      'mobile.c4.text': 'Piloto nos goggles, spotter retransmitindo obstáculos em tempo real. Latência abaixo de 40 ms — diferença entre cruzar o gate ou crashear o quad.',
      'mobile.c5.title': 'Outdoor & expedições',
      'mobile.c5.text': 'Esqui off-piste, vela, equipes de escalada. Grupos divididos em posições, líder coordenando rotas e emergências sem gritar pro vento.',
      'mobile.c6.title': 'Equipes profissionais',
      'mobile.c6.text': 'Security em eventos, treinamento de resposta, coaching esportivo. Onde tem equipes se coordenando, Umbra substitui o chat de WhatsApp por algo sério.',
      'mobile.coming.label': 'App móvel',
      'mobile.coming.value': 'iOS e Android · Em breve',

      'tactical.eyebrow': 'Pra gaming sério',
      'tactical.h2': 'Feito pra ops multi-squad de verdade.',
      'tactical.lead': 'Orgs grandes que rodam operações reais sofrem com apps generalistas: uma sala por squad, comandantes com cinco janelas abertas, chegando atrasados na jogada. Umbra resolve isso na raiz, não importa o jogo.',
      'tactical.p1.html': '<strong>Operações multi-squad reais.</strong> Um comandante pode falar simultaneamente com Alpha, Bravo, Recon ou Capital com um atalho por esquadrão.',
      'tactical.p2.html': '<strong>Hierarquia de roles integrada.</strong> Squad leader, officer, member — as permissões refletem sua org, não o app de chat da vez.',
      'tactical.p3.html': '<strong>Privacidade pra sua org.</strong> Servidor dedicado ou self-hosted. Suas comms não se misturam com o resto da comunidade da internet.',
      'tactical.p4.html': '<strong>Em breve: integrações com APIs de jogos.</strong> Ver seus membros in-game, status, stats — direto no Umbra.',
      'tactical.cta': 'Reservar lugar pra sua org',

      'pricing.eyebrow': 'Preços',
      'pricing.h2': 'Free pra gamers. Assinatura pra orgs.',
      'pricing.lead': 'Se você joga casual, Umbra é grátis pra sempre. A org paga, os membros se conectam. Sem ads, sem cosméticos, sem firula — sua assinatura cobre infra e equipe.',
      'pricing.community.tagline': 'Pra squads casuais e grupos pequenos.',
      'pricing.community.note': 'Grátis pra sempre',
      'pricing.community.f1': 'Até 10 membros',
      'pricing.community.f2': 'Whisper limitado (2 destinos)',
      'pricing.community.f3': 'Hotkeys teclado/mouse',
      'pricing.community.f4': 'Áudio Opus standard',
      'pricing.community.cta': 'Começar grátis',
      'pricing.squad.badge': 'Novo',
      'pricing.squad.tagline': 'Pra squads competitivos com coach.',
      'pricing.squad.note': 'ou $120/ano · economize $24',
      'pricing.squad.f1': 'Até 25 membros',
      'pricing.squad.f2': 'Whisper sem limites',
      'pricing.squad.f3': 'Suporte gamepad/HOTAS',
      'pricing.squad.f4': 'Áudio Opus HD',
      'pricing.squad.cta': 'Testar 30 dias',
      'pricing.org.featured': 'Mais escolhido',
      'pricing.org.tagline': 'Pra orgs e clãs com ops reais.',
      'pricing.org.note': 'ou $300/ano · 2 meses grátis',
      'pricing.org.f1': 'Até 100 membros',
      'pricing.org.f2': 'Stream Deck nativo',
      'pricing.org.f3': 'Hierarquia de roles completa',
      'pricing.org.f4': 'Branding do invite',
      'pricing.org.f5': 'Audit log',
      'pricing.org.cta': 'Reservar org',
      'pricing.enterprise.tagline': 'Esports, milsim grande, produção.',
      'pricing.enterprise.note': 'Anual com desconto',
      'pricing.enterprise.f1': 'Até 500 membros',
      'pricing.enterprise.f2': 'Região dedicada · SLA 99,9%',
      'pricing.enterprise.f3': 'Gravação + transcrição AAR',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · Audit avançado',
      'pricing.enterprise.cta': 'Falar com vendas',
      'pricing.pro.eta': 'Q3 2026',
      'pricing.pro.desc': '$4,99/mês individual. Perfis de hotkey cloud-sync entre PC + tablet + Stream Deck, soundboard pessoal, badge founder. Sem features pay-to-win.',
      'pricing.boost.eta': 'Q4 2026',
      'pricing.boost.desc': '$3,99/mês por boost. Um membro contribui pro plano da sua org. 5 boosts = upgrade automático do tier. Como Server Boost do Discord, mas pra algo que importa.',
      'pricing.period': '/mês',

      'about.eyebrow': 'CFX',
      'about.h2': 'Construído por gamers, pra gamers.',
      'about.lead.html': 'UMBRA é um produto da <strong>CFX</strong>, um estúdio de tecnologia fundado por três jogadores que passaram noites demais gritando coordenadas em cinco janelas ao mesmo tempo.',
      'about.p2': 'A gente vive dentro das comunidades que usam Umbra e faz parte das orgs que testam ele todo dia. Cada decisão de produto a gente toma do lado de quem coloca o capacete e entra em combate, não de uma sala de reuniões.',
      'about.p3': 'A gente não vai vender seus dados, não vai meter ads nas suas comms, não vai pivotar pra NFTs quando se entediar. É um negócio simples: você faz um produto que funciona, cobra justo, mantém vivo.',
      'about.role.title': 'Co-founder · All-rounder',
      'about.signature': 'CFX · 2026 · Estúdio independente',
      'about.frame.tag': 'CFX-CORP // GAMING TECHNOLOGY',

      'faq.eyebrow': 'FAQ',
      'faq.h2': 'Perguntas que já fizeram pra gente.',
      'faq.q1': 'Por que usar Umbra em vez dos apps que eu já conheço?',
      'faq.a1.html': '<p>Você não precisa abandonar os apps de chat de sempre — eles vão continuar sendo onde o mundo conversa. Umbra entra quando tem coordenação séria envolvida: ops multi-squad, eventos competitivos, comms táticos onde a fluidez vale a pena.</p><p>Muitas orgs usam em paralelo: o app generalista pro casual, Umbra pras ops.</p>',
      'faq.q2': 'Funciona com anti-cheat (EAC, BattlEye)?',
      'faq.a2.html': '<p>Sim. Umbra é um app desktop independente que não se injeta no processo do jogo. Não usa hooks nem overlays in-game, então é 100% compatível com qualquer anti-cheat.</p><p>Os hotkeys globais são gerenciados no nível do sistema operacional, não do jogo.</p>',
      'faq.q3': 'Minha org precisa fazer self-host?',
      'faq.a3.html': '<p>Não. Por padrão Umbra é SaaS — roda na nossa infra. Você assina e começa a usar em menos de um minuto.</p><p>O plano Enterprise oferece self-hosting com licença pra orgs que precisam de controle total sobre a infraestrutura (privacidade estrita, compliance, latência regional muito específica).</p>',
      'faq.q4': 'Tem versão Mac e Linux?',
      'faq.a4.html': '<p>Windows está em beta hoje. Mac e Linux estão no roadmap pros próximos meses. A base do Umbra (Tauri + Rust) é cross-platform por design, então o port é direto, não um rewrite.</p>',
      'faq.q5': 'Minhas chamadas são privadas?',
      'faq.a5.html': '<p>Sim. Seu áudio passa pelo nosso SFU e é repassado pros membros da sala — não é gravado nem armazenado. A única persistência é metadata mínima (quem entrou, quem fez whisper pra quem, pra que o dono da org tenha visibilidade da comunidade).</p><p>O plano Enterprise com gravação opt-in é explícito e só funciona se o dono ativar pra uma sessão específica.</p>',
      'faq.q6': 'Quanto a infraestrutura custa de verdade?',
      'faq.a6.html': '<p>Pergunta honesta merece resposta honesta. Uma sala de 50 pessoas com 5 falando simultaneamente custa ~$0,07/hora em banda no nosso stack atual (Mediasoup + Fly.io). Uma org pesada fazendo 4 ops semanais de 2 horas: $2-3/mês. A assinatura cobre isso ~10x — o resto vai pra suporte, devs e servidores em regiões boas.</p>',
      'faq.q7': 'Por que se chama Umbra?',
      'faq.a7.html': '<p>Umbra é a sombra mais escura de um eclipse — onde a luz fica completamente bloqueada. Pra gente simboliza o espaço privado onde sua org coordena sem nada vazar pra fora. O triângulo do logo (um Penrose impossível) representa os fluxos de áudio que conectam salas que em teoria não deveriam se conectar.</p>',

      'cta.eyebrow': 'Beta',
      'cta.h2': 'Garanta sua vaga na beta fechada.',
      'cta.lead': 'A gente prioriza orgs ativas com ops periódicas. Deixa seu email e a gente avisa quando abrir slot pra seu time.',
      'cta.email.placeholder': 'comandante@sua-org.com',
      'cta.email.label': 'Email',
      'cta.button': 'Reservar acesso',
      'cta.success': 'Reservado. A gente avisa assim que liberar slots pra sua org.',
      'cta.note': 'SEM SPAM · SEM VENDA DE DADOS · A GENTE SÓ AVISA QUANDO ABRIR SUA VAGA',

      'footer.brand': 'Comms táticos pra gaming sério. Um produto da CFX, estúdio de tecnologia independente fundado por gamers de carreira.',
      'footer.col1.title': 'Produto',
      'footer.col1.l1': 'Features',
      'footer.col1.l2': 'Whisper',
      'footer.col1.l3': 'Preços',
      'footer.col1.l4': 'Beta',
      'footer.col2.title': 'Recursos',
      'footer.col2.l1': 'Pra orgs',
      'footer.col2.l2': 'Roadmap (em breve)',
      'footer.col2.l3': 'Status do serviço',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': 'Quem somos',
      'footer.col3.l2': 'Contato',
      'footer.col3.l3': 'Suporte',
      'footer.copyright': '· Todos os direitos reservados',
      'footer.legal.privacy': 'Privacidade',
      'footer.legal.terms': 'Termos',
      'footer.legal.status': 'Status',

      'auth.login': 'Entrar',
      'auth.modal.title': 'Entrar no UMBRA',
      'auth.modal.subtitle': 'Comece com a sua conta',
      'auth.modal.google_btn': 'Entrar com Google',
      'auth.modal.note': 'Usamos o Google pra login seguro sem senha. A gente nunca vê sua senha.',
      'auth.modal.close': 'Fechar',
      'auth.user.signout': 'Sair',
      'auth.error.popup': 'Popup bloqueado. Permita popups pra este site.',
      'auth.error.cancelled': 'Login cancelado.',
      'auth.error.failed': 'Falha no login. Tente de novo.',
      'auth.error.network': 'Não foi possível conectar ao servidor de autenticação.',
    },

    // ═══════════════════════════════════════════════════════════
    zh: {
      'meta.title': 'UMBRA by CFX — 严肃游戏的战术语音',
      'meta.description': '面向战术游戏的语音通讯平台。跨频道私语、全局热键（支持手柄）、多房间同时在线。专为竞技小队和真正运行战术行动的组织打造。',
      'splash.online': '系统 · 在线',

      'nav.problem': '问题',
      'nav.product': '产品',
      'nav.tactical': 'Tactical',
      'nav.mobile': 'Mobile',
      'nav.pricing': '价格',
      'nav.cfx': 'CFX',
      'nav.cta': '加入测试',
      'nav.menu': '打开菜单',
      'nav.lang': '切换语言',

      'hero.badge': '测试 · 抢先体验 2026',
      'hero.h1.html': '你的<span class="stroke">小队</span>所需要的声音。',
      'hero.lead': '战术语音通讯，支持跨频道私语、全局热键（包括手柄）和多房间同时在线。专为严肃游戏打造——为运行真正战术行动的小队而生。',
      'hero.cta1': '下载测试版',
      'hero.cta2': '查看产品',
      'hero.stat1.label': '战术延迟',
      'hero.stat2.label': '同时房间',
      'hero.stat3.label': '更多平台即将到来',

      'problem.eyebrow': '问题',
      'problem.h2.html': '聊天应用擅长闲聊。<br />Umbra 是用来协调的。',
      'problem.lead': '与朋友聊天和指挥 50 人跨多个小队执行行动之间，存在巨大差距。通用通讯应用从未为后者设计。我们做到了。',
      'problem.casual.title': '休闲应用做的事',
      'problem.casual.text': '一个房间，一个声音。要听另一个小队，你必须离开。要在两个房间之间协调，你打开两个窗口然后祈祷。',
      'problem.umbra.title': 'UMBRA 做的事',
      'problem.umbra.text': '你留在你的房间。按住一个按键，你的声音就到达另一个房间——或同时到达所有房间——无需移动。松开按键，你立刻回来。你的小队从未失去你。',
      'problem.vs': 'vs',

      'features.eyebrow': '产品',
      'features.h2': '为战斗的混乱而设计。',
      'features.lead': '四个设计决策，没有竞争对手能同时提供。每一个都源于在战术游戏中协调小队的真实痛点。',
      'features.f1.label': '01 · 差异化',
      'features.f1.title': '实时跨频道私语',
      'features.f1.text': '按住一个热键，你的声音到达另一个房间，无需离开你自己的房间。目标房间的成员将你听作一段被标记的私语，不会打断他们的对话。松开热键，一切恢复原样。',
      'features.f1.arrow': '— 私语 →',
      'features.f2.title': '真正的全局热键',
      'features.f2.text': '即使游戏处于焦点，你的 PTT 也能正常工作。可绑定任何键盘、鼠标或手柄按键——甚至是游戏会忽略的那些。',
      'features.f2.note.html': '兼容 <kbd>鼠标 4/5</kbd> · <kbd>右摇杆</kbd> · <kbd>踏板</kbd> · <kbd>HOTAS</kbd>',
      'features.f3.title': '多房间在场',
      'features.f3.text': '实时查看频道每个房间内的成员。为每个目标绑定不同的热键，像 HUD 中选择目标一样发起私语。',
      'features.f3.note.html': '<kbd>1</kbd> → Alpha · <kbd>2</kbd> → Bravo · <kbd>3</kbd> → Recon',
      'features.f4.title': 'Opus 48 kHz 音频',
      'features.f4.text': '专用 SFU 搭配战术级 Opus 编码。无暴力压缩，所有人同时说话也不损失清晰度。正常条件下延迟低于 40 毫秒。',
      'features.f4.note': 'Mediasoup · WebRTC · 原生 UDP',

      'whisper.eyebrow': '工作原理',
      'whisper.h2': '私语，分步说明。',
      'whisper.lead': '不离开你的房间，你的声音到达另一个房间，被标记为私语。目标房间的成员在他们的正常对话之上听到它，并附有谁在说话以及来自何处的视觉提示。',
      'whisper.r1.label': '源房间 · BRIDGE',
      'whisper.r1.title': '战术指挥',
      'whisper.r1.m1': 'Xolii · 说话中',
      'whisper.r2.label': '目标房间 · SQUAD ALPHA',
      'whisper.r2.title': '作战中的小队',
      'whisper.arrow': '私语',

      'mobile.eyebrow': '移动应用',
      'mobile.h2': '当小队房间是一个真实战场。',
      'mobile.lead': 'Umbra 移动应用（即将登陆 iOS 和 Android）将相同的战术通讯带到任何场景。无论您的团队在哪里行动，我们都在那里——只要有信号，跨频道私语就能工作。',
      'mobile.c1.title': '气枪 & 军事模拟',
      'mobile.c1.text': '五个小队分散在战场上。指挥官按扇区使用私语进行协调，不会饱和主频道。对讲机留在口袋里。',
      'mobile.c2.title': '战术彩弹',
      'mobile.c2.text': '侧翼之间的快速协调。在战场另一端给队友呼叫掩护，而队伍其他人不会听到布置。',
      'mobile.c3.title': '影视制作',
      'mobile.c3.text': '导演、摄影、音响和灯光——每个人都在自己的房间，可以私语对演员说话而不打断拍摄。不需要传统对讲机。',
      'mobile.c4.title': 'FPV & 无人机竞速',
      'mobile.c4.text': '飞手戴着护目镜，观察员实时通报障碍物。延迟低于 40 毫秒——这是穿过门或撞毁四旋翼的差别。',
      'mobile.c5.title': '户外 & 探险',
      'mobile.c5.text': '越野滑雪、帆船、攀岩团队。小组分布在不同位置，领队协调路线和紧急情况，无需对着风大喊。',
      'mobile.c6.title': '专业团队',
      'mobile.c6.text': '活动安保、应急训练、体育教练。任何需要团队协调的地方，Umbra 用更专业的工具取代了 WhatsApp 聊天。',
      'mobile.coming.label': '移动应用',
      'mobile.coming.value': 'iOS 与 Android · 即将推出',

      'tactical.eyebrow': '严肃游戏',
      'tactical.h2': '为真正的多小队行动而构建。',
      'tactical.lead': '运行真正行动的大型组织在通用应用中受苦：一个小队一个房间，指挥官打开五个窗口，错过关键时刻。Umbra 从根本上解决这个问题，不论是哪款游戏。',
      'tactical.p1.html': '<strong>真正的多小队行动。</strong>指挥官可以同时对 Alpha、Bravo、Recon 或 Capital 说话——每个小队一个热键。',
      'tactical.p2.html': '<strong>内置角色层级。</strong>小队长、军官、成员——权限反映你的组织，而不是当下的聊天应用。',
      'tactical.p3.html': '<strong>组织隐私。</strong>专用或自托管服务器。你的通讯不会与互联网社区的其他部分混在一起。',
      'tactical.p4.html': '<strong>即将推出：游戏 API 集成。</strong>直接在 Umbra 中查看你的成员的游戏内状态、统计信息。',
      'tactical.cta': '为你的组织预留位置',

      'pricing.eyebrow': '价格',
      'pricing.h2': '玩家免费。组织订阅。',
      'pricing.lead': '如果你休闲玩，Umbra 永远免费。组织付费，成员连接。无广告、无装饰品、无废话——你的订阅覆盖基础设施和团队。',
      'pricing.community.tagline': '面向休闲小队和小团体。',
      'pricing.community.note': '永久免费',
      'pricing.community.f1': '最多 10 名成员',
      'pricing.community.f2': '私语限制（2 个目标）',
      'pricing.community.f3': '键盘/鼠标热键',
      'pricing.community.f4': '标准 Opus 音频',
      'pricing.community.cta': '免费开始',
      'pricing.squad.badge': '新',
      'pricing.squad.tagline': '面向有教练的竞技小队。',
      'pricing.squad.note': '或 $120/年 · 省 $24',
      'pricing.squad.f1': '最多 25 名成员',
      'pricing.squad.f2': '无限私语',
      'pricing.squad.f3': '手柄/HOTAS 支持',
      'pricing.squad.f4': 'HD Opus 音频',
      'pricing.squad.cta': '试用 30 天',
      'pricing.org.featured': '最受欢迎',
      'pricing.org.tagline': '面向有真实行动的组织和战队。',
      'pricing.org.note': '或 $300/年 · 2 个月免费',
      'pricing.org.f1': '最多 100 名成员',
      'pricing.org.f2': '原生 Stream Deck',
      'pricing.org.f3': '完整角色层级',
      'pricing.org.f4': '邀请品牌化',
      'pricing.org.f5': '审计日志',
      'pricing.org.cta': '预订组织',
      'pricing.enterprise.tagline': '电竞、大型 milsim、制作。',
      'pricing.enterprise.note': '年度合约含折扣',
      'pricing.enterprise.f1': '最多 500 名成员',
      'pricing.enterprise.f2': '专用区域 · SLA 99.9%',
      'pricing.enterprise.f3': '录制 + AAR 转录',
      'pricing.enterprise.f4': 'SSO (SAML/OIDC) · 高级审计',
      'pricing.enterprise.cta': '联系销售',
      'pricing.pro.eta': 'Q3 2026',
      'pricing.pro.desc': '$4.99/月个人版。热键配置在 PC + 平板 + Stream Deck 间云同步，个人 soundboard，founder 徽章。无付费胜利元素。',
      'pricing.boost.eta': 'Q4 2026',
      'pricing.boost.desc': '$3.99/月每个 boost。成员为其组织计划贡献。5 个 boost = 自动升级 tier。就像 Discord Server Boost，但用于真正重要的事情。',
      'pricing.period': '/月',

      'about.eyebrow': 'CFX',
      'about.h2': '由玩家为玩家打造。',
      'about.lead.html': 'UMBRA 是 <strong>CFX</strong> 的产品——一家由三位玩家创立的技术工作室，他们度过了无数个在五个窗口同时喊坐标的夜晚。',
      'about.p2': '我们生活在使用 Umbra 的社区中，是每天测试它的组织的一部分。每一个产品决策都是从穿上头盔进入战斗的人的角度做出的，而不是从会议室。',
      'about.p3': '我们不会出售你的数据，不会在你的通讯中插入广告，不会在无聊时转向 NFT。这是一个简单的生意：做一个能用的产品，公平定价，让它继续运行。',
      'about.role.title': '联合创始人 · 全能型',
      'about.signature': 'CFX · 2026 · 独立工作室',
      'about.frame.tag': 'CFX-CORP // GAMING TECHNOLOGY',

      'faq.eyebrow': '常见问题',
      'faq.h2': '我们已经被问过的问题。',
      'faq.q1': '为什么用 Umbra 而不是我已经熟悉的应用？',
      'faq.a1.html': '<p>你不需要放弃你常用的聊天应用——它们仍将是世界闲聊的地方。Umbra 在严肃协调登场时介入：多小队行动、竞技活动、流畅度至关重要的战术通讯。</p><p>许多组织并行使用：通用应用用于休闲，Umbra 用于行动。</p>',
      'faq.q2': '它是否兼容反作弊（EAC、BattlEye）？',
      'faq.a2.html': '<p>是的。Umbra 是一款独立的桌面应用，不会注入游戏进程。它不使用游戏内 hook 或 overlay，因此与任何反作弊 100% 兼容。</p><p>全局热键在操作系统层处理，而不是游戏层。</p>',
      'faq.q3': '我的组织需要自托管吗？',
      'faq.a3.html': '<p>不需要。默认情况下 Umbra 是 SaaS——运行在我们的基础设施上。你订阅后不到一分钟就能开始使用。</p><p>Enterprise 计划为需要完全控制其基础设施的组织（严格隐私、合规、非常具体的区域延迟）提供授权自托管。</p>',
      'faq.q4': '是否有 Mac 和 Linux 版本？',
      'faq.a4.html': '<p>Windows 今天处于测试阶段。Mac 和 Linux 在未来几个月的路线图中。Umbra 的基础（Tauri + Rust）按设计就是跨平台的，所以移植是直接的，不是重写。</p>',
      'faq.q5': '我的通话是否私密？',
      'faq.a5.html': '<p>是的。你的音频通过我们的 SFU 转发给房间成员——不会被录制或存储。唯一的持久性是最少的元数据（谁加入、谁向谁发送私语，以便组织所有者了解他们的社区）。</p><p>Enterprise 计划的可选录制是显式的，只有所有者为特定会话启用时才会工作。</p>',
      'faq.q6': '基础设施实际成本是多少？',
      'faq.a6.html': '<p>诚实的问题值得诚实的答案。50 人同时 5 人说话的房间在我们当前堆栈（Mediasoup + Fly.io）上每小时约 0.07 美元的带宽成本。一个每周做 4 次 2 小时行动的重度组织：每月 2-3 美元。订阅覆盖了大约 10 倍——其余用于支持、开发人员和好区域的服务器。</p>',
      'faq.q7': '为什么叫 Umbra？',
      'faq.a7.html': '<p>Umbra 是日食最暗的阴影——光被完全遮挡的地方。对我们来说，它象征着你的组织协调而不让任何东西泄露的私密空间。Logo 中的三角形（一个不可能的彭罗斯三角形）代表了连接理论上不应该连接的房间的音频流。</p>',

      'cta.eyebrow': '测试',
      'cta.h2': '在封闭测试中预订你的位置。',
      'cta.lead': '我们优先考虑有定期行动的活跃组织。留下你的邮箱，当你的团队的位置开放时我们会通知你。',
      'cta.email.placeholder': 'commander@your-org.com',
      'cta.email.label': '邮箱',
      'cta.button': '预订访问',
      'cta.success': '已预订。一旦我们为你的组织开放位置，我们会通知你。',
      'cta.note': '无垃圾邮件 · 不出售数据 · 仅在你的位置开放时邮件提醒',

      'footer.brand': '严肃游戏的战术通讯。CFX 的产品——一家由职业玩家创立的独立技术工作室。',
      'footer.col1.title': '产品',
      'footer.col1.l1': '功能',
      'footer.col1.l2': '私语',
      'footer.col1.l3': '价格',
      'footer.col1.l4': '测试',
      'footer.col2.title': '资源',
      'footer.col2.l1': '面向组织',
      'footer.col2.l2': '路线图（即将）',
      'footer.col2.l3': '服务状态',
      'footer.col3.title': 'CFX',
      'footer.col3.l1': '关于我们',
      'footer.col3.l2': '联系',
      'footer.col3.l3': '支持',
      'footer.copyright': '· 保留所有权利',
      'footer.legal.privacy': '隐私',
      'footer.legal.terms': '条款',
      'footer.legal.status': '状态',

      'auth.login': '登录',
      'auth.modal.title': '登录 UMBRA',
      'auth.modal.subtitle': '开始使用您的账户',
      'auth.modal.google_btn': '使用 Google 登录',
      'auth.modal.note': '我们使用 Google 进行安全的免密码登录。我们从不看到您的密码。',
      'auth.modal.close': '关闭',
      'auth.user.signout': '退出登录',
      'auth.error.popup': '弹窗被阻止。请允许此网站的弹窗。',
      'auth.error.cancelled': '登录已取消。',
      'auth.error.failed': '登录失败。请重试。',
      'auth.error.network': '无法连接到身份验证服务器。',
    },
  }


  // ─── Detección y aplicación ────────────────────────────────

  function detectInitialLang() {
    let saved = null
    try { saved = localStorage.getItem(STORAGE_KEY) } catch (e) {}
    if (saved && SUPPORTED.includes(saved)) return saved

    const browser = (navigator.language || navigator.userLanguage || DEFAULT_LANG)
      .split('-')[0]
      .toLowerCase()
    if (SUPPORTED.includes(browser)) return browser
    return DEFAULT_LANG
  }

  function applyTranslation(lang) {
    const dict = T[lang] || T[DEFAULT_LANG]
    document.documentElement.lang = lang

    // Texto plano
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n')
      if (dict[key] !== undefined) el.textContent = dict[key]
    })

    // HTML interno (con etiquetas <strong>, <span>, <br>, <kbd>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html')
      if (dict[key] !== undefined) el.innerHTML = dict[key]
    })

    // Atributos. Formato: "attr1:key1, attr2:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr')
      spec.split(',').forEach((pair) => {
        const parts = pair.split(':').map((s) => s.trim())
        if (parts.length === 2 && dict[parts[1]] !== undefined) {
          el.setAttribute(parts[0], dict[parts[1]])
        }
      })
    })

    // Meta title y description
    if (dict['meta.title']) document.title = dict['meta.title']
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && dict['meta.description']) metaDesc.setAttribute('content', dict['meta.description'])
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && dict['meta.description']) ogDesc.setAttribute('content', dict['meta.description'])

    // Persistencia
    try { localStorage.setItem(STORAGE_KEY, lang) } catch (e) {}

    // Actualizar UI del selector
    document.querySelectorAll('.lang-current').forEach((el) => {
      el.textContent = LANG_META[lang]?.code || ''
    })
    document.querySelectorAll('.lang-option').forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.lang === lang)
      opt.setAttribute('aria-selected', opt.dataset.lang === lang ? 'true' : 'false')
    })
  }

  // ─── Init ──────────────────────────────────────────────────

  const initialLang = detectInitialLang()
  // Aplicación inmediata (los attributes ya están en el DOM al cargar el script)
  applyTranslation(initialLang)

  // Listo: revelar el body si estaba oculto por el script de head
  document.documentElement.classList.remove('lang-pending')
  document.documentElement.classList.add('i18n-ready')

  // ─── Selector dropdown handlers ────────────────────────────

  function setupSelector() {
    const toggles = document.querySelectorAll('.lang-toggle')
    const dropdowns = document.querySelectorAll('.lang-dropdown')
    const options = document.querySelectorAll('.lang-option')

    toggles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const wrap = btn.closest('.lang-selector')
        const dd = wrap?.querySelector('.lang-dropdown')
        const isOpen = dd?.classList.contains('open')
        // Cerrar todos primero
        dropdowns.forEach((d) => d.classList.remove('open'))
        toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'))
        if (!isOpen && dd) {
          dd.classList.add('open')
          btn.setAttribute('aria-expanded', 'true')
        }
      })
    })

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang
        if (lang && SUPPORTED.includes(lang)) applyTranslation(lang)
        dropdowns.forEach((d) => d.classList.remove('open'))
        toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'))
        // Si el cambio vino del drawer mobile, lo cerramos
        document.querySelector('.mobile-drawer')?.classList.remove('open')
      })
    })

    // Cerrar dropdowns al click afuera o ESC
    document.addEventListener('click', () => {
      dropdowns.forEach((d) => d.classList.remove('open'))
      toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'))
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach((d) => d.classList.remove('open'))
        toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'))
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSelector)
  } else {
    setupSelector()
  }

  // ─── API pública ──────────────────────────────────────────
  // Para que otros scripts (auth.js, etc.) puedan obtener strings
  // traducidos en el idioma activo y re-aplicar tras cambios de DOM.

  let _activeLang = initialLang

  // Wrappear applyTranslation para trackear el lang activo
  const _origApply = applyTranslation
  // Sobreescribir la referencia que usan los handlers del selector
  window.umbraI18n = {
    current: () => _activeLang,
    t: (key) => (T[_activeLang] && T[_activeLang][key]) || (T[DEFAULT_LANG] && T[DEFAULT_LANG][key]) || key,
    apply: (lang) => {
      _activeLang = lang
      applyTranslation(lang)
    },
    reapply: () => applyTranslation(_activeLang),
  }

  // Atajo para re-aplicar (usado desde auth.js cuando inserta nuevos textos)
  window.umbraReapplyI18n = () => applyTranslation(_activeLang)

  // Hookear handlers del selector para actualizar _activeLang
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.lang-option')
    if (opt && opt.dataset.lang && SUPPORTED.includes(opt.dataset.lang)) {
      _activeLang = opt.dataset.lang
    }
  }, true)
})()
