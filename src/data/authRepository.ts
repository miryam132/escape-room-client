import type { Role, User } from "../types/user";

// MOCK: stored in localStorage until a real server exists.
// Never keep passwords client-side in production — replace with API calls.
type StoredUser = User & { password: string };

export type RegisterInput = { name: string; email: string; password: string; role: Role };

const USERS_KEY = "mysteria:users";
const SESSION_KEY = "mysteria:session";

const readUsers = (): StoredUser[] => JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
const toUser = ({ id, name, email, role }: StoredUser): User => ({ id, name, email, role });

export async function register({ email, ...rest }: RegisterInput): Promise<User> {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("כתובת האימייל כבר רשומה");
  }

  const user: StoredUser = { ...rest, id: crypto.randomUUID(), email: normalizedEmail };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  localStorage.setItem(SESSION_KEY, user.id);
  return toUser(user);
}

export async function login(email: string, password: string): Promise<User> {
  const user = readUsers().find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );
  if (!user) throw new Error("אימייל או סיסמה שגויים");

  localStorage.setItem(SESSION_KEY, user.id);
  return toUser(user);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser(): User | null {
  const id = localStorage.getItem(SESSION_KEY);
  const user = readUsers().find((u) => u.id === id);
  return user ? toUser(user) : null;
}
