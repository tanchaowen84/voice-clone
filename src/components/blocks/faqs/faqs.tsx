'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IconName } from 'lucide-react/dynamic';
import { useLocale, useTranslations } from 'next-intl';

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQs() {
  const locale = useLocale();
  const t = useTranslations('HomePage.faqs');

  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      icon: 'calendar-clock',
      question: t('items.item-1.question'),
      answer: t('items.item-1.answer'),
    },
    {
      id: 'item-2',
      icon: 'wallet',
      question: t('items.item-2.question'),
      answer: t('items.item-2.answer'),
    },
    {
      id: 'item-3',
      icon: 'refresh-cw',
      question: t('items.item-3.question'),
      answer: t('items.item-3.answer'),
    },
    {
      id: 'item-4',
      icon: 'hand-coins',
      question: t('items.item-4.question'),
      answer: t('items.item-4.answer'),
    },
    {
      id: 'item-5',
      icon: 'mail',
      question: t('items.item-5.question'),
      answer: t('items.item-5.answer'),
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto max-w-5xl mt-12">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
