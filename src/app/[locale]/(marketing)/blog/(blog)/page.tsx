import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { websiteConfig } from '@/config/website';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { NextPageProps } from '@/types/next-page-props';
import { allPosts } from 'content-collections';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({ locale, namespace: 'BlogPage' });
  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    canonicalUrl: getUrlWithLocale('/blog', locale),
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: NextPageProps) {
  const paginationSize = websiteConfig.blog.paginationSize;
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const { page } = (resolvedSearchParams as { [key: string]: string }) || {};
  const currentPage = page ? Number(page) : 1;
  const startIndex = (currentPage - 1) * paginationSize;
  const endIndex = startIndex + paginationSize;

  // Filter posts by locale
  const localePosts = allPosts.filter(
    (post) => post.locale === locale && post.published
  );

  // If no posts found for the current locale, show all published posts
  const filteredPosts =
    localePosts.length > 0
      ? localePosts
      : allPosts.filter((post) => post.published);

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Paginate posts
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalCount = filteredPosts.length;
  const totalPages = Math.ceil(totalCount / paginationSize);

  // console.log("BlogPage, totalCount", totalCount, ", totalPages", totalPages,);

  return (
    <div>
      {/* when no posts are found */}
      {paginatedPosts.length === 0 && <EmptyGrid />}

      {/* when posts are found */}
      {paginatedPosts.length > 0 && (
        <div>
          <BlogGrid posts={paginatedPosts} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination
              routePreix={`/${locale}/blog`}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
