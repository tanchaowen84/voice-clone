import { PricePlan, Price } from "@/payment/types";
import { websiteConfig } from "@/config/website";

/**
 * Get plan by ID
 * @param planId Plan ID
 * @returns Plan or undefined if not found
 */
export const getPlanById = (planId: string): PricePlan | undefined => {
  return websiteConfig.payment.plans[planId];
};

/**
 * Get all price plans (without name/description/features)
 * @returns Array of price plans
 */
export const getAllPricePlans = (): PricePlan[] => {
  return Object.values(websiteConfig.payment.plans);
};

/**
 * Find price in a plan by ID
 * @param planId Plan ID
 * @param priceId Price ID (Stripe price ID)
 * @returns Price or undefined if not found
 */
export const findPriceInPlan = (planId: string, priceId: string): Price | undefined => {
  const plan = getPlanById(planId);
  if (!plan) {
    console.error(`Plan with ID ${planId} not found`);
    return undefined;
  }
  return plan.prices.find(price => price.priceId === priceId);
};

/**
 * Find plan by price ID
 * @param priceId Price ID (Stripe price ID)
 * @returns Plan or undefined if not found
 */
export const findPlanByPriceId = (priceId: string): PricePlan | undefined => {
  const plans = getAllPricePlans();
  for (const plan of plans) {
    const matchingPrice = plan.prices.find(price => price.priceId === priceId);
    if (matchingPrice) {
      return plan;
    }
  }
  return undefined;
};
