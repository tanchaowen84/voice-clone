import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

/**
 * Next.js internationalized routing
 *
 * https://next-intl.dev/docs/routing#base-path
 */
export const config = {
  // The `matcher` is relative to the `basePath`
  matcher: [
    // This entry handles the root of the base
    // path and should always be included
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(zh|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/zh/pathnames`)
    // Exclude API routes and other Next.js internal routes
    // if not exclude api routes, auth routes will not work
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
