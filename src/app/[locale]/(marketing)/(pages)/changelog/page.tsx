import { ReleaseCard } from '@/components/release/release-card';
import { getReleases } from '@/lib/release/get-releases';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '@/styles/mdx.css';

export async function generateMetadata(
  props: NextPageProps
): Promise<Metadata> {
  const params = await props.params;
  if (!params) {
    return {};
  }

  const locale = params.locale as string;

  return {
    title: 'Changelog',
    description: 'Track all updates and improvements to our platform',
    openGraph: {
      title: 'Changelog',
      description: 'Track all updates and improvements to our platform',
      type: 'article',
      url: `${getBaseUrl()}/changelog`,
    },
  };
}

export default async function ChangelogPage(props: NextPageProps) {
  const params = await props.params;
  if (!params) {
    notFound();
  }

  const locale = params.locale as string;
  const releases = await getReleases(locale);

  if (!releases || releases.length === 0) {
    notFound();
  }

  const t = await getTranslations('ChangelogPage');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Releases */}
      <div className="mt-8">
        {releases.map((release) => (
          <ReleaseCard
            key={release.slug}
            title={release.title}
            description={release.description}
            date={release.date}
            version={release.version}
            content={release.body.code}
          />
        ))}
      </div>
    </div>
  );
}
