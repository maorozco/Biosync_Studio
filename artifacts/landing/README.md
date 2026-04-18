# @workspace/landing

BioSync Studio — bilingual landing page (ES + EN) with scored waitlist.
Part of the `Biosync_Studio` pnpm monorepo.

## Stack

- **Vite 7** + **React 19** + **TypeScript strict**
- **Tailwind v4** (CSS-first via `@tailwindcss/vite`)
- **Wouter** for routing
- **Zod** for validation (imported on-demand)
- **Lucide-react** for icons
- **Mock mode** built-in (no backend required to demo the UI)

## Quickstart

```bash
# From repo root
pnpm install
PORT=3001 pnpm --filter @workspace/landing dev
# open http://localhost:3001 — redirects to /es by default
```

Build for production:

```bash
pnpm --filter @workspace/landing build
pnpm --filter @workspace/landing preview
```

Typecheck only:

```bash
pnpm --filter @workspace/landing typecheck
```

## Environment

Copy `.env.example` → `.env.local` and fill in as needed. **Empty = mock
mode**; waitlist submissions are simulated and persisted in
`localStorage`.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL. Unset → mock mode. |
| `VITE_SITE_URL` | Canonical URL for SEO / OG. |
| `VITE_CALENDLY_URL` | Manuela's Calendly for 🟢 tier post-submit. |
| `VITE_COUNTER_BASELINE` | `Math.max(realCount, baseline)` floor. |
| `VITE_PLAUSIBLE_DOMAIN` | Optional analytics. |

## Routes

| Path | What it renders |
|---|---|
| `/` | Redirect to `/es` (or `/en` based on `navigator.language`) |
| `/es` / `/es/` | Landing (Spanish) |
| `/en` / `/en/` | Landing (English) |
| `/es/gracias?email=…` | Post-signup form (6 questions, ES) |
| `/en/thank-you?email=…` | Post-signup form (6 questions, EN) |

## Source of truth

- **Copy** → `marketing/LANDING-PAGE-SPEC.md` + `src/messages.ts`
- **Scoring rubric** → `marketing/WAITLIST-FORM.md` §3 + `src/lib/scoring.ts`
- **Anti-overclaim (banned phrases)** → `.research-synthesis.md` §6
- **Stack honesty (TRL)** → `marketing/AI-ML-MOAT.md`

If you add copy, edit `src/messages.ts` (both `es` and `en`). Keep
messages as **strings with `{token}` placeholders**. Never functions.

## Mock mode details

`src/lib/api.ts` exports `isMockMode = !VITE_API_URL`. When true:
- `signupToWaitlist` writes to `localStorage` and returns `{ok, count}`.
- `submitWaitlistResponses` computes scoring locally and returns tier.
- `fetchWaitlistCount` reads from `localStorage`, floored at baseline.

This lets anyone (including designers, non-dev founders) run `pnpm dev`
and submit the form without spinning up a DB.

In production (API wired), the server **re-runs scoring server-side**
using the same rubric — clients cannot forge their tier.

## Pending humans before launch

- [ ] Real founder photo at Founder section (currently placeholder div).
- [ ] `/es/privacidad`, `/es/terminos`, `/en/privacy`, `/en/terms` pages.
- [ ] `hola@biosync.studio` + `hello@biosync.studio` email forwards verified.
- [ ] `VITE_CALENDLY_URL` pointing to a real slot calendar.
- [ ] OG image asset `/og.png` (1200×630) — currently referenced but not bundled.
- [ ] LinkedIn URL in footer — current `/in/manuela-orozco` is a placeholder.

## Next

See `REPLIT-AGENT-HANDOFF.md` at repo root for production deploy steps.
