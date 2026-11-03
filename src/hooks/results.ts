import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaderboard, getUserResults, saveResult } from "../data/gameRepository";

export const useLeaderboard = (roomId = "") =>
  useQuery({
    queryKey: ["leaderboard", roomId],
    queryFn: () => getLeaderboard(roomId),
    enabled: Boolean(roomId),
  });

export const useUserResults = (userId = "") =>
  useQuery({
    queryKey: ["results", userId],
    queryFn: () => getUserResults(userId),
    enabled: Boolean(userId),
  });

export function useSaveResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveResult,
    onSuccess: ({ roomId, userId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leaderboard", roomId] }),
        queryClient.invalidateQueries({ queryKey: ["results", userId] }),
      ]),
  });
}
