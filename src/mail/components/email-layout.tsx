import type { BaseEmailProps } from '@/mail/types';
import {
  Container,
  Font,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface EmailLayoutProps extends BaseEmailProps {
  children: React.ReactNode;
}

/**
 * Email Layout
 *
 * https://react.email/docs/components/tailwind
 */
export default function EmailLayout({
  locale,
  messages,
  children,
}: EmailLayoutProps) {
  const t = createTranslator({
    locale,
    messages,
  });

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Section className="bg-background p-4">
          <Container className="rounded-lg bg-card p-6 text-card-foreground">
            {children}

            <Hr className="my-8" />
            <Text className="mt-4">
              {t('Mail.common.team', { name: t('Metadata.name') })}
            </Text>
            <Text>
              {t('Mail.common.copyright', { year: new Date().getFullYear() })}
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
