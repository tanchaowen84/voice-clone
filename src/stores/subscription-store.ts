import { getCustomerSubscriptionAction } from '@/actions/get-customer-subscription';
import { getUserLifetimeStatusAction } from '@/actions/get-user-lifetime-status';
import { Session } from '@/lib/auth';
import { getAllPlans } from '@/payment';
import { Subscription } from '@/payment/types';
import { create } from 'zustand';

/**
 * Subscription state interface
 */
export interface SubscriptionState {
  // Subscription data
  subscription: Subscription | null;
  // Current user's plan information
  currentPlanId: string | null;
  // Lifetime member
  isLifetimeMember: boolean;
  // Free plan
  isFreePlan: boolean;
  // Active subscription
  hasActiveSubscription: boolean;
  // Loading state 
  isLoading: boolean;
  // Error state
  error: string | null;
  // Last fetch time
  lastFetched: number | null;

  // Actions
  fetchSubscription: (user: Session['user'] | null | undefined) => Promise<void>;
  resetState: () => void;
}

/**
 * Subscription store using Zustand
 * Manages the user's subscription data globally
 */
export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  subscription: null,
  currentPlanId: null,
  isLifetimeMember: false,
  isFreePlan: true,
  hasActiveSubscription: false,
  isLoading: false,
  error: null,
  lastFetched: null,

  /**
   * Fetch subscription data for the current user
   * @param user Current user from auth session
   */
  fetchSubscription: async (user) => {
    // Skip if already loading
    if (get().isLoading) return;

    // Skip if no user is provided
    if (!user) {
      set({
        subscription: null,
        currentPlanId: null,
        isLifetimeMember: false,
        isFreePlan: true,
        hasActiveSubscription: false,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }

    // Check if user is a lifetime member directly from the database
    let isLifetimeMember = false;
    try {
      const result = await getUserLifetimeStatusAction({ userId: user.id });
      if (result?.data?.success) {
        isLifetimeMember = result.data.isLifetimeMember || false;
        console.log('check user lifetime status result', result);
      }
    } catch (error) {
      console.error('check user lifetime status error:', error);
    }

    // Get all available plans
    const plans = getAllPlans();
    // Skip fetching if user doesn't have a customer ID (except for lifetime members)
    if (!user.customerId && !isLifetimeMember) {
      const freePlan = plans.find(plan => plan.isFree);
      set({
        subscription: null,
        currentPlanId: freePlan?.id || null,
        isLifetimeMember: false,
        isFreePlan: true,
        hasActiveSubscription: false,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }

    // If lifetime member, set the lifetime plan
    if (isLifetimeMember) {
      const lifetimePlan = plans.find(plan => plan.isLifetime);
      set({
        subscription: null,
        currentPlanId: lifetimePlan?.id || null,
        isLifetimeMember: true,
        isFreePlan: false,
        hasActiveSubscription: false,
        error: null,
        lastFetched: Date.now()
      });
      return;
    }

    // Fetch subscription data
    set({ isLoading: true, error: null });

    try {
      const result = await getCustomerSubscriptionAction();

      if (result?.data?.success) {
        const subscriptionData = result.data.data;

        // Set subscription state
        if (subscriptionData) {
          // Determine if subscription is active
          const isActive = subscriptionData.status === 'active'
            || subscriptionData.status === 'trialing';

          set({
            subscription: subscriptionData,
            currentPlanId: subscriptionData.planId,
            isLifetimeMember: false,
            isFreePlan: false,
            hasActiveSubscription: isActive,
            error: null,
            lastFetched: Date.now()
          });
        } else {
          // No subscription found - set to free plan
          const freePlan = plans.find(plan => plan.isFree);
          set({
            subscription: null,
            currentPlanId: freePlan?.id || null,
            isLifetimeMember: false,
            isFreePlan: true,
            hasActiveSubscription: false,
            error: null,
            lastFetched: Date.now()
          });
        }
      } else {
        // Error fetching subscription
        set({
          error: result?.data?.error || 'Failed to fetch subscription',
          isLoading: false,
          lastFetched: Date.now()
        });
      }
    } catch (error) {
      console.error('Subscription fetch error:', error);
      set({
        error: 'Failed to fetch subscription data',
        isLoading: false,
        lastFetched: Date.now()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Reset subscription state
   */
  resetState: () => {
    set({
      subscription: null,
      currentPlanId: null,
      isLifetimeMember: false,
      isFreePlan: true,
      hasActiveSubscription: false,
      isLoading: false,
      error: null,
      lastFetched: null
    });
  }
})); 