import type { AnswerResult, Game, GameHistoryEntry, LeaderboardEntry } from "../types/game";
import type { PublicHotspot } from "../types/hotspot";
import { request } from "./client";

const base = (roomId: string) => `/rooms/${roomId}/game`;

/** Starts a game, or resumes the existing one without resetting it. */
export const startGame = (roomId: string) => request<Game>(base(roomId), { method: "POST" });

export const getHotspot = (roomId: string, hotspotId: string) =>
  request<PublicHotspot>(`${base(roomId)}/hotspots/${hotspotId}`);

export const getHint = (roomId: string, hotspotId: string) =>
  request<{ hint: string | null }>(`${base(roomId)}/hotspots/${hotspotId}/hint`);

export const submitAnswer = (roomId: string, hotspotId: string, answer: string, revision: number) =>
  request<AnswerResult>(`${base(roomId)}/hotspots/${hotspotId}/answer`, {
    method: "POST",
    body: { answer, revision },
  });

export const restartGame = (roomId: string, revision: number) =>
  request<Game>(`${base(roomId)}/restart`, { method: "POST", body: { revision } });

// --- Not in the server yet: see docs/SERVER-ENDPOINTS.md ---
export const getLeaderboard = (roomId: string) =>
  request<{ items: LeaderboardEntry[] }>(`/rooms/${roomId}/leaderboard`);

export const getMyGames = () => request<{ items: GameHistoryEntry[] }>("/me/games");
