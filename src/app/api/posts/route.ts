import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getDb({ DB: process.env.DB });
    const { results } = await db.prepare('SELECT slug FROM posts').all();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}