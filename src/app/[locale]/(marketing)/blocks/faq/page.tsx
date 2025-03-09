import FAQs from "@/components/blocks/faq/faqs";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
};

/**
 * https://nsui.irung.me/faqs
 */
export default async function FAQPage(props: FAQPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <FAQs />
      </div>
    </>
  );
}
