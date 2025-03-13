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
import { authClient } from '@/lib/auth-client';
import { RegisterSchema } from '@/lib/schemas';
import { Routes } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

export const RegisterForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const t = useTranslations('AuthPage.register');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    // 1. if requireEmailVerification is true, callbackURL will be used in the verification email,
    // the user will be redirected to the callbackURL after the email is verified.
    // 2. if requireEmailVerification is false, the user will not be redirected to the callbackURL,
    // we should redirect to the callbackURL manually in the onSuccess callback.
    const { data, error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: callbackUrl || Routes.DefaultLoginRedirect,
      },
      {
        onRequest: (ctx) => {
          console.log('register, request:', ctx.url);
          setIsPending(true);
          setError('');
          setSuccess('');
        },
        onResponse: (ctx) => {
          console.log('register, response:', ctx.response);
          setIsPending(false);
        },
        onSuccess: (ctx) => {
          // sign up success, user information stored in ctx.data
          // console.log("register, success:", ctx.data);
          setSuccess(t('checkEmail'));
        },
        onError: (ctx) => {
          // sign up fail, display the error message
          console.error('register, error:', ctx.error);
          setError(`${ctx.error.status}:${ctx.error.statusText}`);
        },
      }
    );
  };

  return (
    <AuthCard
      headerLabel={t('createAccount')}
      bottomButtonLabel={t('signInHint')}
      bottomButtonHref={`${Routes.Login}`}
      showSocialLoginButton
      className="border-none"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>{t('password')}</FormLabel>
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
          <FormError message={error} />
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
            <span>{t('signUp')}</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
