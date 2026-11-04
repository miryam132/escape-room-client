export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const DIFFICULTY_LABELS = { easy: "קל", medium: "בינוני", hard: "קשה" } as const;

/** Category is free text on the server; these are only suggestions in the room form. */
export const SUGGESTED_CATEGORIES = ["חקירה", "מסתורין", "הרפתקאות"];

export const MIN_HOTSPOTS = 1;
export const MAX_HOTSPOTS = 20;
