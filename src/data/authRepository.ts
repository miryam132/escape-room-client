import type { User } from "../types/user";

// MOCK: stored in localStorage until the real server is connected.
// Passwords must never be kept client-side in production — replace with API calls.
// There is exactly ONE admin (seeded below). Registration can only create regular users.
type StoredUser = User & { password: string };

export type RegisterInput = { name: string; email: string; password: string };

const USERS_KEY = "mysteria:users";
const SESSION_KEY = "mysteria:session";

const SEED_ADMIN: StoredUser = {
  id: "admin",
  name: "מנהל",
  email: "admin@mysteria.local",
  password: "admin1234",
  role: "admin",
};

function readUsers(): StoredUser[] {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  return users.some((u) => u.role === "admin") ? users : [SEED_ADMIN, ...users];
}

const writeUsers = (users: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const toUser = ({ id, name, email, role }: StoredUser): User => ({ id, name, email, role });

function updateUser(id: string, change: (user: StoredUser) => StoredUser) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("המשתמש לא נמצא");
  users[index] = change(users[index]);
  writeUsers(users);
  return toUser(users[index]);
}

export async function register({ email, ...rest }: RegisterInput): Promise<User> {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) throw new Error("כתובת האימייל כבר רשומה");

  const user: StoredUser = {
    ...rest,
    id: crypto.randomUUID(),
    email: normalizedEmail,
    role: "user",
  };
  writeUsers([...users, user]);
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

export const logout = () => localStorage.removeItem(SESSION_KEY);

export function getSessionUser(): User | null {
  const id = localStorage.getItem(SESSION_KEY);
  const user = readUsers().find((u) => u.id === id);
  return user ? toUser(user) : null;
}

export const getUsers = async () => readUsers().map(toUser);

export async function deleteUser(id: string) {
  const user = readUsers().find((u) => u.id === id);
  if (!user) throw new Error("המשתמש לא נמצא");
  if (user.role === "admin") throw new Error("לא ניתן למחוק את המנהל");
  writeUsers(readUsers().filter((u) => u.id !== id));
}

export const updateName = async (id: string, name: string) =>
  updateUser(id, (user) => ({ ...user, name }));

export async function changePassword(id: string, currentPassword: string, newPassword: string) {
  updateUser(id, (user) => {
    if (user.password !== currentPassword) throw new Error("הסיסמה הנוכחית שגויה");
    return { ...user, password: newPassword };
  });
}

/** Mock: the server will email a reset link. Always resolves, so it never reveals which emails exist. */
export async function requestPasswordReset(email: string) {
  void email;
}
