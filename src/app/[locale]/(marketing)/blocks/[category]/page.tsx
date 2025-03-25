import BlockPreview from '@/components/blocks/block-preview';
import { blocks, categories } from '@/components/blocks/blocks';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}): Promise<Metadata | undefined> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return constructMetadata({
    title: category + ' | ' + t('title'),
    description: t('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/blocks/${category}`,
  });
}

interface BlockCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function BlockCategoryPage({
  params,
}: BlockCategoryPageProps) {
  const { category } = await params;
  const categoryBlocks = blocks.filter((b) => b.category === category);

  if (categoryBlocks.length === 0) {
    notFound();
  }

  return (
    <>
      {categoryBlocks.map((block, index) => (
        <BlockPreview {...block} key={index} />
      ))}
    </>
  );
}
