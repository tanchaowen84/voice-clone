import { getCustomerSubscriptionAction } from '@/actions/get-customer-subscription';
import { getUserLifetimeStatusAction } from '@/actions/get-user-lifetime-status';
import { Session } from '@/lib/auth';
import { getAllPlans, getPlanById } from '@/payment';
import { Subscription, PricePlan } from '@/payment/types';
import { create } from 'zustand';

/**
 * Payment state interface
 */
export interface PaymentState {
  // Current user's plan
  currentPlan: PricePlan | null;
  // Subscription data
  subscription: Subscription | null;
  // Loading state 
  isLoading: boolean;
  // Error state
  error: string | null;
  // Last fetch time
  lastFetched: number | null;

  // Actions
  fetchPayment: (user: Session['user'] | null | undefined) => Promise<void>;
  resetState: () => void;
}

/**
 * Payment store using Zustand
 * Manages the user's payment and subscription data globally
 */
export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Initial state
  currentPlan: null,
  subscription: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  /**
   * Fetch payment and subscription data for the current user
   * @param user Current user from auth session
   */
  fetchPayment: async (user) => {
    // Skip if already loading
    if (get().isLoading) return;

    // Skip if no user is provided
    if (!user) {
      set({
        currentPlan: null,
        subscription: null,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }

    // Fetch subscription data
    set({ isLoading: true, error: null });

    // Check if user is a lifetime member directly from the database
    let isLifetimeMember = false;
    try {
      const result = await getUserLifetimeStatusAction({ userId: user.id });
      if (result?.data?.success) {
        isLifetimeMember = result.data.isLifetimeMember || false;
        console.log('check user lifetime status result', result);
      } else {
        console.warn('check user lifetime status failed');
      }
    } catch (error) {
      console.error('check user lifetime status error:', error);
    }

    // Get all available plans
    const plans = getAllPlans();
    const freePlan = plans.find(plan => plan.isFree);
    const lifetimePlan = plans.find(plan => plan.isLifetime);

    // If lifetime member, set the lifetime plan
    if (isLifetimeMember) {
      console.log('setting lifetime plan for user', user.id);
      set({
        currentPlan: lifetimePlan || null,
        subscription: null,
        isLoading: false,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }
    
    // Skip fetching if user doesn't have a customer ID (except for lifetime members)
    if (!user.customerId) {
      console.log('setting free plan for user', user.id);
      set({
        currentPlan: freePlan || null,
        subscription: null,
        isLoading: false,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }

    try {
      const result = await getCustomerSubscriptionAction();
      if (result?.data?.success) {
        const subscriptionData = result.data.data;

        // Set subscription state
        if (subscriptionData) {
          const plan = plans.find(p => p.id === subscriptionData.planId) || null;
          console.log('subscription found, setting plan for user', user.id, plan?.id);
          set({
            currentPlan: plan,
            subscription: subscriptionData,
            isLoading: false,
            error: null,
            lastFetched: Date.now()
          });
        } else { // No subscription found - set to free plan
          console.log('no subscription found, setting free plan for user', user.id);
          set({
            currentPlan: freePlan || null,
            subscription: null,
            isLoading: false,
            error: null,
            lastFetched: Date.now()
          });
        }
      } else { // Failed to fetch subscription
        console.warn('Failed to fetch subscription for user', user.id, result?.data?.error);
        set({
          error: result?.data?.error || 'Failed to fetch payment data',
          isLoading: false,
          lastFetched: Date.now()
        });
      }
    } catch (error) {
      console.error('Fetch payment data error:', error);
      set({
        error: 'Failed to fetch payment data',
        isLoading: false,
        lastFetched: Date.now()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Reset payment state
   */
  resetState: () => {
    set({
      currentPlan: null,
      subscription: null,
      isLoading: false,
      error: null,
      lastFetched: null
    });
  }
})); 