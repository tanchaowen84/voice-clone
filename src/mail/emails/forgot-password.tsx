import { getWebsiteInfo } from '@/config';
import { routing } from '@/i18n/routing';
import { createTranslator as createAppTranslator } from '@/i18n/translator';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';
import { defaultMessages } from '@/i18n/messages';

type ForgotPasswordProps = {
  url: string;
  name: string;
} & BaseEmailProps;

export function ForgotPassword({
  url,
  name,
  locale,
  messages,
}: ForgotPasswordProps) {
  const t = createTranslator({
    locale,
    messages,
  });
  
  // Create a simple translator function for site config
  const appTranslator = createAppTranslator((key: string) => key);
  const websiteInfo = getWebsiteInfo(appTranslator);

  return (
    <EmailLayout>
      <Text>{t('Mail.forgotPassword.title', { name })}</Text>

      <Text>{t('Mail.forgotPassword.body')}</Text>

      <EmailButton href={url}>
        {t('Mail.forgotPassword.resetPassword')}
      </EmailButton>

      <br />
      <br />
      <br />

      <Text>{t('Mail.common.team', { name: websiteInfo.name })}</Text>
      <Text>
        {t('Mail.common.copyright', { year: new Date().getFullYear() })}
      </Text>
    </EmailLayout>
  );
}

ForgotPassword.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  url: 'https://mksaas.com',
  name: 'username',
};

export default ForgotPassword;
