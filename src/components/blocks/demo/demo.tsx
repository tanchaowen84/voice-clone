import { VoiceDemoSection } from '@/components/demo/voice-demo-section';
import { HeaderSection } from '@/components/layout/header-section';
import { useTranslations } from 'next-intl';

export default function DemoSection() {
  const t = useTranslations('HomePage.demo');
  const proofItems = [
    {
      title: t('features.feature-1.title'),
      description: t('features.feature-1.description'),
    },
    {
      title: t('features.feature-2.title'),
      description: t('features.feature-2.description'),
    },
    {
      title: t('features.feature-3.title'),
      description: t('features.feature-3.description'),
    },
  ];

  return (
    <section
      id="demo"
      className="relative scroll-mt-24 px-4 py-16"
      style={{
        background:
          'linear-gradient(135deg, rgba(142, 209, 252, 0.18) 0%, rgba(159, 122, 234, 0.15) 50%, rgba(183, 148, 246, 0.18) 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl relative z-10">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-12 space-y-8">
          <VoiceDemoSection />

          <div className="grid gap-4 lg:grid-cols-3">
            {proofItems.map((item) => (
              <DemoFeature
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const DemoFeature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-5 text-left shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/55">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
};
