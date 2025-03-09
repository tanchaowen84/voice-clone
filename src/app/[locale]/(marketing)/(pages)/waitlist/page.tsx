'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

/**
 *
 */
export default function WaitlistPage() {
  const t = useTranslations('WaitlistPage');

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

        <form action="" className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input type="email" id="email" required />
          </div>

          <Button type="submit" className="w-full">
            {t('subscribe')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
