import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface VerifyEmailProps extends BaseEmailProps {
  url: string;
  name: string;
}

export function VerifyEmail({ url, name, locale, messages }: VerifyEmailProps) {
  const t = createTranslator({ locale, messages, namespace: 'Mail.verifyEmail' });
  
  return (
    <EmailLayout locale={locale} messages={messages}>
      <Text>{t('title', { name })}</Text>
      <Text>{t('body')}</Text>
      <EmailButton href={url}>{t('confirmEmail')}</EmailButton>
    </EmailLayout>
  );
}

VerifyEmail.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  url: 'https://mksaas.com',
  name: 'username',
};

export default VerifyEmail;
