import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/store/auth/useAuth";
import "@/auth.css";

type AuthPageProps = { mode: "login" | "register" };

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register";
  const { user, loading, error, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/" });
  }, [navigate, user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegister) {
      register(name.trim(), email.trim(), password);
      return;
    }
    login(email.trim(), password);
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-label="About loop">
        <img
          className="auth-showcase-image"
          src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=85"
          alt=""
        />
        <div className="auth-showcase-shade" />
        <Link to="/" className="auth-brand">
          <span>
            <Zap size={18} fill="currentColor" />
          </span>
          loop
        </Link>
        <div className="auth-showcase-copy">
          <span className="auth-kicker">
            <Sparkles size={14} /> A LITTLE MORE HUMAN
          </span>
          <h1>
            Life is better
            <br />
            when it&apos;s <em>shared.</em>
          </h1>
          <p>
            A little corner for the moments, people, and things that make your
            day.
          </p>
          <div className="auth-social-proof">
            <span className="auth-faces">
              <i>M</i>
              <i>J</i>
              <i>A</i>
            </span>
            <span>
              <strong>Good things happen here.</strong>
              <br />
              Come find your people.
            </span>
          </div>
        </div>
        <span className="auth-image-caption">
          Somewhere between here and the next little adventure.
        </span>
      </section>

      <section className="auth-panel">
        <Link to="/" className="auth-mobile-brand">
          <span>
            <Zap size={17} fill="currentColor" />
          </span>
          loop
        </Link>
        <div className="auth-form-wrap">
          <Link to="/" className="auth-back">
            <ArrowLeft size={15} /> Back to your feed
          </Link>
          <div className="auth-heading">
            <span className="auth-heading-icon">
              <Sparkles size={18} />
            </span>
            <p className="auth-kicker">
              {isRegister ? "YOUR PEOPLE ARE HERE" : "WELCOME BACK"}
            </p>
            <h2>
              {isRegister ? "Make yourself at home." : "Good to see you again."}
            </h2>
            <p className="auth-subheading">
              {isRegister
                ? "Create an account. The good stuff starts here."
                : "Pick up right where you left off."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Your name</span>
                <span className="auth-input-wrap">
                  <UserRound size={17} />
                  <input
                    autoComplete="name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="What should we call you?"
                    required
                    maxLength={80}
                  />
                </span>
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <span className="auth-input-wrap">
                <Mail size={17} />
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                />
              </span>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <span className="auth-input-wrap">
                <LockKeyhole size={17} />
                <input
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isRegister ? "At least 8 characters" : "Your password"
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                  maxLength={72}
                />
                <button
                  type="button"
                  className="auth-show-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            {error && (
              <p role="alert" className="auth-error">
                {error}
              </p>
            )}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  {isRegister ? "Create your account" : "Log in"}{" "}
                  <ArrowRight size={17} />
                </>
              )}
              {loading &&
                (isRegister ? "Creating your account..." : "Logging in...")}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New around here?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </p>
          <p className="auth-terms">
            By continuing, you agree to keep this a kind little corner of the
            internet.
          </p>
        </div>
        <footer className="auth-footer">
          <span>© 2026 loop social</span>
          <span>
            Made for the moments in between <span aria-hidden="true">✳</span>
          </span>
        </footer>
      </section>
    </main>
  );
}
