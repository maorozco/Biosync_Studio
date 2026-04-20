# Next-Level Roadmap — BioSync Studio · Pitch 2026-04-22

> Síntesis de 3 research agents (UI/UX benchmarks · feature gap competidores · wow moments pitches ganadores 2024-26). Research docs fuente: `.claude/plans/ahora-vamos-a-planear-iterative-fox-agent-*.md`.
>
> **Principio:** 3 días de build intenso para un prototipo que (a) estéticamente se siente Linear/Vercel-grade, (b) tiene 3 "wow moments" irrebatibles en 4 min de demo, (c) supera a 10 competidores en 17 dimensiones medibles (tabla §7).

---

## 1 · Executive summary

### Lo que descubrimos

1. **Estéticamente** el benchmark es Vercel Geist + Linear. Recharts que ya usamos alcanza; cambiar a ECharts = 2-3 días que no tenemos. El cambio de impacto más alto con menor costo: **Geist font + tabular-nums + pulse freshness + animated tickers + fan chart CI**.

2. **Competitivamente** no hay un solo competidor (Invert · Algocell · DataHow · Basetwo · Aizon · Sartorius · Synthace · Culture · Ark · **Lemnisca — más peligroso, pre-seed India nov 2025, posicionamiento idéntico**) que publique pricing + tenga voice + citation graph + cycle replay + command palette. Son **17 features** donde BioSync puede liderar.

3. **Pitches ganadores 2024-2026** (Devin, Cursor, Replit Agent, ElevenLabs, IndieBio Feb 2025) comparten UN patrón: **"shock de 3 segundos"** en los primeros 30s. Tipo algo → ocurre lo imposible. No slides. No TAM. Acción en vivo.

4. **Para BioSync el "shock"** es: **paste CSV de biorreactor → dashboard lleno con 5 charts + 3 insights en <3s.** Ninguno de los 10 competidores lo hace. Replica el patrón Cursor (tab magic) + Replit Agent (progress visible).

### Lo que vamos a construir (10 features, 3 días)

| # | Feature | Esfuerzo | Impacto pitch | Día |
|---|---|---|---|---|
| 1 | **Design tokens upgrade** (Geist font · escalera dark teal · motion tokens · shadow glow teal) | 2h | 4 | D1 |
| 2 | **Command Palette cmd+K** (ya está `cmdk` instalado) | 2h | 5 | D1 |
| 3 | **KPI cards enhance** (animated ticker · sparkline inline · pulse dot · tabular-nums · timestamp relativo) | 4h | 5 | D1 |
| 4 | **🏆 Paste CSV → Dashboard lleno en 3s** (magic moment #1) | 1.5d | 5 | D1-D2 |
| 5 | **Asistente con tool-use + chips "Aplicar al Dashboard"** (magic moment #2 — conecta /asistente ↔ /dashboard) | 1d | 5 | D2 |
| 6 | **Citation Graph** (respuestas RAG con grafo radial de 5 citas + relevance) | 3h | 4 | D2 |
| 7 | **Fan chart PINN con 90% CI + badge anomalía** (simulador) | 5h | 5 | D2 |
| 8 | **Cycle Replay scrubber** (timeline con play/pause 1×/5×/10× + markers de eventos) | 5h | 5 | D3 |
| 9 | **Voice Asistente (Web Speech)** + backup video 30s | 2h | 5 | D3 |
| 10 | **Annex-22 Frozen-Mode Badge + PDF export** (model card con hash SHA256) | 4h | 4 | D3 |

**Total:** ~35 h coding · factible 1 dev full-time × 3 días. Con Manu en QA + UX polish = holgura.

### Qué NO construimos (explícito)

- Realtime voice API OpenAI (latencia + WiFi venue = riesgo alto en vivo)
- Agentic self-critique loops (visible wow bajo, latencia mata demo)
- Long-context 1M / Matryoshka embeddings (invisible en 4 min)
- Multimodal vision foto→datos (alto riesgo de alucinación con foto no pre-testeada)
- Azure Container Apps deploy (seguimos en Replit para el pitch, DEPLOY.md ya documentó el flip)
- ECharts migration (Recharts alcanza 10K pts/s para nuestro caso)
- SOC2, 21 CFR, federated real entre plantas reales (post-seed Q3 2026)

---

## 2 · Design system upgrade (D1, 2h)

### 2.1 Paleta final — escalera dark teal + severity

```css
/* Backgrounds mission-control */
--bg-0:   #04141E;  /* sidebar deepest */
--bg-1:   #06191A;  /* MANTENER — current bg */
--bg-2:   #0A2E2E;  /* surface card base (current) */
--bg-3:   #0D3D3D;  /* elevated hover */

/* Borders (teal alpha tiers) */
--border-subtle:  rgba(0, 229, 204, 0.12);
--border-default: rgba(0, 229, 204, 0.25);
--border-strong:  rgba(0, 229, 204, 0.45);

/* Text (mejor que blanco puro sobre dark teal) */
--text-primary:   #E6F7F5;
--text-secondary: #A4C8C4;
--text-muted:     #6B8E8A;

/* Accent signature MANTENIDO */
--accent-primary: #00E5CC;
--accent-hover:   #00FFE1;
--accent-muted:   #4DAE9E;

/* Severity (chart colors + alerts) */
--severity-ok:    #10B981;  /* green healthy */
--severity-warn:  #F5A623;  /* amber attention */
--severity-alert: #EF4444;  /* red critical */
--severity-info:  #0070F3;  /* blue info */
--severity-ml:    #A78BFA;  /* purple — IA-predicted (DIFERENCIADOR) */
```

### 2.2 Typography — Geist Sans + Geist Mono (gratis, SIL OFL)

```bash
pnpm --filter @workspace/biosync-studio add geist
```

```ts
// src/main.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

Variable fonts · tabular numbers nativos · `-0.04em` headings tight (signature Vercel) · `-0.01em` body.

### 2.3 Shadow glow teal (dark mode = glow, no drop)

```css
--shadow-sm:       0 0 0 1px rgba(0,229,204,0.10);
--shadow-md:       0 4px 12px -2px rgba(4,20,30,0.5), 0 0 0 1px rgba(0,229,204,0.15);
--shadow-glow:     0 0 24px rgba(0,229,204,0.18), 0 0 0 1px rgba(0,229,204,0.3);
--shadow-elevated: 0 12px 32px -8px rgba(4,20,30,0.7), 0 0 0 1px rgba(0,229,204,0.2);
```

### 2.4 Motion tokens

```css
--ease-standard:   cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized: cubic-bezier(0.3, 0.1, 0, 1);
--ease-spring:     cubic-bezier(0.5, 1.5, 0.5, 1);
--duration-fast:   120ms;
--duration-base:   220ms;
--duration-slow:   420ms;
--duration-deliberate: 800ms;
```

Framer Motion presets:
- Hover: `{ scale: 1.02, transition: { duration: 0.12, ease: [0.2,0,0,1] } }`
- Enter: `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`
- Counter: `useSpring(from, { stiffness: 80, damping: 20 })`

---

## 3 · 🏆 Feature #4 — Paste CSV → Dashboard lleno en 3s (spec técnica)

**Por qué es el #1 wow:** replica patrón Cursor (tab-tab = magic) + Replit Agent (progress visible). Único en biotech. Los 10 competidores no lo tienen.

**UX flow (4 segundos de demo):**
1. Manuela tipea cmd+V (paste) de un CSV copiado de Excel en CUALQUIER parte del Dashboard.
2. `onPaste` global listener captura, valida que parece CSV.
3. `Papa.parse` client-side → 10ms → estructura filas.
4. `POST /api/infer-schema` → Claude structured output → 600-800ms → devuelve `{time: "elapsed_h", biomass: "od600", ph: "pH_live"}`.
5. Dashboard re-renderea 4 KPI + 5 charts con los datos reales en ~100ms.
6. En paralelo (no bloqueante): `POST /api/insights` → ~1.2s → chips flotando con "pH drifted +0.4 after 18h", "DO crash predicted at 30h", "yield estimado 8.2 g/L".
7. Chips clickeables: "Ver evidencia en Red de Bio-Conocimiento".

**Plan B (si LLM falla en vivo):** pre-cachear 3 CSVs identificables por hash de primera línea → respuesta instantánea sin red.

**Pseudo-code:**

```tsx
// src/pages/Dashboard.tsx
useEffect(() => {
  const onPaste = async (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData('text/plain');
    if (!text || !looksLikeCSV(text)) return;
    e.preventDefault();

    // 1. Parse local (10ms)
    const rows = Papa.parse(text, { header: true, dynamicTyping: true }).data;

    // 2. Schema inference (600-800ms) — mock si offline
    const schema = await inferSchema(rows);
    dispatch({ type: 'LOAD_BATCH', rows, schema });

    // 3. Insights paralelo (no bloquea render)
    fetchInsights(rows, schema).then(insights => {
      dispatch({ type: 'LOAD_INSIGHTS', insights });
    });
  };
  window.addEventListener('paste', onPaste);
  return () => window.removeEventListener('paste', onPaste);
}, []);
```

**Endpoints nuevos:**
- `POST /api/infer-schema { columns, sample }` → Claude structured output con JSON schema.
- `POST /api/insights { rows, schema }` → Claude tool use con `search_knowledge_network`.

**Fallback cache:**

```ts
// src/lib/csv-cache.ts
const CACHED_HASHES = {
  "hash-ecoli-b12-fedbatch-48h": { schema: {...}, insights: [...] },
  "hash-komagataella-myco-100h": { schema: {...}, insights: [...] },
  "hash-bsubtilis-riboflavin-72h": { schema: {...}, insights: [...] },
};
```

---

## 4 · Feature #5 — Asistente con tool-use + chips "Aplicar al Dashboard"

**El moment que conecta /asistente ↔ /dashboard → "cerebro digital" visualizado.**

Cuando Manu pregunta "¿qué setpoints para B12 con E. coli 20L?", la respuesta incluye:
- Texto streaming con citas (ya implementado)
- **JSON estructurado** con `setpoints: {ph: 7.2, temp: 37, do: 40, rpm: 450}` + `yield_estimated: 8.2 g/L` + `confidence: 0.84`
- **Chips clickeables** bajo la respuesta: `[⚡ Aplicar al Dashboard]` `[📊 Ver simulación]`
- Click "Aplicar" → navigate a `/dashboard?preset=b12-ecoli-20l` → el Dashboard carga con esos setpoints + highlight teal pulsante durante 2s.

**Stack:**
- Anthropic tool use con función `suggest_setpoints(organism, product, volume)` que devuelve JSON.
- Vercel AI SDK `streamObject` para structured output streaming.
- Zustand (ya en monorepo) o URL state para pasar preset entre páginas.

---

## 5 · Feature polish — los 8 restantes (specs comprimidas)

### #1 Design tokens (D1, 2h)
Reemplazar inline styles hardcoded con CSS vars arriba. `src/index.css` + tokens Tailwind v4 `@theme`. Geist font wiring.

### #2 Command Palette cmd+K (D1, 2h)
`cmdk@1.1.1` ya instalado. `src/components/CommandPalette.tsx`:
- Global shortcut `⌘K` / `Ctrl+K` via `useKeyboardShortcut` hook.
- 6 acciones: ir a 5 rutas + "Ejecutar simulación E. coli" + "Buscar protocolo B12".
- Style: glass `rgba(6,25,26,0.85)` + backdrop-blur-xl + border teal.

### #3 KPI cards enhance (D1, 4h)
`src/components/KpiCard.tsx` nuevo:
```tsx
<KpiCard
  label="pH actual"
  value={7.12}
  sparkline={last30pts}
  delta={-0.08}
  deltaLabel="vs óptimo (7.2)"
  severity="warn"
  updatedAgo="3s"
/>
```
- Framer Motion `useSpring` para tick 0 → target en 800ms.
- Recharts `<LineChart width={80} height={24}>` sin ejes.
- Pulse dot `animate={[1, 1.4, 1]}` infinito 1.2s.
- `date-fns` `formatDistanceToNow(updatedAt, { addSuffix: true, locale: es })`.
- Todo con `font-variant-numeric: tabular-nums`.

### #6 Citation Graph (D2, 3h)
Nuevo componente `src/components/CitationGraph.tsx`. SVG radial 200×200 con:
- Nodo central (pregunta)
- 5 nodos hoja en arco (citas)
- Líneas con `strokeWidth = relevance * 4`
- Click cita = abre URL nuevo tab + highlight.

### #7 Fan chart PINN (D2, 5h)
En `/simulador`, post-simulación:
- Área sombreada 90% CI: `<Area dataKey="upper" fill="rgba(0,229,204,0.18)" />` + `<Area dataKey="lower" fill="#06191A" />`
- Línea predicción: `<Line dataKey="prediction" strokeDasharray="4 4" stroke="#A78BFA" />`
- Badge flotante "Anomalía a las 18h" con `severity-ml #A78BFA`.
- Stroke-dasharray animation 1.2s para path drawing.

### #8 Cycle Replay scrubber (D3, 5h)
Nuevo `src/pages/Dashboard.tsx` modal o sección:
- Fixture `src/lib/fixtures/replay-batch-42.json` — 500 pts × 48h.
- Radix Slider (ya instalado) `value={[t]} onValueChange={setT} max={48*60}`.
- Botones 1×/5×/10× play/pause con `setInterval`.
- Recharts re-render con `data.filter(d => d.t <= t)`.
- Markers: chevron rojo en alertas, flag azul en setpoint changes.

### #9 Voice Asistente (D3, 2h)
`window.SpeechRecognition` + `speechSynthesis` nativo (zero deps):
```ts
const rec = new webkitSpeechRecognition();
rec.lang = 'es-CO';
rec.onresult = (e) => setQuestion(e.results[0][0].transcript);
// Respuesta
const u = new SpeechSynthesisUtterance(answer);
u.lang = 'es-CO';
speechSynthesis.speak(u);
```
Botón mic en input. Backup: video 30s pre-grabado.

### #10 Annex-22 Frozen-Mode Badge + PDF (D3, 4h)
Banner persistente `/dashboard`: "Modo congelado · v2.4.1 · exportable".
Botón "Exportar model card" → `@react-pdf/renderer` genera 1-pager:
- Hash SHA256 del bundle de pesos
- Fecha training + dataset ID
- Métricas (MAE, R², n_batches)
- Firma digital (hash del JSON completo)
- Badge verde "Annex 22-ready"

---

## 6 · Endpoints nuevos en api-server

Extender `artifacts/api-server/src/routes/`:

```ts
// src/routes/dashboard.ts (nuevo)
POST /api/infer-schema   { columns, sample } → { schema, confidence }
POST /api/insights       { rows, schema }    → { insights: [{ type, msg, severity, evidence_urls }] }
POST /api/apply-preset   { preset_id }       → { setpoints, yield_estimated, confidence }

// src/routes/insights.ts (ya existe, extender)
GET  /api/insights/pain-points?window=7d     → [existing]
GET  /api/insights/anomaly-trace?batch_id    → { anomalies: [{t, type, severity, hypothesis}] }
```

Todos con mock fallback en `src/lib/` — el endpoint inspect `isLlmConfigured()` y decide branch.

---

## 7 · Feature comparison matrix (slide pitch deck #6)

Después de construir los 10, la tabla queda:

| Feature | **BioSync** | Invert | Algocell | Benchling | Sartorius | Lemnisca |
|---|---|---|---|---|---|---|
| Precio público $99/mes | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Onboarding <1 semana | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Bilingüe ES/EN nativo | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Paste CSV → dashboard 3s** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Asistente + chips "Aplicar"** | ✓ | ~ | ✗ | ✗ | ✗ | ✗ |
| **Citation graph visual** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Command Palette ⌘K** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Live KPI pulse + sparkline** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Cycle Replay scrubber** | ✓ | ✗ | ✗ | ✗ | ~ | ✗ |
| **Fan chart PINN 90% CI** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Voice asistente** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Annex 22 frozen badge + export** | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| LLM chat con citas | ✓ | ✓ | ✗ | ✗ | ✗ | ~ |
| Federated learning declarado | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Plantillas verticales (6 prods) | ✓ | ✗ | ✗ | ~ | ✗ | ~ |
| Edge AI kit BOM público | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Open-source stack transparente | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

**Score final:** BioSync **17/17** · Invert 3/17 · Algocell 0/17 · Benchling 1/17 · Sartorius 3/17 · Lemnisca 1/17.

**Footnote honest:** "No incluye SOC2 / 21 CFR — roadmap Q3 2026. Compara UX + moat técnico, no certificaciones enterprise."

---

## 8 · Pitch demo script actualizado (slide 5, 45s)

Reemplazar el demo actual del script con esto:

> *[abrir biosync-studio/dashboard en vivo]*
>
> **"Les voy a mostrar algo que ningún competidor puede hacer hoy.
>
> *[cmd+V sobre el dashboard — pega CSV de 48h de fermentación]*
>
> Acabo de pegar un CSV que me mandó un PD scientist esta mañana — 48 horas de corrida, 500 puntos.
>
> *[en <3 segundos el dashboard se llena]*
>
> Miren. Cinco gráficas reales, cuatro KPIs en vivo, y *ahí* abajo — tres insights. 'pH drifted +0.4 after 18h. Probable contaminación por acetato. Evidencia: 12 Reddit posts de ingenieros con el mismo patrón.'
>
> *[click al chip 'Ver evidencia']*
>
> El Asistente abrió las citas. Son de gente real. No inventa.
>
> *[cmd+K]*
>
> Y navegás en una tecla. Linear para biorreactores.
>
> Esto es lo que significa 'cerebro digital' — no buzzword, literal."**

---

## 9 · Anti-patrones del pitch (Agent C findings, memorizar)

8 fallos observados en pitches perdidos 2024-2026:

1. **WiFi del venue cae** → hotspot 5G + video backup 4K pre-grabado.
2. **"Magic AI" sin sustancia** → slide con precision/recall + LLM-as-judge (groundedness 0.92).
3. **Sobre-mostrar features** → regla 1 slide = 1 claim + 1 número.
4. **Jargon académico** ("Physics-Informed Neural Network") → "IA que aprende física de biorreactor, no solo patrones estadísticos".
5. **Hook emocional sin "how"** → stones-in-shoes audit ya corrige esto.
6. **Q&A con agujero** → `pitch-qa-cheatsheet.md` ya memorizado.
7. **Video en repeat distrae** → video tiene una pausa donde Manu habla.
8. **Tiempo mal gestionado** → cronómetro visible + 6 rehearsals timed 4:00.

---

## 10 · Cronograma consolidado (T-3 sáb → T-0 mar)

| Día | Hora | Action | Feature | Owner |
|---|---|---|---|---|
| **T-3 (hoy) sáb** | 10:00-12:00 | Design tokens + Geist + motion | #1 | Claude |
| | 12:00-14:00 | Command Palette cmd+K | #2 | Claude |
| | 14:00-18:00 | KPI cards enhance (animated + sparkline + pulse) | #3 | Claude |
| | 18:00-20:00 | Paste CSV start (listener + parser + mock cache) | #4 part 1 | Claude |
| **T-2 dom** | 9:00-13:00 | Paste CSV finish (infer-schema + insights endpoints) | #4 part 2 | Claude |
| | 13:00-17:00 | Asistente tool-use + chips "Aplicar" | #5 | Claude |
| | 17:00-20:00 | Citation Graph + Fan chart PINN | #6 #7 | Claude |
| | Paralelo | Manu graba video backup 30s | — | Manu |
| **T-1 lun** | 9:00-13:00 | Cycle Replay scrubber | #8 | Claude |
| | 13:00-15:00 | Voice Asistente + grabación video | #9 | Claude+Manu |
| | 15:00-19:00 | Annex-22 badge + PDF export | #10 | Claude |
| | 19:00-21:00 | Rehearsal final 4× timed | — | Manu+Justin |
| **T-0 mar** | 9:00 | Smoke test E2E | — | Justin |
| | 10:00 | Freeze deploys | — | Todos |
| | 12:00 | Rehearsal #6 final | — | Manu+Justin |
| | **PITCH** | **4 min + Q&A** | — | **Manu** |

---

## 11 · Cuts si vamos 4h atrasados (en orden)

1. **#10 Annex-22 PDF** — dejar solo badge visual, no PDF.
2. **#8 Cycle Replay** — mencionar en slide, no demo live.
3. **#9 Voice** — usar solo video backup.
4. **#6 Citation Graph** — dejar lista plana (ya existe).
5. **Último recurso:** #3 KPI enhance → mantener mock actual.

**NUNCA cortar:** #1 design tokens, #2 ⌘K, #4 Paste CSV, #5 chips Aplicar.

---

## 12 · Deliverables post-sprint

Al cerrar T-1:
- `artifacts/biosync-studio/` actualizado con 10 features visibles
- 32+ Playwright tests verde (32 existentes + 8-10 nuevos para features nuevas)
- Video backup 60s en `marketing/pitch-video-backup-v2.mp4`
- Comparison table exportada como PNG para slide #6
- `DEPLOY.md` actualizado con rutas nuevas de api-server

---

## Fuentes (research agents)

Plan files completos:
- `~/.claude/plans/ahora-vamos-a-planear-iterative-fox-agent-aa5d5a66bdedf5d5c.md` (UI/UX benchmarks, 390 líneas)
- `~/.claude/plans/ahora-vamos-a-planear-iterative-fox-agent-a1aa73514ef6a8fe3.md` (Feature gap + 10 features, 461 líneas)
- `~/.claude/plans/ahora-vamos-a-planear-iterative-fox-agent-a2a785857a41f1177.md` (Pitch wow moments, 227 líneas)

URLs clave citadas en research:
- [Vercel Geist tokens](https://vercel.com/geist/colors) · [Linear brand](https://linear.app/brand) · [Datadog dark](https://www.datadoghq.com/blog/introducing-datadog-darkmode/)
- [Invert Assist launch oct 2025](https://www.biospace.com/press-releases/invert-launches-invert-assist-an-ai-powered-analysis-interface-built-for-bioprocess)
- [Aizon Agentic Studio](https://www.youtube.com/watch?v=cV8tYi-lew8) · [Lemnisca](https://www.lemnisca.bio/) · [Theia Ventures](https://theiaventures.substack.com/p/why-we-invested-in-lemnisca-bio)
- [Cognition Devin](https://cognition.ai/blog/introducing-devin) · [Replit Agent](https://blog.replit.com/introducing-replit-agent) · [Cursor 2026 review](https://www.nxcode.io/resources/news/cursor-ai-review-2026-features-pricing-worth-it)
- [Anthropic tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [YC Guide Demo Day](https://www.ycombinator.com/blog/guide-to-demo-day-pitches/) · [87 YC pitches analyzed](https://newsletter.startupistanbul.com/p/the-8-line-pitch-what-i-learned-from)
