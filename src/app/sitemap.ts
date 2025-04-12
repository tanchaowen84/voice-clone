import { getLocalePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { source } from '@/lib/docs/source';
import { allCategories, allPosts } from 'content-collections';
import { MetadataRoute } from 'next';
import { Locale } from 'next-intl';
import { getBaseUrl } from '../lib/urls/urls';

type Href = Parameters<typeof getLocalePathname>[0]['href'];

/**
 * static routes for sitemap, you may change the routes for your own
 */
const staticRoutes = [
  '/',
  '/pricing',
  '/blog',
  '/docs',
  '/about',
  '/contact',
  '/waitlist',
  '/changelog',
  '/privacy',
  '/terms',
  '/cookie',
  '/auth/login',
  '/auth/register',
];

/**
 * Generate a sitemap for the website
 * 
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://github.com/javayhu/cnblocks/blob/main/app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = []; // final result

  // add static routes
  sitemapList.push(...staticRoutes.flatMap((route) => {
    return routing.locales.map((locale) => ({
      url: getUrl(route, locale),
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'weekly' as const
    }));
  }));

  // add categories
  sitemapList.push(...allCategories.flatMap((category: { slug: string }) =>
    routing.locales.map((locale) => ({
      url: getUrl(`/blog/category/${category.slug}`, locale),
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: 'weekly' as const
    }))
  ));

  // add posts
  sitemapList.push(...allPosts.flatMap((post: { slugAsParams: string }) =>
    routing.locales.map((locale) => ({
      url: getUrl(`/blog/${post.slugAsParams}`, locale),
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: 'weekly' as const
    }))
  ));

  // add docs
  const docsParams = source.generateParams();
  sitemapList.push(...docsParams.flatMap(param =>
    routing.locales.map((locale) => ({
      url: getUrl(`/docs/${param.slug.join('/')}`, locale),
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: 'weekly' as const
    }))
  ));

  return sitemapList;
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getLocalePathname({ locale, href });
  return getBaseUrl() + pathname;
}

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#sitemap
 * https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/sitemap.ts
 */
function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  }));
}
