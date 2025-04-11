'use client';

import { PaymentConfig } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 * 
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * @returns The price plans with translated content
 */
export function getPricePlans(): PaymentConfig {
  const t = useTranslations('PricePlans');
  const paymentConfig = websiteConfig.payment;

  // Add translated content to each plan
  if (paymentConfig.plans.free) {
    paymentConfig.plans.free.name = t('free.name');
    paymentConfig.plans.free.description = t('free.description');
    paymentConfig.plans.free.features = [
      t('free.features.projects'),
      t('free.features.analytics'),
      t('free.features.support'),
      t('free.features.storage')
    ];
    paymentConfig.plans.free.limits = [
      t('free.limits.domains'),
      t('free.limits.brands'),
      t('free.limits.updates')
    ];
  }

  if (paymentConfig.plans.pro) {
    paymentConfig.plans.pro.name = t('pro.name');
    paymentConfig.plans.pro.description = t('pro.description');
    paymentConfig.plans.pro.features = [
      t('pro.features.projects'),
      t('pro.features.analytics'),
      t('pro.features.support'),
      t('pro.features.storage'),
      t('pro.features.domains'),
    ];
    paymentConfig.plans.pro.limits = [
      t('pro.limits.brands'),
      t('pro.limits.updates')
    ];
  }

  if (paymentConfig.plans.lifetime) {
    paymentConfig.plans.lifetime.name = t('lifetime.name');
    paymentConfig.plans.lifetime.description = t('lifetime.description');
    paymentConfig.plans.lifetime.features = [
      t('lifetime.features.proFeatures'),
      t('lifetime.features.security'),
      t('lifetime.features.support'),
      t('lifetime.features.storage'),
      t('lifetime.features.integrations'),
      t('lifetime.features.branding'),
      t('lifetime.features.updates')
    ];
    paymentConfig.plans.lifetime.limits = [
    ];
  }

  return paymentConfig;
} 