import Features2 from "@/components/blocks/features/features-2";
import Features8 from "@/components/blocks/features/features-8";

interface FeaturesPageProps {
  params: Promise<{ locale: string }>;
};

export default async function FeaturesPage(props: FeaturesPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Features2 />
        <Features8 />
      </div>
    </>
  );
}
