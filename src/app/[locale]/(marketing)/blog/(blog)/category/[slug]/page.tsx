import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { allPosts, allCategories } from 'content-collections';
import { siteConfig } from '@/config/site';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { NextPageProps } from '@/types/next-page-props';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata | undefined> {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  // Find category with matching slug and locale
  const category = allCategories.find(
    (category) => category.slug === slug && category.locale === locale
  );

  if (!category) {
    console.warn(
      `generateMetadata, category not found for slug: ${slug}, locale: ${locale}`
    );
    return;
  }

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append('title', category.name);
  ogImageUrl.searchParams.append('description', category.description || '');
  ogImageUrl.searchParams.append('type', 'Blog Category');

  return constructMetadata({
    title: `${category.name}`,
    description: category.description,
    canonicalUrl: `${siteConfig.url}/blog/category/${slug}`,
    // image: ogImageUrl.toString(),
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: NextPageProps) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const { page } = (resolvedSearchParams as { [key: string]: string }) || {};
  const currentPage = page ? Number(page) : 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

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
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

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
