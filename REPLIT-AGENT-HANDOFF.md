# REPLIT Agent Handoff — BioSync Landing

> Paste-able, step-by-step, para el próximo dev/agente que tome la landing y la deploye a Replit. Asume que el código del repo está clonado y que leíste `CLAUDE.md` raíz.

**Qué es:** `artifacts/landing/` — landing page bilingüe (ES+EN) con waitlist scored. MVP ya vivo en `https://bio-sync-stu.replit.app/` (distinto — ese es el app de producto, no la landing).

**Qué no es:** no es el MVP de dashboard/simulador (ese vive en `artifacts/biosync-studio/`). La landing es standalone.

---

## Step 1 · Instalar deps

```bash
# Desde raíz del repo
pnpm install
```

Espera ver `@workspace/landing` en la lista de workspaces. Si falla:
```bash
pnpm -v            # debe ser ≥10
node -v            # debe ser ≥20
```

---

## Step 2 · Provisionar DB (OPCIONAL para primeras 48h)

**Caso A · Mock mode (launch default):** no hagas nada. `VITE_API_URL` vacío → la app persiste signups en `localStorage` del navegador. Sirve para launch.

**Caso B · Replit Postgres (producción real):**

1. En Replit, "Tools" → "Database" → "Create Postgres".
2. Copia `DATABASE_URL` del panel.
3. Deploy `artifacts/api-server/` apuntando a ese DATABASE_URL (ya configurado — ver su README).
4. En landing, setea `VITE_API_URL=https://<tu-api-server>.replit.app`.
5. Ejecutar migración:
   ```bash
   pnpm --filter @workspace/api-server db:push
   ```

**Caso C · Neon / Supabase externo:** misma idea — pega `DATABASE_URL` en Replit Secrets + `VITE_API_URL` en la landing.

---

## Step 3 · Configurar Secrets (Replit → Tools → Secrets)

| Secret | Ejemplo | Obligatorio? |
|---|---|---|
| `VITE_API_URL` | `https://biosync-api.replit.app` | No (mock mode si vacío) |
| `VITE_SITE_URL` | `https://biosync.studio` | Recomendado (SEO) |
| `VITE_CALENDLY_URL` | `https://calendly.com/manuela-orozco/biosync-feedback` | Sí |
| `VITE_COUNTER_BASELINE` | `25` | No (default 25) |
| `VITE_PLAUSIBLE_DOMAIN` | `biosync.studio` | No |

**Vite lee vars con prefijo `VITE_` y las embebe en el bundle al build.** Por eso NO pongas secretos sensibles aquí (todo será público). DB credentials van en api-server, no aquí.

---

## Step 4 · Smoke test local antes de deploy

```bash
# Terminal 1: dev server
PORT=3001 pnpm --filter @workspace/landing dev

# Terminal 2: curl
curl -I http://localhost:3001/            # 200 (redirect client-side)
curl -I http://localhost:3001/es          # 200
curl -I http://localhost:3001/en          # 200
curl -I http://localhost:3001/es/gracias  # 200
curl -I http://localhost:3001/en/thank-you # 200
```

En el browser verificá el **flow completo**:

1. `/` → redirige a `/es` (o `/en` si tu navegador es inglés).
2. Click en toggle `ES|EN` del nav → cambia idioma sin reload hard.
3. Hero: escribí email → submit → redirige a `/es/gracias?email=foo@bar.com`.
4. Form 6 preguntas → completá → submit → ves panel 🟢/🟡/🔴 según scoring.
5. Tier 🟢 → el botón Calendly abre nueva pestaña.

Si algún paso falla: revisá consola del browser + `pnpm --filter @workspace/landing typecheck`.

---

## Step 5 · Build + preview

```bash
pnpm --filter @workspace/landing build
# dist/ ~260KB JS + 18KB CSS. Gzip: ~87KB total.

pnpm --filter @workspace/landing preview
# http://localhost:3001 sirve dist/ como estático
```

---

## Step 6 · Deploy a Replit

El repo trae `artifacts/landing/.replit` ya configurado. En Replit:

1. Importá el repo (si aún no está importado).
2. Abrí el proyecto → run button → ejecuta `pnpm --filter @workspace/landing dev`.
3. Para production: "Deployments" → "Create deployment" → tipo **Static** o **Autoscale**.
   - **Static:** build command = `pnpm install && pnpm --filter @workspace/landing build`. Public dir = `artifacts/landing/dist`.
   - **Autoscale:** run command = `pnpm --filter @workspace/landing preview`.
4. Add custom domain en "Domains" → punta `biosync.studio` (o el que tengás) al deployment.

Replit manejará SSL automáticamente en el custom domain.

---

## Step 7 · Custom domain

1. En Replit deployment → "Custom domain" → agregá `biosync.studio` y `www.biosync.studio`.
2. Replit te da 2 CNAME / A records → copialos a tu registrar.
3. DNS propagación: ~5–30 min. Verificá con `dig biosync.studio +short`.
4. Una vez activo, actualizá `VITE_SITE_URL=https://biosync.studio` en Secrets + redeploy.

---

## 🚫 Lista de "NO tocar"

Los siguientes archivos contienen **copy validado contra research + lista "no prometer"**. Cualquier cambio debe re-auditar contra `.research-synthesis.md` §6.

- `artifacts/landing/src/messages.ts` — toda la copy bilingüe. NO "mejorar" con ChatGPT/LLM sin validación humana — rompe anti-overclaim.
- `artifacts/landing/src/lib/scoring.ts` — rubrica de scoring 🟢🟡🔴. Cambiar altera segmentación; cambiar SOLO si hay data nueva del launch.
- `marketing/*.md` — docs operacionales. Editá con diff, nunca sobrescribas en bloque.
- `.research-synthesis.md` y `.research-external.md` — intermediate research artifacts. Marcá updates como `## Update YYYY-MM-DD` al final.

---

## ✍️ Decisiones humanas pendientes (before T-0)

- [ ] **Foto de Manuela** — `src/App.tsx` Founder section tiene placeholder `<div>` con texto "foto · placeholder". Reemplazar por `<img src="/founder.jpg" ... />` y poner archivo en `public/founder.jpg` (≤200KB JPG, crop 1:1).
- [ ] **Dominio final** — confirmar si es `biosync.studio`, `.com`, `.ai`. Actualizar `VITE_SITE_URL` Secret + footer links en `messages.ts` (`hola@`, `hello@`).
- [ ] **LinkedIn URL real** — `messages.ts` footer y BuildInPublic tienen `/in/manuela-orozco` placeholder.
- [ ] **GitHub URL** — `messages.ts` footer tiene `github.com/JustinWebconnex` como placeholder. Decidir si se publica repo en T-0 o post-launch.
- [ ] **Calendly link** — el default apunta a `manuela-orozco/biosync-feedback`. Crear ese link en Calendly con 4 slots/día lun–vie.
- [ ] **Email forwards** — `hola@biosync.studio` y `hello@biosync.studio` deben resolver a la inbox de Manuela.
- [ ] **OG image** — crear `public/og.png` (1200×630) y descomentar la línea `<meta property="og:image">` en `index.html` (actualmente removida para que el build no falle por asset inexistente).
- [ ] **Privacy + Terms** — placeholder pages ES+EN. Mínimo legal B2B: copiar template standard + mencionar retention + unsubscribe.

---

## 🐛 Limitaciones conocidas

1. **hreflang no está en el HTML** — Vite falla el build si apunta a paths de SPA. Hay que añadirlo dinámicamente en `<head>` vía `useEffect` post-hydration. Issue abierto: `TODO` en `src/App.tsx`.
2. **Counter en mock mode es por-navegador** — cada visitante ve su propio counter de `localStorage`. En producción con api-server, será global.
3. **Scoring corre en el cliente en mock mode** — cualquier usuario con devtools puede ver su tier. En producción el api-server re-calcula y devuelve la tier auténtica.
4. **Footer links a `/es/privacidad` etc. devuelven 404 post-launch** hasta que se publiquen las páginas legales.
5. **OG image ausente** — el meta tag está removido hasta que exista el asset. Share en LinkedIn/X muestra solo texto.
6. **No hay sitemap.xml ni robots.txt** — agregar post-launch para SEO (no bloquea).

---

## 🔍 Queries SQL útiles (cuando api-server esté conectado)

```sql
-- Greens del día para follow-up <48h
SELECT w.email, r.role, r.country, r.pain_text
FROM waitlist w
JOIN waitlist_responses r ON w.id = r.waitlist_id
WHERE r.tier = 'green'
  AND w.status = 'completed'
  AND w.created_at > NOW() - INTERVAL '2 days'
ORDER BY w.created_at DESC;

-- Top 10 pain_text repetidos (goldmine copy v2)
SELECT pain_text, COUNT(*)
FROM waitlist_responses
GROUP BY pain_text
ORDER BY 2 DESC
LIMIT 10;

-- Distribución por país (para decidir región primaria post-launch)
SELECT country, COUNT(*)
FROM waitlist_responses
GROUP BY country
ORDER BY 2 DESC;

-- Tier split por idioma (ver si ES rinde más 🟢 que EN)
SELECT w.lang, r.tier, COUNT(*)
FROM waitlist w
JOIN waitlist_responses r ON w.id = r.waitlist_id
GROUP BY w.lang, r.tier
ORDER BY 1, 2;
```

---

## 🆘 Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| `pnpm install` falla con "minimumReleaseAge" | El paquete fue publicado hace <1 día | Espera 24h o añadilo a `minimumReleaseAgeExclude` en `pnpm-workspace.yaml` (solo si es trusted) |
| Build pasa typecheck, falla en vite con `EISDIR` | Asset en `index.html` apunta a una ruta que Vite interpreta como dir | Quitá el tag o usá URL absoluta `https://...` |
| `/es` responde 404 en producción | Replit static deployment no tiene SPA fallback | En Replit deployment config: "SPA rewrite to /index.html" |
| `ReferenceError: window is not defined` | Código corriendo en SSR (no debería, somos SPA) | Envolvé en `typeof window !== 'undefined'` |
| Counter queda en 0 | `fetchWaitlistCount` fallando en silencio (mock mode sí devuelve baseline) | Check consola browser + `VITE_API_URL` bien seteado |
| Toggle EN/ES no persiste scroll | Wouter re-renderiza todo el route | Acceptable T-0; mejora T+1 con `useLocation` + scroll-preserve |
| LinkedIn ads desaprobado | Probable "exaggerated claim" en copy | Revisá contra `.research-synthesis.md` §6 "no prometer" y ajustá |

---

## TL;DR paste-able

```
git clone <repo> && cd Biosync_Studio
pnpm install
# Set secrets in Replit (VITE_CALENDLY_URL mínimo)
pnpm --filter @workspace/landing dev        # local test
pnpm --filter @workspace/landing build      # produces dist/
# Replit: "Static deployment" apuntando a artifacts/landing/dist/
# Custom domain: Replit → Domains → biosync.studio
# Mock mode (VITE_API_URL vacío) está OK para las primeras 48h.
```

---

**Dueño de este doc:** Manuela Orozco. Preguntas → `hola@biosync.studio`.
**Última actualización:** 2026-04-18.

**Conteo:** ~1,680 palabras.
