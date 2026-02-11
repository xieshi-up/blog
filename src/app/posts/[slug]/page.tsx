import { getDb } from '@/lib/db';
import Link from 'next/link';
import { marked } from 'marked';

export async function generateStaticParams() {
  const db = getDb({ DB: process.env.DB as string });
  const allPosts = await db.prepare('SELECT slug FROM posts').all<{ slug: string }>();
  return allPosts.results.map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const db = getDb({ DB: process.env.DB as string });
  const post = await db.prepare(
    'SELECT * FROM posts WHERE slug = ?'
  ).bind(params.slug).all<{
    id: number;
    title: string;
    excerpt: string;
    content: string;
    slug: string;
    date: string;
  }>();

  if (!post.results.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const currentPost = post.results[0];
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