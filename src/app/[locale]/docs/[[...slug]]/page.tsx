import { UiOverview } from '@/components/docs/ui-overview';
import { Wrapper } from '@/components/docs/preview/wrapper';
import { HoverCard, HoverCardContent, HoverCardTrigger, } from '@/components/ui/hover-card';
import { LOCALES } from '@/i18n/routing';
import { source } from '@/lib/docs/source';
import { MDXContent } from '@content-collections/mdx/react';
import Link from 'fumadocs-core/link';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import { createGenerator } from 'fumadocs-typescript';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { MDXComponents } from 'mdx/types';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ComponentProps, FC, ReactNode } from 'react';
import * as Preview from '@/components/docs/preview';

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

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

interface DocPageProps {
  params: Promise<{
    slug?: string[];
    locale: Locale
  }>;
}

/**
 * Doc Page
 * 
 * ref:
 * https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/docs/%5B...slug%5D/page.tsx
 */
export default async function DocPage({
  params,
}: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);

  if (!page) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  const preview = page.data.preview;

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
        {/* Preview Rendered Component */}
        {preview ? <PreviewRenderer preview={preview} /> : null}

        {/* MDX Content */}
        <MDXContent
          code={page.data.body}
          components={{
            ...defaultMdxComponents,
            ...((await import('lucide-react')) as unknown as MDXComponents),
            a: ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: page.file.dirname,
              });

              if (!found) return <Link href={href} {...props} />;

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    <p className="font-medium">{found.page.data.title}</p>
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              );
            },
            Popup,
            PopupContent,
            PopupTrigger,
            Tabs,
            Tab,
            TypeTable,
            AutoTypeTable: (props) => (
              <AutoTypeTable 
                generator={createGenerator()} 
                {...props} 
              />
            ),
            Accordion,
            Accordions,
            Wrapper,
            File,
            Folder,
            Files,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
            UiOverview,

            ...(await import('@/content/docs/components/tabs.client')),
            ...(await import('@/content/docs/theme.client')),
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}
