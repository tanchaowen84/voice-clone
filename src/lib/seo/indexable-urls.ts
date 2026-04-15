import { websiteConfig } from '@/config/website';
import { getLocalePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';
import type { Locale } from 'next-intl';
import {
  allCategories,
  allPosts,
} from '../../../.content-collections/generated/index.js';
import { getBaseUrl } from '../urls/urls';

type Href = Parameters<typeof getLocalePathname>[0]['href'];
type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry['changeFrequency']>;

interface StaticIndexableRoute {
  href: Href;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const STATIC_INDEXABLE_ROUTES: StaticIndexableRoute[] = [
  {
    href: '/',
    priority: 1,
    changeFrequency: 'weekly',
  },
  {
    href: '/tools/audio-enhancer',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    href: '/tools/echo-remover-ai',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    href: '/tools/online-voice-recorder',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    href: '/tools/mic-test-online',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
];

function getStaticRoutes(): StaticIndexableRoute[] {
  const routes = [...STATIC_INDEXABLE_ROUTES];

  if (websiteConfig.features.enableMagicUIPage) {
    routes.push({
      href: '/magicui',
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  }

  return routes;
}

function getUrl(href: Href, locale: Locale): string {
  const pathname = getLocalePathname({ locale, href });
  return getBaseUrl() + pathname;
}

function upsertEntry(
  entryMap: Map<string, SitemapEntry>,
  entry: SitemapEntry
): void {
  entryMap.set(entry.url, entry);
}

function getPublishedPostsForLocale(locale: string) {
  return allPosts.filter((post) => post.published && post.locale === locale);
}

function getIndexableCategoriesForLocale(locale: string) {
  return allCategories.filter(
    (category) =>
      category.locale === locale &&
      allPosts.some(
        (post) =>
          post.published &&
          post.locale === locale &&
          post.categories.some(
            (postCategory) => postCategory?.slug === category.slug
          )
      )
  );
}

export function getIndexableSitemapEntries(): MetadataRoute.Sitemap {
  const entryMap = new Map<string, SitemapEntry>();
  const buildTime = new Date();

  for (const route of getStaticRoutes()) {
    for (const locale of routing.locales) {
      upsertEntry(entryMap, {
        url: getUrl(route.href, locale as Locale),
        lastModified: buildTime,
        priority: route.priority,
        changeFrequency: route.changeFrequency,
      });
    }
  }

  for (const locale of routing.locales) {
    const publishedPosts = getPublishedPostsForLocale(locale);
    const totalBlogPages = Math.ceil(
      publishedPosts.length / websiteConfig.blog.paginationSize
    );

    for (let page = 2; page <= totalBlogPages; page++) {
      upsertEntry(entryMap, {
        url: getUrl(`/blog/page/${page}`, locale as Locale),
        lastModified: buildTime,
        priority: 0.8,
        changeFrequency: 'weekly',
      });
    }

    for (const category of getIndexableCategoriesForLocale(locale)) {
      upsertEntry(entryMap, {
        url: getUrl(`/blog/category/${category.slug}`, locale as Locale),
        lastModified: buildTime,
        priority: 0.8,
        changeFrequency: 'weekly',
      });

      const totalCategoryPages = Math.ceil(
        publishedPosts.filter((post) =>
          post.categories.some(
            (postCategory) => postCategory?.slug === category.slug
          )
        ).length / websiteConfig.blog.paginationSize
      );

      for (let page = 2; page <= totalCategoryPages; page++) {
        upsertEntry(entryMap, {
          url: getUrl(
            `/blog/category/${category.slug}/page/${page}`,
            locale as Locale
          ),
          lastModified: buildTime,
          priority: 0.8,
          changeFrequency: 'weekly',
        });
      }
    }
  }

  for (const post of allPosts.filter((entry) => entry.published)) {
    upsertEntry(entryMap, {
      url: getUrl(`/blog/${post.slugAsParams}`, post.locale as Locale),
      lastModified: new Date(post.date),
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  }

  return Array.from(entryMap.values());
}

export function getIndexableUrls(): string[] {
  return getIndexableSitemapEntries().map((entry) => entry.url);
}
