import { PaymentTypes, PlanIntervals } from '@/payment/types';
import type { WebsiteConfig } from '@/types';
import { getAssetUrl } from './cdn-config';

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  metadata: {
    theme: {
      defaultTheme: 'default',
      enableSwitch: true,
    },
    mode: {
      defaultMode: 'system',
      enableSwitch: true,
    },
    images: {
      ogImage: getAssetUrl('ogImage'),
      logoLight: getAssetUrl('logoLight'),
      logoDark: getAssetUrl('logoDark'),
    },
    social: {
      github: 'https://github.com/voiceclone',
      twitter: 'https://twitter.com/voiceclone',
      discord: 'https://discord.gg/voiceclone',
    },
  },
  features: {
    enableDiscordWidget: false,
    enableUpgradeCard: true,
    enableAffonsoAffiliate: false,
    enablePromotekitAffiliate: false,
    enableAIPages: false,
    enableMagicUIPage: false,
  },
  routes: {
    defaultLoginRedirect: '/settings/profile',
  },
  analytics: {
    enableVercelAnalytics: false,
    enableSpeedInsights: false,
  },
  auth: {
    enableGoogleLogin: true,
    enableGithubLogin: true,
    enablePasswordLogin: false,
    enableEmailVerification: false,
    enableForgotPassword: false,
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        flag: '🇺🇸',
        name: 'English',
      },
      // zh: {
      //   flag: '🇨🇳',
      //   name: '中文',
      // },
    },
  },
  blog: {
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  mail: {
    provider: 'resend',
    fromEmail: 'MkSaaS <support@mksaas.com>',
    supportEmail: 'MkSaaS <support@mksaas.com>',
  },

  storage: {
    provider: 's3',
  },
  payment: {
    provider: 'creem',
  },
  price: {
    plans: {
      free: {
        id: 'free',
        prices: [],
        isFree: true,
        isLifetime: false,
      },
      // ========== Stripe Configuration (Commented Out) ==========
      // pro: {
      //   id: 'pro',
      //   prices: [
      //     {
      //       type: PaymentTypes.SUBSCRIPTION,
      //       priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
      //       amount: 990,
      //       currency: 'USD',
      //       interval: PlanIntervals.MONTH,
      //     },
      //     {
      //       type: PaymentTypes.SUBSCRIPTION,
      //       priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
      //       amount: 9900,
      //       currency: 'USD',
      //       interval: PlanIntervals.YEAR,
      //     },
      //   ],
      //   isFree: false,
      //   isLifetime: false,
      //   recommended: true,
      // },
      // lifetime: {
      //   id: 'lifetime',
      //   prices: [
      //     {
      //       type: PaymentTypes.ONE_TIME,
      //       priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!,
      //       amount: 19900,
      //       currency: 'USD',
      //     },
      //   ],
      //   isFree: false,
      //   isLifetime: true,
      // },

      // ========== Creem Configuration ==========
      basic: {
        id: 'basic',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BASIC_MONTHLY!,
            amount: 1000, // $10.00
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BASIC_YEARLY!,
            amount: 10000, // $100.00 (10 months price for 12 months)
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: true,
      },
      pro: {
        id: 'pro',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_MONTHLY!,
            amount: 2500, // $25.00
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_YEARLY!,
            amount: 25000, // $250.00 (10 months price for 12 months)
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: false,
      },
    },
  },
};
