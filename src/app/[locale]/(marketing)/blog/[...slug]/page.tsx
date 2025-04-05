import AllPostsButton from '@/components/blog/all-posts-button';
import BlogGrid from '@/components/blog/blog-grid';
import { BlogToc } from '@/components/blog/blog-toc';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { CustomMDXContent } from '@/components/shared/custom-mdx-content';
import { websiteConfig } from '@/config';
import { LocaleLink } from '@/i18n/navigation';
import { getTableOfContents } from '@/lib/blog/toc';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/urls';
import { getLocaleDate } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';
import { allPosts, Post } from 'content-collections';
import { CalendarIcon, ClockIcon, FileTextIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import '@/styles/mdx.css';

/**
 * Gets the blog post from the params
 * @param props - The props of the page
 * @returns The blog post
 *
 * How it works:
 * /[locale]/blog/first-post:
 * params.slug = ["first-post"]
 * slug becomes "first-post" after join('/')
 * Matches post where slugAsParams === "first-post" AND locale === params.locale
 */
async function getBlogPostFromParams(props: NextPageProps) {
  const params = await props.params;
  if (!params) {
    return null;
  }

  const locale = params.locale as string;
  const slug =
    (Array.isArray(params.slug) ? params.slug?.join('/') : params.slug) || '';

  // Find post with matching slug and locale
  const post = allPosts.find(
    (post) =>
      (post.slugAsParams === slug ||
        (!slug && post.slugAsParams === 'index')) &&
      post.locale === locale
  );

  if (!post) {
    // If no post found with the current locale, try to find one with the default locale
    const defaultPost = allPosts.find(
      (post) =>
        post.slugAsParams === slug || (!slug && post.slugAsParams === 'index')
    );

    return defaultPost;
  }

  return post;
}

/**
 * get related posts, random pick from all posts with same locale, different slug,
 * max size is websiteConfig.blog.relatedPostsSize
 */
async function getRelatedPosts(post: Post) {
  const relatedPosts = allPosts
    .filter((p) => p.locale === post.locale)
    .filter((p) => p.slugAsParams !== post.slugAsParams)
    .sort(() => Math.random() - 0.5)
    .slice(0, websiteConfig.blog.relatedPostsSize);

  return relatedPosts;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { slug, locale } = await params;

  const post = await getBlogPostFromParams({
    params: Promise.resolve({ slug, locale }),
    searchParams: Promise.resolve({})
  });
  if (!post) {
    console.warn(
      `generateMetadata, post not found for slug: ${slug}, locale: ${locale}`
    );
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    canonicalUrl: `${getBaseUrlWithLocale(locale)}${post.slug}`,
  });
}

export default async function BlogPostPage(props: NextPageProps) {
  const post = await getBlogPostFromParams(props);
  if (!post) {
    notFound();
  }

  const publishDate = post.date;
  const date = getLocaleDate(publishDate);
  const toc = await getTableOfContents(post.content);
  const t = await getTranslations('BlogPage');

  // get related posts
  const relatedPosts = await getRelatedPosts(post);

  return (
    <div className="flex flex-col gap-8">
      {/* content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left column (blog post content) */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Basic information */}
          <div className="space-y-8">
            {/* blog post image */}
            <div className="group overflow-hidden relative aspect-16/9 rounded-lg transition-all border">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title || 'image for blog post'}
                  title={post.title || 'image for blog post'}
                  loading="eager"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* blog post date and reading time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground leading-none my-auto">
                  {date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground leading-none my-auto">
                  {t('readTime', { minutes: post.estimatedTime })}
                </span>
              </div>
            </div>

            {/* blog post title */}
            <h1 className="text-3xl font-bold">{post.title}</h1>

            {/* blog post description */}
            <p className="text-lg text-muted-foreground">{post.description}</p>
          </div>

          {/* blog post content */}
          {/* in order to make the mdx.css work, we need to add the className prose to the div */}
          {/* https://github.com/tailwindlabs/tailwindcss-typography */}
          <div className="mt-8 max-w-none prose prose-neutral dark:prose-invert prose-img:rounded-lg">
            <CustomMDXContent
              code={post.body}
              includeFumadocsComponents={true}
            />
          </div>

          <div className="flex items-center justify-start my-16">
            <AllPostsButton />
          </div>
        </div>

        {/* right column (sidebar) */}
        <div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* author info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">{t('author')}</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-8 w-8 shrink-0">
                  {post.author?.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={`avatar for ${post.author.name}`}
                      className="rounded-full object-cover border"
                      fill
                    />
                  )}
                </div>
                <span className="line-clamp-1">
                  {post.author?.name}
                </span>
              </div>
            </div>

            {/* categories */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">{t('categories')}</h2>
              <ul className="flex flex-wrap gap-4">
                {post.categories?.filter(Boolean).map(
                  (category) =>
                    category && (
                      <li key={category.slug}>
                        <LocaleLink
                          href={`/blog/category/${category.slug}`}
                          className="text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                          {category.name}
                        </LocaleLink>
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* table of contents */}
            <div className="bg-muted/50 rounded-lg p-6 hidden lg:block">
              <h2 className="text-lg font-semibold mb-4">
                {t('tableOfContents')}
              </h2>
              <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
                <BlogToc toc={toc} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-4 text-muted-foreground" />
            <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              {t('morePosts')}
            </h2>
          </div>

          <BlogGrid posts={relatedPosts} />
        </div>
      )}

      {/* newsletter */}
      <div className="flex items-center justify-start my-8">
        <NewsletterCard />
      </div>
    </div>
  );
}
