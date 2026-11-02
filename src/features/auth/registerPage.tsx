import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit() {
    setFeedback(
      "הפרטים תקינים. החשבון עדיין לא נוצר — ההרשמה טרם חוברה לשרת.",
    );
  }

  return (
    <main className="auth-page" dir="rtl">
      <section className="auth-card" aria-labelledby="register-heading">
        <h1 id="register-heading">הרשמה ל־Mysteria</h1>
        <p>מלא את הפרטים ליצירת חשבון.</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit, () => setFeedback(""))}
          onChange={() => setFeedback("")}
          noValidate
        >
          <fieldset
            disabled={isSubmitting}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
            }}
          >
            <div className="form-field">
              <label htmlFor="register-name">שם</label>

              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="השם שלך"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "register-name-error" : undefined
                }
                {...register("name", {
                  validate: (value) =>
                    value.trim().length >= 2 ||
                    "הזן שם באורך שני תווים לפחות",
                })}
              />

              {errors.name && (
                <p
                  id="register-name-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-email">אימייל</label>

              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                dir="ltr"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "register-email-error" : undefined
                }
                {...register("email", {
                  setValueAs: (value: string) => value.trim(),
                  required: "הזן כתובת אימייל",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "הזן כתובת אימייל תקינה",
                  },
                })}
              />

              {errors.email && (
                <p
                  id="register-email-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-password">סיסמה</label>

              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                dir="ltr"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? "register-password-help register-password-error"
                    : "register-password-help"
                }
                {...register("password", {
                  required: "הזן סיסמה",
                  minLength: {
                    value: 8,
                    message: "הסיסמה חייבת להכיל לפחות 8 תווים",
                  },
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "הסיסמה לא יכולה להכיל רווחים בלבד",
                  deps: ["confirmPassword"],
                })}
              />

              <p id="register-password-help">
                לפחות 8 תווים.
              </p>

              {errors.password && (
                <p
                  id="register-password-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm-password">
                אימות סיסמה
              </label>

              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                dir="ltr"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "register-confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword", {
                  required: "הזן שוב את הסיסמה",
                  validate: (value, values) =>
                    value === values.password ||
                    "הסיסמאות אינן תואמות",
                })}
              />

              {errors.confirmPassword && (
                <p
                  id="register-confirm-password-error"
                  className="form-error"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "בודק..." : "בדוק פרטי הרשמה"}
            </button>
          </fieldset>

          {feedback && (
            <p className="form-feedback" role="status">
              {feedback}
            </p>
          )}
        </form>

        <p>
          כבר יש לך חשבון?{" "}
          <Link to="/login">התחבר</Link>
        </p>

        <Link to="/rooms">חזרה לחדרים</Link>
      </section>
    </main>
  );
}