import { categories } from '@/components/tailark/blocks';
import BlocksNav from '@/components/tailark/blocks-nav';
import { websiteConfig } from '@/config/website';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

/**
 * The locale inconsistency issue has been fixed in the BlocksNav component
 */
export default function BlockCategoryLayout({ children }: PropsWithChildren) {
  // Check if blocks pages are enabled
  if (!websiteConfig.features.enableBlocksPages) {
    notFound();
  }

  return (
    <>
      <BlocksNav categories={categories} />

      <main>{children}</main>
    </>
  );
}
