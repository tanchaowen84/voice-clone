import { CustomPage } from '@/components/page/custom-page';
import { getCustomPage } from '@/lib/page/get-custom-page';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
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
  const page = await getCustomPage('privacy-policy', locale);
  
  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      url: `${getBaseUrl()}/privacy-policy`
    }
  };
}

export default async function PrivacyPolicyPage(props: NextPageProps) {
  const params = await props.params;
  if (!params) {
    notFound();
  }

  const locale = params.locale as string;
  const page = await getCustomPage('privacy-policy', locale);
  
  if (!page) {
    notFound();
  }

  return (
    <CustomPage
      title={page.title}
      description={page.description}
      date={page.date}
      content={page.body.code}
    />
  );
} 