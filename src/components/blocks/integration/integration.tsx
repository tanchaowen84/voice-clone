import { HeaderSection } from '@/components/layout/header-section';
// Placeholder logos - replace with actual integration logos
const Gemini = () => <div className="w-8 h-8 bg-blue-500 rounded" />;
const Replit = () => <div className="w-8 h-8 bg-orange-500 rounded" />;
const MagicUI = () => <div className="w-8 h-8 bg-purple-500 rounded" />;
const VSCodium = () => <div className="w-8 h-8 bg-blue-600 rounded" />;
const MediaWiki = () => <div className="w-8 h-8 bg-green-500 rounded" />;
const GooglePaLM = () => <div className="w-8 h-8 bg-red-500 rounded" />;
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type * as React from 'react';

export default function IntegrationSection() {
  const t = useTranslations('HomePage.integration');

  return (
    <section id="integration" className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <IntegrationCard
            title={t('items.item-1.title')}
            description={t('items.item-1.description')}
          >
            <Gemini />
          </IntegrationCard>

          <IntegrationCard
            title={t('items.item-2.title')}
            description={t('items.item-2.description')}
          >
            <Replit />
          </IntegrationCard>

          <IntegrationCard
            title={t('items.item-3.title')}
            description={t('items.item-3.description')}
          >
            <MagicUI />
          </IntegrationCard>

          <IntegrationCard
            title={t('items.item-4.title')}
            description={t('items.item-4.description')}
          >
            <VSCodium />
          </IntegrationCard>

          <IntegrationCard
            title={t('items.item-5.title')}
            description={t('items.item-5.description')}
          >
            <MediaWiki />
          </IntegrationCard>

          <IntegrationCard
            title={t('items.item-6.title')}
            description={t('items.item-6.description')}
          >
            <GooglePaLM />
          </IntegrationCard>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  children,
  link = '#',
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  link?: string;
}) => {
  const t = useTranslations('HomePage.integration');

  return (
    <Card className="p-6 hover:bg-accent dark:hover:bg-accent">
      <div className="relative">
        <div className="*:size-10">{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1 pr-2 shadow-none"
          >
            <LocaleLink href={link}>
              {t('learnMore')}
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </LocaleLink>
          </Button>
        </div>
      </div>
    </Card>
  );
};
