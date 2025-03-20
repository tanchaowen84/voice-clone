import AllPostsButton from '@/components/blog/all-posts-button';
import { BlogToc } from '@/components/blog/blog-toc';
import { Mdx } from '@/components/shared/mdx-component';
import { LocaleLink } from '@/i18n/navigation';
import { getTableOfContents } from '@/lib/blog/toc';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { estimateReadingTime, getLocaleDate } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';
import { allPosts } from 'content-collections';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/metadata';
import { Locale } from 'next-intl';

/**
 * Gets the blog post from the params
 * @param props - The props of the page
 * @returns The blog post
 *
 * How it works:
 * 1. /[locale]/blog/first-post:
 * params.slug = ["first-post"]
 * slug becomes "first-post" after join('/')
 * Matches post where slugAsParams === "first-post" AND locale === params.locale
 *
 * 2. /[locale]/blog/2023/year-review:
 * params.slug = ["2023", "year-review"]
 * slug becomes "2023/year-review" after join('/')
 * Matches post where slugAsParams === "2023/year-review" AND locale === params.locale
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata | undefined> {
  const {slug, locale} = await params;
  
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

  const t = await getTranslations({locale, namespace: 'Metadata'});

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
                <p className="text-sm text-muted-foreground">{date}</p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {estimateReadingTime(post.body.raw)}
                </p>
              </div>
            </div>

            {/* blog post title */}
            <h1 className="text-3xl font-bold">{post.title}</h1>

            {/* blog post description */}
            <p className="text-lg text-muted-foreground">{post.description}</p>
          </div>

          {/* blog post content */}
          <Mdx code={post.body.code} />

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
                <span className="line-clamp-1">{post.author?.name}</span>
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
                          className="text-sm font-medium hover:text-primary"
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

      {/* newsletter */}
      {/* TODO: add newsletter */}
    </div>
  );
}
