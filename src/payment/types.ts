import { Locale } from 'next-intl';

/**
 * Interval types for subscription plans
 */
export type PlanInterval = PlanIntervals.MONTH | PlanIntervals.YEAR;

export enum PlanIntervals {
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Payment type (recurring or one-time)
 */
export type PaymentType = PaymentTypes.RECURRING | PaymentTypes.ONE_TIME;

export enum PaymentTypes {
  RECURRING = 'recurring',
  ONE_TIME = 'one_time',
}

/**
 * Status of a payment or subscription
 */
export type PaymentStatus =
  | 'active'     // Subscription is active
  | 'canceled'   // Subscription has been canceled
  | 'incomplete' // Payment not completed
  | 'past_due'   // Payment is past due
  | 'trialing'   // In trial period
  | 'unpaid'     // Payment failed
  | 'completed'  // One-time payment completed
  | 'processing' // Payment is processing
  | 'failed';    // Payment failed

/**
 * Price definition for a plan
 */
export interface Price {
  type: PaymentType;                 // Type of payment (recurring or one_time)
  productId: string;                 // Stripe price ID (TODO: change to priceId)
  amount: number;                    // Price amount in currency units (dollars, euros, etc.)
  currency: string;                  // Currency code (e.g., USD)
  interval?: PlanInterval;           // Billing interval for recurring payments
  trialPeriodDays?: number;          // Free trial period in days
}

/**
 * Price plan definition
 */
export interface PricePlan {
  id: string;                        // Unique identifier for the plan
  name: string;                      // Display name of the plan
  description: string;               // Description of the plan features
  features: string[];                // List of features included in this plan
  prices: Price[];                   // Available prices for this plan
  isFree: boolean;                   // Whether this is a free plan
  isLifetime: boolean;               // Whether this is a lifetime plan
  recommended?: boolean;             // Whether to mark this plan as recommended in UI
}

/**
 * Payment configuration
 */
export interface PaymentConfig {
  plans: Record<string, PricePlan>;  // Plans indexed by ID
  defaultCurrency: string;           // Default currency
}

/**
 * Customer data
 */
export interface Customer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

/**
 * Subscription data
 */
export interface Subscription {
  id: string;
  customerId: string;
  status: PaymentStatus;
  planId: string;
  priceId: string;
  interval?: PlanInterval;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialEndDate?: Date;
  createdAt: Date;
}

/**
 * Payment data
 */
export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
  metadata?: Record<string, string>;
}

/**
 * Parameters for creating a checkout session
 */
export interface CreateCheckoutParams {
  planId: string;
  priceId: string;
  customerEmail: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  locale?: Locale;
}

/**
 * Result of creating a checkout session
 */
export interface CheckoutResult {
  url: string;
  id: string;
}

/**
 * Parameters for creating a customer portal
 */
export interface CreatePortalParams {
  customerId: string;
  returnUrl?: string;
  locale?: Locale;
}

/**
 * Result of creating a customer portal
 */
export interface PortalResult {
  url: string;
}

/**
 * Parameters for retrieving a customer
 */
export interface GetCustomerParams {
  customerId: string;
}

/**
 * Parameters for retrieving a subscription
 */
export interface GetSubscriptionParams {
  subscriptionId: string;
}

/**
 * Parameters for listing customer subscriptions
 */
export interface ListCustomerSubscriptionsParams {
  customerId: string;
  status?: PaymentStatus | PaymentStatus[];
  limit?: number;
}

/**
 * Payment provider interface
 */
export interface PaymentProvider {
  /**
   * Create a checkout session for a plan
   */
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;

  /**
   * Create a customer portal session
   */
  createCustomerPortal(params: CreatePortalParams): Promise<PortalResult>;

  /**
   * Get customer details
   */
  getCustomer(params: GetCustomerParams): Promise<Customer | null>;

  /**
   * Get subscription details
   */
  getSubscription(params: GetSubscriptionParams): Promise<Subscription | null>;

  /**
   * List customer subscriptions
   */
  listCustomerSubscriptions(params: ListCustomerSubscriptionsParams): Promise<Subscription[]>;

  /**
   * Handle webhook events
   */
  handleWebhookEvent(payload: string, signature: string): Promise<void>;
}
