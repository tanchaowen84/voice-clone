import AdsenseScript from '@/components/ads/adsense';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
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

import EchoRemoverClient from './echo-remover-client';

export default function EchoRemoverPage() {
  return (
    <>
      <AdsenseScript />
      <EchoRemoverClient />
      <BackToHomeCTA
        title="Remove Echo from More Audio"
        description="Explore our complete suite of AI audio tools for professional content creation."
      />
    </>
  );
}
