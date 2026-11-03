import { useState } from "react";
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

export function useGame(hotspots: Hotspot[]) {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isHintVisible, setIsHintVisible] = useState(false);

  const isCompleted = hotspots.some((h) => h.type === "puzzle" && h.isFinal && solvedIds.includes(h.id));

  function select(hotspot: Hotspot | null) {
    if (hotspot?.requiresHotspotId && !solvedIds.includes(hotspot.requiresHotspotId)) {
      const required = hotspots.find((h) => h.id === hotspot.requiresHotspotId);
      setSelected(null);
      setFeedback(`צריך לפתור קודם: ${required?.label ?? "החידה הקודמת"}`);
      return;
    }
    setAnswer("");
    setFeedback("");
    setIsHintVisible(false);
    setSelected(hotspot);
  }

  function check() {
    if (!selected) return;

    if (!isAnswerCorrect(selected, answer)) {
      setFeedback("התשובה אינה נכונה, נסה שוב.");
      return;
    }
    setFeedback("תשובה נכונה!");
    setSolvedIds((ids) => (ids.includes(selected.id) ? ids : [...ids, selected.id]));
    if (selected.type === "puzzle" && selected.isFinal) setSelected(null);
  }

  return {
    selected,
    solvedIds,
    answer,
    feedback,
    isHintVisible,
    isCompleted,
    select: (h: Hotspot) => !isCompleted && select(h),
    close: () => setSelected(null),
    check,
    setAnswer,
    showHint: () => setIsHintVisible(true),
  };
}
