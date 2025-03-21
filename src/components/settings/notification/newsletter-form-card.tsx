'use client';

import { FormError } from '@/components/shared/form-error';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { 
  subscribeAction, 
  unsubscribeAction, 
  isSubscribedAction 
} from '@/actions/newsletter';
import { cn } from '@/lib/utils';

interface NewsletterFormCardProps {
  className?: string;
}

/**
 * Newsletter subscription form card
 * 
 * Allows users to toggle their newsletter subscription status
 */
export function NewsletterFormCard({ className }: NewsletterFormCardProps) {
  const t = useTranslations('Dashboard.sidebar.settings.items.notification');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [isSubscriptionChecked, setIsSubscriptionChecked] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  // Create a schema for newsletter subscription
  const formSchema = z.object({
    subscribed: z.boolean().default(false),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscribed: false,
    },
  });

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (user?.email) {
        try {
          setIsUpdating(true);
          // Check if the user is already subscribed using server action
          const statusResult = await isSubscribedAction({ email: user.email });
          
          if (statusResult && statusResult.data?.success) {
            const isCurrentlySubscribed = statusResult.data.subscribed;
            setIsSubscriptionChecked(isCurrentlySubscribed);
            form.setValue('subscribed', isCurrentlySubscribed);
          } else {
            // Handle error from server action
            const errorMessage = statusResult?.data?.error;
            if (errorMessage) {
              console.error('Error checking subscription status:', errorMessage);
              setError(errorMessage);
            }
            // Default to not subscribed if there's an error
            setIsSubscriptionChecked(false);
            form.setValue('subscribed', false);
          }
        } catch (err) {
          console.error('Error checking subscription status:', err);
          // Default to not subscribed if there's an error
          setIsSubscriptionChecked(false);
          form.setValue('subscribed', false);
        } finally {
          setIsUpdating(false);
        }
      }
    };
    
    checkSubscriptionStatus();
  }, [user?.email, form]);

  // Check if user exists after all hooks are initialized
  if (!user) {
    return null;
  }

  // Handle checkbox change
  const handleSubscriptionChange = async (value: boolean) => {
    if (!user.email) {
      setError(t('newsletter.emailRequired'));
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      if (value) {
        // Subscribe to newsletter using server action
        const subscribeResult = await subscribeAction({ email: user.email });
        
        if (subscribeResult && subscribeResult.data?.success) {
          toast.success(t('newsletter.subscribeSuccess'));
          setIsSubscriptionChecked(true);
          form.setValue('subscribed', true);
        } else {
          const errorMessage = subscribeResult?.data?.error || t('newsletter.subscribeFail');
          toast.error(errorMessage);
          setError(errorMessage);
          // Reset checkbox if subscription failed
          form.setValue('subscribed', false);
        }
      } else {
        // Unsubscribe from newsletter using server action
        const unsubscribeResult = await unsubscribeAction({ email: user.email });
        
        if (unsubscribeResult && unsubscribeResult.data?.success) {
          toast.success(t('newsletter.unsubscribeSuccess'));
          setIsSubscriptionChecked(false);
          form.setValue('subscribed', false);
        } else {
          const errorMessage = unsubscribeResult?.data?.error || t('newsletter.unsubscribeFail');
          toast.error(errorMessage);
          setError(errorMessage);
          // Reset checkbox if unsubscription failed
          form.setValue('subscribed', true);
        }
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(t('newsletter.error'));
      toast.error(t('newsletter.error'));
      // Reset form to previous state on error
      form.setValue('subscribed', isSubscriptionChecked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-0", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {t('newsletter.title')}
        </CardTitle>
        <CardDescription>
          {t('newsletter.description')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subscribed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('newsletter.label')}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleSubscriptionChange(checked);
                      }}
                      disabled={isUpdating}
                      aria-readonly={isUpdating}
                      className="cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormError message={error} />
          </CardContent>
          <CardFooter className="mt-6 px-6 py-4 bg-muted rounded-none">
            <p className="text-sm text-muted-foreground">
              {t('newsletter.hint')}
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 