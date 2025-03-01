/**
 * The routes for the application
 */
export enum Routes {
  Root = '/',
  
  Features = '/#features',
  Pricing = '/#pricing',
  FAQ = '/#faq',

  TermsOfUse = '/terms-of-use',
  PrivacyPolicy = '/privacy-policy',
  CookiePolicy = '/cookie-policy',

  Blog = '/blog',
  Docs = '/docs',
  Changelog = '/changelog',
  Roadmap = 'https://mksaas.canny.io',

  About = '/about',
  Contact = '/contact',
  Waitlist = '/waitlist',
  Story = '/story',
  Careers = '/careers',

  Login = '/auth/login',
  Register = '/auth/register',
  AuthError = '/auth/error',
  ForgotPassword = '/auth/forgot-password',
  ResetPassword = '/auth/reset-password',

  Auth = '/auth',
  Logout = '/auth/logout',
  Totp = '/auth/totp',
  RecoveryCode = '/auth/recovery-code',
  ChangeEmail = '/auth/change-email',
  ChangeEmailRequest = '/auth/change-email/request',
  ChangeEmailInvalid = '/auth/change-email/invalid',
  ChangeEmailExpired = '/auth/change-email/expired',
  // ForgotPassword = '/auth/forgot-password',
  ForgotPasswordSuccess = '/auth/forgot-password/success',
  // ResetPassword = '/auth/reset-password',
  ResetPasswordRequest = '/auth/reset-password/request',
  ResetPasswordExpired = '/auth/reset-password/expired',
  ResetPasswordSuccess = '/auth/reset-password/success',
  VerifyEmail = '/auth/verify-email',
  VerifyEmailRequest = '/auth/verify-email/request',
  VerifyEmailExpired = '/auth/verify-email/expired',
  VerifyEmailSuccess = '/auth/verify-email/success',

  Dashboard = '/dashboard',
  Home = '/dashboard/home',
  Contacts = '/dashboard/contacts',
  Settings = '/dashboard/settings',
  Account = '/dashboard/settings/account',
  Profile = '/dashboard/settings/account/profile',
  Security = '/dashboard/settings/account/security',
  Notifications = '/dashboard/settings/account/notifications',
  Organization = '/dashboard/settings/organization',
  OrganizationInformation = '/dashboard/settings/organization/information',
  Members = '/dashboard/settings/organization/members',
  Billing = '/dashboard/settings/organization/billing',
  Developers = '/dashboard/settings/organization/developers',

  Invitations = '/invitations',
  InvitationRequest = '/invitations/request',
  InvitationAlreadyAccepted = '/invitations/already-accepted',
  InvitationRevoked = '/invitations/revoked',
  InvitationLogOutToAccept = '/invitations/log-out-to-accept',

  Onboarding = '/onboarding',

  DefaultLoginRedirect = '/dashboard',
}

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/terms(/.*)?",
  "/privacy(/.*)?",
  "/about(/.*)?",
  "/changelog(/.*)?",

  // blog
  "/blog(/.*)?",

  // docs
  "/docs(/.*)?",

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
  Routes.Login,
  Routes.Register,
  Routes.AuthError,
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
