import { TextInput } from "../common/Common";
import type { Hotspot } from "../../types/hotspot";

type HotspotPanelProps = {
  hotspot: Hotspot;
  userAnswer: string;
  answerFeedback: string;
  isHintVisible: boolean;
  onAnswerChange: (value: string) => void;
  onCheckAnswer: () => void;
  onShowHint: () => void;
  onClose: () => void;
};

export function HotspotPanel({
  hotspot,
  userAnswer,
  answerFeedback,
  isHintVisible,
  onAnswerChange,
  onCheckAnswer,
  onShowHint,
  onClose,
}: HotspotPanelProps) {
  return (
    <section>
      <h2>{hotspot.label}</h2>
      <p>{hotspot.content}</p>

      {hotspot.type === "puzzle" && (
        <>
          <p>{hotspot.question}</p>

          <TextInput
            id={hotspot.id}
            label="התשובה שלך"
            value={userAnswer}
            onChange={onAnswerChange}
          />

          <button
            type="button"
            onClick={onShowHint}
            disabled={isHintVisible}
          >
            הצג רמז
          </button>

          {isHintVisible && <p>{hotspot.hint}</p>}

          <button type="button" onClick={onCheckAnswer}>
            בדוק תשובה
          </button>

          <p aria-live="polite">{answerFeedback}</p>
        </>
      )}

      <button type="button" onClick={onClose}>
        סגור
      </button>
    </section>
  );
}