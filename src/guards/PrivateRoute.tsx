import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !user) {
      void navigate({ to: ROUTES.LOGIN, replace: true });
    }
  }, [initialized, navigate, user]);

  if (!initialized || !user) {
    return (
      <main className="feed-status" role="status">
        {MESSAGES.checkingSession}
      </main>
    );
  }
  return children;
}
