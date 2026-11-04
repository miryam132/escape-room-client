import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRoom, getAdminRoom, getRoom, getRooms, uploadImage } from "../api/rooms";
import type { RoomFilters } from "../api/rooms";
import { saveRoom } from "../features/admin/saveRoom";
import type { RoomFormValues } from "../features/admin/mappers";

export const queryKeys = {
  rooms: ["rooms"] as const,
  room: (id: string) => ["rooms", id] as const,
  adminRoom: (id: string) => ["admin-room", id] as const,
};

export const useRooms = (filters: RoomFilters = {}) =>
  useQuery({
    queryKey: [...queryKeys.rooms, filters],
    queryFn: () => getRooms(filters),
    placeholderData: keepPreviousData,
  });

export const useRoom = (id = "") =>
  useQuery({ queryKey: queryKeys.room(id), queryFn: () => getRoom(id), enabled: Boolean(id) });

export const useAdminRoom = (id = "") =>
  useQuery({
    queryKey: queryKeys.adminRoom(id),
    queryFn: () => getAdminRoom(id),
    enabled: Boolean(id),
    gcTime: 0, // the editor must always start from fresh server data
  });

export const useUploadImage = () => useMutation({ mutationFn: uploadImage });

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
  });
}

/** Creates a room (no `original`) or updates `original` to match the form. */
export function useSaveRoom(original?: Parameters<typeof saveRoom>[0]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RoomFormValues) => saveRoom(original ?? null, values),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
