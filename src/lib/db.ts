import { drizzle } from 'drizzle-orm/cloudflare-d1';
import type { D1Database } from '@cloudflare/workers-types';

declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

export const posts = {
  id: 'id',
  title: 'title',
  excerpt: 'excerpt',
  content: 'content',
  slug: 'slug',
  date: 'date',
};

export function getDb(env: { DB: D1Database }) {
  if (globalThis.db) return globalThis.db;
  globalThis.db = drizzle(env.DB);
  return globalThis.db;
}