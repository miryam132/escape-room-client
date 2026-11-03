import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/common/Field";
import type { Role } from "../../types/user";
import { useAuth } from "./authContext";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "user" },
  });

  async function onSubmit({ name, email, password, role }: RegisterFormValues) {
    const values = { name, email, password, role };
    setFeedback("");
    try {
      await registerUser(values);
      navigate(values.role === "admin" ? "/admin/rooms" : "/rooms", { replace: true });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "ההרשמה נכשלה");
    }
  }

  return (
    <main className="auth-page" dir="rtl">
      <section className="auth-card" aria-labelledby="register-heading">
        <h1 id="register-heading">הרשמה ל־Mysteria</h1>
        <p>מלא את הפרטים ליצירת חשבון.</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} onChange={() => setFeedback("")} noValidate>
          <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <Field id="register-name" label="שם" error={errors.name?.message}>
              <input
                id="register-name"
                autoComplete="name"
                {...register("name", {
                  validate: (v) => v.trim().length >= 2 || "הזן שם באורך שני תווים לפחות",
                })}
              />
            </Field>

            <Field id="register-email" label="אימייל" error={errors.email?.message}>
              <input
                id="register-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder="name@example.com"
                {...register("email", {
                  setValueAs: (v: string) => v.trim(),
                  required: "הזן כתובת אימייל",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "הזן כתובת אימייל תקינה" },
                })}
              />
            </Field>

            <Field id="register-password" label="סיסמה (לפחות 8 תווים)" error={errors.password?.message}>
              <input
                id="register-password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                {...register("password", {
                  required: "הזן סיסמה",
                  minLength: { value: 8, message: "הסיסמה חייבת להכיל לפחות 8 תווים" },
                  validate: (v) => v.trim().length > 0 || "הסיסמה לא יכולה להכיל רווחים בלבד",
                  deps: ["confirmPassword"],
                })}
              />
            </Field>

            <Field id="register-confirm-password" label="אימות סיסמה" error={errors.confirmPassword?.message}>
              <input
                id="register-confirm-password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "הזן שוב את הסיסמה",
                  validate: (v, values) => v === values.password || "הסיסמאות אינן תואמות",
                })}
              />
            </Field>

            <Field id="register-role" label="סוג משתמש">
              <select id="register-role" {...register("role")}>
                <option value="user">משתמש רגיל</option>
                <option value="admin">מנהל</option>
              </select>
            </Field>

            <button type="submit">{isSubmitting ? "יוצר חשבון..." : "הרשמה"}</button>
          </fieldset>

          {feedback && <p role="alert">{feedback}</p>}
        </form>

        <p>
          כבר יש לך חשבון? <Link to="/login">התחבר</Link>
        </p>
      </section>
    </main>
  );
}
