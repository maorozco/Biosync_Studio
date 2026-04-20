# DEPLOY.md — BioSync Studio · Replit Core ($20/mo)

> **Pivote 2026-04-21:** no hay créditos de Azure. Todo se adapta a **Replit Core ($20/mo)** + lo que Replit ofrece por la subscripción. Zero code change desde el sprint — sólo env vars + deploy.
>
> **Estado actual del código** (todos commits al día):
> - Landing (`artifacts/landing/`): Vite SPA · Playwright 4/4 ✓
> - biosync-studio (`artifacts/biosync-studio/`): React 19 · 32/32 Playwright ✓ · 10 features signature
> - api-server (`artifacts/api-server/`): Express 5 · RAG SSE · mock mode default · **soporta OpenAI direct Y Azure, no requiere Azure**
> - DB schema (`lib/db/`): Drizzle + pgvector (lazy-init, mock-ready)
>
> **Regla central:** mock mode funciona sin credenciales. Para producción, solo necesitás lo que cabe en $20/mo Replit Core + opcional OpenAI direct (pay-per-token).

---

## 1 · Lo que Replit Core ($20/mo) te da

Verificado en replit.com/pricing (abril 2026):

- **Unlimited Autoscale Deployments** (pay-per-compute ~$0.00001/CPU-s, cents/mes a bajo tráfico)
- **Static Deployments** gratis dentro del plan
- **Reserved VM** desde $7/mo si necesitás proceso 24/7 (no usamos hoy)
- **Storage 10 GB** (archivos + DBs)
- **Replit Agent** credits incluidos ($25/mo valor)
- **Private Repls** ilimitados
- **Secrets** panel (env vars encriptados — nuestro Key Vault sustituto)

Lo que NO incluye:
- **Replit Postgres** — integración con Neon (plan gratis 512 MB es suficiente para MVP) o $15+/mo.
- **LLM** — Replit NO es proveedor de API LLM general. Para IA real usamos OpenAI/Claude API direct, pagando nosotros los tokens (mock mode fallback defecto).

---

## 2 · Arquitectura target (Replit-only)

```
┌──────────────────────────────────────────────────────────────┐
│                   BIOSYNC · REPLIT CORE $20/mo                │
└──────────────────────────────────────────────────────────────┘

   GitHub main ──→ auto-deploy via Replit GitHub connect

   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │ Static · landing│    │ Static · studio │    │ Autoscale · API │
   │ (biosync.studio)│    │  (app.biosync...)│    │ (api.biosync...)│
   │    Vite build   │    │    Vite build   │    │ Express 5 esbuild│
   │    → dist/      │    │    → dist/public│    │    → dist/       │
   └─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                           │
                       ┌───────────────────────────────────┼───────────────────────────────┐
                       │                                   │                               │
                       ▼                                   ▼                               ▼
               ┌───────────────┐                   ┌───────────────┐              ┌───────────────┐
               │ Neon Postgres │                   │ Replit Secrets│              │ OpenAI API    │
               │ (free 512 MB) │                   │  OPENAI_KEY   │              │  direct       │
               │ o Replit DB   │                   │  DATABASE_URL │              │ (opcional, pay│
               │  key-value    │                   │  APIFY_KEY    │              │  per-token)   │
               └───────────────┘                   └───────────────┘              └───────────────┘

   Mock mode (defecto · zero cost):
   • Si DATABASE_URL vacío  → waitlist + signups in-memory
   • Si OPENAI_API_KEY vacío → Asistente usa corpus offline + cache 10 queries pre-validadas
   • Todas las demos del pitch funcionan sin credenciales
```

---

## 3 · Costo mensual estimado (3 escenarios)

| Escenario | Replit Core | Postgres | LLM | Total |
|---|---|---|---|---|
| **Pitch-only (mock mode)** | $20 | $0 (no DB) | $0 (corpus offline) | **$20** |
| **Beta 50 labs (opcional OpenAI)** | $20 | $0 (Neon free 512 MB) | ~$5-15 (gpt-4o-mini prompt-cached) | **$25-35** |
| **Post-launch SMB** | $20 + $7 Reserved VM | $15 Neon Pro | ~$30-80 (según demo load) | **$72-122** |

Para T-0 pitch, escenario #1 alcanza. Mock mode tiene:
- 22 entries de corpus curado (`artifacts/api-server/src/data/pain-corpus.json`)
- 10 queries pre-cacheadas con respuestas validadas (`rag-cache.json`)
- Keyword Jaccard matching — responde en <100ms
- Zero dependency externa

---

## 4 · Deploy paso-a-paso (T-0 ready)

### Step 1 · Subir el monorepo a Replit (1 Repl raíz)

```bash
# En Replit:
Create Repl → Import from GitHub → pegá la URL del repo
```

Replit detecta automáticamente el monorepo pnpm. Run `pnpm install` en la shell.

### Step 2 · Configurar Secrets (Replit → Tools → Secrets)

**Para mock mode (recomendado para pitch):**

| Secret | Valor | ¿Para qué? |
|---|---|---|
| `PORT` | `3002` | Puerto del api-server |
| `CORS_ORIGINS` | `https://<landing-replit-url>,https://bio-sync-stu.replit.app` | Allowlist CORS |
| `VITE_API_URL` | `https://<api-replit-url>` | Landing + studio apuntan al api-server |
| `VITE_COUNTER_BASELINE` | `25` | Floor del contador de waitlist |

**Para real mode (opcional, cuando quieran gastar):**

| Secret | Valor |
|---|---|
| `DATABASE_URL` | `postgres://...neon.tech/...?sslmode=require` (Neon free tier) |
| `OPENAI_API_KEY` | `sk-...` de platform.openai.com |
| `OPENAI_CHAT_MODEL` | `gpt-4o-mini` (default; cambiarlo solo si querés upgrade) |
| `OPENAI_EMBED_MODEL` | `text-embedding-3-small` (default) |

**Importante:** NO necesitás `AZURE_OPENAI_*` — el código las soporta pero son opcionales. OpenAI direct es más simple.

### Step 3 · Configurar 3 Deployments (Replit → Deployments)

Replit soporta múltiples deployments desde un mismo Repl. Crear tres:

#### Deployment A — Landing (Static, gratis en Core)

```
Tipo: Static
Build command: pnpm install && pnpm --filter @workspace/landing build
Output directory: artifacts/landing/dist
Env vars:
  VITE_API_URL = https://<api-replit-url>
```

URL: `biosync-landing.<username>.replit.app` → apuntar dominio `biosync.studio` acá.

#### Deployment B — biosync-studio (Static, gratis en Core)

```
Tipo: Static
Build command: PORT=3000 BASE_PATH=/ pnpm install && pnpm --filter @workspace/biosync-studio build
Output directory: artifacts/biosync-studio/dist/public
Env vars:
  VITE_API_URL = https://<api-replit-url>
```

URL: `bio-sync-stu.<username>.replit.app` (ya existe, solo actualizar build).

#### Deployment C — api-server (Autoscale, pay-per-request)

```
Tipo: Autoscale
Build command: pnpm install && pnpm --filter @workspace/api-server build
Run command: pnpm --filter @workspace/api-server start
Port: 3002 (matches PORT secret)
Min instances: 0  # scale-to-zero — sólo gastás cuando hay tráfico
Max instances: 3  # protección contra runaway cost
```

URL: `biosync-api.<username>.replit.app`

**Costo estimado Autoscale:** scale-to-zero = $0 cuando no hay requests. En pitch día con ~50 requests demo, costo <$0.10.

### Step 4 · (Opcional) Conectar Neon Postgres

Si querés persistir waitlist + Reddit scrapes:

1. Ir a neon.tech → Create project (free tier 512 MB)
2. Copiar connection string (incluye `?sslmode=require`)
3. Replit → Tools → Secrets → `DATABASE_URL` = <connection-string>
4. En Replit shell:
   ```bash
   # Habilitar pgvector (Neon lo soporta nativo)
   psql "$DATABASE_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;"
   # Push schema Drizzle
   pnpm --filter @workspace/db push
   ```
5. Re-deploy api-server → ahora usa DB real en vez de in-memory.

Alternativa más simple: **Replit DB** (key-value incluido en Core). Adaptar `waitlist` router para usar Replit DB en vez de Postgres. No necesario para pitch.

### Step 5 · (Opcional) Conectar OpenAI para Asistente real

Si querés que el Asistente haga embeddings + completions reales en vez de usar el corpus offline:

1. Crear cuenta platform.openai.com → Billing → añadir método de pago ($5 inicial)
2. API Keys → Create → copiar `sk-...`
3. Replit → Secrets → `OPENAI_API_KEY` = `sk-...`
4. Re-deploy api-server. El Asistente automáticamente detecta la key y switchea a real mode.

**Costo esperado T-0 pitch:** $1-3 (con prompt caching agresivo).
**Costo beta 50 labs x 90 días:** $10-40 total.

### Step 6 · Custom domain `biosync.studio`

```
Replit → Deployment A (Landing) → Domains → Add custom domain
→ biosync.studio
→ Copiar los DNS records (A/CNAME/TXT) al registrar del dominio
→ Wait DNS propagation (5-30 min)
→ Replit issues SSL cert automáticamente (Let's Encrypt)
```

Repetir para `app.biosync.studio` → Deployment B y `api.biosync.studio` → Deployment C.

---

## 5 · Comparativa rápida: Replit vs Azure (para tu tranquilidad)

| Capacidad | Azure (lo que perdimos) | Replit $20/mo (lo que tenemos) |
|---|---|---|
| Frontend hosting | Static Web Apps free | Static deployment gratis |
| Backend hosting | Container Apps | Autoscale deployment |
| Postgres | Azure DB Flexible ($12.41/mo) | Neon integration (free 512 MB) |
| pgvector | Via azure.extensions | Native Neon ✓ |
| LLM | Azure OpenAI (enterprise) | OpenAI direct (simpler, pay-per-token) |
| Secrets | Key Vault (free tier) | Secrets panel (free) |
| Observability | Application Insights | Replit logs + metrics dashboard |
| Custom domain | Free + auto SSL | Free + auto SSL |
| Auto-deploy GitHub | Requires Actions | Native integration |
| CI/CD setup | ~2-4h | ~15 min |

**Lo único que perdimos:** el marketing point "corriendo en Azure enterprise-grade". Lo reemplazamos con: **"arquitectura portable — mismo código en Replit hoy, Azure o AWS mañana cuando los clientes lo pidan"**. Honestamente, para SMB target del pitch, Replit transmite "velocidad + pragmatism" más que Azure transmite "pesadez enterprise".

---

## 6 · Script de deploy 15-min (T-0 morning)

Si nunca se hizo deploy a Replit, seguí este orden:

```bash
# 1. En el Repl de BioSync:
pnpm install
pnpm run typecheck:libs  # tsc --build de lib/db + lib/api-zod
pnpm --filter @workspace/biosync-studio typecheck
pnpm --filter @workspace/landing typecheck
pnpm --filter @workspace/api-server typecheck

# 2. Builds
pnpm --filter @workspace/landing build  # dist/
pnpm --filter @workspace/biosync-studio build  # dist/public/
pnpm --filter @workspace/api-server build  # dist/index.mjs (esbuild bundle)

# 3. En Replit UI, crear los 3 Deployments arriba (Step 3)
# 4. Configurar Secrets (Step 2)
# 5. Click "Deploy" en cada uno (Landing + studio ~1 min · api 30s)

# 6. Smoke tests (reemplazar URLs con tus deployments)
curl https://<api-url>/healthz
# → {"ok":true}
curl https://<api-url>/api/asistente/status
# → {"mock":true,"llm":"none","corpus_size":22}  (o "openai" si pusiste key)
curl -X POST https://<api-url>/api/asistente/ask \
  -H "content-type: application/json" \
  -d '{"q":"perdí pH a las 3am","lang":"es"}'
# → SSE stream con tokens + citations
```

Si algo falla: `Replit Console → Logs` muestra stderr de los 3 deployments.

---

## 7 · Fallback + rollback

**Si Replit falla T-0:**
- El código corre 100% en local con `pnpm dev`. Laptop con hotspot del celular = backup.
- Video backup 30s en `marketing/pitch-video-backup-*.mp4` (grabados T-2).

**Si OpenAI falla T-0 (rate limit / down):**
- Api-server detecta fallo → cae a mock mode automáticamente (cache 10 queries pre-validadas).
- Demo no depende del LLM live.

**Si Neon falla T-0 (raro, free tier):**
- Api-server con `DATABASE_URL` unreachable → logs warning + cae a in-memory.
- Waitlist temporalmente no-persistente, pero demo sobrevive.

---

## 8 · Env vars matrix (cheatsheet bolsillo)

```
┌─────────────────────────┬────────────┬────────────┬────────────────┐
│ Secret                  │ Local      │ Replit Dev │ Replit Prod    │
├─────────────────────────┼────────────┼────────────┼────────────────┤
│ PORT                    │ 3002       │ 3002       │ 3002           │
│ DATABASE_URL            │ (vacío)    │ (vacío)    │ neon://... opt │
│ OPENAI_API_KEY          │ (vacío)    │ opt        │ sk-... opt     │
│ CORS_ORIGINS            │ (vacío)    │ replit url │ biosync.studio │
│ VITE_API_URL (SPA)      │ localhost  │ replit api │ api.biosync... │
│ VITE_COUNTER_BASELINE   │ 25         │ 25         │ 25             │
│ APIFY_API_KEY (scripts) │ opt        │ opt        │ opt            │
└─────────────────────────┴────────────┴────────────┴────────────────┘
```

---

## 9 · Adiós Azure (solo mental)

Lo que tenías planeado en Azure (versión anterior de este doc):
- ~~Azure DB Flexible Postgres B1ms~~ → Neon free 512 MB
- ~~Azure Container Apps environment~~ → Replit Autoscale
- ~~Azure Container Registry~~ → no necesario (Replit build in-place)
- ~~Azure OpenAI + deployments~~ → OpenAI direct API (opcional)
- ~~Azure Key Vault~~ → Replit Secrets
- ~~Azure Functions timer trigger (scrape cron)~~ → manual scrape con `pnpm scrape-reddit` o Replit Scheduled Deployment

Zero cambios de código. El api-server detecta env vars y decide branch:
- `isLlmConfigured()` ya soporta OPENAI_API_KEY ∨ AZURE_OPENAI_API_KEY
- `isDbConfigured()` ya soporta DATABASE_URL (Neon o Azure o local Postgres, todo Postgres)
- Mock fallback en todas las rutas

---

## 10 · TL;DR

1. Deploy target ahora es **Replit Core $20/mo** + opcional OpenAI direct.
2. **Zero code change**. Sólo env vars + 3 deployments en Replit UI.
3. Mock mode es el default — demo funciona sin credenciales externas.
4. Costo esperado pitch = $20/mo. Beta 50 labs = $25-35/mo. Todo manejable.
5. Cuando crezcamos a Series A, reabrimos la puerta Azure — el código está listo para ambos.

**Pitch narrative update:** si un jurado pregunta "¿dónde corre?" → "Replit hoy, cualquier cloud mañana — el código es portable porque cada dependencia tiene un fallback mock". Eso es una fortaleza arquitectónica, no una debilidad.
