# Deploy Quickstart — BioSync · 1 page

> For the pitch 2026-04-22. Deploy the **Landing** only; it's the single pitch-critical asset. Studio + API can wait.
>
> **Design rule:** everything below is pre-tested. The Replit Agent should NOT need to iterate. If something fails, check the troubleshooting section — don't debug blindly (that burns tokens).

## The 4-step deploy (Landing · 5 minutes)

### 1. Import to Replit
Go to `replit.com/import` → paste the GitHub repo URL → "Create Repl".

### 2. Activate the Landing deploy config
In the Replit Shell of your new Repl, run:
```sh
cp .replit.deploy-landing .replit
```
This swaps the dev workspace config for a static-deploy config (build + publicDir + SPA rewrites pre-set).

### 3. (Optional) Set 1 secret
In Replit → **Tools → Secrets** → add `VITE_CALENDLY_URL` if you want a non-default Calendly link. Skip if the default is fine.

All other env vars are optional — the Landing runs in mock mode (localStorage waitlist) without any backend.

### 4. Click Deploy
Replit UI → **Deployments** tab → **Static** → Confirm. Wait 60–90 seconds. Replit gives you `<name>.replit.app`.

To use the custom domain, go to Deployment → **Domains** → Add `biosync.studio` → copy the CNAME/A records to your registrar.

**Done.** The Landing is live in ~5 min with zero code changes.

---

## Optional: deploy the other two apps (separate Repls)

Each app needs its own Repl (Replit limitation — one `[deployment]` block per `.replit`).

### Studio (product demo, static)
1. `replit.com/import` → same GitHub URL → new Repl.
2. `cp .replit.deploy-studio .replit`
3. Optional: `VITE_API_URL = https://<api-repl>.replit.app` (only if API is deployed).
4. Deploy → Static.

### API (backend, autoscale)
1. `replit.com/import` → same GitHub URL → new Repl.
2. `cp .replit.deploy-api .replit`
3. Optional secrets: `OPENAI_API_KEY`, `DATABASE_URL`, `CORS_ORIGINS`. All optional — mock mode works without them.
4. Deploy → Autoscale → min 0 instances (scale-to-zero, ~$0/mo at pitch traffic).

---

## What's pre-tested and locked in

- ✅ `pnpm typecheck` across the monorepo (2026-04-21).
- ✅ `pnpm --filter @workspace/landing build` — reproducible.
- ✅ Playwright E2E — Landing 4/4, Studio 32/32 (last run Apr 20).
- ✅ Mock mode default — no secrets required for working demo.
- ✅ Healthcheck endpoint on API (`GET /api/healthz`).
- ✅ SPA rewrites configured (no 404 on deep links).

## Troubleshooting (don't iterate blindly)

| Symptom | Fix |
|---|---|
| `ERR_PNPM_NO_LOCKFILE` | `pnpm install` once in the Repl shell, re-deploy. |
| Static deploy returns 404 on `/es` or `/en` | Check `[[deployment.rewrites]]` block is present in active `.replit`. |
| `window is not defined` | SSR is not used; check build type (should be static, not SSR). |
| API returns 503 at cold start | Normal for Autoscale first hit (2–3 s cold start). Re-ping healthcheck. |
| Build hangs on Darwin-ARM64 optional deps | They're platform-gated in pnpm; safe to ignore on Linux/Replit. |

## Rollback plan

If anything goes wrong during pitch:
- **Primary:** Landing deployed → visitors land on live site.
- **Fallback 1:** Local laptop + phone hotspot running `pnpm --filter @workspace/landing dev` at port 4300.
- **Fallback 2:** Static screenshots of Landing + live Studio demo on laptop.

## If you need more detail

- Architecture + cost matrix: `DEPLOY.md` (full reference, ~330 lines).
- Landing-specific troubleshooting: `REPLIT-AGENT-HANDOFF.md`.
- Context for the Agent: `replit.md`.
