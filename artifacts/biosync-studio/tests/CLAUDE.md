# Tests E2E — Playwright

Suite de 32 specs cubriendo las 5 rutas de BioSync Studio + smoke navegacional.

## Cómo correr

```bash
# Desde el root del repo
pnpm --filter @workspace/biosync-studio test:e2e

# Modo UI interactivo (debugging)
pnpm --filter @workspace/biosync-studio test:e2e:ui

# Abrir reporte HTML del último run
pnpm --filter @workspace/biosync-studio test:e2e:report

# Filtrar por spec
cd artifacts/biosync-studio && pnpm test:e2e dashboard
```

El `webServer` de Playwright levanta Vite automáticamente con `PORT=4173` y `BASE_PATH=/`. No necesitas arrancar `pnpm dev` aparte.

## Archivos

```
tests/e2e/
├── home.spec.ts        # / — hero, categorías, métricas, CTA
├── dashboard.spec.ts   # /dashboard — KPIs, charts, sliders, IA panel
├── red.spec.ts         # /red — protocolos, filtros, buscador, expander
├── simulador.spec.ts   # /simulador — config, simulación, resultados
├── asistente.spec.ts   # /asistente — suggestions, chatbot, refs científicas
└── smoke.spec.ts       # 5 rutas cargan + sidebar navega
```

## Config (`playwright.config.ts`)

- Browser: `chromium` únicamente (MVP).
- Viewport: `1440×900` (desktop-first — la app responde, pero tests pasan en desktop).
- Timeout test: 60s, expect: 10s.
- Retries: 0 local, 2 en CI.
- Reporters: `list` + `html` (no auto-abre).
- Trace: `on-first-retry` (para diagnosticar flakes).
- Video: `retain-on-failure`.

## Patrones de selectores

**Preferir (orden):**
1. `getByRole("heading", { name: /regex/i })` — más robusto
2. `getByRole("button", { name: "X" })` — para CTAs
3. `getByPlaceholder(/Buscar/i)` — para inputs con placeholder
4. `getByText(/X/i)` — última opción

**Evitar:** selectores CSS acoplados a clases Tailwind (`.text-xl`, `.bg-teal-500`) — cambian con refactors.

## Gotchas encontrados

- **Texto repetido:** "pH", "Temperatura (°C)" aparecen en KPIs **y** chart titles **y** slider labels. Usar `.first()` o contar SVGs con `.recharts-surface`.
- **Icon + text:** el panel IA del dashboard renderiza `"⚠️ ALERTA"` (icono + espacio + tipo), no `"ALERTA"` solo. Usar regex `/ALERTA/` en vez de `exact: true`.
- **Simulador lento:** las 5 fases suman ~8s + delay aleatorio. Test de simulación usa `test.setTimeout(30_000)` y `toBeVisible({ timeout: 20_000 })`.
- **Asistente chatbot:** respuestas simuladas tardan `600–1400ms` (setTimeout con Math.random). Usar `{ timeout: 5_000 }` es suficiente.
- **Errores de consola ignorables:** filtrar `favicon|replit|cartographer` en smoke — vienen de plugins Replit en dev.

## Escribir un spec nuevo

1. Lee el componente (`src/pages/*.tsx`) para entender estructura.
2. Empieza por el heading (`getByRole("heading", { name: /.../ })`) — establece que la página cargó.
3. Verifica contenido estático (labels, botones clave).
4. Verifica una interacción (click + nuevo estado visible).
5. Corre `pnpm test:e2e tu-spec --ui` mientras escribes.

## CI (propuesto)

No hay workflow activo todavía. Sugerido:
```yaml
- pnpm install --frozen-lockfile
- pnpm --filter @workspace/biosync-studio exec playwright install chromium --with-deps
- pnpm --filter @workspace/biosync-studio test:e2e
```
Env vars `PORT=4173 BASE_PATH=/` ya están en `playwright.config.ts:webServer.env` — no necesitas exportarlas en CI.
