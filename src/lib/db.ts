export interface D1Database {
  prepare: (sql: string) => {
    bind: (...params: unknown[]) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
    };
  };
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
  
  var db: D1Database | undefined;
}

export function getDb(env: { DB: D1Database }) {
  if (globalThis.db) return globalThis.db;
  globalThis.db = env.DB;
  return globalThis.db;
}