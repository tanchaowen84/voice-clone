import { categories } from '@/components/blocks/blocks';
import BlocksNav from '@/components/blocks/blocks-nav';
import { PropsWithChildren } from 'react';

/**
 * TODO: bug to fix
 * 
 * when in zh locale, click blocks nav will redirect to /zh/blocks/logo
 * but the navbar is not updated with the new locale
 * 
 */
export default function CategoryLayout({ children }: PropsWithChildren) {
  return (
    <>
      <BlocksNav categories={categories} />
      <main>{children}</main>
    </>
  );
}
