'use client';

import { createCheckoutAction } from '@/actions/create-checkout-session';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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
 * It's used to initiate the checkout process for a specific plan and price
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
  const [isLoading, setIsLoading] = useState(false);

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
        window.location.href = result.data.data?.url;
      } else {
        console.error('Error creating checkout session:', result);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Here you could display an error notification
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
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
} 