import { source } from '@/lib/docs/source';
import { MDXContent } from '@content-collections/mdx/react';
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from 'next-intl';

export default async function Page({
  params,
}: {
  params: { slug?: string[]; locale: Locale };
}) {
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[]; locale: Locale };
}) {
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
