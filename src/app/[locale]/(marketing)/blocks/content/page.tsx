import Content from '@/components/blocks/content/content';
import Content2 from '@/components/blocks/content/content-2';
import Content3 from '@/components/blocks/content/content-3';
import Content4 from '@/components/blocks/content/content-4';
import Content5 from '@/components/blocks/content/content-5';
import Content6 from '@/components/blocks/content/content-6';

interface ContentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContentPage(props: ContentPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Content />

        <Content2 />

        <Content3 />

        <Content4 />

        <Content5 />

        <Content6 />
      </div>
    </>
  );
}
