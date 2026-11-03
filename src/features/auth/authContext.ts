import { createContext, useContext } from "react";
import type { RegisterInput } from "../../data/authRepository";
import type { User } from "../../types/user";

export type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
