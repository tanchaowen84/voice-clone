/**
 * The routes for the application
 */
export enum Routes {
  Root = '/',
  DefaultLoginRedirect = '/dashboard',

  Features = '/#features',
  FAQ = '/#faq',
  Pricing = '/pricing',

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
  SettingsProfile = '/settings/profile',
  SettingsBilling = '/settings/billing',
  SettingsSecurity = '/settings/security',
  SettingsNotifications = '/settings/notifications',

  AIText = '/ai/text',
  AIImage = '/ai/image',
  AIVideo = '/ai/video',
  AIAudio = '/ai/audio',

  // Block routes
  HeroBlocks = '/blocks/hero-section',
  LogoBlocks = '/blocks/logo-cloud',
  FeaturesBlocks = '/blocks/features',
  ContentBlocks = '/blocks/content',
  StatsBlocks = '/blocks/stats',
  TeamBlocks = '/blocks/team',
  TestimonialsBlocks = '/blocks/testimonials',
  CallToActionBlocks = '/blocks/call-to-action',
  FooterBlocks = '/blocks/footer',
  PricingBlocks = '/blocks/pricing',
  ComparatorBlocks = '/blocks/comparator',
  FAQBlocks = '/blocks/faqs',
  LoginBlocks = '/blocks/login',
  SignupBlocks = '/blocks/signup',
  ContactBlocks = '/blocks/contact',
}

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',

  // pages
  '/blog(/.*)?',
  '/blocks(/.*)?',
  '/terms-of-service(/.*)?',
  '/privacy-policy(/.*)?',
  '/cookie-policy(/.*)?',
  '/about(/.*)?',
  '/contact(/.*)?',
  '/waitlist(/.*)?',
  '/changelog(/.*)?',

  // unsubscribe newsletter
  '/unsubscribe(/.*)?',

  // stripe webhook
  '/api/webhook',

  // og images
  '/api/og',
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
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = Routes.Dashboard;
