import Testimonials from '@/components/sections/testimonials/testimonials';
import Testimonials2 from '@/components/sections/testimonials/testimonials-2';
import Testimonials4 from '@/components/sections/testimonials/testimonials-4';
import Testimonials5 from '@/components/sections/testimonials/testimonials-5';
import Testimonials6 from '@/components/sections/testimonials/testimonials-6';
import { Locale } from 'next-intl';

interface TestimonialsPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * https://nsui.irung.me/testimonials
 */
export default async function TestimonialsPage(props: TestimonialsPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Testimonials />

        <Testimonials2 />

        <Testimonials4 />

        <Testimonials5 />

        <Testimonials6 />
      </div>
    </>
  );
}
