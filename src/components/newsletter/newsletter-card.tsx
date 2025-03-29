'use client';

import { HeaderSection } from '@/components/shared/header-section';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { useTranslations } from 'next-intl';

export function NewsletterCard() {
  const t = useTranslations('Newsletter');

  return (
    <div className="w-full px-4 py-8 md:p-12 bg-muted rounded-lg">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderSection
          titleAs="h3"
          title={t('title')}
          subtitle={t('description')}
        />

        <NewsletterForm />
      </div>
    </div>
  );
}
