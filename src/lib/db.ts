interface D1PreparedStatement {
  bind: (...params: unknown[]) => D1BoundStatement;
}

interface D1BoundStatement {
  all: <T = unknown>() => Promise<{ results: T[] }>;
}

export interface D1Database {
  prepare: (sql: string) => D1PreparedStatement;
}

declare global {
  var db: D1Database | undefined;
}

export function getDb(env: { DB: D1Database }) {
  if (globalThis.db) return globalThis.db;
  globalThis.db = env.DB;
  return globalThis.db;
}