import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

/**
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#i18n-navigation
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
