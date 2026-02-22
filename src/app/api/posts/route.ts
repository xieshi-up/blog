import { NextResponse } from 'next/server';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = process.env.DB as unknown as D1Database;
    
    if (!db) {
      return NextResponse.json([]);
    }

    interface SlugRow {
      slug: string;
    }

    const { results } = await db
      .prepare('SELECT slug FROM posts')
      .all<SlugRow>();
    
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}