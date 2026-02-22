import type { D1Database } from '@cloudflare/workers-types';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const db = process.env.DB as D1Database;
    
    const { results } = await db
      .prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .all<Post>();
    
    return results[0] || null;
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error);
    return null;
  }
}