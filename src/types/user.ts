export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
