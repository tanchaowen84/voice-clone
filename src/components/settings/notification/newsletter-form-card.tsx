'use client';

import { checkNewsletterStatusAction } from '@/actions/check-newsletter-status';
import { subscribeNewsletterAction } from '@/actions/subscribe-newsletter';
import { unsubscribeNewsletterAction } from '@/actions/unsubscribe-newsletter';
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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface NewsletterFormCardProps {
  className?: string;
}

/**
 * Newsletter subscription form card
 * 
 * Allows users to toggle their newsletter subscription status
 */
export function NewsletterFormCard({ className }: NewsletterFormCardProps) {
  const t = useTranslations('Dashboard.settings.notification');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [isSubscriptionChecked, setIsSubscriptionChecked] = useState(false);
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

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
      if (currentUser?.email) {
        try {
          setIsLoading(true);
          // Check if the user is already subscribed using server action
          const statusResult = await checkNewsletterStatusAction({ email: currentUser.email });

          if (statusResult && statusResult.data?.success) {
            const isCurrentlySubscribed = statusResult.data.subscribed;
            setIsSubscriptionChecked(isCurrentlySubscribed);
            form.setValue('subscribed', isCurrentlySubscribed);
          } else {
            // Handle error from server action
            const errorMessage = statusResult?.data?.error;
            if (errorMessage) {
              console.error('check subscription status error:', errorMessage);
              setError(errorMessage);
            }
            // Default to not subscribed if there's an error
            setIsSubscriptionChecked(false);
            form.setValue('subscribed', false);
          }
        } catch (error) {
          console.error('check subscription status error:', error);
          // Default to not subscribed if there's an error
          setIsSubscriptionChecked(false);
          form.setValue('subscribed', false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkSubscriptionStatus();
  }, [currentUser?.email, form]);

  // Check if user exists after all hooks are initialized
  if (!currentUser) {
    return null;
  }

  // Handle checkbox change
  const handleSubscriptionChange = async (value: boolean) => {
    if (!currentUser.email) {
      setError(t('newsletter.emailRequired'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (value) {
        // Subscribe to newsletter using server action
        const subscribeResult = await subscribeNewsletterAction({ email: currentUser.email });

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
        const unsubscribeResult = await unsubscribeNewsletterAction({ email: currentUser.email });

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
    } catch (error) {
      console.error('newsletter subscription error:', error);
      setError(t('newsletter.error'));
      toast.error(t('newsletter.error'));
      // Reset form to previous state on error
      form.setValue('subscribed', isSubscriptionChecked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-0", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
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
                    <div className="relative flex items-center">
                      {isLoading && (
                        <Loader2Icon className="mr-2 size-4 animate-spin text-primary" />
                      )}
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleSubscriptionChange(checked);
                        }}
                        disabled={isLoading}
                        aria-readonly={isLoading}
                        className="cursor-pointer"
                      />
                    </div>
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