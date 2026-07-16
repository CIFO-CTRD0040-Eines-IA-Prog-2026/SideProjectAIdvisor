export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  UPDATE_PASSWORD: "/update-password",
  AUTH_CALLBACK: "/auth/callback",
} as const;

/**
 * Routes any visitor (authenticated or not) may view.
 * Home (/) is public — visitors are NOT forced to log in (feature 002).
 */
export const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
  ROUTES.UPDATE_PASSWORD,
  ROUTES.AUTH_CALLBACK,
]);

/**
 * Auth-only pages an authenticated user should be redirected AWAY from.
 * Excludes HOME: authenticated users stay on the public home page (feature 002).
 */
export const AUTH_PAGES: Set<string> = new Set([
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
  ROUTES.UPDATE_PASSWORD,
]);
