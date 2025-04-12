import { useTranslations } from "next-intl";

export default function StatsSection() {
  const t = useTranslations('HomePage.stats');

  return (
    <section className="py-12 md:py-20 w-full bg-muted">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">
            {t('title')}
          </h2>
          <p>
            {t('description')}
          </p>
        </div>

        <div className="grid gap-12 divide-y-0 *:text-center md:grid-cols-3 md:gap-2 md:divide-x">
          <div className="space-y-4">
            <div className="text-5xl font-bold">+1200</div>
            <p>{t('items.item-1.title')}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">22 Million</div>
            <p>{t('items.item-2.title')}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">+500</div>
            <p>{t('items.item-3.title')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
