'use client';

import { createPortalAction } from '@/actions/create-customer-portal-session';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CustomerPortalButtonProps {
  customerId: string;
  returnUrl?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link' | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Customer Portal Button
 * 
 * This client component opens the Stripe customer portal
 * It's used to let customers manage their billing, subscriptions, and payment methods
 */
export function CustomerPortalButton({
  customerId,
  returnUrl,
  variant = 'outline',
  size = 'default',
  className,
  children,
}: CustomerPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // Create customer portal session using server action
      const result = await createPortalAction({
        customerId,
        returnUrl,
      });

      // Redirect to customer portal
      if (result && result.data?.success && result.data.data?.url) {
        window.location.href = result.data.data?.url;
      }

      // TODO: Handle error
    } catch (error) {
      console.error('Error creating customer portal:', error);
      setIsLoading(false);
      // Here you could display an error notification
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className, 'cursor-pointer')}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children || 'Manage Billing'
      )}
    </Button>
  );
} 