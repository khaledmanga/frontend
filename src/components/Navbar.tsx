import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useAuth } from "@/store/auth/useAuth";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Loop home">
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
            <Link to="/login" className="auth-nav-link">
              Log in
            </Link>
            <Link to="/register" className="auth-nav-join">
              Create an account
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
