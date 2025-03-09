import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Navigation APIs
 *
 * https://next-intl.dev/docs/routing/navigation
 */
export const {
  Link: LocaleLink,
  getPathname: getLocalePathname,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);
