import FAQs from '@/components/sections/faq/faqs';
import { Locale } from 'next-intl';

interface FAQPageProps {
  params: Promise<{ locale: Locale }>;
}

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
