import { allPages } from 'content-collections';
import type { Locale } from 'next-intl';

/**
 * Gets a page from the content collection
 * @param type The type of page to get (e.g., 'privacy-policy', 'terms-of-service')
 * @param locale The locale to get the page for
 * @returns The page or undefined if not found
 */
export async function getPage(type: string, locale: Locale) {
  // Find page with matching slug and locale
  const page = allPages.find(
    (page) => page.slugAsParams === `${type}` && page.locale === locale
  );

  if (!page) {
    // If no page found with the current locale, try to find one with any locale
    const defaultPage = allPages.find(
      (page) => page.slugAsParams === `${type}`
    );

    return defaultPage;
  }

  return page;
}
