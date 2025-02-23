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
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const AUTH_ROUTE_LOGIN = "/auth/login";
export const AUTH_ROUTE_REGISTER = "/auth/register";
export const AUTH_ROUTE_ERROR = "/auth/error";
export const AUTH_ROUTE_FORGOT_PASSWORD = "/auth/forgot-password";
export const AUTH_ROUTE_RESET_PASSWORD = "/auth/reset-password";

export const authRoutes = [
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_REGISTER,
  AUTH_ROUTE_ERROR,
  AUTH_ROUTE_FORGOT_PASSWORD,
  AUTH_ROUTE_RESET_PASSWORD,
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
