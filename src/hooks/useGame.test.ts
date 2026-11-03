import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Hotspot } from "../types/hotspot";
import { isAnswerCorrect, useGame } from "./useGame";

const base = { roomId: "r", xPercent: 0, yPercent: 0, content: "" };
const first: Hotspot = {
  ...base,
  id: "p1",
  label: "ראשון",
  type: "puzzle",
  question: "?",
  answerType: "number",
  answer: "24",
  hint: "רמז",
  isFinal: false,
};
const last: Hotspot = {
  ...base,
  id: "p2",
  label: "אחרון",
  type: "puzzle",
  requiresHotspotId: "p1",
  question: "?",
  answerType: "text",
  answer: "Abc",
  hint: "רמז",
  isFinal: true,
};
const hotspots = [first, last];

describe("isAnswerCorrect", () => {
  it("compares numbers numerically", () => {
    expect(isAnswerCorrect(first, " 024 ")).toBe(true);
    expect(isAnswerCorrect(first, "25")).toBe(false);
  });

  it("ignores case and surrounding spaces for text", () => {
    expect(isAnswerCorrect(last, " abc ")).toBe(true);
  });
});

describe("useGame", () => {
  it("locks hotspots until their prerequisite is solved", () => {
    const { result } = renderHook(() => useGame(hotspots));
    expect(result.current.lockedIds).toEqual(["p2"]);

    act(() => result.current.select(last));
    expect(result.current.selected).toBeNull();
    expect(result.current.feedback).toContain("ראשון");
  });

  it("counts wrong answers and hints, then completes with stats", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useGame(hotspots, onComplete));

    act(() => result.current.select(first));
    act(() => result.current.setAnswer("1"));
    act(() => result.current.check());
    act(() => result.current.showHint());
    act(() => result.current.showHint()); // same hint twice costs once
    act(() => result.current.setAnswer("24"));
    act(() => result.current.check());
    expect(result.current.lockedIds).toEqual([]);

    act(() => result.current.select(last));
    act(() => result.current.setAnswer("abc"));
    act(() => result.current.check());

    expect(result.current.isCompleted).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ hintsUsed: 1, wrongAnswers: 1 }),
    );
  });

  it("resets for a replay", () => {
    const { result } = renderHook(() => useGame([{ ...first, isFinal: true }]));
    act(() => result.current.select(first));
    act(() => result.current.setAnswer("24"));
    act(() => result.current.check());
    expect(result.current.isCompleted).toBe(true);

    act(() => result.current.reset());
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.solvedIds).toEqual([]);
  });
});
