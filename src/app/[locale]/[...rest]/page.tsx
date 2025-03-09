import { notFound } from 'next/navigation';

/**
 * Catching unknown routes
 *
 * all requests that are matched within the [locale] segment will render
 * the not-found page when an unknown route is encountered (e.g. /en/unknown).
 *
 * https://next-intl.dev/docs/environments/error-files#catching-unknown-routes
 */
export default function CatchAllPage() {
  notFound();
}
