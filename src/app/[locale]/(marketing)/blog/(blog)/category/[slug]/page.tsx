import BlogGrid from '@/components/blog/blog-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { websiteConfig } from '@/config/website';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { allCategories, allPosts } from 'content-collections';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Generate all static params for SSG (locale + category + pagination)
export function generateStaticParams() {
  const categories = allCategories;
  const publishedPosts = allPosts.filter((post) => post.published);
  const paginationSize = websiteConfig.blog.paginationSize;
  const params: { locale: string; slug: string; page?: string }[] = [];
  for (const locale of LOCALES) {
    const localeCategories = categories.filter((cat) => cat.locale === locale);
    for (const category of localeCategories) {
      const filteredPosts = publishedPosts.filter(
        (post) =>
          post.locale === locale &&
          post.categories.some((cat) => cat && cat.slug === category.slug)
      );
      const totalCount = filteredPosts.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / paginationSize));
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        if (pageNumber === 1) {
          params.push({ locale, slug: category.slug });
        } else {
          params.push({
            locale,
            slug: category.slug,
            page: String(pageNumber),
          });
        }
      }
    }
  }
  console.log('BlogCategoryPage, generateStaticParams', params);
  return params;
}

// Generate metadata for each static category page (locale + slug + page)
export async function generateMetadata({ params }: BlogCategoryPageProps) {
  const { locale, slug, page } = await params;
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
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  // Build canonical URL with pagination
  let canonicalPath = `/blog/category/${slug}`;
  if (page && page !== '1') {
    canonicalPath += `?page=${page}`;
  }
  console.log(
    `locale: ${locale}, slug: ${slug}, page: ${page}, canonicalPath: ${canonicalPath}`
  );

  return constructMetadata({
    title: `${category.name} | ${t('title')}`,
    description: category.description,
    canonicalUrl: getUrlWithLocale(canonicalPath, locale),
  });
}

interface BlogCategoryPageProps {
  params: Promise<{
    slug: string;
    locale: Locale;
    page?: string;
  }>;
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { slug, locale, page } = await params;
  const currentPage = page ? Number(page) : 1;
  const paginationSize = websiteConfig.blog.paginationSize;
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
              routePreix={`/${locale}/blog/category/${slug}`}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
