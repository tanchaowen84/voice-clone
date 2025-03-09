import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

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
  return {
    title: fullTitle,
    description,
    keywords: siteConfig.keywords,
    creator: siteConfig.author,
    authors: [
      {
        name: siteConfig.author,
      },
    ],
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: fullTitle,
      description,
      siteName: title,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      site: siteConfig.url,
      creator: siteConfig.author,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
