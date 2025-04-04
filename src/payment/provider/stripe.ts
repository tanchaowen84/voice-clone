import Stripe from 'stripe';
import { PaymentProvider, CreateCheckoutParams, CheckoutResult, CreatePortalParams, PortalResult, GetCustomerParams, Customer, GetSubscriptionParams, Subscription, PaymentStatus, PlanInterval, PaymentType, PaymentTypes, ListCustomerSubscriptionsParams } from '../types';
import { getPlanById, findPriceInPlan } from '../index';
import db from '@/db/index';
import { user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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
   * Convert Stripe subscription status to PaymentStatus
   * @param status Stripe subscription status
   * @returns PaymentStatus
   */
  private mapSubscriptionStatus(status: Stripe.Subscription.Status): PaymentStatus {
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

  /**
   * Convert Stripe payment intent status to PaymentStatus
   * @param status Stripe payment intent status
   * @returns PaymentStatus
   */
  private mapPaymentIntentStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      succeeded: 'completed',
      processing: 'processing',
      requires_payment_method: 'incomplete',
      requires_confirmation: 'incomplete',
      requires_action: 'incomplete',
      requires_capture: 'processing',
      canceled: 'canceled',
    };

    return statusMap[status] || 'failed';
  }

  /**
   * Create a customer in Stripe if not exists
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
      // Search for existing customer
      // stripe.customers.retrieve(customerId) does not work with email
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

      // Update user record in database with the new customer ID (non-blocking)
      this.updateUserWithCustomerId(customer.id, email).catch(error => {
        console.error('Update user with customer ID failed:', error);
      });

      return customer.id;
    } catch (error) {
      console.error('Create or get customer failed:', error);
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
        console.log(`Updated user ${result[0].id} with customer ID ${customerId}`);
      } else {
        console.log(`No user found with email ${email}`);
      }
    } catch (error) {
      console.error('Update user with customer ID failed:', error);
      throw error; // Re-throw to be caught by the caller
    }
  }

  /**
   * Create a checkout session for a plan
   * @param params Parameters for creating the checkout session
   * @returns Checkout result
   */
  public async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const { planId, priceId, customerEmail, successUrl, cancelUrl, metadata } = params;

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
      // TODO: add locale to checkout params
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

      // Add trial period if it's a subscription and has trial days
      if (price.type === PaymentTypes.RECURRING
        && price.trialPeriodDays && price.trialPeriodDays > 0) {
        checkoutParams.subscription_data = {
          trial_period_days: price.trialPeriodDays,
          metadata: {
            planId,
            priceId,
            ...metadata,
          },
        };
      }

      // Create the checkout session
      const session = await this.stripe.checkout.sessions.create(checkoutParams);

      return {
        url: session.url!,
        id: session.id,
      };
    } catch (error) {
      console.error('Create checkout session failed:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a customer portal session
   * @param params Parameters for creating the portal
   * @returns Portal result
   */
  public async createCustomerPortal(params: CreatePortalParams): Promise<PortalResult> {
    const { customerId, returnUrl } = params;

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error('Create customer portal failed:', error);
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
      console.error('Get customer failed:', error);
      return null;
    }
  }

  /**
   * Get subscription details
   * @param params Parameters for retrieving the subscription
   * @returns Subscription data or null if not found
   */
  public async getSubscription(params: GetSubscriptionParams): Promise<Subscription | null> {
    const { subscriptionId } = params;

    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      // Determine the interval if available
      let interval: PlanInterval | undefined = undefined;
      if (subscription.items.data[0]?.plan.interval === 'month' || subscription.items.data[0]?.plan.interval === 'year') {
        interval = subscription.items.data[0]?.plan.interval as PlanInterval;
      }

      // Extract plan ID and price ID from metadata or use defaults
      const planId = subscription.metadata.planId || 'unknown';
      const priceId = subscription.metadata.priceId || subscription.items.data[0]?.price.id || 'unknown';

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: this.mapSubscriptionStatus(subscription.status),
        planId,
        priceId,
        interval,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : undefined,
        trialEndDate: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
        createdAt: new Date(subscription.created * 1000),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Get subscription failed:', error);
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

      // Map to our subscription model
      return subscriptions.data.map(subscription => {
        // Determine the interval if available
        let interval: PlanInterval | undefined = undefined;
        if (subscription.items.data[0]?.plan.interval === 'month' || subscription.items.data[0]?.plan.interval === 'year') {
          interval = subscription.items.data[0]?.plan.interval as PlanInterval;
        }

        // Extract plan ID and price ID from metadata or use defaults
        const planId = subscription.metadata.planId || 'unknown';
        const priceId = subscription.metadata.priceId || subscription.items.data[0]?.price.id || 'unknown';

        return {
          id: subscription.id,
          customerId: subscription.customer as string,
          status: this.mapSubscriptionStatus(subscription.status),
          planId,
          priceId,
          interval,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : undefined,
          trialEndDate: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : undefined,
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date(),
        };
      });
    } catch (error) {
      console.error('List customer subscriptions failed:', error);
      return [];
    }
  }

  /**
   * Handle webhook event
   * @param payload Raw webhook payload
   * @param signature Webhook signature
   */
  public async handleWebhookEvent(payload: string, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      // Verify the event signature if webhook secret is available
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
      // Process the event with the default handler
      await this.defaultWebhookHandler(event);
    } catch (error) {
      console.error('handle webhook event error:', error);
      throw new Error('Failed to handle webhook event');
    }
  }

  /**
   * Default webhook handler for common event types
   * @param event Stripe event
   */
  private async defaultWebhookHandler(event: Stripe.Event): Promise<void> {
    const eventType = event.type;
    console.log(`handle webhook event, type: ${eventType}`);
    
    try {
      // Handle subscription events
      if (eventType.startsWith('customer.subscription.')) {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Processing subscription ${subscription.id}, status: ${subscription.status}`);
        
        // Get customerId from subscription
        const customerId = subscription.customer as string;
        
        // Process based on subscription status and event type
        switch (eventType) {
          case 'customer.subscription.created': {
            // New subscription created - update user record with subscription ID and status
            const result = await db
              .update(user)
              .set({
                subscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                updatedAt: new Date()
              })
              .where(eq(user.customerId, customerId))
              .returning({ id: user.id });
              
            if (result.length > 0) {
              console.log(`Updated user ${customerId} with subscription ${subscription.id}`);
            } else {
              console.warn(`Update operation performed but no rows were updated for customerId ${customerId}`);
            }
            
            break;
          }
          case 'customer.subscription.updated': {
            // Subscription was updated - update status
            await db
              .update(user)
              .set({
                subscriptionStatus: subscription.status,
                updatedAt: new Date()
              })
              .where(eq(user.customerId, customerId) && eq(user.subscriptionId, subscription.id));
              
            console.log(`Updated subscription status for user ${customerId} to ${subscription.status}`);
            break;
          }
          case 'customer.subscription.deleted': {
            // Subscription was cancelled/deleted - remove from user
            await db
              .update(user)
              .set({
                subscriptionId: null,
                subscriptionStatus: 'canceled',
                updatedAt: new Date()
              })
              .where(eq(user.customerId, customerId) && eq(user.subscriptionId, subscription.id));
              
            console.log(`Removed subscription from user ${customerId}`);
            break;
          } 
          case 'customer.subscription.trial_will_end': {
            // Trial ending soon - we could trigger an email notification here
            console.log(`Trial ending soon for subscription ${subscription.id}, customerId ${customerId}`);
            break;
          }
        }
      }
      // Handle checkout events
      else if (eventType.startsWith('checkout.')) {
        if (eventType === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Only process one-time payments (likely for lifetime plan)
          if (session.mode === 'payment') {
            const customerId = session.customer as string;
            console.log(`Processing one-time payment for customer ${customerId}`);
            
            // Check if this was for a lifetime plan (via metadata)
            const metadata = session.metadata || {};
            const planId = metadata.planId;
            
            if (planId === 'lifetime') {
              // Mark user as lifetime member
              await db
                .update(user)
                .set({
                  lifetimeMember: true,
                  updatedAt: new Date()
                })
                .where(eq(user.customerId, customerId));
                
              console.log(`Marked user ${customerId} as lifetime member`);
            } else {
              // Handle other one-time payments if needed, like increase user credits
              console.log(`One-time payment for non-lifetime plan: ${planId}, customerId: ${customerId}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('default webhook handler error:', error);
      throw new Error('Failed to handle webhook event');
    }
  }
}