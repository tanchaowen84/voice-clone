'use client';

import { PaymentConfig } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 * 
 * NOTICE: This function should only be used in client components
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
      t('pro.features.collaboration')
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
  }

  return paymentConfig;
} 