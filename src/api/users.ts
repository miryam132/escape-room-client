import type { User } from "../types/user";
import { request } from "./client";

// Not in the server yet: see docs/SERVER-ENDPOINTS.md
export const getUsers = () => request<{ items: User[] }>("/admin/users");
export const deleteUser = (id: string) => request<void>(`/admin/users/${id}`, { method: "DELETE" });
