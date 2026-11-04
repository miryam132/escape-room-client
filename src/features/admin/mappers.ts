import type { z } from "zod";
import type { HotspotPayload, RoomPayload } from "../../api/rooms";
import type { AdminHotspot } from "../../types/hotspot";
import type { roomSchema } from "./roomSchema";

export type RoomFormValues = z.input<typeof roomSchema>;
export type HotspotFormValues = RoomFormValues["hotspots"][number];

export const EMPTY_HOTSPOT: Omit<HotspotFormValues, "id" | "xpercent" | "ypercent"> = {
  type: "INFO",
  label: "",
  content: "",
  question: "",
  answerType: "text",
  answer: "",
  hint: "",
  solvedContent: "",
  prerequisiteId: "",
  lockedMessage: "",
  isFinal: false,
};

export const toHotspotFormValues = (h: AdminHotspot): HotspotFormValues => ({
  id: h.id,
  type: h.type,
  label: h.label,
  xpercent: h.xpercent,
  ypercent: h.ypercent,
  content: h.content,
  question: h.question ?? "",
  answerType: h.answerType ?? "text",
  answer: h.answer ?? "",
  hint: h.hint ?? "",
  solvedContent: h.solvedContent ?? "",
  prerequisiteId: h.prerequisiteId ?? "",
  lockedMessage: h.lockedMessage ?? "",
  isFinal: h.isFinal,
});

export const toRoomPayload = (v: RoomFormValues): RoomPayload => ({
  title: v.title.trim(),
  description: v.description.trim(),
  category: v.category.trim(),
  difficulty: v.difficulty,
  imageUrl: v.imageUrl,
  imageKey: v.imageKey || null,
});

/** Content fields only. Dependencies and the final flag are saved in separate steps (see saveRoom). */
export function toContentPayload(
  h: HotspotFormValues,
): Omit<HotspotPayload, "prerequisiteId" | "lockedMessage" | "isFinal"> {
  const base = {
    label: h.label.trim(),
    xpercent: h.xpercent,
    ypercent: h.ypercent,
    content: h.content.trim(),
  };

  // An INFO point must carry no puzzle fields at all, so they are sent explicitly as null.
  if (h.type === "INFO") {
    return {
      ...base,
      type: "INFO",
      question: null,
      answerType: null,
      answer: null,
      hint: null,
      solvedContent: null,
    };
  }
  return {
    ...base,
    type: "PUZZLE",
    question: h.question.trim(),
    answerType: h.answerType,
    answer: h.answer.trim(),
    hint: h.hint.trim() || null,
    solvedContent: h.solvedContent.trim(),
  };
}
