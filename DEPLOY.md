# DEPLOY.md — plan de producción "listo cuando hagan `az login`"

> El proyecto está **construido para funcionar en local sin credenciales** (mock mode en landing, api-server y biosync-studio). Cuando Manu/Justin tengan `az login` + deployments Azure, SOLO hace falta setear env vars + deploy artifacts. Cero código nuevo.
>
> **Estado hoy (T-3 2026-04-19):**
> - Landing (`artifacts/landing/`): Vite SPA + Playwright 4/4 ✓ + hedging aplicado
> - Api-server (`artifacts/api-server/`): Express 5 + Drizzle + RAG mock-mode ✓ + endpoints Asistente/Waitlist/Insights ✓
> - Biosync-studio (`artifacts/biosync-studio/`): Asistente real con SSE streaming + citation cards + Dashboard widget pain-points ✓
> - DB schema: `lib/db/src/schema/index.ts` — 5 tablas + pgvector + tipos Drizzle
> - Scripts: `scripts/src/scrape-reddit.ts` (standalone Apify CLI)

---

## 0 · Correr todo en local (sin credenciales)

```bash
# 1. Install
pnpm install

# 2. Terminal A — api-server (mock mode)
pnpm --filter @workspace/api-server build
PORT=3002 pnpm --filter @workspace/api-server start

# 3. Terminal B — landing (mock mode)
PORT=3001 pnpm --filter @workspace/landing dev

# 4. Terminal C — biosync-studio con api-server wire-up
PORT=3000 BASE_PATH=/ VITE_API_URL=http://localhost:3002 pnpm --filter @workspace/biosync-studio dev

# 5. Smoke tests
curl http://localhost:3002/healthz
curl http://localhost:3002/api/asistente/status
curl -X POST http://localhost:3002/api/asistente/ask \
  -H "content-type: application/json" \
  -d '{"q":"perdí pH en mi reactor a las 3am","lang":"es"}'
```

Todo responde. El Asistente usa el **corpus offline** + cache de 10 respuestas pre-validadas. Sin LLM externo.

---

## 1 · Cuando tengan `az login` (production flip)

### Step 1 — Provisión Azure

```bash
az login
az account set --subscription <subscription-id>

RG=biosync-studio-rg
LOC=eastus2

az group create --name $RG --location $LOC

# Postgres Flexible Server (B1ms — $12.41/mo, 2GB RAM, pgvector soportado)
az postgres flexible-server create \
  --resource-group $RG \
  --name biosync-db \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16 \
  --admin-user bsadmin \
  --admin-password "<strong-password>" \
  --public-access 0.0.0.0 \
  --storage-size 32

# Enable pgvector extension
az postgres flexible-server parameter set \
  --resource-group $RG \
  --server-name biosync-db \
  --name azure.extensions \
  --value vector

# Container Apps env + Container Registry
az containerapp env create \
  --name biosync-env \
  --resource-group $RG \
  --location $LOC

az acr create --resource-group $RG --name biosyncstudio --sku Basic --admin-enabled true

# Azure OpenAI — crear resource en el portal primero, luego desplegar los 2 modelos:
#   gpt-4o-mini (deployment name: gpt-4o-mini)
#   text-embedding-3-small (deployment name: text-embed-3-small)
# Ver: https://portal.azure.com → Azure OpenAI → Deployments

# Key Vault
az keyvault create --name biosync-kv --resource-group $RG --location $LOC
az keyvault secret set --vault-name biosync-kv --name openai-key --value "<key>"
az keyvault secret set --vault-name biosync-kv --name openai-endpoint --value "https://<name>.openai.azure.com/"
az keyvault secret set --vault-name biosync-kv --name db-url --value "postgres://bsadmin:<pass>@biosync-db.postgres.database.azure.com:5432/postgres?sslmode=require"
az keyvault secret set --vault-name biosync-kv --name apify-key --value "<apify-api-key>"
```

### Step 2 — Push DB schema

```bash
export DATABASE_URL="postgres://bsadmin:<pass>@biosync-db.postgres.database.azure.com:5432/postgres?sslmode=require"

# Connect manualmente para crear la extension (solo 1x)
psql "$DATABASE_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;"

pnpm --filter @workspace/db push
```

### Step 3 — Build + push api-server image

```bash
cd artifacts/api-server
pnpm build

# Dockerfile (crear manualmente si no existe — ver §5 abajo)
az acr build --registry biosyncstudio --image api-server:latest .
```

### Step 4 — Deploy Container App

```bash
az containerapp create \
  --resource-group $RG \
  --name biosync-api \
  --environment biosync-env \
  --image biosyncstudio.azurecr.io/api-server:latest \
  --ingress external \
  --target-port 3002 \
  --min-replicas 0 \
  --max-replicas 3 \
  --secrets \
    openai-key=keyvaultref:https://biosync-kv.vault.azure.net/secrets/openai-key,identityref:system \
    openai-endpoint=keyvaultref:https://biosync-kv.vault.azure.net/secrets/openai-endpoint,identityref:system \
    db-url=keyvaultref:https://biosync-kv.vault.azure.net/secrets/db-url,identityref:system \
  --env-vars \
    PORT=3002 \
    NODE_ENV=production \
    DATABASE_URL=secretref:db-url \
    AZURE_OPENAI_API_KEY=secretref:openai-key \
    AZURE_OPENAI_ENDPOINT=secretref:openai-endpoint \
    AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o-mini \
    AZURE_OPENAI_EMBED_DEPLOYMENT=text-embed-3-small \
    CORS_ORIGINS=https://biosync.studio,https://bio-sync-stu.replit.app,https://biosync-landing.azurestaticapps.net

# URL queda en: https://biosync-api.<region>.azurecontainerapps.io
```

### Step 5 — Landing → Static Web Apps

```bash
cd artifacts/landing
pnpm build  # → dist/

# Azure Static Web Apps via CLI:
az staticwebapp create \
  --name biosync-landing \
  --resource-group $RG \
  --location westus2 \
  --sku Free

# O mejor: conectar GitHub Actions. En el portal → Azure Static Web Apps → Source → GitHub.
# Build command: pnpm install && pnpm --filter @workspace/landing build
# Output dir: artifacts/landing/dist

# Setear env var para que apunte al API:
az staticwebapp appsettings set \
  --name biosync-landing \
  --setting-names VITE_API_URL=https://biosync-api.<region>.azurecontainerapps.io
```

### Step 6 — Biosync-studio

Opción A — mantener en Replit (el MVP ya está vivo en `bio-sync-stu.replit.app`). Solo setear secret:
- Replit → Secrets → `VITE_API_URL=https://biosync-api.<region>.azurecontainerapps.io`
- Re-deploy.

Opción B — mover a Azure Static Web Apps (mismo patrón que landing).

### Step 7 — Seed corpus embeddings (una sola vez)

```bash
# Después de que DB + Azure OpenAI estén up:
export DATABASE_URL=...
export AZURE_OPENAI_API_KEY=...
export AZURE_OPENAI_ENDPOINT=...

# TODO: scripts/src/seed-embeddings.ts (pendiente — el api-server ya embed on-the-fly,
# solo necesario si querés persistir para pgvector queries masivos).
```

### Step 8 — Manual Reddit scrape (populate pain points widget)

```bash
export APIFY_API_KEY=<key>
export DATABASE_URL=<azure-pg-url>

pnpm --filter @workspace/scripts exec tsx src/scrape-reddit.ts --persist --limit=100
```

Esto:
1. Corre el actor `practicaltools/apify-reddit-api` (costo ≈ $2 por 1,000 posts).
2. Inserta en `reddit_posts` table.
3. El api-server `/api/insights/pain-points` empezará a devolver data real en vez del mock.

### Step 9 — DNS

```bash
# Comprar dominio biosync.studio (si aún no está)
# Crear CNAME record: biosync.studio → <app>.azurestaticapps.net
# Replit también permite custom domain si biosync-studio queda ahí.
```

---

## 2 · Smoke tests production

```bash
API=https://biosync-api.<region>.azurecontainerapps.io

curl $API/healthz
# Expected: {"ok":true}

curl $API/api/asistente/status
# Expected: {"mock":false,"llm":"azure","corpus_size":22}

curl -X POST $API/api/asistente/ask \
  -H "content-type: application/json" \
  -d '{"q":"cuánto cuesta benchling","lang":"es"}'
# Expected: SSE stream, <3s, 3+ citations con URLs válidas

curl $API/api/waitlist/count
# Expected: {"count":<N>,"mock":false}  con N ≥ 25 baseline
```

---

## 3 · Matriz env vars por environment

| Var | Local (mock) | Dev (Replit) | Prod (Azure) |
|---|---|---|---|
| `DATABASE_URL` | _vacío_ | _vacío_ | `postgres://...azure.com...` |
| `OPENAI_API_KEY` | _vacío_ | opcional (OpenAI direct) | _vacío_ (usamos Azure) |
| `AZURE_OPENAI_API_KEY` | _vacío_ | _vacío_ | `secretref:openai-key` |
| `AZURE_OPENAI_ENDPOINT` | _vacío_ | _vacío_ | `secretref:openai-endpoint` |
| `CORS_ORIGINS` | _vacío_ (open) | `https://bio-sync-stu.replit.app` | `https://biosync.studio,...` |
| `VITE_API_URL` (landing + biosync-studio) | _vacío_ (mock) | `http://localhost:3002` | `https://biosync-api.<region>.azurecontainerapps.io` |
| `APIFY_API_KEY` (scripts only) | _opcional_ | _opcional_ | Key Vault |

---

## 4 · Rollback / fallback

Si Azure falla T-0 antes del pitch:
1. Landing y biosync-studio ya funcionan en mock mode — el Asistente usa el corpus offline + cache de 10 respuestas. Demo NO depende de Azure.
2. Cambiar `VITE_API_URL` a vacío → cliente cae a mock. Zero deploy needed.
3. Video backup en `marketing/pitch-video-backup-*.mp4`.

---

## 5 · Dockerfile api-server (crear cuando se haga deploy)

```dockerfile
# artifacts/api-server/Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json tsconfig.json ./
COPY artifacts/api-server artifacts/api-server
COPY lib lib
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/artifacts/api-server/dist ./dist
EXPOSE 3002
ENV PORT=3002
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
```

Guardar como `artifacts/api-server/Dockerfile` cuando arranque el deploy real.

---

**Regla:** este doc es la única fuente de verdad para el flip prod. Si algo se desvía, actualizar acá primero.
