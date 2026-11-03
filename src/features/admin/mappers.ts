import type { z } from "zod";
import type { roomSchema } from "./roomSchema";
import type { Hotspot } from "../../types/hotspot";
import type { HotspotInput, RoomInput } from "../../data/roomRepository";

export type RoomFormValues = z.input<typeof roomSchema>;
export type HotspotFormValues = RoomFormValues["hotspots"][number];

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
