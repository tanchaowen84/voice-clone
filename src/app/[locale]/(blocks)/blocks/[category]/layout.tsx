import CategoryNavigation from '@/components/blocks/blocks-nav';
import { categories } from '@/components/blocks/blocks';

export default function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CategoryNavigation categories={categories} />
      <main>{children}</main>
    </>
  );
}
