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
    const db = process.env.DB as unknown as D1Database;
    const { results } = await db
      .prepare('SELECT slug FROM posts')
      .all<{ slug: string }>();
    
    if (results.length === 0) {
      return [{ slug: 'placeholder' }];
    }
    
    return results.map((post) => ({ slug: post.slug }));
  } catch {
    return [{ slug: 'placeholder' }];
  }
}

async function getPostData(slug: string): Promise<{ post: Post | null; error: string | null }> {
  const db = process.env.DB as unknown as D1Database;
  
  if (!db) {
    return { post: null, error: '数据库不可用' };
  }

  try {
    const { results } = await db
      .prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .all<Post>();
    
    if (!results.length) {
      return { post: null, error: null };
    }
    
    return { post: results[0], error: null };
  } catch (err) {
    return { post: null, error: err instanceof Error ? err.message : '未知错误' };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === 'placeholder') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">文章加载中</h1>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const { post, error } = await getPostData(slug);

  if (error) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">加载文章失败</h1>
        <p>错误信息：{error}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const htmlContent = await marked.parse(post.content);
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← 返回首页</Link>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-8">{post.date}</p>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}