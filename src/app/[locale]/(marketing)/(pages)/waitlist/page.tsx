import { Card } from '@/components/ui/card';
import { constructMetadata } from '@/lib/metadata';
import { createTitle } from '@/lib/utils';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { WaitlistForm } from './waitlist-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('WaitlistPage');

  return constructMetadata({
    title: createTitle(t('title')),
    description: t('description'),
  });
}

/**
 *
 */
export default async function WaitlistPage() {
  const t = await getTranslations('WaitlistPage');

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Form */}
      <Card className="mx-auto max-w-lg p-8 shadow-md">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('formDescription')}
          </p>
        </div>

        <WaitlistForm labels={{
          email: t('email'),
          subscribe: t('subscribe')
        }} />
      </Card>
    </div>
  );
}
