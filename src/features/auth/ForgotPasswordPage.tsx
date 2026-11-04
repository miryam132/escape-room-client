import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Field from "../../components/common/Field";
import { requestPasswordReset } from "../../api/auth";
import { forgotPasswordSchema } from "./schemas";
import type { ForgotPasswordValues } from "./schemas";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>שכחתי סיסמה</h1>

        {sent ? (
          <p role="status">אם הכתובת רשומה במערכת, נשלח אליה קישור לאיפוס הסיסמה.</p>
        ) : (
          <form
            className="auth-form"
            noValidate
            onSubmit={handleSubmit(async ({ email }) => {
              setFailed(false);
              try {
                await requestPasswordReset(email);
                setSent(true);
              } catch {
                // The server cannot send e-mail yet (see docs/SERVER-ENDPOINTS.md).
                setFailed(true);
              }
            })}
          >
            <Field id="forgot-email" label="אימייל" error={errors.email?.message}>
              <input
                id="forgot-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                {...register("email")}
              />
            </Field>
            {failed && <p role="alert">שחזור סיסמה אינו זמין כרגע. פנה למנהל המערכת.</p>}
            <button type="submit" disabled={isSubmitting}>
              שלח קישור לאיפוס
            </button>
          </form>
        )}

        <Link to="/login">חזרה להתחברות</Link>
      </section>
    </main>
  );
}
