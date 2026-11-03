import { describe, expect, it } from "vitest";
import { calcScore, formatTime } from "./score";

describe("calcScore", () => {
  it("subtracts time, hints and wrong answers from the base score", () => {
    expect(calcScore({ seconds: 100, hintsUsed: 2, wrongAnswers: 3 })).toBe(1000 - 100 - 100 - 60);
  });

  it("never goes below zero", () => {
    expect(calcScore({ seconds: 5000, hintsUsed: 0, wrongAnswers: 0 })).toBe(0);
  });
});

describe("formatTime", () => {
  it("formats seconds as mm:ss", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(75)).toBe("01:15");
  });
});
