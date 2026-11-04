export type Role = "PLAYER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
