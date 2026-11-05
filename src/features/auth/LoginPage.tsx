import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../../components/common/Field";
import { AuthLock } from "./AuthLock";
import { ApiError, errorMessage } from "../../api/client";
import { useAuth } from "./authContext";
import { DEMO_ACCOUNTS } from "./demoAccounts";
import type { DemoAccount } from "./demoAccounts";
import { loginSchema } from "./schemas";
import type { LoginValues } from "./schemas";

export default function LoginPage() {
  const { user, login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/rooms";
  const [feedback, setFeedback] = useState("");
  const [demoBusy, setDemoBusy] = useState(false);
  const [landing, setLanding] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (user) return <Navigate to={landing ?? from} replace />;

  async function onSubmit({ email, password }: LoginValues) {
    setFeedback("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setFeedback(errorMessage(error, "ההתחברות נכשלה"));
    }
  }

  /** One-click demo sign-in. A player account that does not exist yet is created on first use. */
  async function demoLogin(account: DemoAccount) {
    setFeedback("");
    setDemoBusy(true);
    setLanding(account.landing);
    try {
      try {
        await login(account.email, account.password);
      } catch (error) {
        const invalid = error instanceof ApiError && error.code === "INVALID_CREDENTIALS";
        if (!account.createIfMissing || !invalid) throw error;
        await registerUser({
          name: account.name,
          email: account.email,
          password: account.password,
        });
      }
    } catch (error) {
      setLanding(null);
      setFeedback(errorMessage(error, "ההתחברות נכשלה"));
    } finally {
      setDemoBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <AuthLock />
        <h1 id="login-heading">התחברות</h1>
        <p className="auth-sub">טוב לראות אותך שוב. החדרים מחכים.</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset
            disabled={isSubmitting}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <Field id="login-email" label="אימייל" error={errors.email?.message}>
              <input
                id="login-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                {...register("email")}
              />
            </Field>

            <Field id="login-password" label="סיסמה" error={errors.password?.message}>
              <input
                id="login-password"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                {...register("password")}
              />
            </Field>

            <button type="submit" className="btn btn-primary btn-block">
              {isSubmitting ? "מתחבר..." : "התחבר"}
            </button>
          </fieldset>

          {feedback && <p role="alert">{feedback}</p>}
        </form>

        <div className="demo-box">
          <p className="demo-label">( חשבונות הדגמה לבדיקה )</p>
          <div className="demo-buttons">
            {Object.entries(DEMO_ACCOUNTS).map(([key, account]) => (
              <button
                key={key}
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={demoBusy || isSubmitting}
                onClick={() => demoLogin(account)}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>

        <p className="auth-links">
          <Link to="/forgot-password">שכחת סיסמה?</Link>
        </p>
        <p className="auth-links">
          אין לך חשבון? <Link to="/register">הרשמה</Link>
        </p>
      </section>
    </div>
  );
}
