import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getHint,
  getHotspot,
  getLeaderboard,
  getMyGames,
  restartGame,
  startGame,
  submitAnswer,
} from "../api/game";
import type { Game } from "../types/game";

const gameKey = (roomId: string) => ["game", roomId] as const;
const hotspotKey = (roomId: string, hotspotId: string) => ["hotspot", roomId, hotspotId] as const;

/** Starting is idempotent on the server, so it is safe to use as a query. */
export const useGame = (roomId = "") =>
  useQuery({
    queryKey: gameKey(roomId),
    queryFn: () => startGame(roomId),
    enabled: Boolean(roomId),
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

export const useOpenHotspot = (roomId: string, hotspotId: string | null) =>
  useQuery({
    queryKey: hotspotKey(roomId, hotspotId ?? ""),
    queryFn: () => getHotspot(roomId, hotspotId!),
    enabled: hotspotId !== null,
    staleTime: Infinity,
    gcTime: 0,
  });

export const useHint = (roomId: string) =>
  useMutation({ mutationFn: (id: string) => getHint(roomId, id) });

export function useSubmitAnswer(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hotspotId,
      answer,
      revision,
    }: {
      hotspotId: string;
      answer: string;
      revision: number;
    }) => submitAnswer(roomId, hotspotId, answer, revision),
    onSuccess: (result, { hotspotId }) => {
      if (!result.correct) return;
      // The server returns the new board; unlocking other hotspots changes what they show.
      if (result.game) queryClient.setQueryData(gameKey(roomId), result.game);
      if (result.hotspot) queryClient.setQueryData(hotspotKey(roomId, hotspotId), result.hotspot);
      queryClient.removeQueries({
        queryKey: ["hotspot", roomId],
        predicate: (q) => q.queryKey[2] !== hotspotId,
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard", roomId] });
      queryClient.invalidateQueries({ queryKey: ["my-games"] });
    },
    onError: () => queryClient.invalidateQueries({ queryKey: gameKey(roomId) }),
  });
}

export function useRestartGame(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (revision: number) => restartGame(roomId, revision),
    onSuccess: (game: Game) => {
      queryClient.setQueryData(gameKey(roomId), game);
      queryClient.removeQueries({ queryKey: ["hotspot", roomId] });
    },
  });
}

export const useLeaderboard = (roomId = "") =>
  useQuery({
    queryKey: ["leaderboard", roomId],
    queryFn: () => getLeaderboard(roomId),
    enabled: Boolean(roomId),
  });

export const useMyGames = () => useQuery({ queryKey: ["my-games"], queryFn: getMyGames });
