import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import { getBaseUrl } from './urls/get-base-url';

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  canonicalUrl,
  image = siteConfig.image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title} - ${siteConfig.title}` : siteConfig.title;
  const ogImageUrl = new URL(`${getBaseUrl()}/${image}`);
  
  return {
    title: fullTitle,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: getBaseUrl(),
      title: fullTitle,
      description,
      siteName: title,
      images: [ogImageUrl.toString()],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
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
