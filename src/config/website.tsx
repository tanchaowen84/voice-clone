import { PaymentTypes, PlanIntervals } from '@/payment/types';
import { WebsiteConfig } from '@/types';

/**
 * website config, without translations
 */
export const websiteConfig: WebsiteConfig = {
  metadata: {
    theme: "default",
    ogImage: '/og.png',
    logoLight: '/logo.png',
    logoDark: '/logo-dark.png',
    social: {
      github: 'https://github.com/MkSaaSHQ',
      twitter: 'https://x.com/mksaascom',
      youtube: 'https://www.youtube.com/@MkSaaS',
      blueSky: 'https://bsky.app/profile/mksaas.com',
      linkedin: 'https://linkedin.com/company/mksaas',
      facebook: 'https://facebook.com/mksaas',
      instagram: 'https://instagram.com/mksaas',
      tiktok: 'https://tiktok.com/@mksaas',
    },
  },  
  blog: {
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  mail: {
    provider: 'resend',
    from: 'support@mksaas.com',
    to: 'support@mksaas.com',
  },
  newsletter: {
    provider: 'resend',
  },
  storage: {
    provider: 's3',
  },
  payment: {
    provider: 'stripe',
    plans: {
      free: {
        id: "free",
        prices: [],
        isFree: true,
        isLifetime: false,
      },
      pro: {
        id: "pro",
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
            amount: 990,
            currency: "USD",
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
            amount: 9900,
            currency: "USD",
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: true,
      },
      lifetime: {
        id: "lifetime",
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!,
            amount: 19900,
            currency: "USD",
          },
        ],
        isFree: false,
        isLifetime: true,
      }
    }
  }
};
