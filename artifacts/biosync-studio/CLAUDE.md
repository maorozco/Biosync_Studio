# Frontend: `@workspace/biosync-studio`

App React 19 + Vite 7 + TypeScript 5.9 — el SaaS público de BioSync Studio.

## Stack

- **UI:** React 19.1, Radix UI (40+ primitivas), Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Routing:** Wouter 3 (ligero, <3 KB)
- **State:** `useState` local + TanStack Query para data remota
- **Charts:** Recharts (LineChart, ReferenceLine, ReferenceArea)
- **Animaciones:** Framer Motion
- **Forms:** react-hook-form + @hookform/resolvers + Zod
- **Icons:** lucide-react + react-icons (múltiples familias)
- **Theming:** next-themes (dark por default)

## Rutas (`src/App.tsx`)

| Path | Componente | Archivo |
|------|-----------|---------|
| `/` | `Inicio` | `src/pages/Inicio.tsx` |
| `/dashboard` | `Dashboard` | `src/pages/Dashboard.tsx` |
| `/red` | `RedConocimiento` | `src/pages/RedConocimiento.tsx` |
| `/simulador` | `Simulador` | `src/pages/Simulador.tsx` |
| `/asistente` | `Asistente` | `src/pages/Asistente.tsx` |

`App.tsx` implementa Sidebar + TopBar + Router. Base path se toma de `import.meta.env.BASE_URL`.

## Vite config crítico (`vite.config.ts`)

**PORT y BASE_PATH son OBLIGATORIOS** — el config hace `throw` si faltan:

```bash
PORT=4310 BASE_PATH=/ pnpm dev
```

Puertos locales BioSync usan bloque 43xx (landing 4300 · studio 4310 · api 4320) para no colisionar con Next.js 3000 / Streamlit 5000 / Replit 8080.

- Alias: `@` → `src/`, `@assets` → `../../attached_assets`
- Build output: `dist/public/`
- Plugins Replit activos sólo si `NODE_ENV !== production` y `REPL_ID` existe.

## Convenciones de estilo

- **Dark theme "Mission Control":** fondo `#06191A`, sidebar `#0A2E2E`, accent teal `#00E5CC`, danger `#EF4444`, success `#10B981`.
- Usa **inline styles** mezclados con Tailwind — no hay un design system formalizado aún (oportunidad: extraer tokens a `tailwind.config` o CSS vars).
- Componentes Radix siempre usados con `className="ui-*"` y aria labels.
- Texto 100% en español.

## Generación de datos

- Dashboard y Simulador generan data sintética client-side (Math.random + cinética Monod aproximada).
- No hay backend todavía consumido desde estas páginas — data es mock.

## Testing E2E

Playwright instalado en este workspace. 32 specs en `tests/e2e/`. Ver `tests/CLAUDE.md`.

## Gotchas

- Simulador demora ~8s en mostrar resultados (phases con setTimeout). En tests usar timeout ≥ 20s.
- Dashboard tiene texto repetido ("pH", "Temperatura (°C)") en KPI cards, chart titles y slider labels — usar `.first()` o selectores más específicos en tests.
- Asistente es chatbot determinista keyword-based (no hay LLM real detrás) — las respuestas están hardcoded en `getResponse()` en `src/pages/Asistente.tsx`.

## Trabajo pendiente

- Integrar con `@workspace/api-client-react` (ya declarado como dep) para data real.
- Extraer design tokens (colores, spacing, typography) a un sistema centralizado.
- Añadir i18n si se quiere vender fuera de LATAM/ES — hoy todo el copy está hardcoded en español.
