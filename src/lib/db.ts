declare global {
  var db: any;
}

export function getDb(env: { DB: any }) {
  if (globalThis.db) return globalThis.db;
  globalThis.db = env.DB;
  return globalThis.db;
}