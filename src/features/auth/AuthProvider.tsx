import { useState } from "react";
import type { ReactNode } from "react";
import * as auth from "../../data/authRepository";
import type { User } from "../../types/user";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.getSessionUser);

  return (
    <AuthContext
      value={{
        user,
        login: async (email, password) => setUser(await auth.login(email, password)),
        register: async (input) => setUser(await auth.register(input)),
        logout: () => {
          auth.logout();
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext>
  );
}
