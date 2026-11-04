import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../../components/common/Field";
import { Loading } from "../../components/common/Common";
import { errorMessage } from "../../api/client";
import { useMyGames } from "../../hooks/game";
import { formatTime } from "../../lib/format";
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
        try {
          await updateName(name);
          setMessage("השם עודכן בהצלחה");
        } catch (error) {
          setMessage(errorMessage(error, "העדכון נכשל"));
        }
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
      setFeedback({ text: errorMessage(error, "העדכון נכשל"), isError: true });
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
  const { data, isPending, isError } = useMyGames();

  if (isPending) return <Loading />;
  if (isError) return <p role="alert">לא ניתן לטעון את היסטוריית המשחקים.</p>;

  return (
    <section>
      <h2>היסטוריית משחקים</h2>
      {data.items.length ? (
        <table>
          <thead>
            <tr>
              <th>חדר</th>
              <th>זמן</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((game) => (
              <tr key={`${game.roomId}-${game.completedAt}`}>
                <td>{game.roomTitle}</td>
                <td>{formatTime(game.seconds)}</td>
                <td>{new Date(game.completedAt).toLocaleDateString("he-IL")}</td>
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
