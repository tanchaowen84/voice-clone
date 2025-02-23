import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db/index";
import { user, session, account, verification } from "@/db/schema";
import { siteConfig } from "@/config/site";
import { resend } from "@/lib/email/resend";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";

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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#forget-password
    async sendResetPassword({ user, url }) {
			await resend.emails.send({
				from,
				to: user.email,
				subject: "Reset your password",
				react: `Click the link to reset your password: ${url}`,
			});
		},
  },
  emailVerification: {
    // https://www.better-auth.com/docs/authentication/email-password#require-email-verification
    sendVerificationEmail: async ( { user, url, token }, request) => {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  },
});
