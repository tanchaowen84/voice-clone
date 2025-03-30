import { LOCALES } from '@/i18n/routing';
import { source } from '@/lib/docs/source';
import { MDXContent } from '@content-collections/mdx/react';
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const locales = LOCALES;
  const slugParams = source.generateParams();
  const params = locales.flatMap(locale =>
    slugParams.map(param => ({
      locale,
      slug: param.slug
    }))
  );

  return params;
}

export async function generateMetadata({
  params,
}: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);
  if (!page) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}

interface DocPageProps {
  params: Promise<{
    slug?: string[];
    locale: Locale
  }>;
}

export default async function Page({
  params,
}: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);

  if (!page) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  return (
    <DocsPage toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <DocsTitle>
        {page.data.title}
      </DocsTitle>
      <DocsDescription>
        {page.data.description}
      </DocsDescription>
      <DocsBody>
        <MDXContent
          code={page.data.body}
          components={{
            ...defaultMdxComponents,
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            // you can add other MDX components here
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}
