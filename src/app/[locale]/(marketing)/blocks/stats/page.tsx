import Stats from '@/components/blocks/stats/stats';
import Stats2 from '@/components/blocks/stats/stats-2';
import Stats3 from '@/components/blocks/stats/stats-3';
import Stats4 from '@/components/blocks/stats/stats-4';

interface StatsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * https://nsui.irung.me/stats
 */
export default async function StatsPage(props: StatsPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Stats />

        <Stats2 />

        <Stats3 />

        <Stats4 />
      </div>
    </>
  );
}
