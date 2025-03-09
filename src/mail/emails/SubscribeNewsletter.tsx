import EmailLayout from '@/mail/components/EmailLayout';
import { defaultLocale, defaultMessages } from '@/mail/messages';
import type { BaseMailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

export function SubscribeNewsletter({ locale, messages }: BaseMailProps) {
  const t = createTranslator({
    locale,
    messages,
  });

  return (
    <EmailLayout>
      <Heading className="text-xl">
        {t('Mail.subscribeNewsletter.subject')}
      </Heading>
      <Text>{t('Mail.subscribeNewsletter.body')}</Text>
    </EmailLayout>
  );
}

SubscribeNewsletter.PreviewProps = {
  locale: defaultLocale,
  messages: defaultMessages,
};

export default SubscribeNewsletter;
