import { websiteConfig } from '@/config/website';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { getBaseUrl } from './urls/urls';
import { defaultMessages } from '@/i18n/messages';

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
  title = title || defaultMessages.Metadata.name;
  description = description || defaultMessages.Metadata.description;
  image = image || websiteConfig.metadata.ogImage;
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
      locale: 'en_US',
      url: canonicalUrl,
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
    manifest: `${getBaseUrl()}/manifest.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
