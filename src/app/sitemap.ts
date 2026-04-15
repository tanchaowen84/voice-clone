import { getIndexableSitemapEntries } from '@/lib/seo/indexable-urls';
import type { MetadataRoute } from 'next';

/**
 * Generate a sitemap for the website
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://github.com/javayhu/cnblocks/blob/main/app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getIndexableSitemapEntries();
}
