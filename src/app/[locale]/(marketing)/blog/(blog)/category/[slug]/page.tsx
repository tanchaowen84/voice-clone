import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { websiteConfig } from '@/config';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { NextPageProps } from '@/types/next-page-props';
import { allCategories, allPosts } from 'content-collections';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { slug, locale } = await params;

  // Find category with matching slug and locale
  const category = allCategories.find(
    (category) => category.slug === slug && category.locale === locale
  );

  if (!category) {
    console.warn(
      `generateMetadata, category not found for slug: ${slug}, locale: ${locale}`
    );
    return {};
  }

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return constructMetadata({
    title: `${category.name} | ${t('title')}`,
    description: category.description,
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: NextPageProps) {
  const paginationSize = websiteConfig.blog.paginationSize;
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const { page } = (resolvedSearchParams as { [key: string]: string }) || {};
  const currentPage = page ? Number(page) : 1;
  const startIndex = (currentPage - 1) * paginationSize;
  const endIndex = startIndex + paginationSize;

  // Find category with matching slug and locale
  const category = allCategories.find(
    (category) => category.slug === slug && category.locale === locale
  );

  // Filter posts by category and locale
  const filteredPosts = allPosts.filter((post) => {
    if (!post.published || post.locale !== locale) {
      return false;
    }

    // Check if any of the post's categories match the current category slug
    return post.categories.some(
      (category) => category && category.slug === slug
    );
  });

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Paginate posts
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalCount = filteredPosts.length;
  const totalPages = Math.ceil(totalCount / paginationSize);

  // console.log("BlogCategoryPage, totalCount", totalCount, ", totalPages", totalPages);

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
              routePreix={`/${locale}/blog/category/${resolvedParams.slug}`}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
