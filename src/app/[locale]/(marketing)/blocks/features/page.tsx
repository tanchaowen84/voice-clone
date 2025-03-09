import Features from '@/components/blocks/features/features';
import Features2 from '@/components/blocks/features/features-2';
import Features4 from '@/components/blocks/features/features-4';
import Features5 from '@/components/blocks/features/features-5';
import Features6 from '@/components/blocks/features/features-6';
import Features7 from '@/components/blocks/features/features-7';
import Features8 from '@/components/blocks/features/features-8';
import Features9 from '@/components/blocks/features/features-9';

interface FeaturesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FeaturesPage(props: FeaturesPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Features />

        <Features2 />

        <Features4 />

        <Features5 />

        <Features6 />

        <Features7 />

        <Features8 />

        <Features9 />
      </div>
    </>
  );
}
