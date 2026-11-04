import type { HotspotSummary, PublicHotspot } from "./hotspot";

export type Game = {
  id: string;
  roomId: string;
  revision: number;
  status: "ACTIVE" | "COMPLETED";
  startedAt: string;
  completedAt: string | null;
  solvedHotspotIds: string[];
  solvedCount: number;
  totalPuzzles: number;
  hotspots: HotspotSummary[];
};

export type AnswerResult = {
  correct: boolean;
  alreadySolved?: boolean;
  message?: string;
  hotspot?: PublicHotspot;
  game?: Game;
};

export type LeaderboardEntry = { userName: string; seconds: number; completedAt: string };
export type GameHistoryEntry = {
  roomId: string;
  roomTitle: string;
  seconds: number;
  completedAt: string;
};
