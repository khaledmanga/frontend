export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
