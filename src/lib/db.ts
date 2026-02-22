import type { D1Database } from '@cloudflare/workers-types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
}

let dbInstance: D1Database | undefined;

export function getDb(env: { DB: D1Database }) {
  if (!dbInstance) {
    dbInstance = env.DB;
  }
  return dbInstance;
}