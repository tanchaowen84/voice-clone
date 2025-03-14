import { getDefaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/utils/types';
import { Heading, Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

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

SubscribeNewsletter.PreviewProps = {
  locale: routing.defaultLocale,
  messages: await getDefaultMessages(),
};

export default SubscribeNewsletter;
