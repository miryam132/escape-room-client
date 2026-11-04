import { hasCycle } from "./hotspots";

const chain = [
  { id: "a" },
  { id: "b", requiresHotspotId: "a" },
  { id: "c", requiresHotspotId: "b" },
];

describe("hasCycle", () => {
  it("allows a plain chain", () => {
    expect(hasCycle(chain, "c", "b")).toBe(false);
  });

  it("detects depending on itself", () => {
    expect(hasCycle(chain, "a", "a")).toBe(true);
  });

  it("detects an indirect cycle", () => {
    expect(hasCycle(chain, "a", "c")).toBe(true);
  });
});
