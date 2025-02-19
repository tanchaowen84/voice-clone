import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';
import { BlogPost } from '@/components/blog/blog-post';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import type { NextPageProps } from '@/types/next-page-props';

import '@/app/mdx.css';

/**
 * Gets the blog post from the params
 * @param props - The props of the page
 * @returns The blog post
 * 
 * How it works:
 * 1. /blog/first-post:
 * params.slug = ["first-post"]
 * slug becomes "first-post" after join('/')
 * Matches post where slugAsParams === "first-post"
 * 
 * 2. /blog/2023/year-review:
 * params.slug = ["2023", "year-review"]
 * slug becomes "2023/year-review" after join('/')
 * Matches post where slugAsParams === "2023/year-review"
 */
async function getBlogPostFromParams(props: NextPageProps) {
  const params = await props.params;
  if (!params) {
    return null;
  }
  const slug =
    (Array.isArray(params.slug) ? params.slug?.join('/') : params.slug) || '';
  const post = allPosts.find(
    (post) =>
      post.slugAsParams === slug || (!slug && post.slugAsParams === 'index')
  );
  if (!post) {
    return null;
  }
  return post;
}

export async function generateMetadata(
  props: NextPageProps
): Promise<Metadata> {
  const post = await getBlogPostFromParams(props);
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${getBaseUrl()}${post.slug}`
    }
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/')
  }));
}

export default async function BlogPostPage(props: NextPageProps) {
  const post = await getBlogPostFromParams(props);
  if (!post) {
    return notFound();
  }
  return <BlogPost post={post} />;
}
