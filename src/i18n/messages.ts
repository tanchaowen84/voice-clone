import deepmerge from 'deepmerge';
import { routing } from './routing';
import { Locale, Messages } from 'next-intl';

const importLocale = async (locale: Locale): Promise<Messages> => {
  return (await import(`../../messages/${locale}.json`)).default as Messages;
};

// Instead of using top-level await, create a function to get default messages
export const getDefaultMessages = async (): Promise<Messages> => {
  return await importLocale(routing.defaultLocale);
};

/**
 * If you have incomplete messages for a given locale and would like to use messages
 * from another locale as a fallback, you can merge the two accordingly.
 *
 * https://next-intl.dev/docs/usage/configuration#messages
 */
export const getMessagesForLocale = async (
  locale: Locale
): Promise<Messages> => {
  const localeMessages = await importLocale(locale);
  if (locale === routing.defaultLocale) {
    return localeMessages;
  }
  // Get default messages when needed instead of using a top-level await
  const defaultMessages = await getDefaultMessages();
  return deepmerge(defaultMessages, localeMessages);
};
