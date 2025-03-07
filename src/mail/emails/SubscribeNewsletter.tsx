import { Heading, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";
import EmailLayout from "@/mail/components/EmailLayout";
import { defaultLocale, defaultTranslations } from "@/mail/translations";
import type { BaseMailProps } from "@/mail/types";

export function SubscribeNewsletter({ locale, translations }: BaseMailProps) {
	const t = createTranslator({
		locale,
		messages: translations,
	});

	return (
		<EmailLayout>
			<Heading className="text-xl">
				{t("mail.subscribeNewsletter.subject")}
			</Heading>
			<Text>{t("mail.subscribeNewsletter.body")}</Text>
		</EmailLayout>
	);
}

SubscribeNewsletter.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
};

export default SubscribeNewsletter;
