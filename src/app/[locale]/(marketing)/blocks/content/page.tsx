import Content2 from "@/components/blocks/content/content-2";

interface ContentPageProps {
  params: Promise<{ locale: string }>;
};

export default async function ContentPage(props: ContentPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Content2 />
      </div>
    </>
  );
}
