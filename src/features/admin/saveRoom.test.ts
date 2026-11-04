import * as api from "../../api/rooms";
import type { AdminRoom } from "../../api/rooms";
import type { AdminHotspot } from "../../types/hotspot";
import { EMPTY_HOTSPOT, toHotspotFormValues } from "./mappers";
import type { HotspotFormValues, RoomFormValues } from "./mappers";
import { saveRoom } from "./saveRoom";

vi.mock("../../api/rooms");

const calls: string[] = [];
let counter = 0;

beforeEach(() => {
  calls.length = 0;
  counter = 0;
  vi.mocked(api.createRoom).mockImplementation(async () => {
    calls.push("createRoom");
    return { room: { id: "room" } } as never;
  });
  vi.mocked(api.updateRoom).mockImplementation(async (_id, changes) => {
    calls.push(`updateRoom ${Object.keys(changes).join(",")}`);
    return {} as never;
  });
  vi.mocked(api.addHotspot).mockImplementation(async (_room, payload) => {
    calls.push(`add ${payload.label}`);
    return { hotspot: { id: `server-${++counter}` } } as never;
  });
  vi.mocked(api.updateHotspot).mockImplementation(async (id, changes) => {
    calls.push(`update ${id} ${Object.keys(changes).sort().join(",")}`);
    return {} as never;
  });
  vi.mocked(api.deleteRoom).mockImplementation(async (id) => {
    calls.push(`deleteRoom ${id}`);
  });
  vi.mocked(api.deleteHotspot).mockImplementation(async (id) => {
    calls.push(`delete ${id}`);
  });
});

const puzzle = (id: string, overrides: Partial<HotspotFormValues> = {}): HotspotFormValues => ({
  ...EMPTY_HOTSPOT,
  id,
  label: id,
  xpercent: 1,
  ypercent: 2,
  type: "PUZZLE",
  question: "?",
  answer: "1",
  solvedContent: "ok",
  ...overrides,
});

const form = (hotspots: HotspotFormValues[]): RoomFormValues => ({
  title: "חדר",
  description: "תיאור",
  category: "חקירה",
  difficulty: "easy",
  imageUrl: "https://example.com/a.webp",
  imageKey: "k",
  hotspots,
});

describe("saveRoom", () => {
  it("creates a room, then points, then dependencies, and the final flag last", async () => {
    await saveRoom(
      null,
      form([
        puzzle("temp-final", { isFinal: true }),
        puzzle("temp-second", { prerequisiteId: "temp-first", lockedMessage: "נעול" }),
        puzzle("temp-first"),
      ]),
    );

    expect(calls).toEqual([
      "createRoom",
      "add temp-final",
      "add temp-second",
      "add temp-first",
      "update server-2 lockedMessage,prerequisiteId", // dependency uses the server id of "temp-first"
      "update server-1 isFinal",
    ]);
    expect(vi.mocked(api.updateHotspot).mock.calls[0][1]).toMatchObject({
      prerequisiteId: "server-3",
    });
  });

  it("removes a newly created room again when saving its points fails", async () => {
    vi.mocked(api.addHotspot).mockRejectedValueOnce(new Error("boom"));

    await expect(saveRoom(null, form([puzzle("a", { isFinal: true })]))).rejects.toThrow("boom");
    expect(calls).toEqual(["createRoom", "deleteRoom room"]);
  });

  it("does not delete an existing room when an update fails", async () => {
    vi.mocked(api.updateRoom).mockRejectedValueOnce(new Error("boom"));
    const original = {
      id: "room",
      title: "ישן",
      description: "תיאור",
      category: "חקירה",
      difficulty: "easy",
      imageUrl: "https://example.com/a.webp",
      imageKey: "k",
      revision: 1,
      createdAt: "",
      updatedAt: "",
      hotspots: [],
    } as AdminRoom;

    await expect(saveRoom(original, form([]))).rejects.toThrow("boom");
    expect(calls).toEqual([]);
  });

  it("sends nothing when nothing changed", async () => {
    const hotspot: AdminHotspot = {
      id: "h1",
      roomId: "room",
      label: "a",
      xpercent: 1,
      ypercent: 2,
      type: "PUZZLE",
      content: "",
      question: "?",
      answerType: "text",
      answer: "1",
      hint: null,
      solvedContent: "ok",
      prerequisiteId: null,
      lockedMessage: null,
      isFinal: true,
    };
    const original = {
      id: "room",
      title: "חדר",
      description: "תיאור",
      category: "חקירה",
      difficulty: "easy",
      imageUrl: "https://example.com/a.webp",
      imageKey: "k",
      revision: 1,
      createdAt: "",
      updatedAt: "",
      hotspots: [hotspot],
    } as AdminRoom;

    await saveRoom(original, form([toHotspotFormValues(hotspot)]));
    expect(calls).toEqual([]);
  });

  it("moves the final flag and deletes a removed point before the new final is set", async () => {
    const base = {
      roomId: "room",
      xpercent: 1,
      ypercent: 2,
      type: "PUZZLE",
      content: "",
      question: "?",
      answerType: "text",
      answer: "1",
      hint: null,
      solvedContent: "ok",
      prerequisiteId: null,
      lockedMessage: null,
    } as const;
    const oldFinal: AdminHotspot = { ...base, id: "old", label: "old", isFinal: true };
    const middle: AdminHotspot = { ...base, id: "mid", label: "mid", isFinal: false };
    const original = {
      id: "room",
      title: "חדר",
      description: "תיאור",
      category: "חקירה",
      difficulty: "easy",
      imageUrl: "https://example.com/a.webp",
      imageKey: "k",
      revision: 1,
      createdAt: "",
      updatedAt: "",
      hotspots: [oldFinal, middle],
    } as AdminRoom;

    // "old" is removed, "mid" becomes the final puzzle.
    await saveRoom(original, form([{ ...toHotspotFormValues(middle), isFinal: true }]));

    expect(calls).toEqual([
      "update old isFinal,lockedMessage,prerequisiteId", // removed point is detached first
      "delete old",
      "update mid isFinal",
    ]);
  });
});
