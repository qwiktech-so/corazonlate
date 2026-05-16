# Corazón Late — Contexto del proyecto

> Sitio web para **Fundación Corazón Late** (Rep. Dominicana). Astro 5 estático + Decap CMS, alojado en Netlify, formulario de voluntarios + contacto vía n8n webhook, donaciones por PayPal + transferencia BHD León. Cerrado el **2026-05-15**.

---

## 1. Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Static site | **Astro 5** (`output: 'static'`) | Build a `dist/` con `npm run build` |
| Componentes interactivos | **React 18** (`@astrojs/react`) | Solo `VolunteerForm.tsx` y `ContactForm.tsx` (con `client:load`) |
| Estilos | **Tailwind CSS** | Paleta de marca en `tailwind.config.mjs`. CSS extra en `src/styles/global.css` |
| CMS | **Decap CMS 3.x** (CDN) | Panel en `/admin`, auth vía Netlify Identity + Git Gateway |
| Webhooks formularios | **n8n self-hosted** | `https://n8n.qwiktech.cloud/webhook/{corazonlate-voluntarios,corazonlate-contacto}` |
| Email | **Resend** | API key con dominio `corazonlate.org` verificado |
| Hosting | **Netlify** | site_id `b331606b-ba45-4889-9395-f252b2611d51`, dominio `corazonlate.org` |

---

## 2. Estructura del proyecto

```
corazonlate/
├── astro.config.mjs         # Astro 5 + React + Tailwind
├── tailwind.config.mjs      # Paleta de marca (brand-red, terracotta, gold, cream, ...)
├── netlify.toml             # build = "npm run build" / publish = "dist"
│
├── content/                 # ⭐ TODO el contenido editable del sitio (JSON)
│   ├── settings.json        # Site name, contact, social URLs
│   ├── home.json            # Página principal (hero, stats, mission, services, gallery, banner, testimonials, CTA)
│   ├── nosotros.json        # Página /nosotros (mission, vision, valores, historia)
│   ├── donaciones.json      # Página /donaciones (impact cards, PayPal config, datos bancarios)
│   └── contacto.json        # Página /contacto (textos)
│
├── public/
│   ├── admin/
│   │   ├── index.html       # Entrada Decap CMS
│   │   └── config.yml       # ⭐ Configuración de TODOS los campos editables
│   ├── images/
│   │   ├── logo.png         # Header
│   │   ├── logo-white.png   # Footer / hero overlays
│   │   ├── nina-sol.jpg     # Foto "Niña con sol" (hero + galería)
│   │   ├── quienes-somos.jpg
│   │   ├── hero-home.jpg, hero-form.jpg, cta-luz.jpg
│   │   ├── team-1..4.jpg    # Placeholders (sin uso actualmente)
│   │   └── gallery/         # Fotos reales de actividades (optimizadas con sharp)
│   │       ├── jornada-calle.jpg   # Jornada en la calle (panorámica)
│   │       ├── taller-banner.jpg   # Voluntaria frente al banner CL
│   │       ├── fe.jpg              # Figuras de Jesús
│   │       ├── navidad.jpg         # Evento navideño con payaso
│   │       ├── mentoria.jpg        # Mentoría con niñas
│   │       └── sonrisa-timida.jpg  # Niña sonriendo
│   └── favicon.ico
│
├── src/
│   ├── layouts/Layout.astro          # Wrapper común: <head>, Header, Footer, Netlify Identity script
│   ├── components/
│   │   ├── Header.astro              # Nav sticky con menú móvil
│   │   ├── Footer.astro              # Lee de content/settings.json
│   │   ├── VolunteerForm.tsx         # Formulario de 5 pasos → n8n webhook
│   │   └── ContactForm.tsx           # Formulario simple → n8n webhook
│   ├── pages/                        # Cada página lee SU JSON de content/
│   │   ├── index.astro               # Home (lee content/home.json)
│   │   ├── nosotros.astro            # /nosotros (lee content/nosotros.json)
│   │   ├── voluntariado.astro        # /voluntariado (solo embed VolunteerForm)
│   │   ├── donaciones.astro          # /donaciones (lee content/donaciones.json)
│   │   └── contacto.astro            # /contacto (lee content/contacto.json + settings.json)
│   └── styles/global.css             # Tailwind + animaciones (float, scroll-reveal, hero/banner slideshow)
│
├── photos/                  # ⚠️ ORIGINALES de fotos (alta resolución de WhatsApp).
│                            #     EN .gitignore — solo viven localmente. Si necesitas
│                            #     re-optimizar, hazlo con sharp desde aquí.
│
├── GUIA-CMS.md              # Manual para el cliente sobre cómo usar el CMS
└── CLAUDE.md                # (este archivo)
```

---

## 3. Cómo está conectado el CMS

**Flujo end-to-end:**

```
Cliente → corazonlate.org/admin → login Netlify Identity → Decap CMS UI →
  edita formulario → "Publish" → commit a GitHub (master) → Netlify rebuild auto →
  sitio actualizado en ~1-2 min
```

**Decap CMS** (`public/admin/config.yml`) define 5 colecciones, cada una mapeada a un archivo JSON en `content/`. El backend es **Git Gateway** (`backend.name: git-gateway`, `branch: master`), que usa la GitHub App de Netlify para hacer commits en nombre del usuario autenticado.

**Páginas Astro** importan los JSON directamente al build:
```astro
---
import home from '../../content/home.json';
---
<h1>{home.hero.title_line1}</h1>
```

**Imágenes** suben a `public/images/` (configurado vía `media_folder` y `public_folder`). El widget `image` en `config.yml` devuelve rutas tipo `/images/nombre.jpg`.

---

## 4. Despliegues

### Netlify (producción)

- **Site:** `corazon-late` — https://corazon-late.netlify.app
- **Dominio:** https://corazonlate.org (DNS administrado en cPanel WHM `s3420.mex1.stableserver.net`)
- **Apex A record:** `75.2.60.5` (Netlify) — mail records preservados apuntando a `195.250.27.34`
- **Build trigger:** push a `master` en GitHub repo `qwiktech-so/corazonlate`
- **Build command:** `npm run build` → publica `dist/`
- **Env vars (Netlify):**
  - `PUBLIC_N8N_WEBHOOK = https://n8n.qwiktech.cloud/webhook/corazonlate-voluntarios`
  - `PUBLIC_N8N_CONTACTO = https://n8n.qwiktech.cloud/webhook/corazonlate-contacto`
  - `NODE_VERSION = 20`

### Deploy manual desde local

```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub

- **Repo:** `qwiktech-so/corazonlate` (público, requerido por Netlify para auto-deploy sin SSH key)
- **Branch:** `master` (no `main` — Decap CMS apunta a `master`)
- **CLI auth:** `gh` autenticado como `qwiktech-so`

---

## 5. Backend de formularios (n8n)

### Workflow `Corazón Late — Formulario Voluntariado`

- **ID:** `So7DgBKwoaeiFFJV`
- **URL n8n:** `https://n8n.qwiktech.cloud`
- **Nodos:**
  1. `Webhook` (path `corazonlate-voluntarios`) → Respond OK + Email Resend + NoOp (placeholder Google Sheets)
  2. `Webhook Contacto` (path `corazonlate-contacto`) → Respond OK Contacto + Email Contacto

Ambos webhooks responden inmediatamente `{ok: true}` y disparan emails HTML estilizados con la paleta de marca a `edward.emv@gmail.com` (cambiar a `Corazonlate2025@gmail.com` cuando el cliente esté listo).

### Resend

- **API key:** Vive en Infisical (project `corazon-late`, env `prod`, var `RESEND_API_KEY`). Cargar con `/creds corazon-late`. **Nunca commitear el valor en este repo (público).**
- **Dominio verificado:** `corazonlate.org` (DNS: `resend._domainkey`, MX `send.`, SPF, DMARC)
- **From:** `Corazon Late <noreply@corazonlate.org>`

### Cambiar destinatario del email

Editar en n8n UI:
- Workflow `Corazón Late — Formulario Voluntariado`
- Nodo `Enviar Email — Resend` → body field → cambiar `"to": ["edward.emv@gmail.com"]`
- Mismo cambio en nodo `Enviar Email Contacto`

O por API:
```bash
curl -X PUT https://n8n.qwiktech.cloud/api/v1/workflows/So7DgBKwoaeiFFJV \
  -H "X-N8N-API-KEY: <token>" \
  -H "Content-Type: application/json" \
  -d @cl-workflow.json
```
(payload completo del workflow excluyendo `versionId` que es read-only)

---

## 6. Donaciones

### PayPal

- **hosted_button_id:** `XE3R99LUD79GU` (del GHL anterior — verificar que la cuenta del botón siga activa; si no, crear uno nuevo desde la cuenta PayPal de la fundación)
- Configurable desde CMS: `content/donaciones.json` → `paypal.hosted_button_id`. Puedes desactivar la opción entera con `paypal.enabled: false`.

### Transferencia bancaria

- Banco: BHD León
- Titular: Shaerena Díaz
- Cédula: 402-5163267-1
- Cuenta: 32105820014 (Ahorros)
- Configurable desde CMS en `content/donaciones.json → bank.fields[]`

---

## 7. Decisiones técnicas + gotchas

### Por qué CMS basado en archivos JSON, no markdown
El sitio tiene mucho contenido nested (objects + listas) que es más natural en JSON. Decap CMS soporta JSON nativamente con la opción `file:` collection. Markdown sería forzado para campos como `hero.cta_primary_url` o `gallery.items[].alt`.

### Por qué Netlify Forms NO está activado
El usuario quería integración con n8n directamente. ContactForm.tsx hace `fetch POST` al webhook en lugar de usar el `data-netlify="true"`. El form HTML no aparece en el panel de Netlify Forms (no hay forms entry en `netlify.toml`).

### Por qué no hay fallbacks de Unsplash
Las URLs de Unsplash a veces 404 (typos en photo IDs o fotos removidas). Cuando el `onerror` cargaba una Unsplash que también 404 → loop infinito de cientos de requests por segundo (visto en Network panel del cliente). Solución: TODOS los `onerror` hacen `this.onerror=null;this.style.display='none'` y el contenedor padre tiene `bg-gradient-to-br from-brand-terracotta to-brand-red` como fallback visual.

### Slideshow del hero / banner
CSS puro con `@keyframes` + `animation-delay` escalonado. No JS, no librería. Cycle de 20s (4 fotos × 5s) para hero, 18s (3 fotos × 6s) para banner. Respeta `prefers-reduced-motion`.

### Astro static + env vars
`PUBLIC_*` env vars se **bakean al build time**. Si cambias `PUBLIC_N8N_WEBHOOK` en Netlify dashboard, **necesitas redeploy** para que la nueva URL llegue al JS del cliente.

### Decap CMS branch
Es `master` (no `main`). El repo se creó con `master` y no se migró. Si alguna vez Decap se queja con "branch not found", verifica que `public/admin/config.yml → backend.branch: master`.

### El CMS escribe a GitHub, no a local
Cuando el cliente edita en `/admin` y publica, Decap CMS hace un commit a GitHub vía Git Gateway. El JSON local NO se actualiza hasta que hagas `git pull`. Si trabajas en local, siempre `git pull` antes de tocar `content/*.json`.

---

## 8. Vault de secrets (Infisical)

**Regla #1:** **Ningún secreto se commitea jamás en este repo.** Todo vive en Infisical (`secrets.qwiktech.cloud`). Cargar al shell con `/creds <project>` antes de tareas que los necesiten.

- **Project `corazon-late`** — env `prod` — vars: `RESEND_API_KEY`, `NETLIFY_TOKEN`
- **Project `cuic-agency`** — env `prod` — vars: `N8N_PUBLIC_API_TOKEN`, `N8N_URL`, WHM API token (para DNS cPanel)

Los IDs/slugs de los projects y el procedimiento de bootstrap están documentados en `~/.claude/CLAUDE.md` (global, no en este repo).

---

## 9. Desarrollo local

```bash
# Primera vez
npm install

# Dev server (con hot reload)
npm run dev          # http://localhost:4321

# Build estático
npm run build        # genera dist/

# Preview del build
npm run preview
```

**Para probar el CMS localmente** necesitas Netlify Identity activado en el deploy + auth-token válido. La forma fácil es editar JSON manualmente en local y luego ver el resultado con `npm run dev`.

**Para probar el formulario localmente**: crea `.env` con:
```
PUBLIC_N8N_WEBHOOK=https://n8n.qwiktech.cloud/webhook/corazonlate-voluntarios
PUBLIC_N8N_CONTACTO=https://n8n.qwiktech.cloud/webhook/corazonlate-contacto
```

---

## 10. Continuar el proyecto

Si retomas esto en otra máquina (Linux):

1. Descomprimir el zip del proyecto
2. `cd corazonlate && npm install`
3. Autenticar herramientas:
   - `gh auth login` (GitHub CLI, account `qwiktech-so`)
   - `netlify login` (Netlify CLI)
   - `/creds corazon-late` (Infisical, requiere `~/.claude/secrets/cuic/credentials.env`)
4. Verificar acceso:
   - `gh repo view qwiktech-so/corazonlate`
   - `netlify status` (debe mostrar site `corazon-late`)
5. Push de prueba: edita un texto en `content/`, `git push`, ver auto-deploy en Netlify

### Tareas pendientes / mejoras posibles

- [ ] Configurar **Google Sheets** en n8n (nodo `noOp` "Google Sheets — pendiente" en el workflow). Necesita OAuth credential.
- [ ] Cambiar destinatario emails de `edward.emv@gmail.com` a `Corazonlate2025@gmail.com` cuando el cliente esté listo.
- [ ] Verificar que **`hosted_button_id` de PayPal** sigue activo (creado desde GHL bloqueado; puede requerir crear uno nuevo desde PayPal de la fundación).
- [ ] Invitar al cliente en **Netlify Identity** (Site settings → Identity → Invite users) para que pueda entrar a `/admin`.
- [ ] Considerar añadir **Plausible** o GA para analytics.
- [ ] Optimización de imágenes: usar `astro:assets` para fotos del hero/banner si el rendimiento se vuelve un tema.

---

## 11. Comandos útiles

```bash
# Re-optimizar fotos originales de photos/ → public/images/gallery/
node -e "
const sharp = require('sharp');
const fs = require('fs');
sharp('photos/<archivo>.jpg')
  .rotate()
  .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/images/gallery/<nombre>.jpg');
"

# Listar workflows n8n
curl -s -H "X-N8N-API-KEY: $N8N_PUBLIC_API_TOKEN" \
  "https://n8n.qwiktech.cloud/api/v1/workflows?limit=100" | \
  node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{JSON.parse(d).data.forEach(w=>console.log(w.id,w.name,w.active))})"

# Ver últimas ejecuciones del webhook de voluntarios
curl -s -H "X-N8N-API-KEY: $N8N_PUBLIC_API_TOKEN" \
  "https://n8n.qwiktech.cloud/api/v1/executions?workflowId=So7DgBKwoaeiFFJV&limit=5"
```

---

_Última actualización: 2026-05-15. Proyecto cerrado pero documentado para continuidad._
