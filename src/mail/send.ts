import { Locale, routing } from "@/i18n/routing";
import type { mailTemplates } from "@/mail/emails";
import { sendEmail } from "@/mail/provider/resend";
import type { TemplateId } from "./templates";
import { getTemplate } from "./templates";

/**
 * send email with given template, locale, and context
 */
export async function send<T extends TemplateId>(
	params: {
		to: string;
		locale?: Locale;
	} & (
		| {
				templateId: T;
				context: Omit<
					Parameters<(typeof mailTemplates)[T]>[0],
					"locale" | "translations"
				>;
		  }
		| {
				subject: string;
				text?: string;
				html?: string;
		  }
	),
) {
	const { to, locale = routing.defaultLocale } = params;
	console.log("send, locale:", locale);

	let html: string;
	let text: string;
	let subject: string;

	if ("templateId" in params) {
		const { templateId, context } = params;
		const template = await getTemplate({
			templateId,
			context,
			locale,
		});
		subject = template.subject;
		text = template.text;
		html = template.html;
	} else {
		subject = params.subject;
		text = params.text ?? "";
		html = params.html ?? "";
	}

	try {
		await sendEmail({
			to,
			subject,
			text,
			html,
		});
		return true;
	} catch (e) {
		console.error("Error sending email", e);
		return false;
	}
}
