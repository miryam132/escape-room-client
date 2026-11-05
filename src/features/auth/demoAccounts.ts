/**
 * Demo accounts for the login page's quick buttons (so a reviewer can look around without
 * signing up). This is a demonstration site: these credentials are intentionally public.
 *
 * The admin must already exist on the server (`npm run admin:create`). The player account is
 * created by the first click if the server does not know it yet.
 */
export type DemoAccount = {
  label: string;
  name: string;
  email: string;
  password: string;
  /** Register the account when the server says the login is invalid (players only). */
  createIfMissing: boolean;
  /** Where to land after signing in. */
  landing: string;
};

export const DEMO_ACCOUNTS: Record<"user" | "admin", DemoAccount> = {
  user: {
    label: "כניסה כמשתמש",
    name: "משתמש הדגמה",
    email: "user@escape-room.com",
    password: "demopassword123",
    createIfMissing: true,
    landing: "/rooms",
  },
  admin: {
    label: "כניסה כמנהל",
    name: "מנהל",
    email: "admin@escape-room.com",
    password: "securepassword",
    createIfMissing: false,
    landing: "/admin/rooms",
  },
};
