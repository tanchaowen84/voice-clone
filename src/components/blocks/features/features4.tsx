import { ActivityIcon, DraftingCompassIcon, MailIcon, ZapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

/**
 * Features4Section is Features3Section with a different layout
 * 
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-5.json
 */
export default function Features4Section() {
  const t = useTranslations('HomePage.features3');

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/blocks/payments.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/blocks/payments-light.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-semibold">
                {t('title')}
              </h2>
              <p className="mt-6">
                {t('description')}
              </p>
            </div>

            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <MailIcon className="size-5" />
                {t('feature-1')}
              </li>
              <li>
                <ZapIcon className="size-5" />
                {t('feature-2')}
              </li>
              <li>
                <ActivityIcon className="size-5" />
                {t('feature-3')}
              </li>
              <li>
                <DraftingCompassIcon className="size-5" />
                {t('feature-4')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
