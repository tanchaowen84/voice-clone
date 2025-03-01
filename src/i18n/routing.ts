import { defineRouting } from 'next-intl/routing';

/**
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#i18n-routing
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'cn'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  pathnames: {
    '/': '/'
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
