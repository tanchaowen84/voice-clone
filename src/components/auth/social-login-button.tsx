'use client';

import { Icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { GitHubIcon } from '@/components/icons/github';
import { GoogleIcon } from '@/components/icons/google';
import { authClient } from '@/lib/auth-client';
import { Routes } from '@/routes';
import { useTranslations } from 'next-intl';

/**
 * social login buttons
 */
export const SocialLoginButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);
  const t = useTranslations('AuthPage.login');

  const onClick = async (provider: 'google' | 'github') => {
    await authClient.signIn.social(
      {
        /**
         * The social provider id
         * @example "github", "google"
         */
        provider: provider,
        /**
         * a url to redirect after the user authenticates with the provider
         * @default "/"
         */
        callbackURL: callbackUrl || Routes.DefaultLoginRedirect,
        /**
         * a url to redirect if an error occurs during the sign in process
         */
        errorCallbackURL: Routes.AuthError,
        /**
         * a url to redirect if the user is newly registered
         */
        // newUserCallbackURL: "/auth/welcome",
        /**
         * disable the automatic redirect to the provider.
         * @default false
         */
        // disableRedirect: true,
      },
      {
        onRequest: (ctx) => {
          // console.log("onRequest", ctx);
          setIsLoading(provider);
        },
        onResponse: (ctx) => {
          // console.log("onResponse", ctx.response);
          setIsLoading(null);
        },
        onSuccess: (ctx) => {
          // console.log("onSuccess", ctx.data);
          setIsLoading(null);
        },
        onError: (ctx) => {
          console.log('onError', ctx.error.message);
          setIsLoading(null);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick('google')}
        disabled={isLoading === 'google'}
      >
        {isLoading === 'google' ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-5 mr-2" />
        )}
        <span>{t('signInWithGoogle')}</span>
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick('github')}
        disabled={isLoading === 'github'}
      >
        {isLoading === 'github' ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <GitHubIcon className="size-5 mr-2" />
        )}
        <span>{t('signInWithGitHub')}</span>
      </Button>
    </div>
  );
};
