import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { renderMarkdownToHtml } from '@/lib/markdown';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { Post } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: '文章详情',
    description: '阅读文章',
  };
}

async function getPostData(slug: string): Promise<{ post: Post | null; error: string | null }> {
  console.log('--- Inside getPostData ---');
  try {
    const ctx = getCloudflareContext();
    console.log('Full ctx object:', JSON.stringify(ctx, null, 2));
    console.log('ctx.env keys:', Object.keys(ctx.env));
    console.log('DB in ctx.env:', 'DB' in ctx.env);
    console.log('ctx.env.DB type:', typeof ctx.env.DB);

    const post = await getPostBySlug(ctx.env, slug);
    return { post, error: null };
  } catch (err) {
    console.error('Error in getPostData:', err);
    return { post: null, error: err instanceof Error ? err.message : '未知错误' };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const { post, error } = await getPostData(slug);

  if (error) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">数据库连接失败</h1>
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

  const htmlContent = await renderMarkdownToHtml(post.content);
  
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← 返回首页</Link>
      <article>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-500 mb-8">{post.date}</p>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </main>
  );
}