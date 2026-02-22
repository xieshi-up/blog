import type { D1Database } from '@cloudflare/workers-types';

declare global {
  interface ProcessEnv {
    DB: D1Database;
  }

  var db: D1Database | undefined;
}

export function getDb(env: { DB: D1Database }) {
  if (globalThis.db) return globalThis.db;
  globalThis.db = env.DB;
  return globalThis.db;
}