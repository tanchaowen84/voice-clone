import { websiteConfig } from '@/config/website';
import { allPosts } from 'content-collections';

export function getPaginatedBlogPosts({
  locale,
  page = 1,
  category,
}: {
  locale: string;
  page?: number;
  category?: string;
}) {
  // Filter posts by locale
  let filteredPosts = allPosts.filter(
    (post) => post.locale === locale && post.published
  );
  // If no posts found for the current locale, show all published posts
  if (filteredPosts.length === 0) {
    filteredPosts = allPosts.filter((post) => post.published);
  }
  // Filter by category if category is provided
  if (category) {
    filteredPosts = filteredPosts.filter((post) =>
      post.categories.some((cat) => cat && cat.slug === category)
    );
  }
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  // Paginate posts
  const paginationSize = websiteConfig.blog.paginationSize;
  const startIndex = (page - 1) * paginationSize;
  const endIndex = startIndex + paginationSize;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / paginationSize);
  return {
    paginatedPosts,
    totalPages,
    filteredPostsCount: filteredPosts.length,
  };
}
