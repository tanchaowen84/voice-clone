import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import deepmerge from "deepmerge";
import { AbstractIntlMessages } from "next-intl";

/**
 * i18n/request.ts can be used to provide configuration for server-only code, 
 * i.e. Server Components, Server Actions & friends. 
 * The configuration is provided via the getRequestConfig function.
 * 
 * The configuration object is created once for each request by internally using React’s cache. 
 * The first component to use internationalization will call the function defined with getRequestConfig.
 * 
 * https://next-intl.dev/docs/usage/configuration
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // https://next-intl.dev/docs/usage/configuration#messages
  // If you have incomplete messages for a given locale and would like to use messages 
  // from another locale as a fallback, you can merge the two accordingly.
  const userMessages = (await import(`../../messages/${locale}.json`)).default;
  const defaultMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  const messages = deepmerge(defaultMessages, userMessages) as AbstractIntlMessages;

  return {
    locale,
    messages
  };
});
