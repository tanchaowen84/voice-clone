'use client';

import { subscribeNewsletterAction } from '@/actions/subscribe-newsletter';
import { FormError } from '@/components/shared/form-error';
import { Icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type NewsletterFormData, NewsletterFormSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Newsletter.form');
  const [error, setError] = useState<string | undefined>();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: NewsletterFormData) {
    startTransition(async () => {
      try {
        setError(undefined);
        
        const result = await subscribeNewsletterAction({
          email: data.email,
        });

        if (result?.data?.success) {
          toast.success(t('success'));
          form.reset();
        } else {
          const errorMessage = result?.data?.error || t('fail');
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error('Newsletter subscription error:', err);
        const errorMessage = t('fail');
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4"
      >
        <div className="flex items-center w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative w-full space-y-0">
                <FormLabel className="sr-only">{t('email')}</FormLabel>
                <FormControl className="rounded-r-none">
                  <Input
                    type="email"
                    className={cn(
                      'w-full h-12 rounded-r-none',
                      'focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2 focus:border-r-0'
                    )}
                    placeholder={t('email')}
                    {...field}
                  />
                </FormControl>
                <div className="absolute -bottom-6 left-0">
                  <FormMessage className="text-sm text-destructive" />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-l-none size-12 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="size-6 animate-spin" aria-hidden="true" />
            ) : (
              <PaperPlaneIcon className="size-6" aria-hidden="true" />
            )}
            <span className="sr-only">{t('subscribe')}</span>
          </Button>
        </div>
        
        {error && (
          <div className="w-full">
            <FormError message={error} />
          </div>
        )}
      </form>
    </Form>
  );
}
