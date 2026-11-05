import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/common/Field";
import { AuthLock } from "./AuthLock";
import { errorMessage } from "../../api/client";
import { useAuth } from "./authContext";
import { registerSchema } from "./schemas";
import type { RegisterValues } from "./schemas";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit({ name, email, password }: RegisterValues) {
    setFeedback("");
    try {
      await registerUser({ name, email, password });
      navigate("/rooms", { replace: true });
    } catch (error) {
      setFeedback(errorMessage(error, "ההרשמה נכשלה"));
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby="register-heading">
        <AuthLock />
        <h1 id="register-heading">הרשמה ל־Mysteria</h1>
        <p className="auth-sub">מלא את הפרטים ליצירת חשבון.</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => setFeedback("")}
          noValidate
        >
          <fieldset
            disabled={isSubmitting}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <Field id="register-name" label="שם" error={errors.name?.message}>
              <input id="register-name" autoComplete="name" {...register("name")} />
            </Field>

            <Field id="register-email" label="אימייל" error={errors.email?.message}>
              <input
                id="register-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder="name@example.com"
                {...register("email")}
              />
            </Field>

            <Field
              id="register-password"
              label="סיסמה (לפחות 10 תווים)"
              error={errors.password?.message}
            >
              <input
                id="register-password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                {...register("password", { deps: ["confirmPassword"] })}
              />
            </Field>

            <Field
              id="register-confirm"
              label="אימות סיסמה"
              error={errors.confirmPassword?.message}
            >
              <input
                id="register-confirm"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </Field>

            <button type="submit" className="btn btn-primary btn-block">
              {isSubmitting ? "יוצר חשבון..." : "הרשמה"}
            </button>
          </fieldset>

          {feedback && <p role="alert">{feedback}</p>}
        </form>

        <p className="auth-links">
          כבר יש לך חשבון? <Link to="/login">התחבר</Link>
        </p>
      </section>
    </div>
  );
}
