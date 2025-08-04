'use client';

import { HeaderSection } from '@/components/layout/header-section';
import { BorderBeam } from '@/components/magicui/border-beam';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getAssetUrl } from '@/config/cdn-config';
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-12.json
 */
export default function FeaturesSection() {
  const t = useTranslations('HomePage.features');
  type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4';
  const [activeItem, setActiveItem] = useState<ImageKey>('item-1');

  const images = {
    'item-1': {
      image: getAssetUrl('features1'),
      darkImage: getAssetUrl('features1'),
      alt: 'Voice Clone Feature One',
    },
    'item-2': {
      image: getAssetUrl('features2'),
      darkImage: getAssetUrl('features2'),
      alt: 'Voice Clone Feature Two',
    },
    'item-3': {
      image: getAssetUrl('features3'),
      darkImage: getAssetUrl('features3'),
      alt: 'Voice Clone Feature Three',
    },
    'item-4': {
      image: getAssetUrl('features4'),
      darkImage: getAssetUrl('features4'),
      alt: 'Voice Clone Feature Four',
    },
  };

  return (
    <section
      id="features"
      className="px-4 py-16 relative"
      style={{
        background:
          'linear-gradient(135deg, rgba(118, 75, 162, 0.14) 0%, rgba(102, 126, 234, 0.12) 50%, rgba(79, 172, 254, 0.15) 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20 relative z-10 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          subtitleAs="h2"
          description={t('description')}
          descriptionAs="p"
        />

        <div className="grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="lg:pr-0 text-left">
              <h3 className="text-3xl font-semibold lg:text-4xl text-gradient_indigo-purple leading-normal py-1">
                {t('title')}
              </h3>
              <p className="mt-4 text-muted-foreground">{t('description')}</p>
            </div>
            <Accordion
              type="single"
              value={activeItem}
              onValueChange={(value) => setActiveItem(value as ImageKey)}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Database className="size-4" />
                    {t('items.item-1.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-1.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Fingerprint className="size-4" />
                    {t('items.item-2.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-2.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <IdCard className="size-4" />
                    {t('items.item-3.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-3.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <ChartBarIncreasingIcon className="size-4" />
                    {t('items.item-4.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-4.description')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-background w-full relative flex overflow-hidden rounded-2xl border p-2 lg:h-auto lg:col-span-7">
            <div className="aspect-76/59 bg-background relative w-full rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center"
                >
                  <Image
                    src={images[activeItem].image}
                    className="w-full h-full object-cover dark:hidden"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                  <Image
                    src={images[activeItem].darkImage}
                    className="w-full h-full object-cover dark:block hidden"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-violet-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
