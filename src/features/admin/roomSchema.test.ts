import { describe, expect, it } from "vitest";
import { EMPTY_HOTSPOT } from "./mappers";
import type { HotspotFormValues } from "./mappers";
import { roomSchema } from "./roomSchema";

const hotspot = (overrides: Partial<HotspotFormValues>): HotspotFormValues => ({
  ...EMPTY_HOTSPOT,
  id: "h1",
  xPercent: 10,
  yPercent: 10,
  label: "ארון",
  content: "תוכן",
  ...overrides,
});

const finalPuzzle = hotspot({
  type: "puzzle",
  question: "?",
  hint: "רמז",
  answer: "5",
  isFinal: true,
});

const room = (hotspots: HotspotFormValues[]) => ({
  title: "חדר",
  description: "תיאור",
  category: "Mystery",
  difficulty: "easy",
  imageUrl: "/images/mansion.jpg",
  hotspots,
});

describe("roomSchema", () => {
  it("accepts a room with exactly one final puzzle", () => {
    expect(roomSchema.safeParse(room([finalPuzzle])).success).toBe(true);
  });

  it("rejects a room without hotspots", () => {
    expect(roomSchema.safeParse(room([])).success).toBe(false);
  });

  it("rejects a room without a final puzzle", () => {
    expect(roomSchema.safeParse(room([hotspot({})])).success).toBe(false);
  });

  it("rejects a puzzle with a non-numeric answer when the type is number", () => {
    const bad = { ...finalPuzzle, answerType: "number" as const, answer: "abc" };
    expect(roomSchema.safeParse(room([bad])).success).toBe(false);
  });

  it("rejects dependency cycles", () => {
    const a = { ...finalPuzzle, id: "a", requiresHotspotId: "b" };
    const b = { ...finalPuzzle, id: "b", isFinal: false, requiresHotspotId: "a" };
    expect(roomSchema.safeParse(room([a, b])).success).toBe(false);
  });
});
