import type { CATEGORIES, DIFFICULTIES } from "../constants";

export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface EscapeRoom {
  id: string;
  title: string;
  description: string;
  category: Category;
  imageUrl: string;
  createdAt: string;
  difficulty: Difficulty;
}
