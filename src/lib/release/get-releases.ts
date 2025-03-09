import { allReleases } from 'content-collections';

/**
 * Gets all releases for the changelog page
 * @param locale The locale to get releases for
 * @returns An array of releases sorted by date (newest first)
 */
export async function getReleases(locale: string) {
  // Find all published releases with matching locale
  const releases = allReleases.filter(
    (release) =>
      release.published &&
      release.locale === locale
  );

  // If no releases found with the current locale, try to find ones with any locale
  if (releases.length === 0) {
    const defaultReleases = allReleases.filter(
      (release) => release.published
    );

    // Sort by date (newest first)
    return defaultReleases.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Sort by date (newest first)
  return releases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
} 