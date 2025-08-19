import { websiteConfig } from './config/website';

/**
 * The routes for the application
 */
export enum Routes {
  Root = '/',

  // marketing pages
  FAQ = '/#faq',
  Features = '/#features',
  Pricing = '/#pricing', // pricing section in homepage
  Blog = '/blog',
  Tools = '/tools',
  ToolsAudioEnhancer = '/tools/audio-enhancer',
  ToolsVoiceRecorder = '/tools/voice-recorder',
  Roadmap = 'https://mksaas.link/roadmap',
  CookiePolicy = '/cookie',
  PrivacyPolicy = '/privacy',
  TermsOfService = '/terms',

  // auth routes
  Login = '/auth/login',
  Register = '/auth/register',
  AuthError = '/auth/error',
  ForgotPassword = '/auth/forgot-password',
  ResetPassword = '/auth/reset-password',

  // dashboard routes
  Dashboard = '/dashboard',
  AdminUsers = '/admin/users',
  SettingsProfile = '/settings/profile',
  SettingsBilling = '/settings/billing',
  SettingsSecurity = '/settings/security',
}

/**
 * The routes that can not be accessed by logged in users
 */
export const routesNotAllowedByLoggedInUsers = [Routes.Login, Routes.Register];

/**
 * The routes that are protected and require authentication
 */
export const protectedRoutes = [
  // Routes.Dashboard, // Dashboard temporarily disabled
  Routes.AdminUsers,
  Routes.SettingsProfile,
  Routes.SettingsBilling,
  Routes.SettingsSecurity,
];

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT =
  websiteConfig.routes.defaultLoginRedirect ?? Routes.Root;
