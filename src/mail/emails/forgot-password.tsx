import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface ForgotPasswordProps extends BaseEmailProps {
  url: string;
  name: string;
}

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
    <EmailLayout locale={locale} messages={messages}>
      <Text>{t('Mail.forgotPassword.title', { name })}</Text>

      <Text>{t('Mail.forgotPassword.body')}</Text>

      <EmailButton href={url}>
        {t('Mail.forgotPassword.resetPassword')}
      </EmailButton>
    </EmailLayout>
  );
}

// NOTICE: can not use await here!!!
ForgotPassword.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  url: 'https://mksaas.com',
  name: 'username',
};

export default ForgotPassword;
