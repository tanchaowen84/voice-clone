import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: 'Echo Remover AI Free - Remove Echo from Audio Online',
    description:
      'Free AI echo remover tool removes echo and reverb from audio instantly. Perfect for podcasts, videos, interviews. No registration required.',
    canonicalUrl: getUrlWithLocale('/tools/echo-remover-ai', locale),
  });
}

export { default } from './echo-remover-client';
