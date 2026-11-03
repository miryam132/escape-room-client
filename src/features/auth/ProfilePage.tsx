import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../../components/common/Field";
import { Loading } from "../../components/common/Common";
import { useUserResults } from "../../hooks/results";
import { formatTime } from "../../lib/score";
import { useAuth } from "./authContext";
import { changePasswordSchema, profileSchema } from "./schemas";
import type { ChangePasswordValues, ProfileValues } from "./schemas";

function ProfileForm() {
  const { user, updateName } = useAuth();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user!.name },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async ({ name }) => {
        await updateName(name);
        setMessage("השם עודכן בהצלחה");
      })}
    >
      <h2>פרטים אישיים</h2>
      <p dir="ltr">{user!.email}</p>
      <Field id="profile-name" label="שם" error={errors.name?.message}>
        <input id="profile-name" {...register("name")} onChange={() => setMessage("")} />
      </Field>
      <button type="submit" disabled={isSubmitting}>
        שמור
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

function PasswordForm() {
  const { changePassword } = useAuth();
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit({ currentPassword, newPassword }: ChangePasswordValues) {
    try {
      await changePassword(currentPassword, newPassword);
      reset();
      setFeedback({ text: "הסיסמה עודכנה בהצלחה", isError: false });
    } catch (error) {
      setFeedback({ text: error instanceof Error ? error.message : "העדכון נכשל", isError: true });
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2>שינוי סיסמה</h2>
      <Field id="pw-current" label="סיסמה נוכחית" error={errors.currentPassword?.message}>
        <input
          id="pw-current"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
      </Field>
      <Field id="pw-new" label="סיסמה חדשה" error={errors.newPassword?.message}>
        <input
          id="pw-new"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          {...register("newPassword", { deps: ["confirmPassword"] })}
        />
      </Field>
      <Field id="pw-confirm" label="אימות סיסמה" error={errors.confirmPassword?.message}>
        <input
          id="pw-confirm"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </Field>
      <button type="submit" disabled={isSubmitting}>
        עדכן סיסמה
      </button>
      {feedback && <p role={feedback.isError ? "alert" : "status"}>{feedback.text}</p>}
    </form>
  );
}

function History() {
  const { user } = useAuth();
  const { data: results, isPending } = useUserResults(user!.id);

  if (isPending) return <Loading />;

  return (
    <section>
      <h2>היסטוריית משחקים</h2>
      {results?.length ? (
        <table>
          <thead>
            <tr>
              <th>חדר</th>
              <th>ניקוד</th>
              <th>זמן</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.roomTitle}</td>
                <td>{r.score}</td>
                <td>{formatTime(r.seconds)}</td>
                <td>{new Date(r.finishedAt).toLocaleDateString("he-IL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>עדיין לא סיימת אף חדר.</p>
      )}
    </section>
  );
}

export default function ProfilePage() {
  return (
    <>
      <h1>הפרופיל שלי</h1>
      <ProfileForm />
      <PasswordForm />
      <History />
    </>
  );
}
