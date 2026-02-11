import Link from 'next/link';
import { getDb } from '@/lib/db';

export default async function Home() {
  const db = getDb({ DB: process.env.DB as string });
  const allPosts = await db.prepare(
    'SELECT * FROM posts ORDER BY date DESC'
  ).all<{
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
  }>();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">xieshi-up 的独立博客</h1>
        <p className="text-gray-600">记录技术、分享思考</p>
      </header>

      <section className="space-y-8">
        {allPosts.results.map((post) => (
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