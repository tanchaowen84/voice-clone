import { getDefaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

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

      <Text>{t('Mail.common.team')}</Text>
      <Text>
        {t('Mail.common.copyright', { year: new Date().getFullYear() })}
      </Text>
    </EmailLayout>
  );
}

ForgotPassword.PreviewProps = {
  locale: routing.defaultLocale,
  messages: await getDefaultMessages(),
  url: 'https://mksaas.com',
  name: 'username',
};

export default ForgotPassword;
