import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { App } from "@/app/App";
import { AuthPage } from "@/app/AuthPage";
import { ProfilePage } from "@/app/ProfilePage";
import { useAuth } from "@/store/auth/useAuth";
import { store } from "@/store/store";

function ProtectedHome() {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !user) {
      void navigate({ to: "/login", replace: true });
    }
  }, [initialized, navigate, user]);

  if (!initialized || !user) {
    return (
      <main className="feed-status" role="status">
        Checking your session...
      </main>
    );
  }
  return <App />;
}

function ProtectedProfile() {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !user) {
      void navigate({ to: "/login", replace: true });
    }
  }, [initialized, navigate, user]);

  if (!initialized || !user) {
    return (
      <main className="feed-status" role="status">
        Checking your session...
      </main>
    );
  }
  return <ProfilePage />;
}

const rootRoute = createRootRoute({ component: Outlet });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ProtectedHome,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProtectedProfile,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (store.getState().auth.user) throw redirect({ to: "/" });
  },
  component: () => <AuthPage mode="login" />,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: () => {
    if (store.getState().auth.user) throw redirect({ to: "/" });
  },
  component: () => <AuthPage mode="register" />,
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
