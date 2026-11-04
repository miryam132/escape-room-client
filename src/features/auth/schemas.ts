import { z } from "zod";

// Simple regexes.
const NAME = /^.{2,100}$/;
const EMAIL = /^\S+@\S+\.\S+$/;
const PASSWORD = /^.{10,72}$/;

const name = z.string().trim().regex(NAME, "השם חייב להכיל 2 עד 100 תווים");
const email = z.string().trim().regex(EMAIL, "הזן כתובת אימייל תקינה");
const password = z.string().regex(PASSWORD, "הסיסמה חייבת להכיל בין 10 ל־72 תווים");

export const loginSchema = z.object({
  email: z.string().trim().min(1, "הזן כתובת אימייל"),
  password: z.string().min(1, "הזן סיסמה"),
});

const confirmed = { message: "הסיסמאות אינן תואמות", path: ["confirmPassword"] };

export const registerSchema = z
  .object({ name, email, password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, confirmed);
export const forgotPasswordSchema = z.object({ email });
export const profileSchema = z.object({ name });
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "הזן את הסיסמה הנוכחית"),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, confirmed);

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
