'use client';

import { createPortalAction } from '@/actions/create-customer-portal-session';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface CustomerPortalButtonProps {
  userId: string;
  returnUrl?: string;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Customer Portal Button
 *
 * This client component opens the Stripe customer portal
 * It's used to let customers manage their billing, subscriptions, and payment methods
 *
 * NOTICE: Login is required when using this button.
 */
export function CustomerPortalButton({
  userId,
  returnUrl,
  variant = 'default',
  size = 'default',
  className,
  children,
}: CustomerPortalButtonProps) {
  const t = useTranslations('Dashboard.settings.billing.CustomerPortalButton');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // Create customer portal session using server action
      const result = await createPortalAction({
        userId,
        returnUrl,
      });

      // Redirect to customer portal
      if (result?.data?.success && result.data.data?.url) {
        window.location.href = result.data.data?.url;
      } else {
        console.error('Create customer portal error, result:', result);
        toast.error(t('createCustomerPortalFailed'));
      }
    } catch (error) {
      console.error('Create customer portal error:', error);
      toast.error(t('createCustomerPortalFailed'));
    } finally {
      setIsLoading(false);
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
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          {t('loading')}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
