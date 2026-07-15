export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  UPDATE_PASSWORD: "/update-password",
  AUTH_CALLBACK: "/auth/callback",
} as const;

export const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
  ROUTES.UPDATE_PASSWORD,
  ROUTES.AUTH_CALLBACK,
]);
