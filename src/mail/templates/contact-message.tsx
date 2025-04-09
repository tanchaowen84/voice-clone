import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface ContactMessageProps extends BaseEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactMessage({ name, email, message, locale, messages }: ContactMessageProps) {
  const t = createTranslator({ locale, messages, namespace: 'Mail.contactMessage' });

  return (
    <EmailLayout locale={locale} messages={messages}>
      <Text>{t('name', { name })}</Text>
      <Text>{t('email', { email })}</Text>
      <Text>{t('message', { message })}</Text>
    </EmailLayout>
  );
}

ContactMessage.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'username',
  email: 'username@example.com',
  message: 'This is a test message',
};

export default ContactMessage;
