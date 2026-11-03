export const CATEGORIES = ["Mystery", "Adventure"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export const CATEGORY_LABELS = { Mystery: "מסתורין", Adventure: "הרפתקאות" } as const;
export const DIFFICULTY_LABELS = { easy: "קל", medium: "בינוני", hard: "קשה" } as const;

export const ROOM_IMAGES = [
  { value: "/images/mansion.jpg", label: "האחוזה המסתורית" },
  { value: "/images/laboratory.jpg", label: "המעבדה" },
  { value: "/images/detective-office.png", label: "משרד הבלש" },
] as const;

export const MIN_HOTSPOTS = 1;
export const MAX_HOTSPOTS = 8;

/** Score = BASE - time/hints/wrong-answer penalties (never below 0). */
export const SCORING = { base: 1000, perSecond: 1, perHint: 50, perWrongAnswer: 20 } as const;
export const LEADERBOARD_SIZE = 10;
