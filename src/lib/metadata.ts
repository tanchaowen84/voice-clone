import { websiteConfig } from '@/config';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { getBaseUrl } from './urls/get-base-url';

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title,
  description,
  canonicalUrl,
  image,
  noIndex = false,
  locale = routing.defaultLocale,
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
  locale?: string;
} = {}): Metadata {
  image = image || websiteConfig.metadata.image;
  const ogImageUrl = new URL(`${getBaseUrl()}${image}`);
  return {
    title,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US', // TODO: use locale
      url: getBaseUrl(),
      title,
      description,
      siteName: title,
      images: [ogImageUrl.toString()],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
      site: getBaseUrl(),
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL(getBaseUrl()),
    manifest: `${getBaseUrl()}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
