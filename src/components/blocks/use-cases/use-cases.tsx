import { HeaderSection } from '@/components/layout/header-section';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import type * as React from 'react';

export default function UseCasesSection() {
  const t = useTranslations('HomePage.useCases');
  const useCases = [
    {
      title: t('items.item-1.title'),
      description: t('items.item-1.description'),
    },
    {
      title: t('items.item-2.title'),
      description: t('items.item-2.description'),
    },
    {
      title: t('items.item-3.title'),
      description: t('items.item-3.description'),
    },
    {
      title: t('items.item-4.title'),
      description: t('items.item-4.description'),
    },
  ];

  return (
    <section
      id="use-cases"
      className="relative px-4 py-16"
      style={{
        background:
          'linear-gradient(135deg, rgba(183, 148, 246, 0.16) 0%, rgba(102, 126, 234, 0.14) 50%, rgba(118, 75, 162, 0.16) 100%)',
      }}
    >
      <div className="mx-auto max-w-5xl relative z-10">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {useCases.map((item) => (
            <UseCaseCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const UseCaseCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card className="group rounded-2xl border-white/60 bg-white/75 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-900/55">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};
