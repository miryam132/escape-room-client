import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../../components/common/Field";
import { useAuth } from "./authContext";

type LoginFormValues = { email: string; password: string };

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/rooms";
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ defaultValues: { email: "", password: "" } });

  if (user) return <Navigate to={from} replace />;

  async function onSubmit({ email, password }: LoginFormValues) {
    setFeedback("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "ההתחברות נכשלה");
    }
  }

  return (
    <main className="auth-page" dir="rtl">
      <section className="auth-card" aria-labelledby="login-heading">
        <h1 id="login-heading">התחברות</h1>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} onChange={() => setFeedback("")} noValidate>
          <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <Field id="login-email" label="אימייל" error={errors.email?.message}>
              <input
                id="login-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                {...register("email", { required: "הזן כתובת אימייל" })}
              />
            </Field>

            <Field id="login-password" label="סיסמה" error={errors.password?.message}>
              <input
                id="login-password"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                {...register("password", { required: "הזן סיסמה" })}
              />
            </Field>

            <button type="submit">{isSubmitting ? "מתחבר..." : "התחבר"}</button>
          </fieldset>

          {feedback && <p role="alert">{feedback}</p>}
        </form>

        <p>
          אין לך חשבון? <Link to="/register">הרשמה</Link>
        </p>
      </section>
    </main>
  );
}
