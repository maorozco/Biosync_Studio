# Backend: `@workspace/api-server`

Servidor Express 5 + Drizzle ORM + Zod. Estado actual: **esqueleto**, sólo endpoint `/api/health` implementado.

## Stack

- **Runtime:** Node.js 24, ESM
- **HTTP:** Express 5 (última major, Promise-based middleware)
- **Logging:** pino + pino-http (producción), pino-pretty (dev)
- **ORM:** drizzle-orm (schema en `@workspace/db`)
- **Validación:** Zod (schemas en `@workspace/api-zod`)
- **CORS/cookies:** `cors`, `cookie-parser`
- **Build:** esbuild vía `build.mjs` → `dist/index.mjs` (single-file)

## Estructura

```
src/
├── app.ts            # Express app, middleware chain, mount de /api
├── index.ts          # Entry point — http.listen
├── lib/
│   └── logger.ts     # Pino instance compartido
├── middlewares/      # (vacío o en progreso)
└── routes/
    ├── index.ts      # Router raíz
    └── health.ts     # GET /api/health
```

## Middleware chain (orden en `app.ts`)

1. `pinoHttp` — logging estructurado
2. `cors()` — open (ajustar antes de prod)
3. `express.json()` + `express.urlencoded`
4. `router` montado en `/api`

## Scripts

```bash
pnpm dev        # esbuild build + node start con NODE_ENV=development
pnpm build      # bundle → dist/index.mjs
pnpm start      # --enable-source-maps dist/index.mjs
pnpm typecheck
```

## Pendiente para MVP real

- Endpoints de Red de Bio-Conocimiento (CRUD de protocolos).
- Endpoint de simulación que delegue a un worker (ahora el cómputo Monod está en el front).
- Auth — no hay middleware de sesiones ni JWT.
- Persistencia — `@workspace/db` está definido pero no hay migraciones visibles; Drizzle apunta a PostgreSQL según `replit.md`.
- Rate limiting y CSRF protection antes de exponer público.

## Gotchas

- `esbuild-plugin-pino` + `thread-stream` están fijados a versiones específicas por compatibilidad con bundling de pino transports. No actualizar sin verificar.
- `export NODE_ENV=development` es bash-specific en `pnpm dev` — en zsh/fish funciona por ejecutarse con `sh -c`.
