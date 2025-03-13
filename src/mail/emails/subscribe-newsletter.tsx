import { routing } from '@/i18n/routing';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Heading, Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';
import { defaultMessages } from '@/i18n/messages';

export function SubscribeNewsletter({ locale, messages }: BaseEmailProps) {
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
  locale: routing.defaultLocale,
  messages: defaultMessages,
};

export default SubscribeNewsletter;
