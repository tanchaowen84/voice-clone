import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import type { I18nConfig } from 'fumadocs-core/i18n';

/**
 * Internationalization configuration for FumaDocs
 *
 * https://fumadocs.vercel.app/docs/ui/internationalization
 */
export const docsI18nConfig: I18nConfig = {
  defaultLanguage: DEFAULT_LOCALE,
  languages: LOCALES,
};
