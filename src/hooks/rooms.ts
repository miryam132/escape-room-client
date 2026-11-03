import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getHotspotsByRoomId,
  getRoomById,
  getRooms,
  updateRoom,
} from "../data/roomRepository";
import { toRoomInput } from "../features/admin/mappers";
import type { RoomFormValues } from "../features/admin/mappers";

export const queryKeys = {
  rooms: ["rooms"] as const,
  room: (id: string) => ["rooms", id] as const,
  hotspots: (roomId: string) => ["hotspots", roomId] as const,
};

export const useRooms = () => useQuery({ queryKey: queryKeys.rooms, queryFn: getRooms });

export const useRoom = (id = "") =>
  useQuery({
    queryKey: queryKeys.room(id),
    queryFn: () => getRoomById(id),
    enabled: Boolean(id),
  });

export const useRoomHotspots = (roomId = "") =>
  useQuery({
    queryKey: queryKeys.hotspots(roomId),
    queryFn: () => getHotspotsByRoomId(roomId),
    enabled: Boolean(roomId),
  });

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
  });
}

export function useSaveRoom(roomId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RoomFormValues) => {
      const { room, hotspots } = toRoomInput(values);
      return roomId ? updateRoom(roomId, room, hotspots) : createRoom(room, hotspots);
    },
    onSuccess: (room) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
        queryClient.invalidateQueries({ queryKey: queryKeys.hotspots(room.id) }),
      ]),
  });
}
