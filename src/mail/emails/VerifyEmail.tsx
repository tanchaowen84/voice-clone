import { siteConfig } from '@/config/site';
import EmailButton from '@/mail/components/EmailButton';
import EmailLayout from '@/mail/components/EmailLayout';
import { defaultLocale, defaultMessages } from '@/mail/messages';
import type { BaseMailProps } from '@/mail/types';
import { Text } from '@react-email/components';
import { createTranslator } from 'use-intl/core';

export function VerifyEmail({
  url,
  name,
  locale,
  messages,
}: {
  url: string;
  name: string;
} & BaseMailProps) {
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

      <Text>{t('Mail.common.team', { name: siteConfig.name })}</Text>
      <Text>
        {t('Mail.common.copyright', { year: new Date().getFullYear() })}
      </Text>
    </EmailLayout>
  );
}

VerifyEmail.PreviewProps = {
  locale: defaultLocale,
  messages: defaultMessages,
  url: 'https://mksaas.com',
  name: 'username',
};

export default VerifyEmail;
