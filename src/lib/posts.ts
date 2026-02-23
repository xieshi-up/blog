import type { D1Database } from '@cloudflare/workers-types';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
}

export async function getPostBySlug(env: { DB: D1Database }, slug: string): Promise<Post | null> {
  console.log('--- Inside getPostBySlug ---');
  console.log('Received env type:', typeof env);
  console.log('Received env keys:', Object.keys(env));
  console.log('Received DB type:', typeof env.DB);

  try {
    const db = env.DB;
    console.log('DB object available:', !!db);

    const { results } = await db
      .prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .all<Post>();
    
    return results[0] || null;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}