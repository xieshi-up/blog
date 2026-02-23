import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { renderMarkdownToHtml } from '@/lib/markdown';
import { getCloudflareContext } from '@opennextjs/cloudflare';

console.log('--- Worker Startup ---');
console.log('All env keys:', Object.keys(process.env));
console.log('DB key exists:', 'DB' in process.env);
console.log('DB value type:', typeof process.env.DB);

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

async function PostContent({ slug }: { slug: string }) {
  console.log('--- Inside PostContent ---');
  try {
    const ctx = getCloudflareContext();
    console.log('Context keys:', Object.keys(ctx));
    console.log('Env keys:', Object.keys(ctx.env));
    console.log('DB in ctx.env:', 'DB' in ctx.env);

    const { env } = ctx;
    const post = await getPostBySlug(env, slug);

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
  } catch (error) {
    console.error('Error in getCloudflareContext:', error);
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">上下文获取失败</h1>
        <p>错误信息：{error instanceof Error ? error.message : '未知错误'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  return <PostContent slug={slug} />;
}