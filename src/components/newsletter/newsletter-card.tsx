'use client';

import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { useTranslations } from 'next-intl';
import { HeaderSection } from '../layout/header-section';

export function NewsletterCard() {
  const t = useTranslations('Newsletter');

  return (
    <div className="w-full p-16 rounded-lg bg-muted/50">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          className="text-center"
        />

        <NewsletterForm />
      </div>
    </div>
  );
}
