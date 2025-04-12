'use client';

import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';
import { PricePlan } from '@/payment/types';

/**
 * Get price plans with translations for client components
 * 
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * @returns The price plans with translated content
 */
export function getPricePlans(): Record<string, PricePlan> {
  const t = useTranslations('PricePlans');
  const paymentConfig = websiteConfig.payment;
  const plans: Record<string, PricePlan> = {};

  // Add translated content to each plan
  if (paymentConfig.plans.free) {
    plans.free = {
      ...paymentConfig.plans.free,
      name: t('free.name'),
      description: t('free.description'),
      features: [
        t('free.features.projects'),
        t('free.features.analytics'),
        t('free.features.support'),
        t('free.features.storage')
      ],
      limits: [
        t('free.limits.domains'),
        t('free.limits.brands'),
        t('free.limits.updates')
      ]
    };
  }

  if (paymentConfig.plans.pro) {
    plans.pro = {
      ...paymentConfig.plans.pro,
      name: t('pro.name'),
      description: t('pro.description'),
      features: [
        t('pro.features.projects'),
        t('pro.features.analytics'),
        t('pro.features.support'),
        t('pro.features.storage'),
        t('pro.features.domains'),
      ],
      limits: [
        t('pro.limits.brands'),
        t('pro.limits.updates')
      ]
    };
  }

  if (paymentConfig.plans.lifetime) {
    plans.lifetime = {
      ...paymentConfig.plans.lifetime,
      name: t('lifetime.name'),
      description: t('lifetime.description'),
      features: [
        t('lifetime.features.proFeatures'),
        t('lifetime.features.security'),
        t('lifetime.features.support'),
        t('lifetime.features.storage'),
        t('lifetime.features.integrations'),
        t('lifetime.features.branding'),
        t('lifetime.features.updates')
      ],
      limits: []
    };
  }

  return plans;
} 