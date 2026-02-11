import Link from 'next/link';
import { getDb } from '@/lib/db';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}

export default async function Home() {
  let allPosts: Post[] = [];
  let error: Error | null = null;

  try {
    const db = getDb({ DB: process.env.DB as any });
    const query = db.prepare('SELECT id, title, excerpt, slug, date FROM posts ORDER BY date DESC');
    const { results } = await query.bind().all();
    allPosts = results as unknown as Post[];
  } catch (err) {
    error = err instanceof Error ? err : new Error('未知错误');
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">数据库连接失败</h1>
        <p>错误信息：{error.message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">屑史的博客</h1>
        <p className="text-gray-600">记录技术、分享思考</p>
      </header>

      <section className="space-y-8">
        {allPosts.map((post) => (
          <article key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-700 mb-4">{post.excerpt}</p>
            <p className="text-gray-500 text-sm">{post.date}</p>
          </article>
        ))}
      </section>
    </main>
  );
}