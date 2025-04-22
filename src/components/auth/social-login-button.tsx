'use client';

import { DividerWithText } from '@/components/auth/divider-with-text';
import { GitHubIcon } from '@/components/icons/github';
import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { authClient } from '@/lib/auth-client';
import { getUrlWithLocaleInCallbackUrl } from '@/lib/urls/urls';
import { DEFAULT_LOGIN_REDIRECT, Routes } from '@/routes';
import { Loader2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface SocialLoginButtonProps {
  callbackUrl?: string;
}

/**
 * social login buttons
 */
export const SocialLoginButton = ({
  callbackUrl: propCallbackUrl,
}: SocialLoginButtonProps) => {
  if (websiteConfig.auth.disableGoogleLogin && websiteConfig.auth.disableGithubLogin) {
    return null;
  }

  const t = useTranslations('AuthPage.login');
  const searchParams = useSearchParams();
  const paramCallbackUrl = searchParams.get('callbackUrl');
  // Use prop callback URL or param callback URL if provided, otherwise use the default login redirect
  const locale = useLocale();
  const defaultCallbackUrl = getUrlWithLocaleInCallbackUrl(
    DEFAULT_LOGIN_REDIRECT,
    locale
  );
  const callbackUrl = propCallbackUrl || paramCallbackUrl || defaultCallbackUrl;
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);
  console.log('social login button, callbackUrl', callbackUrl);

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
        callbackURL: callbackUrl,
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
          console.log('social login error', ctx.error.message);
          setIsLoading(null);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <DividerWithText text={t('or')} />
      {!websiteConfig.auth.disableGoogleLogin && (
        <Button
          size="lg"
          className="w-full cursor-pointer"
          variant="outline"
          onClick={() => onClick('google')}
          disabled={isLoading === 'google'}
      >
        {isLoading === 'google' ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4 mr-2" />
        )}
          <span>{t('signInWithGoogle')}</span>
        </Button>
      )}
      {!websiteConfig.auth.disableGithubLogin && (
        <Button
          size="lg"
          className="w-full cursor-pointer"
          variant="outline"
          onClick={() => onClick('github')}
          disabled={isLoading === 'github'}
      >
        {isLoading === 'github' ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          <GitHubIcon className="size-4 mr-2" />
        )}
          <span>{t('signInWithGitHub')}</span>
        </Button>
      )}
    </div>
  );
};
