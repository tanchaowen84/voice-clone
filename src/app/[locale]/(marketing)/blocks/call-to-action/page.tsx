import CallToAction from '@/components/blocks/call-to-action/call-to-action';
import CallToAction2 from '@/components/blocks/call-to-action/call-to-action-2';
import CallToAction3 from '@/components/blocks/call-to-action/call-to-action-3';
import { Locale } from 'next-intl';

interface CallToActionPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * https://nsui.irung.me/call-to-action
 */
export default async function CallToActionPage(props: CallToActionPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <CallToAction />
        <CallToAction2 />
        <CallToAction3 />
      </div>
    </>
  );
}
