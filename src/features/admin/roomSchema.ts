import { z } from "zod";
import { CATEGORIES, DIFFICULTIES, MIN_HOTSPOTS } from "../../constants";
import { hasCycle } from "../../lib/hotspots";

const filled = (message: string) => z.string().trim().min(1, message);

const hotspotSchema = z
  .object({
    id: z.string(),
    type: z.enum(["info", "puzzle"]),
    label: filled("הזן שם פריט"),
    xPercent: z.number(),
    yPercent: z.number(),
    content: filled("הזן תוכן"),
    requiresHotspotId: z.string(),
    question: z.string(),
    answerType: z.enum(["text", "number"]),
    answer: z.string(),
    hint: z.string(),
    isFinal: z.boolean(),
  })
  .superRefine((h, ctx) => {
    if (h.type !== "puzzle") return;

    const messages = { question: "הזן שאלה", hint: "הזן רמז", answer: "הזן את התשובה הנכונה" };
    for (const field of ["question", "hint", "answer"] as const) {
      if (!h[field].trim())
        ctx.addIssue({ code: "custom", path: [field], message: messages[field] });
    }
    if (h.answer.trim() && h.answerType === "number" && !Number.isFinite(Number(h.answer))) {
      ctx.addIssue({ code: "custom", path: ["answer"], message: "הזן מספר תקין" });
    }
  });

export const roomSchema = z
  .object({
    title: filled("הזן שם לחדר"),
    description: filled("הזן תיאור"),
    category: z.enum(CATEGORIES),
    difficulty: z.enum(DIFFICULTIES),
    imageUrl: z.string().min(1),
    hotspots: z.array(hotspotSchema),
  })
  .superRefine(({ hotspots }, ctx) => {
    const finals = hotspots.filter((h) => h.type === "puzzle" && h.isFinal).length;
    if (hotspots.length < MIN_HOTSPOTS || finals !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["hotspots"],
        message:
          hotspots.length < MIN_HOTSPOTS
            ? "יש למקם לפחות נקודה אחת על התמונה."
            : "בדיוק חידה אחת חייבת להיות מסומנת כחידה הסופית.",
      });
    }

    hotspots.forEach((h, index) => {
      if (!h.requiresHotspotId) return;
      const prerequisite = hotspots.find((other) => other.id === h.requiresHotspotId);
      const message =
        !prerequisite || prerequisite.type !== "puzzle"
          ? "יש לבחור חידה קיימת"
          : hasCycle(hotspots, h.id, h.requiresHotspotId)
            ? "תלויות בין נקודות לא יכולות ליצור מעגל"
            : null;
      if (message) {
        ctx.addIssue({ code: "custom", path: ["hotspots", index, "requiresHotspotId"], message });
      }
    });
  });
