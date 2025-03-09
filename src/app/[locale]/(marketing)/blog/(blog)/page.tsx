import { allPosts } from 'content-collections';
import { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { POSTS_PER_PAGE } from '@/constants';
import { NextPageProps } from '@/types/next-page-props';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Latest news and updates from our team',
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: NextPageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const { page } = (resolvedSearchParams as { [key: string]: string }) || {};
  const currentPage = page ? Number(page) : 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

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
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

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
