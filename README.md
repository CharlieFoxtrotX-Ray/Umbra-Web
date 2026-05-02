# UMBRA — Web

Landing oficial de **UMBRA**, producto de **CFX**.
Comms tácticos para gaming serio.

## Stack

Sitio estático puro, sin build step:

- **HTML semántico** + Open Graph / meta tags
- **CSS** con variables, Grid, Flexbox y media queries (mobile-first)
- **JavaScript vanilla** modularizado por responsabilidad
- **Google Fonts**: Space Grotesk · Inter · JetBrains Mono
- **Sin dependencias** de framework, runtime, ni package manager

## Estructura

```
.
├── index.html              # Entry point
├── css/
│   └── styles.css          # Tema dark monocromo, acento amber HUD
├── js/
│   ├── i18n.js             # 6 idiomas (ES, EN, FR, DE, PT, ZH) + selector
│   ├── auth.js             # Google OAuth (popup + postMessage + poll)
│   └── app.js              # Splash, scroll reveal, mobile drawer, signup form
├── assets/
│   ├── logo-umbra-cfx.png  # Logo principal con "by CFX"
│   ├── logo-umbra.png      # Logo con UMBRA
│   ├── logo-cfx.png        # Logo CFX standalone
│   ├── logo-triangle.png   # Solo el triángulo (navbar, modal)
│   ├── logo-loading.mp4    # Splash + hero background loop
│   └── bg-video.mp4        # Video de fondo global (4.4 MB, 1280x720, 21s loop)
└── README.md
```

## Configuración

### API base (Google OAuth)

El login con Google delega al backend del repo `Umbra-VoIP`. La URL del backend
se configura en `index.html`:

```html
<meta name="umbra-api-base" content="http://localhost:3000" />
```

- **Dev local**: dejar como está (`localhost:3000`).
- **Producción**: cambiar a la URL pública del server, por ejemplo:
  `https://umbra-server-voip.fly.dev` o `https://api.umbra.cfx-studio.com`.

Ver también la nota de Google OAuth abajo.

## Desarrollo local

No requiere build. Servir como sitio estático:

```bash
# Opción 1: Python (incluido en la mayoría de OS)
python -m http.server 8080

# Opción 2: Node (live reload)
npx serve -p 8080

# Opción 3: cualquier servidor estático
```

Luego abrir `http://localhost:8080`.

> ⚠️ **No abrir con `file://`** (doble click en `index.html`). El login con
> Google y los popups requieren protocolo HTTP/HTTPS.

## Despliegue (Vercel)

El sitio es 100% estático — Vercel lo detecta automáticamente.

1. Importar el repo desde Vercel dashboard.
2. Framework preset: **Other** (estático).
3. Build command: ninguno.
4. Output directory: `.` (raíz).
5. Deploy.

### Variables de entorno

Ninguna. La única configuración es el meta tag `umbra-api-base` en `index.html`.

## Internacionalización

6 idiomas soportados con detección automática del idioma del browser:

| Código | Idioma     | Estado de traducción            |
|--------|------------|---------------------------------|
| `es`   | Español    | Fuente original ✓               |
| `en`   | English    | Sólido ✓                        |
| `pt`   | Português  | Sólido ✓ (BR variant)           |
| `fr`   | Français   | Funcional — recomendado revisar |
| `de`   | Deutsch    | Funcional — recomendado revisar |
| `zh`   | 中文 (CN)   | Borrador — revisar con nativo   |

Las traducciones viven en `js/i18n.js`. Para agregar una key nueva:

1. Marcar el elemento HTML con `data-i18n="seccion.key"` (texto plano) o
   `data-i18n-html="seccion.key"` (HTML interno) o
   `data-i18n-attr="atributo:seccion.key"` (atributos como `placeholder`).
2. Agregar la key en los 6 diccionarios de `js/i18n.js`.

## Google OAuth — setup en Cloud Console

Para que el login funcione, agregar estas URIs autorizadas en
[Google Cloud Console](https://console.cloud.google.com):

**Authorized redirect URIs**:
- `http://localhost:3000/api/auth/google/callback` (dev)
- `https://<tu-server-de-producción>/api/auth/google/callback` (prod)

**Authorized JavaScript origins**:
- `http://localhost:8080` (dev)
- `https://<tu-dominio-web-de-producción>` (prod)

## Performance

Lighthouse target en mobile:

- LCP < 2.5s (gracias a preload del video splash)
- CLS = 0 (alturas reservadas en CSS)
- TBT < 200ms (no JS bloqueante, todo `defer`)
- Tamaño total: ~5.5 MB (4.4 MB del bg-video + 1 MB del splash + ~100 KB HTML/CSS/JS)

## Equipo CFX

- **Xolii** · Co-founder · All-rounder
- **Chuker** · Co-founder · All-rounder
- **Frost** · Co-founder · All-rounder

## Licencia

Propietario. © 2026 CFX. Todos los derechos reservados.
