import { getDb } from '@/lib/db';
import Link from 'next/link';
import { marked } from 'marked';

export async function generateStaticParams() {
  try {
    const db = getDb({ DB: process.env.DB as string });
    const { results: allPosts } = await db.prepare('SELECT slug FROM posts').all();
    return allPosts.map((post: any) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const db = getDb({ DB: process.env.DB as string });
    const { results } = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(params.slug).all();

    if (!results.length) {
      return (
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
          <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
        </div>
      );
    }

    const currentPost = results[0];
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
  } catch (error) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">加载文章失败</h1>
        <p>错误信息：{error instanceof Error ? error.message : '未知错误'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }
}