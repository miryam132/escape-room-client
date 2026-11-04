import type { AdminHotspot } from "../types/hotspot";
import type { EscapeRoom, RoomList, RoomSummary } from "../types/escapeRoom";
import { request } from "./client";

export type RoomFilters = {
  search?: string;
  category?: string;
  difficulty?: string;
  sort?: "newest" | "oldest" | "title" | "difficulty";
  page?: number;
  pageSize?: number;
};

export type RoomPayload = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageUrl: string;
  imageKey: string | null;
};

export type HotspotPayload = Omit<AdminHotspot, "id" | "roomId">;

export type AdminRoom = EscapeRoom & { hotspots: AdminHotspot[] };

export const getRooms = (filters: RoomFilters = {}) =>
  request<RoomList>("/rooms", { query: filters });

export const getRoom = (id: string) => request<RoomSummary>(`/rooms/${id}`);

// --- admin ---
export const getAdminRoom = (id: string) => request<AdminRoom>(`/admin/rooms/${id}`);

export const createRoom = (room: RoomPayload) =>
  request<{ room: EscapeRoom }>("/admin/rooms", { method: "POST", body: room });

export const updateRoom = (id: string, changes: Partial<RoomPayload>) =>
  request<{ room: EscapeRoom; progressReset: boolean }>(`/admin/rooms/${id}`, {
    method: "PATCH",
    body: changes,
  });

export const deleteRoom = (id: string) => request<void>(`/admin/rooms/${id}`, { method: "DELETE" });

export const addHotspot = (roomId: string, hotspot: HotspotPayload) =>
  request<{ hotspot: AdminHotspot }>(`/admin/rooms/${roomId}/hotspots`, {
    method: "POST",
    body: hotspot,
  });

export const updateHotspot = (id: string, changes: Partial<HotspotPayload>) =>
  request<{ hotspot: AdminHotspot }>(`/admin/hotspots/${id}`, { method: "PATCH", body: changes });

export const deleteHotspot = (id: string) =>
  request<void>(`/admin/hotspots/${id}`, { method: "DELETE" });

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("image", file);
  return request<{ imageKey: string; imageUrl: string }>("/admin/uploads", {
    method: "POST",
    form,
  });
};
