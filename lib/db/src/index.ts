import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

type Db = NodePgDatabase<typeof schema>;

let _pool: pg.Pool | null = null;
let _db: Db | null = null;

/**
 * Lazy-initializes the pg pool + drizzle db. Throws only when called without
 * `DATABASE_URL` — this lets mock-mode callers import from `@workspace/db`
 * without triggering an error at module load.
 */
export function getDb(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL must be set to use getDb(). Did you forget to provision a database, or did you call getDb() in mock mode?",
    );
  }
  _pool = new Pool({ connectionString: url });
  _db = drizzle(_pool, { schema });
  return _db;
}

export function getPool(): pg.Pool {
  getDb();
  return _pool!;
}

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "";
}

export * from "./schema";
