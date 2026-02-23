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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  console.log('========== FINAL DIAGNOSTIC ==========');
  let env;
  try {
    const ctx = getCloudflareContext();
    console.log('1. Full ctx object:', JSON.stringify(ctx, null, 2));
    console.log('2. ctx keys:', Object.keys(ctx));
    
    env = ctx.env;
    console.log('3. env object:', JSON.stringify(env, null, 2));
    console.log('4. env keys:', Object.keys(env));
    console.log('5. DB in env:', 'DB' in env);
    console.log('6. env.DB type:', typeof env.DB);
    console.log('7. env.DB value:', env.DB);

  } catch (error) {
    console.error('8. getCloudflareContext threw an error:', error);
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">上下文获取失败</h1>
        <p>错误信息：{error instanceof Error ? error.message : '未知错误'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

  if (!env) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">环境变量错误</h1>
        <p>错误信息：从 getCloudflareContext 获取的 env 对象是 undefined</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

  if (!('DB' in env)) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-4">数据库绑定错误</h1>
        <p>错误信息：env 对象中不存在名为 {`"DB"`} 的绑定。当前 env 的键为: {JSON.stringify(Object.keys(env))}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

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
}