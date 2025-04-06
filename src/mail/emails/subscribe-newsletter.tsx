import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface SubscribeNewsletterProps extends BaseEmailProps {
}

export function SubscribeNewsletter({ locale, messages }: SubscribeNewsletterProps) {
  const t = createTranslator({ locale, messages, });

  return (
    <EmailLayout locale={locale} messages={messages}>
      <Heading className="text-xl">
        {t('Mail.subscribeNewsletter.subject')}
      </Heading>
      <Text>{t('Mail.subscribeNewsletter.body')}</Text>
    </EmailLayout>
  );
}

SubscribeNewsletter.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
};

export default SubscribeNewsletter;
