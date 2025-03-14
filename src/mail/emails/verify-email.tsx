import { getDefaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

type VerifyEmailProps = {
  url: string;
  name: string;
} & BaseEmailProps;

export function VerifyEmail({ url, name, locale, messages }: VerifyEmailProps) {
  const t = createTranslator({
    locale,
    messages,
  });
  
  return (
    <EmailLayout>
      <Text>{t('Mail.verifyEmail.title', { name })}</Text>

      <Text>{t('Mail.verifyEmail.body')}</Text>

      <EmailButton href={url}>{t('Mail.verifyEmail.confirmEmail')}</EmailButton>

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

VerifyEmail.PreviewProps = {
  locale: routing.defaultLocale,
  messages: await getDefaultMessages(),
  url: 'https://mksaas.com',
  name: 'username',
};

export default VerifyEmail;
