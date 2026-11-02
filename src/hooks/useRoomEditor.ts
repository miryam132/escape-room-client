import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  updateRoom,
  getHotspotsByRoomId,
} from "../data/roomRepository";
import type { HotspotInput } from "../data/roomRepository";
import type { RoomFormValues } from "../components/common/admin/RoomForms";

export function useRoomHotspots(roomId?: string) {
  return useQuery({
    queryKey: ["hotspots", roomId],
    queryFn: () => getHotspotsByRoomId(roomId!),
    enabled: Boolean(roomId),
  });
}

export function useSaveRoom(roomId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RoomFormValues) => {
      const { hotspots, ...room } = values;

      const roomHotspots: HotspotInput[] = hotspots.map((hotspot) => {
        const base = {
          id: hotspot.id,
          label: hotspot.label.trim(),
          xPercent: hotspot.xPercent,
          yPercent: hotspot.yPercent,
          content: hotspot.content.trim(),
          requiresHotspotId: hotspot.requiresHotspotId || undefined,
        };

        if (hotspot.type === "info") {
          return { ...base, type: "info" };
        }

        return {
          ...base,
          type: "puzzle",
          question: hotspot.question.trim(),
          answerType: hotspot.answerType,
          answer: hotspot.answer.trim(),
          hint: hotspot.hint.trim(),
          isFinal: hotspot.isFinal,
        };
      });

      const roomData = {
        ...room,
        title: room.title.trim(),
        description: room.description.trim(),
      };

      return roomId
        ? updateRoom(roomId, roomData, roomHotspots)
        : createRoom(roomData, roomHotspots);
    },

    onSuccess: async (room) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rooms"] }),
        queryClient.invalidateQueries({
          queryKey: ["hotspots", room.id],
        }),
      ]);
    },
  });
}