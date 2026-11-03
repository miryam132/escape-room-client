import { useEffect, useState } from "react";
import type { GameStats } from "../lib/score";
import type { Hotspot } from "../types/hotspot";

export const isAnswerCorrect = (hotspot: Hotspot, input: string) => {
  if (hotspot.type !== "puzzle") return false;

  const given = input.trim().toLowerCase();
  const expected = hotspot.answer.trim().toLowerCase();

  if (hotspot.answerType === "number" && given !== "" && expected !== "") {
    return Number(given) === Number(expected);
  }
  return given === expected;
};

const initialState = () => ({
  selectedId: null as string | null,
  solvedIds: [] as string[],
  hintedIds: [] as string[],
  wrongAnswers: 0,
  answer: "",
  feedback: "",
  startedAt: Date.now(),
  finishedSeconds: null as number | null,
});

export function useGame(hotspots: Hotspot[], onComplete?: (stats: GameStats) => void) {
  const [state, setState] = useState(initialState);
  const [now, setNow] = useState(Date.now);
  const { selectedId, solvedIds, hintedIds, wrongAnswers, answer, feedback, finishedSeconds } =
    state;

  const isCompleted = finishedSeconds !== null;
  const selected = hotspots.find((h) => h.id === selectedId) ?? null;
  const seconds = finishedSeconds ?? Math.max(0, Math.floor((now - state.startedAt) / 1000));
  const lockedIds = hotspots
    .filter((h) => h.requiresHotspotId && !solvedIds.includes(h.requiresHotspotId))
    .map((h) => h.id);

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const patch = (changes: Partial<ReturnType<typeof initialState>>) =>
    setState((prev) => ({ ...prev, ...changes }));

  function select(hotspot: Hotspot) {
    if (isCompleted) return;

    if (lockedIds.includes(hotspot.id)) {
      const required = hotspots.find((h) => h.id === hotspot.requiresHotspotId);
      patch({
        selectedId: null,
        feedback: `צריך לפתור קודם: ${required?.label ?? "החידה הקודמת"}`,
      });
      return;
    }
    patch({ selectedId: hotspot.id, answer: "", feedback: "" });
  }

  function check() {
    if (!selected) return;

    if (!isAnswerCorrect(selected, answer)) {
      patch({ wrongAnswers: wrongAnswers + 1, feedback: "התשובה אינה נכונה, נסה שוב." });
      return;
    }

    const newSolved = solvedIds.includes(selected.id) ? solvedIds : [...solvedIds, selected.id];
    if (selected.type === "puzzle" && selected.isFinal) {
      const finalSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      patch({ solvedIds: newSolved, selectedId: null, finishedSeconds: finalSeconds });
      onComplete?.({ seconds: finalSeconds, hintsUsed: hintedIds.length, wrongAnswers });
    } else {
      patch({ solvedIds: newSolved, feedback: "תשובה נכונה!" });
    }
  }

  return {
    selected,
    solvedIds,
    lockedIds,
    answer,
    feedback,
    seconds,
    hintsUsed: hintedIds.length,
    wrongAnswers,
    isCompleted,
    isHintVisible: selectedId !== null && hintedIds.includes(selectedId),
    select,
    check,
    close: () => patch({ selectedId: null }),
    setAnswer: (value: string) => patch({ answer: value }),
    showHint: () =>
      selectedId &&
      !hintedIds.includes(selectedId) &&
      patch({ hintedIds: [...hintedIds, selectedId] }),
    reset: () => {
      setState(initialState());
      setNow(Date.now());
    },
  };
}
