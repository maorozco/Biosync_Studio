# BioSync Studio — Guía para Claude

## Qué es

SaaS de IA para **optimización de bioprocesos en biofabricación**. Democratiza herramientas que hoy sólo Pfizer/Novartis pueden usar ($500K+) al alcance de laboratorios pequeños y medianos desde **$99/mes**.

- **Tagline:** "El cerebro digital de la biofabricación"
- **Productos fabricables:** vitaminas (B12, B2), proteínas recombinantes, pigmentos (astaxantina), enzimas, bioplásticos (PHB), aromas/fragancias.
- **Stack IA:** Gradient Boosting + Physics-Informed Neural Network (PINN), aprendizaje federado para la Red de Bio-Conocimiento.
- **Estética:** "Mission Control" — dark mode (#06191A), teal/cian (#00E5CC), glassmorphism, 100% español.

## Avatar ideal (síntesis)

**PD Scientist / Fermentation Engineer** con MSc/PhD, 30–40 años, en lab de 2–15 FTEs, presupuesto software <$20K/año. Corre 2–8 biorreactores <20 L. Usa Excel + (JMP o MODDE pirateado). Pierde ~1/5 batches. El PI le pide scale-up para Series A en 9 meses.

**Dolor #1 emocional:** "6–18 meses de OFAT y aún no sé si escala" + "cada batch fallido son $500–5,000 que el founder me reclama".

**Ver:** `Proyectos_investigacion/Diferenciador_Unico_Estrategia.md` (baseline) + `docs/avatar/CLAUDE.md` (refinado con investigación web 2026).

## Pain points top 5

1. Muestreo manual 1/día — si algo muere a las 3am, se enteran 9am.
2. Optimización por OFAT 6–18 meses (cambio 1 variable/mes).
3. Cada corrida fallida $500–$5,000 en reactivos; batch industrial $1–2M.
4. Tribal knowledge en laptop de Juan — no se comparte entre labs ni se documenta.
5. Herramientas incumbentes arrancan en $50K/año (Benchling, Algocell, Sartorius SIMCA).

## Arquitectura (monorepo pnpm)

```
Biosync_Studio/
├── artifacts/
│   ├── biosync-studio/       # Frontend SaaS (React 19 + Vite + Wouter) — ver su CLAUDE.md
│   ├── api-server/           # Backend Express 5 + Drizzle — ver su CLAUDE.md
│   ├── landing/              # Landing bilingüe ES+EN + waitlist scored — ver su README.md
│   └── mockup-sandbox/       # Testbed adicional
├── lib/
│   ├── api-client-react/     # Hooks React generados desde OpenAPI
│   ├── api-spec/             # OpenAPI spec (Orval genera cliente + Zod)
│   ├── api-zod/              # Validadores Zod
│   └── db/                   # Drizzle schema
├── Proyectos_investigacion/  # Investigación previa (avatar, competidores, mercado) — ver su CLAUDE.md
├── docs/
│   ├── avatar/               # Avatar refinado post-research
│   ├── competitors/          # Landscape 2026
│   ├── oss-landscape/        # Repos OSS apalancables
│   ├── future/               # Tendencias 3–5 años
│   └── research/             # Reportes crudos de investigación multi-agente
├── marketing/                # Launch playbook 2026-04-22 — avatar, hooks, landing spec, video, waitlist, launch plan
├── .research-synthesis.md    # Síntesis interna del research pre-launch (≤1,500 palabras)
├── .research-external.md     # Agentes externos consolidados (22 quotes, stack ML, regulación)
├── REPLIT-AGENT-HANDOFF.md   # Step-by-step para deployear la landing a Replit
└── scripts/
```

## Comandos

```bash
# Instalar
pnpm install

# Frontend dev (requiere PORT + BASE_PATH env vars)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/biosync-studio dev

# Backend dev
pnpm --filter @workspace/api-server dev

# Landing dev (bilingüe ES+EN, mock mode si VITE_API_URL vacío)
PORT=3001 pnpm --filter @workspace/landing dev
pnpm --filter @workspace/landing build
pnpm --filter @workspace/landing typecheck
pnpm --filter @workspace/landing test:e2e  # Playwright E2E (ES+EN full signup → green tier)

# Typecheck todo
pnpm typecheck

# E2E Playwright
pnpm --filter @workspace/biosync-studio test:e2e
pnpm --filter @workspace/biosync-studio test:e2e:ui     # UI mode
pnpm --filter @workspace/biosync-studio test:e2e:report # ver HTML
```

## Páginas (5 rutas)

| Ruta | Página | Hace |
|------|--------|------|
| `/` | Inicio | Landing: hero, problema/solución, 6 productos, métricas, steps |
| `/dashboard` | Monitor | 4 KPIs en vivo, 5 charts Recharts, IA recommendations, sliders de setpoints |
| `/red` | Red de Bio-Conocimiento | 234 protocolos, filtros por categoría, aprendizaje federado |
| `/simulador` | Gemelo Digital | Organismo + producto → curvas Monod + costos estimados |
| `/asistente` | Chatbot | 6 preguntas sugeridas, respuestas keyword-based con refs científicas |

## Diferenciación (gap vs Siemens/Sartorius/Algocell)

Según `docs/competitors/CLAUDE.md`:
- **Pricing público** por reactor/mes (competidores son "contact sales")
- **Onboarding <1 semana** (competidores 6–12 meses)
- **LATAM-native**, bilingüe ES/EN, vertical en nutrientes
- **Federated biomanufacturing** (whitespace — competidores hacen federated drug discovery, no biofabricación)
- **Edge AI kit** (<$2K BOM viable con Jetson Orin 2026)

## Proyectos hermanos (capital semilla finalistas)

Manuela Orozco tiene **dos proyectos** en la misma competencia de capital semilla nacional (finalistas · pitch 2026-04-22 · slot 4 min + demo):

- **BioSync Studio** — este repo · biofabricación / precision fermentation / nutrientes + compuestos vitales.
- **Impulso BioCycle** — biorremediación · scaffolding en `Proyectos_investigacion/REPLIT_FINAL/` (Streamlit + Python + modelo ML), bundle paste-ready en `marketing/biocycle-replit-bundle.md`.

**Pitch finalista conecta ambos bajo una plataforma común:** *"misma IA al derecho (producir lo que importa) y al revés (degradar lo que sobra)"*. Los hooks emocionales (*4 niños/min por desnutrición · 450 años del plástico*) son **anclas, NO soluciones directas** — disclaim quirúrgico en `marketing/pitch-script-final.md`.

## Pitch finalista 2026-04-22

Material operacional en `marketing/pitch-*`:
- `pitch-script-final.md` — script literal 4 min, 3 actos, 8 slides
- `pitch-cheatsheet-fuentes.md` — 10 citas URL+DOI para Q&A
- `pitch-qa-cheatsheet.md` — 10 Q&A bombs + respuestas seguras (5 técnicas del audit + 5 operacionales)
- `biocycle-replit-bundle.md` — guía paste-ready para levantar BioCycle MVP en Replit

**Stones-in-shoes audit aplicado** a `landing/src/messages.ts`, `ADS-HOOKS.md`, `AI-ML-MOAT.md`: hedging en claims de `<60 min deriva` (caveat "sensores en tiempo real"), `Annex 22-ready` (draft jul 2025, regla final Q2 2026, NO "prohíbe mid-2026"), `<50 batches` (reformulado a "≥20 etiquetados + Bayesian opt debajo"), `playas in-situ` (reformulado a "biorreactores distribuidos + in-situ hidrocarburos").

Regla de voz Manu: humano · storytelling · genuino · transparente · conviction ("te prometo" · "tengo la seguridad"). Si una frase suena a VC deck, se reescribe. Ver `~/.claude/projects/.../memory/pitch_style_manu.md`.

## Marketing & Discovery (launch 2026-04-22)

Fundadora: **Manuela Orozco** (Ingeniera Biológica + Analytics Engineer, 5 años).
Launch: 4 días desde 2026-04-18. Deploy: Replit. Budget ads: $5–10/día.

Docs operacionales en `marketing/`:

| Doc | Qué contiene |
|---|---|
| `AVATAR-IDEAL.md` | ICP refinado — 2 personas (Daniela AR · Evan US) + anti-avatar + JTBD |
| `ADS-HOOKS.md` | 20 hooks EN+ES (5 ángulos × 4 variantes) + 3 formatos del ganador + 10 CTAs + frases prohibidas |
| `CUSTOMER-DISCOVERY-INTERVIEW.md` | 15 preguntas Mom-Test + señales 🟢🟡🔴 + encuesta 6 Qs |
| `AI-ML-MOAT.md` | Stack ML 2026 mapeado con TRL + comparación honesta vs Sartorius/Benchling/Aizon |
| `LANDING-PAGE-SPEC.md` | 10 secciones + copy ES+EN + reglas de tono + checklist |
| `WAITLIST-FORM.md` | 6 preguntas + rubrica scoring server-side + mensajes post-submit |
| `VIDEO-SCRIPT.md` | 75s + 30s EN+ES + direcciones de actuación + setup $30 |
| `LAUNCH-PLAN-4DAYS.md` | Embudo + KPIs + día por día T-4→T-0 + posts build-in-public |

Research crudo en `.research-synthesis.md` (destilación interna) y `.research-external.md` (4 agentes: OSS+SaaS gaps · 22 quotes avatar · stack ML · regulación).

## Testing

Playwright con 32 specs cubriendo las 5 rutas + interacciones (sliders, filtros, simulación, chatbot). Ver `artifacts/biosync-studio/tests/CLAUDE.md`.

## Regla de oro para cambios

1. Avatar + pain points son **la brújula** — cualquier feature nueva valida contra `docs/avatar/CLAUDE.md` y las 5 unmet needs del reporte.
2. Precios públicos y onboarding rápido son ventaja estructural — no los comprometas "por sofisticación".
3. Compliance: EMA Annex 22 (2026) prohíbe IA adaptativa/generativa en GMP. Si se añaden features ML, mantenerlas **deterministas/congelables** para seguir siendo certificables. Ver `docs/future/CLAUDE.md`.
