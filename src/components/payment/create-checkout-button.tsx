'use client';

import { createCheckoutAction } from '@/actions/create-checkout-session';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface CheckoutButtonProps {
  planId: string;
  priceId: string;
  metadata?: Record<string, string>;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link' | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Checkout Button
 * 
 * This client component creates a Stripe checkout session and redirects to it
 * It's used to initiate the checkout process for a specific plan and price.
 * 
 * NOTICE: Login is required when using this button.
 */
export function CheckoutButton({
  planId,
  priceId,
  metadata,
  variant = 'default',
  size = 'default',
  className,
  children,
}: CheckoutButtonProps) {
  const t = useTranslations('PricingPage.CheckoutButton');
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = authClient.useSession();

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // Create checkout session using server action
      const result = await createCheckoutAction({
        planId,
        priceId,
        metadata,
      });

      // Redirect to checkout
      if (result && result.data?.success && result.data.data?.url) {
        // TODO: Always refetch session to ensure we have the latest user data
        if (refetch) {
          await refetch();
        }
        
        // redirect to checkout page
        window.location.href = result.data.data?.url;
      } else {
        console.error('Create checkout session error, result:', result);
        toast.error(t('checkoutFailed'));
      }
    } catch (error) {
      console.error('Create checkout session error:', error);
      toast.error(t('checkoutFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          {t('loading')}
        </>
      ) : (
        children
      )}
    </Button>
  );
} 