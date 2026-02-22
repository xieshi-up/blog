import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export async function GET() {
  if (!process.env.DB) {
    return NextResponse.json([]);
  }

  try {
    const db = getDb({ DB: process.env.DB as unknown as D1Database });
    const { results } = await db.prepare('SELECT slug FROM posts').all();
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}