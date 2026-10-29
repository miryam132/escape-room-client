import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "../data/roomRepository";

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}