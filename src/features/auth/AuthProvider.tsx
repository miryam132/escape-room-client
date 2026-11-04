import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as auth from "../../api/auth";
import { onUnauthorized, tokenStore } from "../../api/client";
import type { User } from "../../types/user";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => tokenStore.get() !== null);

  // Restore the session from a saved token, and drop it if the server rejects it (401).
  useEffect(() => {
    onUnauthorized(() => setUser(null));
    if (tokenStore.get()) {
      auth
        .getMe()
        .then(setUser)
        .catch(() => tokenStore.clear())
        .finally(() => setIsLoading(false));
    }
    return () => onUnauthorized(null);
  }, []);

  return (
    <AuthContext
      value={{
        user,
        isLoading,
        login: async (email, password) => setUser(await auth.login(email, password)),
        register: async (input) => setUser(await auth.register(input)),
        logout: () => {
          auth.logout();
          setUser(null);
          queryClient.clear(); // never show the previous user's games to the next one
        },
        updateName: async (name) => setUser(await auth.updateName(name)),
        changePassword: auth.changePassword,
      }}
    >
      {children}
    </AuthContext>
  );
}
