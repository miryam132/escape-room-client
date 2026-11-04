export type HotspotType = "INFO" | "PUZZLE";
export type AnswerType = "text" | "number";
export type HotspotState = "LOCKED" | "AVAILABLE" | "SOLVED";

/** Full hotspot as the admin sees it (includes the answer). */
export type AdminHotspot = {
  id: string;
  roomId: string;
  label: string;
  xpercent: number;
  ypercent: number;
  type: HotspotType;
  content: string;
  question: string | null;
  answerType: AnswerType | null;
  answer: string | null;
  hint: string | null;
  solvedContent: string | null;
  prerequisiteId: string | null;
  lockedMessage: string | null;
  isFinal: boolean;
};

/** Hotspot as the server sends it in the board overview: position and state only. */
export type HotspotSummary = Pick<
  AdminHotspot,
  "id" | "label" | "xpercent" | "ypercent" | "type" | "isFinal"
> & { state: HotspotState };

/** Hotspot opened by a player; content is already filtered by its state. */
export type PublicHotspot = HotspotSummary & {
  roomId: string;
  content?: string | null;
  question?: string | null;
  answerType?: AnswerType | null;
  hasHint?: boolean;
  lockedMessage?: string;
};
