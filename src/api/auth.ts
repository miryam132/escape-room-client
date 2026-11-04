import type { User } from "../types/user";
import { request, tokenStore } from "./client";

type Session = { user: User; token: string; expiresIn: number };

const startSession = ({ user, token }: Session) => {
  tokenStore.set(token);
  return user;
};

export type RegisterInput = { name: string; email: string; password: string };

export const register = (input: RegisterInput) =>
  request<Session>("/auth/register", { method: "POST", body: input }).then(startSession);

export const login = (email: string, password: string) =>
  request<Session>("/auth/login", { method: "POST", body: { email, password } }).then(startSession);

export const logout = () => tokenStore.clear();

export const getMe = () => request<User>("/auth/me");

// --- Not in the server yet: see docs/SERVER-ENDPOINTS.md ---
export const updateName = (name: string) =>
  request<User>("/auth/me", { method: "PATCH", body: { name } });

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<void>("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });

export const requestPasswordReset = (email: string) =>
  request<void>("/auth/forgot-password", { method: "POST", body: { email } });
