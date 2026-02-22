import { getDb } from '@/lib/db';
import Link from 'next/link';
import { marked } from 'marked';
import type { D1Database } from '@cloudflare/workers-types';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
}

export async function generateStaticParams() {
  try {
    const db = getDb({ DB: process.env.DB as unknown as D1Database });
    const query = db.prepare('SELECT slug FROM posts');
    const { results } = await query.bind().all();
    return (results as unknown as { slug: string }[]).map(post => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let currentPost: Post | null = null;
  let error: Error | null = null;
  let notFound = false;

  try {
    const db = getDb({ DB: process.env.DB as unknown as D1Database });
    const query = db.prepare('SELECT * FROM posts WHERE slug = ?');
    const { results } = await query.bind(slug).all();
    
    if (!results.length) {
      notFound = true;
    } else {
      currentPost = results[0] as unknown as Post;
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error('未知错误');
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">加载文章失败</h1>
        <p>错误信息：{error.message}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

  if (notFound || !currentPost) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const htmlContent = await marked.parse(currentPost.content);
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← 返回首页</Link>
      <h1 className="text-3xl font-bold mb-2">{currentPost.title}</h1>
      <p className="text-gray-500 mb-8">{currentPost.date}</p>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}