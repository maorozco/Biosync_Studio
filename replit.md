# BioSync Studio — Replit Agent Brief

> **Read first.** Primary context for the Replit Agent. If you're a human, see `DEPLOY-QUICKSTART.md` for the 1-page deploy flow.

## What this is

pnpm monorepo with 3 independently deployable apps. All run in **MOCK MODE by default** — no secrets or external services required to get a working demo. Local typecheck passes, local builds are reproducible, E2E tests exist.

- **landing** (`artifacts/landing/`) — Vite 7 SPA · bilingual ES+EN · waitlist form with scoring · static deploy.
- **biosync-studio** (`artifacts/biosync-studio/`) — React 19 + Vite product demo · 5 routes · static deploy.
- **api-server** (`artifacts/api-server/`) — Express 5 · RAG Asistente over offline corpus · Autoscale deploy.

## Stack facts

- **Node 20 LTS** for deploy (modules = ["nodejs-20"]). Local dev can use 24; the Replit drop-in configs pin 20 for broad module compat.
- **pnpm 9+** via Corepack. Root is a pnpm workspace (see `pnpm-workspace.yaml`).
- **TypeScript 5.9**, project references across packages; `tsc --build` at root compiles libs.
- **API:** Express 5 + Drizzle ORM (PostgreSQL) + Zod (`zod/v4`) + `drizzle-zod`. Bundled for prod with **esbuild** (`artifacts/api-server/build.mjs`).
- **API client codegen:** Orval generates `@workspace/api-client-react` from the OpenAPI spec.
- **No DB required** — `DATABASE_URL` empty → in-memory waitlist + counter baseline 25.
- **No LLM required** — `OPENAI_API_KEY` empty → offline corpus (22 curated entries + 10 pre-cached Q&A pairs).
- **Healthcheck:** `GET /api/healthz → 200 {ok:true}` on api-server.

## Key commands

```sh
pnpm install                                        # workspace deps
pnpm run typecheck                                  # typecheck all packages
pnpm run build                                      # typecheck + build all
pnpm --filter @workspace/landing dev                # landing on :4300
pnpm --filter @workspace/biosync-studio dev         # studio on :4310 (needs PORT + BASE_PATH)
pnpm --filter @workspace/api-server dev             # api on :4320
pnpm --filter @workspace/api-server build && pnpm --filter @workspace/api-server start
pnpm --filter @workspace/api-spec run codegen       # regenerate API hooks + Zod schemas
pnpm --filter @workspace/db run push                # push DB schema (dev only)
```

## Deploy decision tree — pick ONE per Repl

You deploy **ONE** app per Repl. Copy the matching drop-in over the root `.replit`:

| Goal | Action | Deploy type | Cost |
|------|--------|-------------|------|
| Deploy Landing (pitch-critical) | `cp .replit.deploy-landing .replit` | Static | Free |
| Deploy Studio (product demo) | `cp .replit.deploy-studio .replit` | Static | Free |
| Deploy API (backend for Studio) | `cp .replit.deploy-api .replit` | Autoscale | ~$0–$5/mo |

Then click **Deploy** in the Replit UI. That's it.

**For all three apps, use three separate Repls** (each importing this same GitHub repo) — Replit supports only one `[deployment]` block per `.replit`. The root `.replit` in this repo is the DEV workspace; the three `.replit.deploy-*` files override it at deploy-time.

## Minimum viable deploy (pitch 2026-04-22)

Only **Landing** is pitch-critical. Skip Studio + API if you're under time pressure:

```sh
cp .replit.deploy-landing .replit
# Click "Deploy" in Replit UI → Static → Confirm
```

Build output lands in `artifacts/landing/dist/`. Replit rebuilds from the build command; local dist is convenience, not auth. URL will be `<repl-name>.replit.app`. Point custom domain `biosync.studio` at it in Deployment → Domains.

## Secrets — all optional

None required for MOCK mode. If you want real data:

| Secret | App | What it unlocks |
|--------|-----|-----------------|
| `VITE_API_URL` | Landing + Studio | Point SPA at a deployed api-server instead of mock |
| `VITE_CALENDLY_URL` | Landing | Real Calendly link (there's a working default) |
| `VITE_SITE_URL` | Landing | Canonical URL for SEO/OG tags |
| `VITE_COUNTER_BASELINE` | Landing | Floor for the waitlist counter (default 25) |
| `DATABASE_URL` | API | Neon Postgres persistence (free 512MB ok) |
| `OPENAI_API_KEY` | API | Real LLM embeddings + completions (~$1–3/day) |
| `CORS_ORIGINS` | API | Allowlist of domains that can call the API |

Set these in **Deployment Secrets** (prod), not Workspace Secrets — they don't auto-carry between the two.

## What's already tested (don't re-run unless broken)

- `pnpm typecheck` — passes 2026-04-21.
- `pnpm --filter @workspace/landing build` — passes 2026-04-21 (258 KB JS, 82 KB gzip).
- Playwright E2E: Landing 4/4 + Studio 32/32 (last run Apr 20).

## Do NOT edit (copy is audited)

- `artifacts/landing/src/messages.ts` — bilingual copy, validated against `.research-synthesis.md` anti-overclaim rules.
- `artifacts/landing/src/lib/scoring.ts` — waitlist tier rubric.
- `artifacts/api-server/src/data/*.json` — curated RAG corpus + cache.
- `marketing/*.md` — pitch materials, version-locked for 2026-04-22.

## If a build fails — DO NOT iterate blindly

Most likely causes, in order:

1. **Missing `pnpm-lock.yaml`** — `pnpm install` once in the shell, re-deploy.
2. **Wrong Node version** — active `.replit` should declare `modules = ["nodejs-20"]`.
3. **Port binding** — api-server must listen on `process.env.PORT` and host `0.0.0.0` (already configured in `artifacts/api-server/src/server.ts`).
4. **SPA 404 on deep links** — `[[deployment.rewrites]]` block must be present (already in static drop-ins).
5. **Darwin-ARM64 optional deps** in `package.json` — pnpm gates by OS/CPU; safe to ignore on Linux.

## Files that matter for deploy

```
/replit.md                        — THIS FILE (Agent's first read)
/DEPLOY-QUICKSTART.md             — human 1-page guide
/.replit                          — DEV workspace config (don't deploy from this)
/.replit.deploy-landing           — drop-in for Landing static
/.replit.deploy-studio            — drop-in for Studio static
/.replit.deploy-api               — drop-in for API autoscale
/REPLIT-AGENT-HANDOFF.md          — Landing detailed handoff (legacy, still valid)
/DEPLOY.md                        — full architecture + env var matrix
/package.json                     — workspace root
/pnpm-workspace.yaml              — workspace definition
/artifacts/landing/               — Landing SPA
/artifacts/biosync-studio/        — Studio SPA
/artifacts/api-server/            — API server
```
