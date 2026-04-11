import { HeaderSection } from '@/components/layout/header-section';
import { CheckCircle2, CircleOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ComparisonSection() {
  const t = useTranslations('HomePage.comparison');
  const traditionalItems = [
    t('traditional.item-1'),
    t('traditional.item-2'),
    t('traditional.item-3'),
    t('traditional.item-4'),
  ];
  const voiceCloneItems = [
    t('voiceclone.item-1'),
    t('voiceclone.item-2'),
    t('voiceclone.item-3'),
    t('voiceclone.item-4'),
  ];

  return (
    <section
      id="comparison"
      className="relative px-4 py-16"
      style={{
        background:
          'linear-gradient(135deg, rgba(0, 201, 255, 0.11) 0%, rgba(146, 254, 157, 0.09) 50%, rgba(0, 242, 96, 0.13) 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-16 relative z-10">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {t('traditional.title')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {t('traditional.subtitle')}
              </h3>
            </div>

            <ul className="space-y-4">
              {traditionalItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CircleOff className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/70 p-8 shadow-sm dark:border-emerald-700/70 dark:bg-emerald-900/20">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                {t('voiceclone.title')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {t('voiceclone.subtitle')}
              </h3>
            </div>

            <ul className="space-y-4">
              {voiceCloneItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
