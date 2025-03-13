import { getWebsiteInfo } from '@/config';
import db from '@/db/index';
import { account, session, user, verification } from '@/db/schema';
import { createTranslator } from '@/i18n/translator';
import { getLocaleFromRequest } from '@/lib/utils';
import { send } from '@/mail';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';

// Create a simple translator function for default values
const t = createTranslator((key: string) => key);
const websiteInfo = getWebsiteInfo(t);

export const auth = betterAuth({
  appName: websiteInfo.name,
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    // The schema object that defines the tables and fields
    // [BetterAuthError]: [# Drizzle Adapter]: The model "verification" was not found in the schema object.
    // Please pass the schema directly to the adapter options.
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  session: {
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
    // https://www.better-auth.com/docs/concepts/session-management#session-expiration
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 5,
  },
  emailAndPassword: {
    enabled: true,
    // https://www.better-auth.com/docs/concepts/email#2-require-email-verification
    requireEmailVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#forget-password
    async sendResetPassword({ user, url }, request) {
      const locale = getLocaleFromRequest(request);
      console.log('sendResetPassword, locale:', locale);
      await send({
        to: user.email,
        template: 'forgotPassword',
        context: {
          url,
          name: user.name,
        },
        locale,
      });
    },
  },
  emailVerification: {
    // https://www.better-auth.com/docs/concepts/email#auto-signin-after-verification
    autoSignInAfterVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#require-email-verification
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const locale = getLocaleFromRequest(request);
      console.log('sendVerificationEmail, locale:', locale);
      await send({
        to: user.email,
        template: 'verifyEmail',
        context: {
          url,
          name: user.name,
        },
        locale,
      });
    },
  },
  socialProviders: {
    // https://www.better-auth.com/docs/authentication/github
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    // https://www.better-auth.com/docs/authentication/google
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    // https://www.better-auth.com/docs/concepts/users-accounts#account-linking
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin
    admin(),
  ],
});
