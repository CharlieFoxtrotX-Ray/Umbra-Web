/*
  UMBRA — i18n (ES España = base, EN = añadido)
  Cada string tiene una clave única.
*/
(function () {
  'use strict';

  const SUPPORTED = ['es', 'en'];
  const DEFAULT_LANG = 'es';
  const STORAGE_KEY = 'umbra:lang:v2';

  const T = {

    // ═══════════════════════════════════════════════════════════
    // ES (España) — BASE
    // ═══════════════════════════════════════════════════════════
    es: {
      'nav.story': 'Cómo va', 'nav.audiences': 'Para quién', 'nav.plans': 'Planes', 'nav.vibe': 'Tu vibe', 'nav.faq': 'FAQ', 'nav.cta': 'Abrir UMBRA',

      'hero.h1.html': 'Tu voz,<br/>tu gente, <span class="ink-blob">en su sitio.</span>',
      'hero.lead': 'UMBRA es donde tu grupo se junta, charla, planea y se organiza — sin abrir cinco apps. Salas ilimitadas, whisper entre canales, voz nítida, y un sitio que te cuida.',
      'hero.cta.download': '↓ Descargar', 'hero.cta.web': 'Abrir en navegador',
      'hero.tag.org': 'Úsalo con tu org', 'hero.tag.mobile': 'Móvil y tablets que ya no uses', 'hero.tag.web': 'Versión web sin instalar',

      'ws.eyebrow': '🧰 Workspace',
      'ws.h2.html': 'Tu workspace, <span class="gold">no solo voz.</span>',
      'ws.lead': 'UMBRA reemplaza Discord + Calendly + Notion + Trello — con voz en el centro. Tu org deja de usar cinco apps y vive en una sola.',
      'ws.mod1.title': 'Salas de voz', 'ws.mod1.text': 'Múltiples canales, whisper cross-canal, jerarquía táctica nativa.',
      'ws.mod2.title': 'Calendario', 'ws.mod2.text': 'Disponibilidad coloreada por miembro. Cuándo está cada uno, qué ops tiene tu org, en un sitio.',
      'ws.mod3.title': 'Notas y SOPs', 'ws.mod3.text': 'Briefings, procedimientos, debriefs. Compartidos con tu org, buscables.',
      'ws.mod4.title': 'Tareas', 'ws.mod4.text': 'Quién hace qué esta semana. Asignaciones, prioridades, recordatorios.',
      'ws.cmp.hoy': 'Hoy usas', 'ws.cmp.manana': 'Mañana usas',
      'ws.cmp.hoy.foot': '5 suscripciones · 5 logins · 0 integración',
      'ws.cmp.man.foot': '1 suscripción · 1 login · todo conectado',

      'pl.eyebrow': '🔌 Plugins por juego',
      'pl.h2.html': 'Tu universo, <span class="gold">tu jerarquía.</span>',
      'pl.lead': 'Instala el plugin de tu juego y UMBRA copia su estructura real. Las naves, los carriles, los escuadrones — son tus salas. Coordinas como si estuvieras en el juego.',
      'pl.tab.sc': '🚀 Star Citizen', 'pl.tab.lol': '⚔️ League of Legends', 'pl.tab.arma': '🛡️ Arma · Squad · HLL', 'pl.tab.ff14': '🐉 FFXIV · WoW', 'pl.tab.custom': '🛠️ Tu juego',
      'pl.sc.title': 'Las naves de tu org → salas en UMBRA.',
      'pl.sc.text': 'El comandante hace whisper desde Bridge a cualquier escuadrón. Cada piloto ve dónde está cada nave en tiempo real.',
      'pl.sc.li1.html': '<span class="pl-emoji">🚀</span><strong>Idris (Capital)</strong> → Bridge / Engineering / Turrets / Hangar',
      'pl.sc.li2.html': '<span class="pl-emoji">✈️</span><strong>Fighter Wing</strong> → Alpha · Bravo · Charlie squadrons',
      'pl.sc.li3.html': '<span class="pl-emoji">🛰️</span><strong>Recon Wing</strong> → Avenger × 2',
      'pl.lol.title': 'Los carriles de tu juego → salas en UMBRA.',
      'pl.lol.text': 'El coach habla a todos en una llamada. Mid y Jungle hacen whisper para coordinar ganks. Caster en su sala con permisos read-only.',
      'pl.lol.li1.html': '<span class="pl-emoji">🛡️</span><strong>Top</strong> · Tanke y splitpush',
      'pl.lol.li2.html': '<span class="pl-emoji">🗡️</span><strong>Jungle</strong> · Coordina ganks vía whisper',
      'pl.lol.li3.html': '<span class="pl-emoji">⚡</span><strong>Mid</strong> · Rotaciones y wave control',
      'pl.lol.li4.html': '<span class="pl-emoji">🏹</span><strong>Bot</strong> · ADC + Support',
      'pl.lol.li5.html': '<span class="pl-emoji">📢</span><strong>Coach + Caster</strong> · Salas con permisos',
      'pl.arma.title': 'La cadena de mando militar → salas en UMBRA.',
      'pl.arma.text': 'El líder de compañía habla a sus pelotones individualmente o a todos a la vez con un atajo. CAS y Armor en sus canales tácticos.',
      'pl.arma.li1.html': '<span class="pl-emoji">📡</span><strong>Comando</strong> → Compañía Alpha → Pelotones → Squads',
      'pl.arma.li2.html': '<span class="pl-emoji">🚁</span><strong>CAS</strong> · Aire / soporte cercano',
      'pl.arma.li3.html': '<span class="pl-emoji">🚜</span><strong>Armor</strong> · Tanques y vehículos',
      'pl.arma.li4.html': '<span class="pl-emoji">🔍</span><strong>Recon</strong> · Inteligencia y observación',
      'pl.ff14.title': 'Los roles de raid → salas en UMBRA.',
      'pl.ff14.text': 'Raid leader hace whisper por rol durante el fight. Officers tienen su sala separada para mid-pull calls. La composición visible siempre en el módulo del plugin.',
      'pl.ff14.li1.html': '<span class="pl-emoji">🛡️</span><strong>Tanks</strong> · Provoke, mit cooldowns',
      'pl.ff14.li2.html': '<span class="pl-emoji">💚</span><strong>Healers</strong> · Cooldowns + raid awareness',
      'pl.ff14.li3.html': '<span class="pl-emoji">⚔️</span><strong>DPS Melee</strong> · Positionals',
      'pl.ff14.li4.html': '<span class="pl-emoji">🏹</span><strong>DPS Ranged</strong> · Mechanics',
      'pl.ff14.li5.html': '<span class="pl-emoji">⭐</span><strong>Officers</strong> · Mid-pull calls',
      'pl.custom.title': '¿Tu juego no está aquí todavía?',
      'pl.custom.text.html': 'Pronto vas a poder <strong>crear tu propio plugin</strong> — o instalar uno hecho por la comunidad. Marketplace de plugins llegando en Q4 2026.',
      'pl.custom.cta': 'Avísame cuando esté listo →',

      'vb.eyebrow': '🎨 Personalización',
      'vb.h2.html': 'Tu vibe, <span class="gold">tu UMBRA.</span>',
      'vb.lead': 'Cambia el fondo. La app entera se adapta. Star Citizen, League of Legends, Genshin, tu logo, tu meme — lo que sea. Mismo producto, mil personalidades.',
      'vb.tag.scifi': 'Sci-fi', 'vb.tag.moba': 'MOBA', 'vb.tag.anime': 'Anime', 'vb.tag.manga': 'Manga', 'vb.tag.retro': 'Retro',
      'vb.add.title': 'El que tú quieras', 'vb.add.text': 'Sube tu fondo · cualquier imagen 1920×1080+',
      'vb.foot': 'Cada org elige su estética. Cada usuario también. El glass de la UI se adapta automáticamente al fondo.',
      'lg.label': 'Nuestro aporte', 'lg.h3': 'Lingotes.', 'lg.text': 'Las unidades de aporte de UMBRA. Para boosts, premium y regalos a otros squads.',

      'st.eyebrow': '✨ CÓMO VA',
      'st.h2': 'Cuatro pasos. Sin vueltas.',
      'st.lead': 'Lingo te lleva del registro a la primera ops en menos de cinco minutos.',
      'st.stage.title': '"Estoy contigo"',
      'st.stage.text': 'Soy Lingo, y te llevo por la app sin que te pierdas. Si te quedas, te invito a un lingote.',
      'st.s1.title': 'Te registras con un email.',
      'st.s1.text': 'Sin contraseña. Solo hace falta un email — te llega un enlace mágico y entras. Nada de "verifica tu número" ni "captcha once veces".',
      'st.s2.title': 'Creas o entras a una sala.',
      'st.s2.text.html': 'Una sala = un grupo. La haces tú en un clic, eliges quién entra, y compartes un enlace tipo <span style="font-family:monospace;color:var(--gold-deep);font-weight:700">umbra.gg/abc</span>.',
      'st.s3.title': 'Hablas — y si quieres, whisper.',
      'st.s3.text': 'Pulsas para hablar. Si necesitas decirle algo a otra sala sin salir de la tuya, mantienes la tecla de whisper y tu voz cruza canales.',
      'st.s4.title': 'Tu org, tu universo.',
      'st.s4.text': 'Roles jerárquicos completos, hotkeys con gamepad/HOTAS, plugins por juego que mapean naves, carriles o escuadrones a tus salas. Cuanto más serio te lo tomas, más te lo damos.',

      'au.h2.html': 'Para tu squad. Para tu liga.<br/>Para <em style="font-style:normal;color:var(--gold-deep);font-family:\'Space Grotesk\',sans-serif">lo que necesites</em>.',
      'au.lead': 'UMBRA es polivalente. Sirve para una squad de 5 que se ríe los viernes, para un milsim con 50 personas pelotoneando, para una liga de esports con casters y coach, para un evento en directo con técnicos en cinco salas, y para una comunidad de gente que solo quiere hablar a gusto. Tú nos dices el contexto, nosotros te damos la voz.',
      'au.o1.title': 'Gaming casual', 'au.o1.text': 'La sala del finde con los colegas. LoL ranked, Apex squad, lo que sea. Voz nítida, sin lag.',
      'au.o2.title': 'Milsim · Tactical', 'au.o2.text': 'Comms con whisper para ops multi-squad reales — Arma, Squad, Hell Let Loose, airsoft IRL.',
      'au.o3.title': 'Star Citizen & Sci-fi', 'au.o3.text': 'Orgs con flotas, capital ships con 50+ personas. Plugin nativo de SC que mapea naves a salas.',
      'au.o4.title': 'Esports & ligas', 'au.o4.text': 'Coach, caster, capitanes — cada uno en su rol con whisper jerárquico.',
      'au.o5.title': 'MMO & raids', 'au.o5.text': 'Raid de 24-40 en FFXIV o WoW. Tanks, healers y DPS en su rol. Officers wispean por rol durante el fight.',
      'au.o6.title': 'Eventos & producción', 'au.o6.text': 'Director, talento, técnicos. Salas separadas pero conectadas.',
      'au.o7.title': 'Comunidades', 'au.o7.text': 'Cursos, hobbies, viajes. Tu gente, tu voz, tu sitio.',
      'au.o8.title': 'Equipos & trabajo', 'au.o8.text': 'Stand-ups, pair, brainstorm sin Zoom-fatigue.',

      'ap.eyebrow': '🪙 Aportes colectivos',
      'ap.h2.html': 'Todos aportan. <span class="gold">Nadie paga solo.</span>',
      'ap.lead': 'UMBRA no tiene suscripciones por usuario. Tu org tiene una cuota mensual en lingotes — el líder aporta al menos el 25%, los miembros completan el resto con aportes pequeños automáticos.',
      'ap.omni.title': '¡Soy Omni!', 'ap.omni.text': 'Yo guardo los lingotes que aportan · ni uno se pierde.',
      'ap.ex.org': 'Tu org de Star Citizen', 'ap.ex.meta': '800 miembros · Plan Crew · 18 lingotes/mes',
      'ap.ex.row1.who': 'Tú (líder)', 'ap.ex.row1.amt.html': '5 lingotes <small>· $10/mes</small>',
      'ap.ex.row2.who': '20 miembros aportando', 'ap.ex.row2.amt.html': '20 lingotes <small>· $2/mes c/u</small>',
      'ap.ex.row3.who': 'Total org', 'ap.ex.row3.amt.html': '25 lingotes <small>· 7 de boost extra</small>',
      'ap.ex.before.html': 'Antes pagabas <s>$36/mes</s> solo.',
      'ap.ex.after.html': 'Ahora pagas <strong>$10</strong>. El resto lo cubren quienes también la usan.',

      'sim.head': 'Calcula lo tuyo',
      'sim.lead': 'Mueve los sliders. Te recomendamos el plan ideal y te enseñamos cuánto pone cada uno.',
      'sim.q1': '¿Cuántos miembros tiene tu org?', 'sim.q2': '¿Cuántos aportarían 1-2 lingotes al mes?',
      'sim.label': 'Plan recomendado', 'sim.leader.label': 'Tú (líder)',

      'pn.head.html': 'Tres planes. <span class="gold">Lo paga la org, lo disfruta el squad.</span>',
      'pn.lead': 'Empieza gratis para asomarte. Cuando tu grupo coordina ops reales y la voz importa, el líder cubre el plan y el equipo conecta sin pagar nada. Sin suscripciones por usuario.',
      'pn.c1.title': 'Community', 'pn.c1.tag': 'La puerta de entrada',
      'pn.c1.text': 'Hasta 25 miembros, salas estándar, whisper limitado, audio standard. Para asomarse y para grupos pequeños.',
      'pn.c1.cta': 'Empezar gratis →',
      'pn.c2.title': 'Org', 'pn.c2.tag': 'Para orgs que coordinan ops reales',
      'pn.c2.text': 'Hasta 250–500 miembros, whisper sin límites, audio HD, hotkeys con gamepad/HOTAS, roles jerárquicos completos y audit log.',
      'pn.c2.cta': 'Reservar org →', 'pn.c2.ribbon': '⭐ El más elegido',
      'pn.c3.title': 'Enterprise · Esports', 'pn.c3.tag': 'Para ligas, eventos y orgs masivas',
      'pn.c3.text': 'Miembros ilimitados, región dedicada (latencia garantizada), grabación de ops, SLA, branding custom y opción self-hosted.',
      'pn.c3.cta': 'Hablar con ventas →',
      'pn.foot.html': '¿Quieres ver los <strong>8 planes</strong> en detalle (Community · Starter · Crew · Squad · Platoon · Company · Battalion · Regiment · Custom)? <a href="#planes-full">Tabla completa abajo ↓</a>',
      'pn.tb.title': 'Los 8 tiers · lo paga la org',
      'pn.tb.lead': 'Precios en lingotes (el sistema de aporte de UMBRA). 1 lingote ≈ $2. Y recuerda: con los aportes del equipo, el líder rara vez paga el total.',
      'pn.tb.col1': 'Plan', 'pn.tb.col2': 'Lingotes / mes', 'pn.tb.col3': 'USD equiv.', 'pn.tb.col4': 'Cap miembros',
      'pn.tb.custom.amt': 'A negociar', 'pn.tb.custom.cap': 'Sin límite',
      'pn.ad.title': 'Add-ons · por encima de tu plan',
      'pn.ad.1.name': 'UMBRA Plus', 'pn.ad.1.price.html': '7 lingotes / mes <small>· $9,99</small>', 'pn.ad.1.text': 'Hotkey profiles cloud-sync · soundboard personal · badge founder.',
      'pn.ad.2.name': 'UMBRA Plus Pro', 'pn.ad.2.price.html': '16 lingotes / mes <small>· $19,99</small>', 'pn.ad.2.text': 'Todo lo de Plus + integraciones avanzadas + early access a features.',
      'pn.ad.3.name': 'Packs de lingotes', 'pn.ad.3.price': 'One-time', 'pn.ad.3.text': '$4 = 2 · $10 = 5 · $20 = 11 (+10%) · $50 = 30 (+20%) · $100 = 65 (+30%).',
      'pn.ad.4.name': 'Boost a tu org', 'pn.ad.4.price': '1-3 lingotes / mes', 'pn.ad.4.text': 'Aporta lingotes recurrentes al server de tu líder. Lo paga quien quiere ayudar.',

      'faq.eyebrow': '💬 PREGUNTAS', 'faq.h2': 'Lo que la gente pregunta antes de entrar.',
      'faq.lead.html': 'Lingo se encarga. Si te quedas con dudas, hay un humano detrás en <a href="mailto:hola@cfx.studio" style="color:var(--gold-deep);font-weight:700;text-decoration:underline">hola@cfx.studio</a>.',
      'faq.foot': 'Pasa el cursor por encima para pausar y leer con calma.',
      'faq.q1': '¿Funciona en navegador o tengo que instalar?',
      'faq.a1': 'Ambas. La versión web va en cualquier Chrome decente (sin HOTAS). La app de Windows es la completa.',
      'faq.q2': 'Tengo un teléfono de 2018. ¿Servirá?',
      'faq.a2': 'Sí. La app móvil es ligera a propósito — Android 8 / iOS 14 mínimo.',
      'faq.q3': '¿Por qué piden tarjeta si dicen "gratis"?',
      'faq.a3': 'Para evitar bots. Preautorización de $1 que se devuelve al instante. No cobramos hasta que termines el trial.',
      'faq.q4': '¿Qué es exactamente un lingote?',
      'faq.a4': 'Son las unidades de aporte de UMBRA. Sirven para activar planes, aportar a tu org, sumar premium o regalar a otros squads. Se consiguen apoyando el proyecto.',
      'faq.q5': '¿Y si los miembros dejan de aportar?',
      'faq.a5.html': '<strong>7 días</strong> de grace period con auto-débito del líder. Si nadie completa, el server baja al tier anterior automáticamente.',
      'faq.q6': '¿Y si sobran lingotes?',
      'faq.a6': 'Boost automático ese mes (+5 slots, audio HD) o upgrade del plan si sobran muchos. Lo que aportas nunca se pierde.',
      'faq.q7': '¿Cómo es el plugin de mi juego?',
      'faq.a7': 'Mapea la estructura del juego a tus salas — naves en SC, carriles en LoL, escuadrones en Arma. SC/LoL/FFXIV/Arma ya disponibles.',
      'faq.q8': '¿Funciona con 5 colegas nada más?',
      'faq.a8.html': 'Sí. <strong>Community</strong> es gratis con tu trial — hasta 50 personas, voz nítida, calendar. Vives sin pagar nada.',
      'faq.q9': '¿Mis llamadas son privadas? ¿Venden datos?',
      'faq.a9': 'Voz cifrada en tránsito. No grabamos salvo que tú lo actives. Y no vendemos datos — el modelo es la suscripción.',

      'cta.h2': '¿Te animas?',
      'cta.lead': 'Descarga UMBRA, abre tu primera sala y prueba el whisper. Si no te convence, te devuelvo el lingote — y son gratis, así que no hay nada que perder.',
      'cta.win': '↓ Windows', 'cta.mac': 'macOS · pronto', 'cta.linux': 'Linux · pronto', 'cta.web': 'Abrir web',
      'cta.mobile': 'Móvil: iOS · Android · próximamente',

      'ft.brand': 'Voz para tu gente. Producto de CFX, un estudio independiente. Pensado en serio, pero sin perder el sentido del humor.',
      'ft.col1.h': 'Producto', 'ft.col1.l1': 'Cómo va', 'ft.col1.l2': 'Casos de uso', 'ft.col1.l3': 'Tu vibe', 'ft.col1.l4': 'Descargar',
      'ft.col2.h': 'Recursos', 'ft.col2.l1': 'FAQ', 'ft.col2.l2': 'Estado del servicio', 'ft.col2.l3': 'Roadmap', 'ft.col2.l4': 'Comunidad',
      'ft.col3.h': 'CFX', 'ft.col3.l1': 'Quiénes somos', 'ft.col3.l2': 'Contacto', 'ft.col3.l3': 'Privacidad', 'ft.col3.l4': 'Términos', 'ft.col3.l5': 'Cookies',
      'ft.copyright': '© 2026 CFX · Todos los derechos reservados',
      'ft.platforms': 'Windows · Web · Mac/Linux pronto',
    },

    // ═══════════════════════════════════════════════════════════
    // EN — English
    // ═══════════════════════════════════════════════════════════
    en: {
      'nav.story': 'How it works', 'nav.audiences': 'Who it\'s for', 'nav.plans': 'Plans', 'nav.vibe': 'Your vibe', 'nav.faq': 'FAQ', 'nav.cta': 'Open UMBRA',

      'hero.h1.html': 'Your voice,<br/>your people, <span class="ink-blob">where they belong.</span>',
      'hero.lead': 'UMBRA is where your group hangs out, talks, plans and gets organized — without opening five different apps. Unlimited rooms, cross-channel whisper, crystal-clear voice, and a place that takes care of you.',
      'hero.cta.download': '↓ Download', 'hero.cta.web': 'Open in browser',
      'hero.tag.org': 'Use it with your org', 'hero.tag.mobile': 'Works on old phones & tablets', 'hero.tag.web': 'Web version, no install',

      'ws.eyebrow': '🧰 Workspace',
      'ws.h2.html': 'Your workspace, <span class="gold">not just voice.</span>',
      'ws.lead': 'UMBRA replaces Discord + Calendly + Notion + Trello — with voice at the core. Your org ditches five apps and lives in one.',
      'ws.mod1.title': 'Voice rooms', 'ws.mod1.text': 'Multiple channels, cross-channel whisper, native tactical hierarchy.',
      'ws.mod2.title': 'Calendar', 'ws.mod2.text': 'Color-coded availability per member. When everyone\'s free, what ops you have, all in one place.',
      'ws.mod3.title': 'Notes & SOPs', 'ws.mod3.text': 'Briefings, procedures, debriefs. Shared with your org, searchable.',
      'ws.mod4.title': 'Tasks', 'ws.mod4.text': 'Who\'s doing what this week. Assignments, priorities, reminders.',
      'ws.cmp.hoy': 'Today you use', 'ws.cmp.manana': 'Tomorrow you use',
      'ws.cmp.hoy.foot': '5 subscriptions · 5 logins · 0 integration',
      'ws.cmp.man.foot': '1 subscription · 1 login · all connected',

      'pl.eyebrow': '🔌 Per-game plugins',
      'pl.h2.html': 'Your universe, <span class="gold">your hierarchy.</span>',
      'pl.lead': 'Install the plugin for your game and UMBRA mirrors its real structure. The ships, the lanes, the squads — they\'re your rooms. You coordinate as if you were inside the game.',
      'pl.tab.sc': '🚀 Star Citizen', 'pl.tab.lol': '⚔️ League of Legends', 'pl.tab.arma': '🛡️ Arma · Squad · HLL', 'pl.tab.ff14': '🐉 FFXIV · WoW', 'pl.tab.custom': '🛠️ Your game',
      'pl.sc.title': 'Your org\'s ships → rooms in UMBRA.',
      'pl.sc.text': 'The commander whispers from Bridge to any squadron. Each pilot sees where each ship is in real time.',
      'pl.sc.li1.html': '<span class="pl-emoji">🚀</span><strong>Idris (Capital)</strong> → Bridge / Engineering / Turrets / Hangar',
      'pl.sc.li2.html': '<span class="pl-emoji">✈️</span><strong>Fighter Wing</strong> → Alpha · Bravo · Charlie squadrons',
      'pl.sc.li3.html': '<span class="pl-emoji">🛰️</span><strong>Recon Wing</strong> → Avenger × 2',
      'pl.lol.title': 'Your game\'s lanes → rooms in UMBRA.',
      'pl.lol.text': 'The coach talks to everyone in a call. Mid and Jungle whisper to coordinate ganks. Caster gets their own room with read-only permissions.',
      'pl.lol.li1.html': '<span class="pl-emoji">🛡️</span><strong>Top</strong> · Tank and splitpush',
      'pl.lol.li2.html': '<span class="pl-emoji">🗡️</span><strong>Jungle</strong> · Coordinates ganks via whisper',
      'pl.lol.li3.html': '<span class="pl-emoji">⚡</span><strong>Mid</strong> · Rotations and wave control',
      'pl.lol.li4.html': '<span class="pl-emoji">🏹</span><strong>Bot</strong> · ADC + Support',
      'pl.lol.li5.html': '<span class="pl-emoji">📢</span><strong>Coach + Caster</strong> · Rooms with permissions',
      'pl.arma.title': 'The military chain of command → rooms in UMBRA.',
      'pl.arma.text': 'The company leader talks to platoons individually or all at once with a shortcut. CAS and Armor get their own tactical channels.',
      'pl.arma.li1.html': '<span class="pl-emoji">📡</span><strong>Command</strong> → Alpha Company → Platoons → Squads',
      'pl.arma.li2.html': '<span class="pl-emoji">🚁</span><strong>CAS</strong> · Air / close support',
      'pl.arma.li3.html': '<span class="pl-emoji">🚜</span><strong>Armor</strong> · Tanks and vehicles',
      'pl.arma.li4.html': '<span class="pl-emoji">🔍</span><strong>Recon</strong> · Intel and scouting',
      'pl.ff14.title': 'Raid roles → rooms in UMBRA.',
      'pl.ff14.text': 'Raid leader whispers per role during the fight. Officers get their own room for mid-pull calls. Composition always visible in the plugin module.',
      'pl.ff14.li1.html': '<span class="pl-emoji">🛡️</span><strong>Tanks</strong> · Provoke, mit cooldowns',
      'pl.ff14.li2.html': '<span class="pl-emoji">💚</span><strong>Healers</strong> · Cooldowns + raid awareness',
      'pl.ff14.li3.html': '<span class="pl-emoji">⚔️</span><strong>DPS Melee</strong> · Positionals',
      'pl.ff14.li4.html': '<span class="pl-emoji">🏹</span><strong>DPS Ranged</strong> · Mechanics',
      'pl.ff14.li5.html': '<span class="pl-emoji">⭐</span><strong>Officers</strong> · Mid-pull calls',
      'pl.custom.title': 'Your game not here yet?',
      'pl.custom.text.html': 'Soon you\'ll be able to <strong>build your own plugin</strong> — or install one made by the community. Plugin marketplace coming Q4 2026.',
      'pl.custom.cta': 'Notify me when ready →',

      'vb.eyebrow': '🎨 Personalization',
      'vb.h2.html': 'Your vibe, <span class="gold">your UMBRA.</span>',
      'vb.lead': 'Change the wallpaper. The whole app adapts. Star Citizen, League of Legends, Genshin, your logo, your meme — whatever. Same product, a thousand personalities.',
      'vb.tag.scifi': 'Sci-fi', 'vb.tag.moba': 'MOBA', 'vb.tag.anime': 'Anime', 'vb.tag.manga': 'Manga', 'vb.tag.retro': 'Retro',
      'vb.add.title': 'Whatever you want', 'vb.add.text': 'Upload your wallpaper · any image 1920×1080+',
      'vb.foot': 'Every org picks its aesthetic. Every user too. The UI glass automatically adapts to the wallpaper.',

      'st.eyebrow': '✨ HOW IT WORKS',
      'st.h2': 'Four steps. No fuss.',
      'lg.label': 'Our contribution', 'lg.h3': 'Lingots.', 'lg.text': 'UMBRA\'s contribution units. For boosts, premium and gifts to other squads.',
      'st.lead': 'Lingo gets you from signup to your first op in under five minutes.',
      'st.stage.title': '"I got you"',
      'st.stage.text': 'I\'m Lingo, and I\'ll walk you through the app without losing you. If you stay, I\'ll buy you a lingot.',
      'st.s1.title': 'Sign up with an email.',
      'st.s1.text': 'No password. Just an email — you get a magic link and you\'re in. None of that "verify your number" or "captcha eleven times" nonsense.',
      'st.s2.title': 'Create or join a room.',
      'st.s2.text.html': 'A room = a group. You spin one up in one click, decide who joins, and share a link like <span style="font-family:monospace;color:var(--gold-deep);font-weight:700">umbra.gg/abc</span>.',
      'st.s3.title': 'You talk — and if you want, whisper.',
      'st.s3.text': 'Push to talk. If you need to tell something to another room without leaving yours, hold the whisper key and your voice crosses channels.',
      'st.s4.title': 'Your org, your universe.',
      'st.s4.text': 'Full role hierarchy, gamepad/HOTAS hotkeys, per-game plugins that map ships, lanes or squads to your rooms. The more serious you get, the more we give you.',

      'au.h2.html': 'For your squad. For your league.<br/>For <em style="font-style:normal;color:var(--gold-deep);font-family:\'Space Grotesk\',sans-serif">whatever you need</em>.',
      'au.lead': 'UMBRA is versatile. Works for a 5-person squad cracking jokes on Friday nights, a milsim with 50 people in formation, an esports league with casters and coach, a live event with techs in five rooms, and a community of folks who just want to chat in peace. You bring the context, we bring the voice.',
      'au.o1.title': 'Casual gaming', 'au.o1.text': 'The weekend hangout with your crew. LoL ranked, Apex squad, anything. Crisp voice, no lag.',
      'au.o2.title': 'Milsim · Tactical', 'au.o2.text': 'Comms with whisper for real multi-squad ops — Arma, Squad, Hell Let Loose, IRL airsoft.',
      'au.o3.title': 'Star Citizen & Sci-fi', 'au.o3.text': 'Orgs with fleets, capital ships with 50+ people. Native SC plugin that maps ships to rooms.',
      'au.o4.title': 'Esports & leagues', 'au.o4.text': 'Coach, caster, captains — each in their role with hierarchical whisper.',
      'au.o5.title': 'MMO & raids', 'au.o5.text': '24-40 raids in FFXIV or WoW. Tanks, healers and DPS in their role. Officers whisper per role during the fight.',
      'au.o6.title': 'Events & production', 'au.o6.text': 'Director, talent, technicians. Separate rooms but connected.',
      'au.o7.title': 'Communities', 'au.o7.text': 'Courses, hobbies, trips. Your people, your voice, your place.',
      'au.o8.title': 'Teams & work', 'au.o8.text': 'Stand-ups, pair, brainstorm without Zoom-fatigue.',

      'ap.eyebrow': '🪙 Collective contributions',
      'ap.h2.html': 'Everyone chips in. <span class="gold">No one pays alone.</span>',
      'ap.lead': 'UMBRA has no per-user subscriptions. Your org has a monthly quota in lingots — the leader covers at least 25%, members fill in the rest with small automatic contributions.',
      'ap.omni.title': 'I\'m Omni!', 'ap.omni.text': 'I keep the lingots you all chip in · not a single one gets lost.',
      'ap.ex.org': 'Your Star Citizen org', 'ap.ex.meta': '800 members · Crew Plan · 18 lingots/mo',
      'ap.ex.row1.who': 'You (leader)', 'ap.ex.row1.amt.html': '5 lingots <small>· $10/mo</small>',
      'ap.ex.row2.who': '20 members chipping in', 'ap.ex.row2.amt.html': '20 lingots <small>· $2/mo each</small>',
      'ap.ex.row3.who': 'Org total', 'ap.ex.row3.amt.html': '25 lingots <small>· 7 extra boost</small>',
      'ap.ex.before.html': 'Before you paid <s>$36/mo</s> alone.',
      'ap.ex.after.html': 'Now you pay <strong>$10</strong>. The rest is covered by those who also use it.',

      'sim.head': 'Run the numbers',
      'sim.lead': 'Move the sliders. We recommend the ideal plan and break down who chips in what.',
      'sim.q1': 'How many members does your org have?', 'sim.q2': 'How many would chip in 1-2 lingots/month?',
      'sim.label': 'Recommended plan', 'sim.leader.label': 'You (leader)',

      'pn.head.html': 'Three plans. <span class="gold">The org pays, the squad enjoys.</span>',
      'pn.lead': 'Start free to dip your toes. When your group runs real ops and voice matters, the leader covers the plan and the team connects without paying anything. No per-user subscriptions.',
      'pn.c1.title': 'Community', 'pn.c1.tag': 'The entry point',
      'pn.c1.text': 'Up to 25 members, standard rooms, limited whisper, standard audio. To check it out and for small groups.',
      'pn.c1.cta': 'Start free →',
      'pn.c2.title': 'Org', 'pn.c2.tag': 'For orgs running real ops',
      'pn.c2.text': 'Up to 250–500 members, unlimited whisper, HD audio, gamepad/HOTAS hotkeys, full role hierarchy and audit log.',
      'pn.c2.cta': 'Reserve org →', 'pn.c2.ribbon': '⭐ Most picked',
      'pn.c3.title': 'Enterprise · Esports', 'pn.c3.tag': 'For leagues, events and massive orgs',
      'pn.c3.text': 'Unlimited members, dedicated region (guaranteed latency), op recording, SLA, custom branding and self-hosted option.',
      'pn.c3.cta': 'Talk to sales →',
      'pn.foot.html': 'Want to see all <strong>8 plans</strong> in detail (Community · Starter · Crew · Squad · Platoon · Company · Battalion · Regiment · Custom)? <a href="#planes-full">Full table below ↓</a>',
      'pn.tb.title': 'The 8 tiers · paid by the org',
      'pn.tb.lead': 'Prices in lingots (UMBRA\'s contribution system). 1 lingot ≈ $2. And remember: with team contributions, the leader rarely pays the full amount.',
      'pn.tb.col1': 'Plan', 'pn.tb.col2': 'Lingots / mo', 'pn.tb.col3': 'USD equiv.', 'pn.tb.col4': 'Member cap',
      'pn.tb.custom.amt': 'Custom quote', 'pn.tb.custom.cap': 'No limit',
      'pn.ad.title': 'Add-ons · on top of your plan',
      'pn.ad.1.name': 'UMBRA Plus', 'pn.ad.1.price.html': '7 lingots / mo <small>· $9.99</small>', 'pn.ad.1.text': 'Hotkey profiles cloud-sync · personal soundboard · founder badge.',
      'pn.ad.2.name': 'UMBRA Plus Pro', 'pn.ad.2.price.html': '16 lingots / mo <small>· $19.99</small>', 'pn.ad.2.text': 'Everything in Plus + advanced integrations + early access to features.',
      'pn.ad.3.name': 'Lingot packs', 'pn.ad.3.price': 'One-time', 'pn.ad.3.text': '$4 = 2 · $10 = 5 · $20 = 11 (+10%) · $50 = 30 (+20%) · $100 = 65 (+30%).',
      'pn.ad.4.name': 'Boost your org', 'pn.ad.4.price': '1-3 lingots / mo', 'pn.ad.4.text': 'Recurring lingots to your leader\'s server. Paid by those who want to help.',

      'faq.eyebrow': '💬 QUESTIONS', 'faq.h2': 'What people ask before they sign up.',
      'faq.lead.html': 'Lingo handles it. If you still have doubts, there\'s a human behind at <a href="mailto:hola@cfx.studio" style="color:var(--gold-deep);font-weight:700;text-decoration:underline">hola@cfx.studio</a>.',
      'faq.foot': 'Hover over to pause and read at your own pace.',
      'faq.q1': 'Does it work in browser or do I have to install?',
      'faq.a1': 'Both. The web version runs on any decent Chrome (no HOTAS). The Windows app is the full one.',
      'faq.q2': 'I have a 2018 phone. Will it work?',
      'faq.a2': 'Yes. The mobile app is intentionally lightweight — Android 8 / iOS 14 minimum.',
      'faq.q3': 'Why ask for a card if you say "free"?',
      'faq.a3': 'To keep bots out. $1 preauth refunded instantly. We don\'t charge anything until your trial ends.',
      'faq.q4': 'What exactly is a lingot?',
      'faq.a4': 'UMBRA\'s contribution units. Use them to activate plans, contribute to your org, add premium or gift to other squads. Earn them or get them by supporting the project.',
      'faq.q5': 'What if members stop chipping in?',
      'faq.a5.html': '<strong>7-day</strong> grace period with leader auto-debit. If no one fills in, the server drops to the previous tier automatically.',
      'faq.q6': 'What if there are leftover lingots?',
      'faq.a6': 'Automatic boost that month (+5 slots, guaranteed HD audio) or plan upgrade if there are many. What you contribute is never lost.',
      'faq.q7': 'How is my game\'s plugin?',
      'faq.a7': 'Maps the game\'s structure to your rooms — ships in SC, lanes in LoL, squads in Arma. SC/LoL/FFXIV/Arma already available.',
      'faq.q8': 'Does it work with just 5 friends?',
      'faq.a8.html': 'Yes. <strong>Community</strong> is free with your trial — up to 50 people, crisp voice, calendar. You live without paying anything.',
      'faq.q9': 'Are my calls private? Do you sell data?',
      'faq.a9': 'Voice encrypted in transit. We don\'t record unless you activate it. And we don\'t sell data — the model is the subscription.',

      'cta.h2': 'You in?',
      'cta.lead': 'Download UMBRA, open your first room and try whisper. If it\'s not for you, I\'ll refund your lingot — they\'re free, so nothing to lose.',
      'cta.win': '↓ Windows', 'cta.mac': 'macOS · soon', 'cta.linux': 'Linux · soon', 'cta.web': 'Open web',
      'cta.mobile': 'Mobile: iOS · Android · coming soon',

      'ft.brand': 'Voice for your people. A product by CFX, an independent studio. We mean it — but we don\'t take ourselves too seriously.',
      'ft.col1.h': 'Product', 'ft.col1.l1': 'How it works', 'ft.col1.l2': 'Use cases', 'ft.col1.l3': 'Your vibe', 'ft.col1.l4': 'Download',
      'ft.col2.h': 'Resources', 'ft.col2.l1': 'FAQ', 'ft.col2.l2': 'Service status', 'ft.col2.l3': 'Roadmap', 'ft.col2.l4': 'Community',
      'ft.col3.h': 'CFX', 'ft.col3.l1': 'About us', 'ft.col3.l2': 'Contact', 'ft.col3.l3': 'Privacy', 'ft.col3.l4': 'Terms', 'ft.col3.l5': 'Cookies',
      'ft.copyright': '© 2026 CFX · All rights reserved',
      'ft.platforms': 'Windows · Web · Mac/Linux soon',
    },
  };

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
  }

  function apply(lang) {
    const dict = T[lang] || T[DEFAULT_LANG];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n; if (dict[k] !== undefined) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml; if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(',').map(s => s.trim()).forEach(p => {
        const [a, k] = p.split(':').map(s => s.trim());
        if (a && k && dict[k] !== undefined) el.setAttribute(a, dict[k]);
      });
    });
    document.querySelectorAll('.lang-switch [data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
  }

  function init() {
    apply(detectLang());
    document.querySelectorAll('.lang-switch [data-lang]').forEach(b => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.UmbraI18n = { setLang, detectLang, T };
})();
