'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useTranslations } from 'next-intl';

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
      image: '/blocks/charts.png',
      alt: 'Product Feature One',
    },
    'item-2': {
      image: '/blocks/music.png',
      alt: 'Product Feature Two',
    },
    'item-3': {
      image: '/blocks/mail2.png',
      alt: 'Product Feature Three',
    },
    'item-4': {
      image: '/blocks/payments.png',
      alt: 'Product Feature Four',
    },
  };

  return (
    <section className="py-16">
      <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance text-4xl lg:text-5xl font-semibold">
            {t('title')}
          </h2>
          <p>
            {t('description')}
          </p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
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
              <AccordionContent>
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
              <AccordionContent>
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
              <AccordionContent>
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
              <AccordionContent>
                {t('items.item-4.description')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-2xl border p-2">
            {/* <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div> */}
            <div className="aspect-76/59 bg-background relative rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
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
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
