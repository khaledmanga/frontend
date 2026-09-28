import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <Link to={ROUTES.HOME} className="brand" aria-label={MESSAGES.loopHome}>
        <span className="brand-mark">
          <Zap size={18} fill="currentColor" />
        </span>
        <span>loop</span>
      </Link>
      <div className="top-actions">
        {user ? (
          <span className="auth-user-name">{user.name}</span>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} className="auth-nav-link">
              {MESSAGES.login}
            </Link>
            <Link to={ROUTES.REGISTER} className="auth-nav-join">
              {MESSAGES.authCreateAccount}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
