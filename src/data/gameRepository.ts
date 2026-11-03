import { LEADERBOARD_SIZE } from "../constants";
import type { GameResult } from "../types/game";

// In-memory mock, same as roomRepository — replace with API calls.
const results: GameResult[] = [];

export type ResultInput = Omit<GameResult, "id" | "finishedAt">;

export async function saveResult(input: ResultInput) {
  const result: GameResult = {
    ...input,
    id: crypto.randomUUID(),
    finishedAt: new Date().toISOString(),
  };
  results.push(result);
  return result;
}

export async function getLeaderboard(roomId: string) {
  return results
    .filter((r) => r.roomId === roomId)
    .sort((a, b) => b.score - a.score || a.seconds - b.seconds)
    .slice(0, LEADERBOARD_SIZE);
}

export async function getUserResults(userId: string) {
  return results
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
}
