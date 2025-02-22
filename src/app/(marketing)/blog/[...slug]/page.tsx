import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';
import { BlogPost } from '@/components/blog/blog-post';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import type { NextPageProps } from '@/types/next-page-props';
import BlogGrid from '@/components/blog/blog-grid';
import { getTableOfContents } from '@/lib/toc';
import { getLocaleDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { BlogToc } from '@/components/blog/blog-toc';
import { Mdx } from '@/components/marketing/blog/mdx-component';

import '@/app/mdx.css';
import AllPostsButton from '@/components/blog/all-posts-button';

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
  // return <BlogPost post={post} />;

  // console.log("PostPage, post", post);
  // const imageProps = post?.image ? urlForImage(post?.image) : null;
  // const imageBlurDataURL = post?.image?.blurDataURL || null;
  const publishDate = post.date;
  const date = getLocaleDate(publishDate);
  // const markdownContent = portableTextToMarkdown(post.body);
  // console.log("markdownContent", markdownContent);

  const toc = await getTableOfContents(post.content);

  return (
    <div className="flex flex-col gap-8">
      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Basic information */}
          <div className="space-y-8">
            {/* blog post image */}
            <div className="group overflow-hidden relative aspect-[16/9] rounded-lg transition-all border">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title || "image for blog post"}
                  title={post.title || "image for blog post"}
                  loading="eager"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* blog post title */}
            <h1 className="text-3xl font-bold">{post.title}</h1>

            {/* blog post description */}
            <p className="text-lg text-muted-foreground">{post.description}</p>
          </div>

          {/* blog post content */}
          <div className="mt-4">
            <Mdx code={post.body.code} />
            {/* {markdownContent && <BlogCustomMdx source={markdownContent} />} */}
          </div>

          <div className="flex items-center justify-start mt-16">
            <AllPostsButton />
          </div>
        </div>

        {/* Right column (sidebar) */}
        <div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* author info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Publisher</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 flex-shrink-0">
                  {post.author?.avatar && (
                    <Image
                      src={post?.author?.avatar}
                      alt={`avatar for ${post.author.name}`}
                      className="rounded-full object-cover border"
                      fill
                    />
                  )}
                </div>
                <div>
                  <span>{post.author?.name}</span>

                  <p className="text-sm text-muted-foreground">{date}</p>
                </div>
              </div>
            </div>

            {/* categories */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul className="flex flex-wrap gap-4">
                {post.categories?.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="text-sm link-underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* table of contents */}
            <div className="bg-muted/50 rounded-lg p-6 hidden lg:block">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
                <BlogToc toc={toc} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related posts */}
      {/* {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              More Posts
            </h2>
          </div>

          <BlogGrid posts={post.relatedPosts} />
        </div>
      )} */}
    </div>
  );
}
