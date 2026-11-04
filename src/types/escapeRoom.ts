import type { DIFFICULTIES } from "../constants";

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface EscapeRoom {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  imageUrl: string;
  imageKey?: string | null;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

/** Catalog item: a room plus what the player needs to know before starting. */
export interface RoomSummary extends EscapeRoom {
  puzzleCount: number;
  isPlayable: boolean;
}

export type RoomList = { items: RoomSummary[]; total: number; page: number; pageSize: number };
