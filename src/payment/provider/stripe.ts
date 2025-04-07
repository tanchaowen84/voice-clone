import { Stripe } from 'stripe';
import db from '@/db';
import { user, subscription } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { findPlanByPriceId, findPriceInPlan, getPlanById } from '../index';
import { CheckoutResult, CreateCheckoutParams, CreatePortalParams, Customer, GetCustomerParams, ListCustomerSubscriptionsParams, PaymentProvider, PaymentStatus, PaymentTypes, PlanInterval, PlanIntervals, PortalResult, Subscription } from '../types';

/**
 * Stripe payment provider implementation
 */
export class StripeProvider implements PaymentProvider {

  private stripe: Stripe;
  private webhookSecret: string;

  /**
   * Initialize Stripe provider with API key
   */
  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set.');
    }

    // Initialize Stripe without specifying apiVersion to use default/latest version
    this.stripe = new Stripe(apiKey);
    this.webhookSecret = webhookSecret;
  }

  /**
   * Create a customer in Stripe if not exists
   * 
   * NOTICE: if you want to delete user in database,
   * please delete customer in Stripe as well,
   * otherwise, no customer id will be saved in database.
   * 
   * @param email Customer email
   * @param name Optional customer name
   * @param metadata Optional metadata
   * @returns Stripe customer ID
   */
  private async createOrGetCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      // Search for existing customer, stripe.customers.retrieve does not work with email
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      // Find existing customer
      if (customers.data && customers.data.length > 0) {
        return customers.data[0].id;
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name: name || undefined,
        metadata,
      });

      // Update user record in database with the new customer ID
      await this.updateUserWithCustomerId(customer.id, email);

      return customer.id;
    } catch (error) {
      console.error('Create or get customer error:', error);
      throw new Error('Failed to create or get customer');
    }
  }

  /**
   * Updates a user record with a Stripe customer ID
   * @param customerId Stripe customer ID
   * @param email Customer email
   * @returns Promise that resolves when the update is complete
   */
  private async updateUserWithCustomerId(customerId: string, email: string): Promise<void> {
    try {
      // Update user record with customer ID if email matches
      const result = await db
        .update(user)
        .set({
          customerId: customerId,
          updatedAt: new Date()
        })
        .where(eq(user.email, email))
        .returning({ id: user.id });

      if (result.length > 0) {
        console.log(`Updated user ${email} with customer ID ${customerId}`);
      } else {
        console.log(`No user found with email ${email}`);
      }
    } catch (error) {
      console.error('Update user with customer ID error:', error);
      // Re-throw to be caught by the caller
      throw new Error('Failed to update user with customer ID');
    }
  }

  /**
   * Finds a user by customerId
   * @param customerId Stripe customer ID
   * @returns User ID or undefined if not found
   */
  private async findUserIdByCustomerId(customerId: string): Promise<string | undefined> {
    try {
      // Query the user table for a matching customerId
      const result = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.customerId, customerId))
        .limit(1);

      if (result.length > 0) {
        return result[0].id;
      }

      return undefined;
    } catch (error) {
      console.error('Find user by customer ID error:', error);
      return undefined;
    }
  }

  /**
   * Create a checkout session for a plan
   * @param params Parameters for creating the checkout session
   * @returns Checkout result
   */
  public async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const { planId, priceId, customerEmail, successUrl, cancelUrl, metadata, locale } = params;

    try {
      // Get plan and price
      const plan = getPlanById(planId);
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }

      // Free plan doesn't need a checkout session
      if (plan.isFree) {
        throw new Error('Cannot create checkout session for free plan');
      }

      // Find price in plan
      const price = findPriceInPlan(planId, priceId);
      if (!price) {
        throw new Error(`Price with ID ${priceId} not found in plan ${planId}`);
      }

      // Set up the line items
      const lineItems = [{
        price: priceId,
        quantity: 1,
      }];

      // Create checkout session parameters
      const checkoutParams: Stripe.Checkout.SessionCreateParams = {
        line_items: lineItems,
        mode: price.type === PaymentTypes.RECURRING ? 'subscription' : 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          planId,
          priceId,
          ...metadata,
        },
      };

      // Add locale if provided
      if (locale) {
        checkoutParams.locale = this.mapLocaleToStripeLocale(locale) as Stripe.Checkout.SessionCreateParams.Locale;
      }

      // Get customer name from metadata if available
      const customerName = metadata?.name;

      // Create or get customer
      const customerId = await this.createOrGetCustomer(
        customerEmail,
        customerName,
        metadata
      );

      // Add customer to checkout session
      checkoutParams.customer = customerId;

      // Add subscription data for recurring payments
      if (price.type === PaymentTypes.RECURRING) {
        // Initialize subscription_data with metadata
        checkoutParams.subscription_data = {
          metadata: {
            planId,
            priceId,
            ...metadata,
          },
        };

        // Add trial period if applicable
        if (price.trialPeriodDays && price.trialPeriodDays > 0) {
          checkoutParams.subscription_data.trial_period_days = price.trialPeriodDays;
        }
      }

      // Create the checkout session
      const session = await this.stripe.checkout.sessions.create(checkoutParams);

      return {
        url: session.url!,
        id: session.id,
      };
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a customer portal session
   * @param params Parameters for creating the portal
   * @returns Portal result
   */
  public async createCustomerPortal(params: CreatePortalParams): Promise<PortalResult> {
    const { customerId, returnUrl, locale } = params;

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
        locale: locale ? this.mapLocaleToStripeLocale(locale) as Stripe.BillingPortal.SessionCreateParams.Locale : undefined,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error('Create customer portal error:', error);
      throw new Error('Failed to create customer portal');
    }
  }

  /**
   * Get customer details
   * @param params Parameters for retrieving the customer
   * @returns Customer data or null if not found
   */
  public async getCustomer(params: GetCustomerParams): Promise<Customer | null> {
    const { customerId } = params;

    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      // customer may be deleted
      if (customer.deleted) {
        return null;
      }

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        metadata: customer.metadata as Record<string, string> || {},
      };
    } catch (error) {
      console.error('Get customer error:', error);
      return null;
    }
  }

  /**
   * List customer subscriptions
   * @param params Parameters for listing customer subscriptions
   * @returns Array of subscription objects
   */
  public async listCustomerSubscriptions(params: ListCustomerSubscriptionsParams): Promise<Subscription[]> {
    const { customerId, status, limit = 10 } = params;

    try {
      // Retrieve customer subscriptions
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: limit,
        expand: ['data.default_payment_method'],
        // Sort by creation date, newest first
        status: status as any, // Type cast to handle our custom status types
      });
      // console.log('list customer subscriptions:', subscriptions);

      // Map to our subscription model
      return subscriptions.data.map(subscription => {
        // determine the interval if available
        const interval = this.mapStripeIntervalToPlanInterval(subscription);

        // get priceId from subscription items (this is always available)
        const priceId = subscription.items.data[0]?.price.id;

        // get planId from config or metadata
        const foundPlan = findPlanByPriceId(priceId);
        const planId = foundPlan?.id || subscription.metadata.planId || 'unknown';

        return {
          id: subscription.id,
          customerId: subscription.customer as string,
          status: this.mapSubscriptionStatusToPaymentStatus(subscription.status),
          planId,
          priceId,
          interval,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000) : undefined,
          trialEndDate: subscription.trial_end
            ? new Date(subscription.trial_end * 1000) : undefined,
          createdAt: new Date(subscription.created * 1000),
        };
      });
    } catch (error) {
      console.error('List customer subscriptions error:', error);
      return [];
    }
  }

  /**
   * Handle webhook event
   * @param payload Raw webhook payload
   * @param signature Webhook signature
   */
  public async handleWebhookEvent(payload: string, signature: string): Promise<void> {
    try {
      // Verify the event signature if webhook secret is available
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
      const eventType = event.type;
      console.log(`handle webhook event, type: ${eventType}`);

      // Handle subscription events
      if (eventType.startsWith('customer.subscription.')) {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        // Process based on subscription status and event type
        switch (eventType) {
          case 'customer.subscription.created': {
            await this.onCreateSubscription(stripeSubscription);
            break;
          }
          case 'customer.subscription.updated': {
            await this.onUpdateSubscription(stripeSubscription);
            break;
          }
          case 'customer.subscription.deleted': {
            await this.onDeleteSubscription(stripeSubscription);
            break;
          }
        }
      } else if (eventType.startsWith('checkout.')) {
        // Handle checkout events
        if (eventType === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;

          // Only process one-time payments (likely for lifetime plan)
          if (session.mode === 'payment') {
            await this.onOnetimePayment(session);
          }
        }
      }
    } catch (error) {
      console.error('handle webhook event error:', error);
      throw new Error('Failed to handle webhook event');
    }
  }

  /**
   * Create subscription record
   * @param stripeSubscription Stripe subscription
   */
  private async onCreateSubscription(stripeSubscription: Stripe.Subscription): Promise<void> {
    console.log(`Create subscription for Stripe subscription ${stripeSubscription.id}`);
    const customerId = stripeSubscription.customer as string;

    // get priceId from subscription items (this is always available)
    const priceId = stripeSubscription.items.data[0]?.price.id;
    if (!priceId) {
      console.warn(`No priceId found for subscription ${stripeSubscription.id}`);
      return;
    }

    // get userId from metadata or find it by customerId from database
    let userId = stripeSubscription.metadata.userId;
    if (!userId) {
      const foundUserId = await this.findUserIdByCustomerId(customerId);
      if (!foundUserId) {
        console.warn(`No user found for customer ${customerId}, skipping subscription creation`);
        return;
      }
      userId = foundUserId;
      console.log(`Found userId ${userId} for customer ${customerId} from database`);
    } else {
      console.log(`Using userId ${userId} from subscription metadata`);
    }

    // get planId from metadata or find it by priceId from payment config
    let planId = stripeSubscription.metadata.planId;
    if (!planId) {
      const foundPlan = findPlanByPriceId(priceId);
      if (!foundPlan) {
        console.warn(`No plan found for price ${priceId}, skipping subscription creation`);
        return;
      }
      planId = foundPlan.id;
      console.log(`Found planId ${planId} for price ${priceId} from config`);
    } else {
      console.log(`Using planId ${planId} from subscription metadata`);
    }

    // prepare create fields
    const createFields: any = {
      id: randomUUID(),
      planId: planId,
      priceId: priceId,
      userId: userId,
      customerId: customerId,
      subscriptionId: stripeSubscription.id,
      interval: this.mapStripeIntervalToPlanInterval(stripeSubscription),
      status: this.mapSubscriptionStatusToPaymentStatus(stripeSubscription.status),
      periodStart: stripeSubscription.current_period_start ?
        new Date(stripeSubscription.current_period_start * 1000) : null,
      periodEnd: stripeSubscription.current_period_end ?
        new Date(stripeSubscription.current_period_end * 1000) : null,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      trialStart: stripeSubscription.trial_start ?
        new Date(stripeSubscription.trial_start * 1000) : null,
      trialEnd: stripeSubscription.trial_end ?
        new Date(stripeSubscription.trial_end * 1000) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.insert(subscription)
      .values(createFields)
      .returning({ id: subscription.id });

    if (result.length > 0) {
      console.log(`Created new subscription ${result[0].id} for Stripe subscription ${stripeSubscription.id}`);
    } else {
      console.warn(`No subscription created for Stripe subscription ${stripeSubscription.id}`);
    }
  }

  /**
   * Update subscription record
   * @param stripeSubscription Stripe subscription
   */
  private async onUpdateSubscription(stripeSubscription: Stripe.Subscription): Promise<void> {
    console.log(`Update subscription for Stripe subscription ${stripeSubscription.id}`);

    // get priceId from subscription items (this is always available)
    const priceId = stripeSubscription.items.data[0]?.price.id;
    if (!priceId) {
      console.warn(`No priceId found for subscription ${stripeSubscription.id}`);
      return;
    }

    // we can not trust the planId from metadata when updating subscription, so get it from config
    let planId;
    let shouldUpdatePlanId = false;
    const foundPlan = findPlanByPriceId(priceId);
    if (!foundPlan) {
      shouldUpdatePlanId = false;
      console.warn(`No plan found for price ${priceId}, did you update the plans and prices in payment config?`);
    } else {
      planId = foundPlan.id;
      shouldUpdatePlanId = true;
      console.log(`Found planId ${planId} for price ${priceId} from config`);
    }

    // prepare update fields
    const updateFields: any = {
      priceId: priceId,
      interval: this.mapStripeIntervalToPlanInterval(stripeSubscription),
      status: this.mapSubscriptionStatusToPaymentStatus(stripeSubscription.status),
      periodStart: stripeSubscription.current_period_start ?
        new Date(stripeSubscription.current_period_start * 1000) : undefined,
      periodEnd: stripeSubscription.current_period_end ?
        new Date(stripeSubscription.current_period_end * 1000) : undefined,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      trialStart: stripeSubscription.trial_start ?
        new Date(stripeSubscription.trial_start * 1000) : undefined,
      trialEnd: stripeSubscription.trial_end ?
        new Date(stripeSubscription.trial_end * 1000) : undefined,
      updatedAt: new Date()
    };

    // Only include planId if it should be updated
    if (shouldUpdatePlanId && planId) {
      updateFields.planId = planId;
    }

    const result = await db
      .update(subscription)
      .set(updateFields)
      .where(eq(subscription.subscriptionId, stripeSubscription.id))
      .returning({ id: subscription.id });

    if (result.length > 0) {
      console.log(`Updated subscription ${result[0].id} for Stripe subscription ${stripeSubscription.id}`);
    } else {
      console.warn(`No subscription found for Stripe subscription ${stripeSubscription.id}`);
    }
  }

  /**
   * Update subscription record, set status to canceled
   * @param stripeSubscription Stripe subscription
   */
  private async onDeleteSubscription(stripeSubscription: Stripe.Subscription): Promise<void> {
    const result = await db
      .update(subscription)
      .set({
        status: this.mapSubscriptionStatusToPaymentStatus(stripeSubscription.status),
        updatedAt: new Date()
      })
      .where(eq(subscription.subscriptionId, stripeSubscription.id))
      .returning({ id: subscription.id });

    if (result.length > 0) {
      console.log(`Marked subscription ${stripeSubscription.id} as canceled`);
    } else {
      console.warn(`No subscription found to cancel for Stripe subscription ${stripeSubscription.id}`);
    }
  }

  /**
   * Handle one-time payment
   * @param session Stripe checkout session
   */
  private async onOnetimePayment(session: Stripe.Checkout.Session): Promise<void> {
    const customerId = session.customer as string;
    console.log(`Handle onetime payment for customer ${customerId}`);

    // get priceId from session metadata, not from line items
    // const priceId = session.line_items?.data[0]?.price?.id;
    const priceId = session.metadata?.priceId;
    if (!priceId) {
      console.warn(`No priceId found for checkout session ${session.id}`);
      return;
    }

    // find plan by priceId, we can not be sure if there is planId in metadata
    const plan = findPlanByPriceId(priceId);
    if (!plan) {
      console.warn(`No plan found for price ${priceId}`);
      return;
    }

    if (plan.isLifetime) {
      // Find user by customerId
      const userResult = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.customerId, customerId))
        .limit(1);

      if (userResult.length === 0) {
        console.warn(`No user found with customerId ${customerId}`);
        return;
      }

      const userId = userResult[0].id;
      
      // Create a subscription record for lifetime membership
      const now = new Date();
      // Far future date for lifetime membership (100 years)
      const farFutureDate = new Date(now);
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
      
      const result = await db
        .insert(subscription)
        .values({
          id: randomUUID(),
          planId: plan.id,
          priceId: priceId,
          interval: 'year', // Using year for lifetime plans
          userId: userId,
          customerId: customerId,
          subscriptionId: session.id, // Use checkout session ID
          status: 'active', // Always active for lifetime
          periodStart: now,
          periodEnd: farFutureDate, // Far future date
          cancelAtPeriodEnd: false,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: subscription.id });

      if (result.length === 0) {
        console.warn(`Failed to create lifetime subscription for user ${userId}`);
        return;
      } else {
        console.log(`Created lifetime subscription for user ${userId}`);
      }
    } else {
      // handle other onetime payments if needed, like increase user credits
      console.log(`Onetime payment for non-lifetime plan: ${plan.id}, customerId: ${customerId}`);
    }
  }

  /**
   * Map Stripe subscription interval to our own interval types
   * @param subscription Stripe subscription
   * @returns PlanInterval
   */
  private mapStripeIntervalToPlanInterval(subscription: Stripe.Subscription): PlanInterval {
    switch (subscription.items.data[0]?.plan.interval) {
      case 'month':
        return PlanIntervals.MONTH;
      case 'year':
        return PlanIntervals.YEAR;
      default:
        return PlanIntervals.MONTH;
    }
  }

  /**
   * Map application locale to Stripe's supported locales
   * @param locale Application locale (e.g., 'en', 'zh-CN')
   * @returns Stripe locale string
   */
  private mapLocaleToStripeLocale(locale: string): string {
    // Stripe supported locales as of 2023: 
    // https://stripe.com/docs/js/appendix/supported_locales
    const stripeLocales = [
      'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fil',
      'fr', 'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'ms',
      'mt', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv',
      'th', 'tr', 'vi', 'zh'
    ];

    // First check if the exact locale is supported
    if (stripeLocales.includes(locale)) {
      return locale;
    }

    // If not, try to get the base language
    const baseLocale = locale.split('-')[0];
    if (stripeLocales.includes(baseLocale)) {
      return baseLocale;
    }

    // Default to auto to let Stripe detect the language
    return 'auto';
  }

  /**
   * Convert Stripe subscription status to PaymentStatus
   * We narrow down the status to our own status types
   * @param status Stripe subscription status
   * @returns PaymentStatus
   */
  private mapSubscriptionStatusToPaymentStatus(status: Stripe.Subscription.Status): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      active: 'active',
      canceled: 'canceled',
      incomplete: 'incomplete',
      incomplete_expired: 'failed',
      past_due: 'past_due',
      trialing: 'trialing',
      unpaid: 'unpaid',
      paused: 'past_due', // Map paused to past_due as a reasonable default
    };

    return statusMap[status] || 'failed';
  }
}