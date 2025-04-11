'use client';

import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { useTranslations } from 'next-intl';

export function NewsletterCard() {
  const t = useTranslations('Newsletter');

  return (
    <div className="w-full px-4 py-8 md:p-16 bg-muted rounded-lg">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <div className="space-y-4">
          <h3 className="text-center text-3xl font-bold tracking-tight">
            {t('title')}
          </h3>
          <p className="text-center text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <NewsletterForm />
      </div>
    </div>
  );
}
