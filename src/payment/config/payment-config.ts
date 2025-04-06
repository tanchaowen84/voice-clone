import { PaymentConfig, PaymentTypes, PlanIntervals, PricePlan } from "../types";

/**
 * Free plan definition
 */
const freePlan: PricePlan = {
  id: "free",
  name: "Free",
  description: "Basic features for personal use",
  features: [
    "Up to 3 projects",
    "Basic analytics",
    "Community support",
    "1 GB storage"
  ],
  prices: [],
  isFree: true,
  isLifetime: false,
};

/**
 * Pro plan definition
 */
const proPlan: PricePlan = {
  id: "pro",
  name: "Pro",
  description: "Advanced features for professionals",
  features: [
    "Unlimited projects",
    "Advanced analytics",
    "Priority support",
    "10 GB storage",
    "Custom domains",
    "Team collaboration"
  ],
  prices: [
    {
      type: PaymentTypes.RECURRING,
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      amount: 990,
      currency: "USD",
      interval: PlanIntervals.MONTH,
    },
    {
      type: PaymentTypes.RECURRING,
      priceId: process.env.STRIPE_PRICE_PRO_YEARLY!,
      amount: 9900,
      currency: "USD",
      interval: PlanIntervals.YEAR,
    },
  ],
  isFree: false,
  isLifetime: false,
  recommended: true,
};

/**
 * Lifetime plan definition
 */
const lifetimePlan: PricePlan = {
  id: "lifetime",
  name: "Lifetime",
  description: "Premium features with one-time payment",
  features: [
    "All Pro features",
    "Enterprise-grade security",
    "Dedicated support",
    "100 GB storage",
    "Advanced integrations",
    "Custom branding",
    "Lifetime updates"
  ],
  prices: [
    {
      type: PaymentTypes.ONE_TIME,
      priceId: process.env.STRIPE_PRICE_LIFETIME!,
      amount: 19900,
      currency: "USD",
    },
  ],
  isFree: false,
  isLifetime: true,
};

/**
 * Payment configuration
 */
export const paymentConfig: PaymentConfig = {
  plans: {
    free: freePlan,
    pro: proPlan,
    lifetime: lifetimePlan,
  },
  defaultCurrency: "USD",
}; 