
type HotspotBase = {
  id: string;
  roomId: string;
  label: string;
  xPercent: number;
  yPercent: number;
  content: string;
  requiresHotspotId?: string;
};

type InfoHotspot = HotspotBase & {
  type: "info";
};

type PuzzleHotspot = HotspotBase & {
  type: "puzzle";
  question: string;
  answerType: "text" | "number";
  answer: string;
  hint: string;
  isFinal: boolean;
};

export type Hotspot = InfoHotspot | PuzzleHotspot;