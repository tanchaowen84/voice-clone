'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { Icons } from '@/components/icons/icons';
import { FormError } from '@/components/shared/form-error';
import { FormSuccess } from '@/components/shared/form-success';
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
import { LocaleLink } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { LoginSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

export const LoginForm = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError = searchParams.get('error');
  const t = useTranslations('AuthPage.login');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    // 1. if callbackUrl is provided, user will be redirected to the callbackURL after login successfully.
    // if user email is not verified, a new verification email will be sent to the user with the callbackURL.
    // 2. if callbackUrl is not provided, we should redirect manually in the onSuccess callback.
    const { data, error } = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: callbackUrl || Routes.DefaultLoginRedirect,
      },
      {
        onRequest: (ctx) => {
          // console.log("login, request:", ctx.url);
          setIsPending(true);
          setError('');
          setSuccess('');
        },
        onResponse: (ctx) => {
          // console.log("login, response:", ctx.response);
          setIsPending(false);
        },
        onSuccess: (ctx) => {
          // console.log("login, success:", ctx.data);
          // setSuccess("Login successful");
          // router.push(callbackUrl || "/dashboard");
        },
        onError: (ctx) => {
          console.error('login, error:', ctx.error);
          setError(`${ctx.error.status}:${ctx.error.statusText}`);
        },
      }
    );
  };

  return (
    <AuthCard
      headerLabel={t('welcomeBack')}
      bottomButtonLabel={t('signUpHint')}
      bottomButtonHref={`${Routes.Register}`}
      showSocialLoginButton
      className={cn('border-none', className)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>{t('password')}</FormLabel>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal text-muted-foreground"
                    >
                      <LocaleLink
                        href={`${Routes.ForgotPassword}`}
                        className="text-xs hover:underline hover:underline-offset-4 hover:text-primary"
                      >
                        {t('forgotPassword')}
                      </LocaleLink>
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError || undefined} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            size="lg"
            type="submit"
            className="w-full flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              ''
            )}
            <span>{t('signIn')}</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
