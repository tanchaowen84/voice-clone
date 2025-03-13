'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { constructMetadata } from '@/lib/metadata';
import { createTitle } from '@/lib/utils';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactPage');

  return constructMetadata({
    title: createTitle(t('title')),
    description: t('description'),
  });
}

/**
 * inspired by https://nsui.irung.me/contact
 */
export default function ContactPage() {
  const t = useTranslations('ContactPage');

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
            <Label htmlFor="name">{t('name')}</Label>
            <Input type="text" id="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input type="email" id="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="msg">{t('message')}</Label>
            <Textarea id="msg" rows={3} />
          </div>

          <Button type="submit" className="w-full">
            {t('submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
