import { VoiceDemoSection } from '@/components/demo/voice-demo-section';
import { HeaderSection } from '@/components/layout/header-section';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function DemoSection() {
  const t = useTranslations('HomePage.demo');

  return (
    <section
      id="demo"
      className="px-4 py-16 relative"
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
          {/* Voice Demo Section */}
          <VoiceDemoSection />

          {/* Demo Features */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DemoFeature
              title={t('features.feature-1.title')}
              description={t('features.feature-1.description')}
            />
            <DemoFeature
              title={t('features.feature-2.title')}
              description={t('features.feature-2.description')}
            />
            <DemoFeature
              title={t('features.feature-3.title')}
              description={t('features.feature-3.description')}
            />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg">
              <LocaleLink href="/#hero">{t('tryItNow')}</LocaleLink>
            </Button>
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
    <div className="text-center space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
