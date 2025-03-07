import { Link, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";
import EmailButton from "@/mail/components/EmailButton";
import EmailLayout from "@/mail/components/EmailLayout";
import { defaultLocale, defaultTranslations } from "@/mail/translations";
import type { BaseMailProps } from "@/mail/types";
import { siteConfig } from "@/config/site";

export function VerifyEmail({
	url,
	name,
	locale,
	translations,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const t = createTranslator({
		locale,
		messages: translations,
	});

	return (
		<EmailLayout>
			<Text>{t("mail.verifyEmail.title", { name })}</Text>
			
			<Text>{t("mail.verifyEmail.body")}</Text>

			<EmailButton href={url}>
				{t("mail.verifyEmail.confirmEmail")}
			</EmailButton>

			<br /><br /><br />

			<Text>{t("mail.common.team", { name: siteConfig.name })}</Text>
			<Text>{t("mail.common.copyright", { year: new Date().getFullYear()})}</Text>
		</EmailLayout>
	);
}

VerifyEmail.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
	url: "https://mksaas.com",
	name: "username",
};

export default VerifyEmail;
