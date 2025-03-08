/**
 * The routes for the application
 */
export enum Routes {
  Root = '/',
  DefaultLoginRedirect = '/dashboard',
  
  Features = '/#features',
  Pricing = '/#pricing',
  FAQ = '/#faq',

  TermsOfService = '/terms-of-service',
  PrivacyPolicy = '/privacy-policy',
  CookiePolicy = '/cookie-policy',

  Blog = '/blog',
  Changelog = '/changelog',
  Roadmap = 'https://mksaas.featurebase.app',

  About = '/about',
  Contact = '/contact',
  Waitlist = '/waitlist',

  Login = '/auth/login',
  Register = '/auth/register',
  AuthError = '/auth/error',
  ForgotPassword = '/auth/forgot-password',
  ResetPassword = '/auth/reset-password',

  Dashboard = '/dashboard',
  Settings = '/dashboard/settings',

  AIText = '/dashboard/features/ai-text',
  AIImage = '/dashboard/features/ai-image',
  AIVideo = '/dashboard/features/ai-video',
  AIAudio = '/dashboard/features/ai-audio',
}

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",

  // pages
  "/blog(/.*)?",
  "/terms-of-service(/.*)?",
  "/privacy-policy(/.*)?",
  "/cookie-policy(/.*)?",
  "/about(/.*)?",
  "/contact(/.*)?",
  "/waitlist(/.*)?",
  "/changelog(/.*)?",

  // unsubscribe newsletter
  "/unsubscribe(/.*)?",

  // stripe webhook
  "/api/webhook",

  // og images
  "/api/og",
];

/**
 * The routes for the authentication pages
 */
export const authRoutes = [
  Routes.AuthError,
  Routes.Login,
  Routes.Register,
  Routes.ForgotPassword,
  Routes.ResetPassword,
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
