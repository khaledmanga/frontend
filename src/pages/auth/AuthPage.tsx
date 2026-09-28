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
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ASSET_URLS } from "@/constants/assets";
import { AuthMode, type AuthMode as AuthModeValue } from "@/constants/auth";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { BUTTON_VARIANTS } from "@/constants/ui";
import {
  AUTOCOMPLETE_VALUES,
  FORM_FIELDS,
  INPUT_TYPES,
  VALIDATION_LIMITS,
} from "@/constants/validation";
import { useAuth } from "@/hooks/useAuth";
import "@/assets/styles/auth.css";

type AuthPageProps = { mode: AuthModeValue };

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === AuthMode.Register;
  const { user, loading, error, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: ROUTES.HOME });
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
      <section className="auth-showcase" aria-label={MESSAGES.authAboutLoop}>
        <img
          className="auth-showcase-image"
          src={ASSET_URLS.AuthShowcase}
          alt=""
        />
        <div className="auth-showcase-shade" />
        <Link to={ROUTES.HOME} className="auth-brand">
          <span>
            <Zap size={18} fill="currentColor" />
          </span>
          loop
        </Link>
        <div className="auth-showcase-copy">
          <span className="auth-kicker">
            <Sparkles size={14} /> {MESSAGES.authKicker}
          </span>
          <h1>
            {MESSAGES.authSharedHeading}
            <br />
            when it&apos;s <em>{MESSAGES.authSharedEmphasis}</em>
          </h1>
          <p>
            {MESSAGES.authDescription}
          </p>
          <div className="auth-social-proof">
            <span className="auth-faces">
              <i>M</i>
              <i>J</i>
              <i>A</i>
            </span>
            <span>
              <strong>{MESSAGES.authGoodThings}</strong>
              <br />
              {MESSAGES.authFindPeople}
            </span>
          </div>
        </div>
        <span className="auth-image-caption">
          {MESSAGES.authImageCaption}
        </span>
      </section>

      <section className="auth-panel">
        <Link to={ROUTES.HOME} className="auth-mobile-brand">
          <span>
            <Zap size={17} fill="currentColor" />
          </span>
          loop
        </Link>
        <div className="auth-form-wrap">
          <Link to={ROUTES.HOME} className="auth-back">
            <ArrowLeft size={15} /> {MESSAGES.authBackToFeed}
          </Link>
          <div className="auth-heading">
            <span className="auth-heading-icon">
              <Sparkles size={18} />
            </span>
            <p className="auth-kicker">
              {isRegister ? MESSAGES.authRegisterKicker : MESSAGES.authWelcomeBack}
            </p>
            <h2>
              {isRegister ? MESSAGES.authCreateHeading : MESSAGES.authLoginHeading}
            </h2>
            <p className="auth-subheading">
              {isRegister
                ? MESSAGES.authCreateSubheading
                : MESSAGES.authLoginSubheading}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>{MESSAGES.authName}</span>
                <span className="auth-input-wrap">
                  <UserRound size={17} />
                  <Input
                    unstyled
                    autoComplete={AUTOCOMPLETE_VALUES.Name}
                    name={FORM_FIELDS.Name}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={MESSAGES.authNamePlaceholder}
                    required
                    maxLength={VALIDATION_LIMITS.DisplayNameMaxLength}
                  />
                </span>
              </label>
            )}
            <label className="auth-field">
              <span>{MESSAGES.authEmail}</span>
              <span className="auth-input-wrap">
                <Mail size={17} />
                <Input
                  unstyled
                  autoComplete={AUTOCOMPLETE_VALUES.Email}
                  name={FORM_FIELDS.Email}
                  type={INPUT_TYPES.Email}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={MESSAGES.authEmailPlaceholder}
                  required
                  maxLength={VALIDATION_LIMITS.EmailMaxLength}
                />
              </span>
            </label>
            <label className="auth-field">
              <span>{MESSAGES.authPassword}</span>
              <span className="auth-input-wrap">
                <LockKeyhole size={17} />
                <Input
                  unstyled
                  autoComplete={
                    isRegister
                      ? AUTOCOMPLETE_VALUES.NewPassword
                      : AUTOCOMPLETE_VALUES.CurrentPassword
                  }
                  name={FORM_FIELDS.Password}
                  type={showPassword ? INPUT_TYPES.Text : INPUT_TYPES.Password}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isRegister
                      ? MESSAGES.authPasswordMinPlaceholder
                      : MESSAGES.authPasswordPlaceholder
                  }
                  minLength={
                    isRegister ? VALIDATION_LIMITS.PasswordMinLength : undefined
                  }
                  required
                  maxLength={VALIDATION_LIMITS.PasswordMaxLength}
                />
                <Button
                  variant={BUTTON_VARIANTS.Unstyled}
                  type="button"
                  className="auth-show-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? MESSAGES.hidePassword : MESSAGES.showPassword
                  }
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </Button>
              </span>
            </label>
            {error && (
              <p role="alert" className="auth-error">
                {error}
              </p>
            )}
            <Button variant={BUTTON_VARIANTS.Unstyled} type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  {isRegister ? MESSAGES.createAccount : MESSAGES.login}{" "}
                  <ArrowRight size={17} />
                </>
              )}
              {loading &&
                (isRegister
                  ? MESSAGES.createAccountLoading
                  : MESSAGES.loginLoading)}
            </Button>
          </form>

          <p className="auth-switch">
            {isRegister
              ? MESSAGES.authAlreadyAccount
              : MESSAGES.authNewAroundHere}{" "}
            <Link to={isRegister ? ROUTES.LOGIN : ROUTES.REGISTER}>
              {isRegister ? MESSAGES.login : MESSAGES.authCreateAccount}
            </Link>
          </p>
          <p className="auth-terms">
            {MESSAGES.authTerms}
          </p>
        </div>
        <footer className="auth-footer">
          <span>{MESSAGES.authFooter}</span>
          <span>
            {MESSAGES.authFooterTagline} <span aria-hidden="true">✳</span>
          </span>
        </footer>
      </section>
    </main>
  );
}
