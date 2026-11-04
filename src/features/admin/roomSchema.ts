import { z } from "zod";
import { DIFFICULTIES, MIN_HOTSPOTS } from "../../constants";
import { hasCycle } from "../../lib/hotspots";

const filled = (message: string, max = 10_000) =>
  z.string().trim().min(1, message).max(max, "הטקסט ארוך מדי");

const hotspotSchema = z
  .object({
    id: z.string(),
    type: z.enum(["INFO", "PUZZLE"]),
    label: filled("הזן שם פריט", 150),
    xpercent: z.number(),
    ypercent: z.number(),
    content: z.string().max(10_000),
    question: z.string(),
    answerType: z.enum(["text", "number"]),
    answer: z.string(),
    hint: z.string(),
    solvedContent: z.string(),
    prerequisiteId: z.string(),
    lockedMessage: z.string(),
    isFinal: z.boolean(),
  })
  .superRefine((h, ctx) => {
    const missing = (path: keyof typeof h, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (h.type === "INFO") {
      if (!h.content.trim()) missing("content", "הזן תוכן");
      return;
    }

    if (!h.question.trim()) missing("question", "הזן שאלה");
    if (!h.answer.trim()) missing("answer", "הזן את התשובה הנכונה");
    else if (h.answerType === "number" && !/^\d+$/.test(h.answer.trim())) {
      missing("answer", "תשובה מספרית היא קוד של ספרות בלבד (0-9)");
    }
    if (!h.solvedContent.trim()) missing("solvedContent", "הזן את התוכן שנחשף אחרי הפתרון");
    if (h.prerequisiteId && !h.lockedMessage.trim())
      missing("lockedMessage", "הזן הודעה לנקודה נעולה");
  });

export const roomSchema = z
  .object({
    title: filled("הזן שם לחדר", 150),
    description: filled("הזן תיאור", 5000),
    category: filled("הזן קטגוריה", 80),
    difficulty: z.enum(DIFFICULTIES),
    imageUrl: z.string().min(1, "יש להעלות תמונה"),
    imageKey: z.string(),
    hotspots: z.array(hotspotSchema),
  })
  .superRefine(({ hotspots }, ctx) => {
    const puzzles = hotspots.filter((h) => h.type === "PUZZLE");
    const finals = puzzles.filter((h) => h.isFinal);

    if (hotspots.length < MIN_HOTSPOTS || finals.length !== 1) {
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
      if (h.type !== "PUZZLE" || !h.prerequisiteId) return;

      const prerequisite = puzzles.find((other) => other.id === h.prerequisiteId);
      const message = !prerequisite
        ? "יש לבחור חידה קיימת"
        : prerequisite.isFinal
          ? "אי אפשר להתנות בחידה הסופית"
          : hasCycle(
                puzzles.map(({ id, prerequisiteId }) => ({
                  id,
                  requiresHotspotId: prerequisiteId,
                })),
                h.id,
                h.prerequisiteId,
              )
            ? "תלויות בין נקודות לא יכולות ליצור מעגל"
            : null;

      if (message) {
        ctx.addIssue({ code: "custom", path: ["hotspots", index, "prerequisiteId"], message });
      }
    });
  });
