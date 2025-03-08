import { siteConfig } from "@/config/site";
import db from "@/db/index";
import { account, session, user, verification } from "@/db/schema";
import { Locale, LOCALE_COOKIE_NAME, routing } from "@/i18n/routing";
import { send } from "@/mail/send";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { parse as parseCookies } from "cookie";

const from = process.env.RESEND_FROM || "delivered@resend.dev";

const getLocaleFromRequest = (request?: Request) => {
  const cookies = parseCookies(request?.headers.get("cookie") ?? "");
  return (
    (cookies[LOCALE_COOKIE_NAME] as Locale) ??
    routing.defaultLocale
  );
};

export const auth = betterAuth({
  appName: siteConfig.name,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
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
      maxAge: 5 * 60 // Cache duration in seconds
    },
    // https://www.better-auth.com/docs/concepts/session-management#session-expiration
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // every 1 day the session expiration is updated
    // https://www.better-auth.com/docs/concepts/session-management#session-freshness
    freshAge: 60 * 5 // the session is fresh if created within the last 5 minutes
  },
  emailAndPassword: {
    enabled: true,
    // https://www.better-auth.com/docs/concepts/email#2-require-email-verification
    requireEmailVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#forget-password
    async sendResetPassword({ user, url }, request) {
      const locale = getLocaleFromRequest(request);
      console.log("sendResetPassword, locale:", locale);
      await send({
        to: user.email,
        template: "forgotPassword",
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
      console.log("sendVerificationEmail, locale:", locale);
      await send({
        to: user.email,
        template: "verifyEmail",
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
    }
  },
  account: {
    // https://www.better-auth.com/docs/concepts/users-accounts#account-linking
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin
    admin(),
  ]
});
