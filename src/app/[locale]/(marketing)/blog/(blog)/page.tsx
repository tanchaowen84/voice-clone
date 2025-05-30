import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { websiteConfig } from '@/config/website';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { allPosts } from 'content-collections';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Generate all static params for SSG (locale + pagination)
export function generateStaticParams() {
  const publishedPosts = allPosts.filter((post) => post.published);
  const paginationSize = websiteConfig.blog.paginationSize;
  const params: { locale: string; page?: string }[] = [];
  for (const locale of LOCALES) {
    const localePosts = publishedPosts.filter((post) => post.locale === locale);
    if (localePosts.length <= 0) {
      continue;
    }
    const totalCount = localePosts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / paginationSize));
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      if (pageNumber === 1) {
        params.push({ locale });
      } else {
        params.push({ locale, page: String(pageNumber) });
      }
    }
  }
  console.log('BlogPage, generateStaticParams', params);
  return params;
}

// Generate metadata for each static page (locale + page)
export async function generateMetadata({ params }: BlogPageProps) {
  const { locale, page } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({ locale, namespace: 'BlogPage' });

  // Build canonical URL with pagination
  let canonicalPath = '/blog';
  if (page && page !== '1') {
    canonicalPath += `?page=${page}`;
  }
  console.log(
    `locale: ${locale}, page: ${page}, canonicalPath: ${canonicalPath}`
  );

  return constructMetadata({
    title: `${pt('title')} | ${t('title')}`,
    description: pt('description'),
    canonicalUrl: getUrlWithLocale(canonicalPath, locale),
  });
}

interface BlogPageProps {
  params: Promise<{
    locale: Locale;
    page?: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale, page } = await params;
  const currentPage = page ? Number(page) : 1;
  const paginationSize = websiteConfig.blog.paginationSize;
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
