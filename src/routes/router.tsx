import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { PrivateRoute } from "@/guards/PrivateRoute";
import { AuthMode } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { store } from "@/store/store";

const AuthPage = lazyRouteComponent(
  () => import("@/pages/auth/AuthPage"),
  "AuthPage",
);
const HomePage = lazyRouteComponent(
  () => import("@/pages/home/HomePage"),
  "HomePage",
);
const ProfilePage = lazyRouteComponent(
  () => import("@/pages/profile/ProfilePage"),
  "ProfilePage",
);

const rootRoute = createRootRoute({ component: Outlet });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.HOME,
  component: () => (
    <PrivateRoute>
      <HomePage />
    </PrivateRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.PROFILE,
  component: () => (
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LOGIN,
  beforeLoad: () => {
    if (store.getState().auth.user) throw redirect({ to: ROUTES.HOME });
  },
  component: () => <AuthPage mode={AuthMode.Login} />,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.REGISTER,
  beforeLoad: () => {
    if (store.getState().auth.user) throw redirect({ to: ROUTES.HOME });
  },
  component: () => <AuthPage mode={AuthMode.Register} />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  profileRoute,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
