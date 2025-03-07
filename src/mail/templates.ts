import type { Messages } from "@/i18n/messages";
import { getMessagesForLocale } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";
import { mailTemplates } from "@/mail/emails";
import { render } from "@react-email/render";

export type TemplateId = keyof typeof mailTemplates;

/**
 * get rendered email for given template id, context, and locale
 */
export async function getTemplate<T extends TemplateId>({
	templateId,
	context,
	locale,
}: {
	templateId: T;
	context: Omit<
		Parameters<(typeof mailTemplates)[T]>[0],
		"locale" | "translations"
	>;
	locale: Locale;
}) {
	const template = mailTemplates[templateId];
	const translations = await getMessagesForLocale(locale);

	const email = template({
		...(context as any),
		locale,
		translations,
	});

	const subject =
		"subject" in translations.mail[templateId as keyof Messages["mail"]]
			? translations.mail[templateId].subject
			: "";

	const html = await render(email);
	const text = await render(email, { plainText: true });
	return { html, text, subject };
}
