import { PaymentProvider, PricePlan, PaymentConfig, Customer, Subscription, Payment, PaymentStatus, PlanInterval, PaymentType, Price, CreateCheckoutParams, CheckoutResult, CreatePortalParams, PortalResult, getSubscriptionsParams } from "./types";
import { StripeProvider } from "./provider/stripe";
import { paymentConfig } from "./config/payment-config";

/**
 * Default payment configuration
 */
export const defaultPaymentConfig: PaymentConfig = paymentConfig;

/**
 * Global payment provider instance
 */
let paymentProvider: PaymentProvider | null = null;

/**
 * Initialize the payment provider
 * @returns initialized payment provider
 */
export const initializePaymentProvider = (): PaymentProvider => {
  if (!paymentProvider) {
    paymentProvider = new StripeProvider();
  }
  return paymentProvider;
};

/**
 * Get the payment provider
 * @returns current payment provider instance
 * @throws Error if provider is not initialized
 */
export const getPaymentProvider = (): PaymentProvider => {
  if (!paymentProvider) {
    return initializePaymentProvider();
  }
  return paymentProvider;
};

/**
 * Create a checkout session for a plan
 * @param params Parameters for creating the checkout session
 * @returns Checkout result
 */
export const createCheckout = async (
  params: CreateCheckoutParams
): Promise<CheckoutResult> => {
  const provider = getPaymentProvider();
  return provider.createCheckout(params);
};

/**
 * Create a customer portal session
 * @param params Parameters for creating the portal
 * @returns Portal result
 */
export const createCustomerPortal = async (
  params: CreatePortalParams
): Promise<PortalResult> => {
  const provider = getPaymentProvider();
  return provider.createCustomerPortal(params);
};

/**
 * Handle webhook event
 * @param payload Raw webhook payload
 * @param signature Webhook signature
 */
export const handleWebhookEvent = async (
  payload: string,
  signature: string
): Promise<void> => {
  const provider = getPaymentProvider();
  await provider.handleWebhookEvent(payload, signature);
};

/**
 * List customer subscriptions
 * @param params Parameters for listing customer subscriptions
 * @returns Array of subscriptions
 */
export const getSubscriptions = async (
  params: getSubscriptionsParams
): Promise<Subscription[]> => {
  const provider = getPaymentProvider();
  return provider.getSubscriptions(params);
};

/**
 * Get plan by ID
 * @param planId Plan ID
 * @returns Plan or undefined if not found
 */
export const getPlanById = (planId: string): PricePlan | undefined => {
  return defaultPaymentConfig.plans[planId];
};

/**
 * Get all available plans
 * @returns Array of price plans
 */
export const getAllPlans = (): PricePlan[] => {
  return Object.values(defaultPaymentConfig.plans);
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
  const plans = getAllPlans();
  for (const plan of plans) {
    const matchingPrice = plan.prices.find(price => price.priceId === priceId);
    if (matchingPrice) {
      return plan;
    }
  }
  return undefined;
};

// Export types for convenience
export type {
  PaymentProvider,
  PricePlan,
  PaymentConfig,
  Price,
  PaymentType,
  Customer,
  Subscription,
  Payment,
  PaymentStatus,
  PlanInterval,
  CreateCheckoutParams,
  CheckoutResult,
  CreatePortalParams,
  PortalResult,
  getSubscriptionsParams as ListCustomerSubscriptionsParams,
};
