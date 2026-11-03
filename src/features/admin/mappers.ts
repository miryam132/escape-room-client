import type { Category, Difficulty } from "../../types/escapeRoom";
import type { Hotspot } from "../../types/hotspot";
import type { HotspotInput, RoomInput } from "../../data/roomRepository";

export type HotspotFormValues = {
  id: string;
  type: "info" | "puzzle";
  label: string;
  xPercent: number;
  yPercent: number;
  content: string;
  requiresHotspotId: string;
  question: string;
  answerType: "text" | "number";
  answer: string;
  hint: string;
  isFinal: boolean;
};

export type RoomFormValues = {
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  imageUrl: string;
  hotspots: HotspotFormValues[];
};

export const EMPTY_HOTSPOT: Omit<HotspotFormValues, "id" | "xPercent" | "yPercent"> = {
  type: "info",
  label: "",
  content: "",
  requiresHotspotId: "",
  question: "",
  answerType: "text",
  answer: "",
  hint: "",
  isFinal: false,
};

export const toHotspotFormValues = (h: Hotspot): HotspotFormValues => ({
  ...EMPTY_HOTSPOT,
  ...h,
  requiresHotspotId: h.requiresHotspotId ?? "",
});

export function toRoomInput({ hotspots, ...room }: RoomFormValues): {
  room: RoomInput;
  hotspots: HotspotInput[];
} {
  return {
    room: {
      ...room,
      title: room.title.trim(),
      description: room.description.trim(),
    },
    hotspots: hotspots.map((h): HotspotInput => {
      const base = {
        id: h.id,
        label: h.label.trim(),
        xPercent: h.xPercent,
        yPercent: h.yPercent,
        content: h.content.trim(),
        requiresHotspotId: h.requiresHotspotId || undefined,
      };

      return h.type === "info"
        ? { ...base, type: "info" }
        : {
            ...base,
            type: "puzzle",
            question: h.question.trim(),
            answerType: h.answerType,
            answer: h.answer.trim(),
            hint: h.hint.trim(),
            isFinal: h.isFinal,
          };
    }),
  };
}
