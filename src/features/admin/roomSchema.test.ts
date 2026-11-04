import { EMPTY_HOTSPOT } from "./mappers";
import type { HotspotFormValues } from "./mappers";
import { roomSchema } from "./roomSchema";

const hotspot = (overrides: Partial<HotspotFormValues>): HotspotFormValues => ({
  ...EMPTY_HOTSPOT,
  id: "h1",
  xpercent: 10,
  ypercent: 10,
  label: "ארון",
  content: "תוכן",
  ...overrides,
});

const puzzle = (overrides: Partial<HotspotFormValues> = {}) =>
  hotspot({
    type: "PUZZLE",
    question: "?",
    answer: "5",
    solvedContent: "נפתח",
    isFinal: true,
    ...overrides,
  });

const room = (hotspots: HotspotFormValues[]) => ({
  title: "חדר",
  description: "תיאור",
  category: "חקירה",
  difficulty: "easy",
  imageUrl: "https://example.com/room.webp",
  imageKey: "key",
  hotspots,
});

const isValid = (hotspots: HotspotFormValues[]) => roomSchema.safeParse(room(hotspots)).success;

describe("roomSchema", () => {
  it("accepts a room with exactly one final puzzle", () => {
    expect(isValid([puzzle()])).toBe(true);
  });

  it("requires an uploaded image", () => {
    expect(roomSchema.safeParse({ ...room([puzzle()]), imageUrl: "" }).success).toBe(false);
  });

  it("rejects a room without hotspots or without a final puzzle", () => {
    expect(isValid([])).toBe(false);
    expect(isValid([hotspot({})])).toBe(false);
  });

  it("ignores the final flag on an info point", () => {
    expect(isValid([puzzle(), hotspot({ id: "h2", isFinal: true })])).toBe(true);
  });

  it("requires a solved content for a puzzle", () => {
    expect(isValid([puzzle({ solvedContent: " " })])).toBe(false);
  });

  it("accepts only digits for a numeric answer", () => {
    expect(isValid([puzzle({ answerType: "number", answer: "007" })])).toBe(true);
    expect(isValid([puzzle({ answerType: "number", answer: "1.5" })])).toBe(false);
  });

  it("requires a locked message when a puzzle has a prerequisite", () => {
    const first = puzzle({ id: "a", isFinal: false });
    const second = puzzle({ id: "b", prerequisiteId: "a" });
    expect(isValid([first, second])).toBe(false);
    expect(isValid([first, { ...second, lockedMessage: "פתור קודם את הראשון" }])).toBe(true);
  });

  it("rejects cycles and depending on the final puzzle", () => {
    const msg = { lockedMessage: "נעול" };
    const a = puzzle({ id: "a", isFinal: false, prerequisiteId: "b", ...msg });
    const b = puzzle({ id: "b", isFinal: false, prerequisiteId: "a", ...msg });
    expect(isValid([a, b, puzzle({ id: "f" })])).toBe(false);

    const final = puzzle({ id: "f" });
    const dependent = puzzle({ id: "d", isFinal: false, prerequisiteId: "f", ...msg });
    expect(isValid([final, dependent])).toBe(false);
  });
});
