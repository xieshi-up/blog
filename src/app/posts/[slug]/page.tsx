import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { renderMarkdownToHtml } from '@/lib/markdown';
import { getCloudflareContext } from '@opennextjs/cloudflare';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: '文章详情',
    description: '阅读文章',
  };
}

async function PostContent({ slug }: { slug: string }) {
  const { env } = getCloudflareContext();
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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  return <PostContent slug={slug} />;
}