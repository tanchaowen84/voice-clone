import { siteConfig } from "@/config/site";
import EmailButton from "@/mail/components/EmailButton";
import EmailLayout from "@/mail/components/EmailLayout";
import { defaultLocale, defaultMessages } from "@/mail/messages";
import type { BaseMailProps } from "@/mail/types";
import { Text } from "@react-email/components";
import { createTranslator } from "use-intl/core";

export function ForgotPassword({
	url,
	name,
	locale,
	messages,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const t = createTranslator({
		locale,
		messages,
	});

	return (
		<EmailLayout>
			<Text>{t("mail.forgotPassword.title", { name })}</Text>

			<Text>{t("mail.forgotPassword.body")}</Text>

			<EmailButton href={url}>
				{t("mail.forgotPassword.resetPassword")}
			</EmailButton>

			<br /><br /><br />

			<Text>{t("mail.common.team", { name: siteConfig.name })}</Text>
			<Text>{t("mail.common.copyright", { year: new Date().getFullYear() })}</Text>
		</EmailLayout>
	);
}

ForgotPassword.PreviewProps = {
	locale: defaultLocale,
	messages: defaultMessages,
	url: "https://mksaas.com",
	name: "username",
};

export default ForgotPassword;
