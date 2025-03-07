import deepmerge from "deepmerge";
import { routing } from "./routing";

import type messages from "../../messages/en.json";

export type Messages = typeof messages;

export const importLocale = async (locale: string): Promise<Messages> => {
	return (await import(`../../messages/${locale}.json`)).default as Messages;
};

/**
 * If you have incomplete messages for a given locale and would like to use messages 
 * from another locale as a fallback, you can merge the two accordingly.
 * 
 * https://next-intl.dev/docs/usage/configuration#messages
 */
export const getMessagesForLocale = async (
	locale: string,
): Promise<Messages> => {
	const localeMessages = await importLocale(locale);
	if (locale === routing.defaultLocale) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(routing.defaultLocale);
	return deepmerge(defaultLocaleMessages, localeMessages);
};
