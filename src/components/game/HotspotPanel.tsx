import { TextInput } from "../common/Common";
import type { PublicHotspot } from "../../types/hotspot";

type HotspotPanelProps = {
  hotspot: PublicHotspot;
  userAnswer: string;
  feedback: string;
  hint?: string;
  isBusy: boolean;
  onAnswerChange: (value: string) => void;
  onCheckAnswer: () => void;
  onShowHint: () => void;
  onClose: () => void;
};

export function HotspotPanel({
  hotspot,
  userAnswer,
  feedback,
  hint,
  isBusy,
  onAnswerChange,
  onCheckAnswer,
  onShowHint,
  onClose,
}: HotspotPanelProps) {
  const isOpen = hotspot.state === "AVAILABLE" && hotspot.type === "PUZZLE";

  return (
    <section>
      <h2>{hotspot.label}</h2>

      {hotspot.state === "LOCKED" ? (
        <p>🔒 {hotspot.lockedMessage}</p>
      ) : (
        <p style={{ whiteSpace: "pre-line" }}>{hotspot.content}</p>
      )}

      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCheckAnswer();
          }}
        >
          <p style={{ whiteSpace: "pre-line" }}>{hotspot.question}</p>

          <TextInput
            id={`answer-${hotspot.id}`}
            label={hotspot.answerType === "number" ? "הקוד שלך (ספרות)" : "התשובה שלך"}
            value={userAnswer}
            onChange={onAnswerChange}
          />

          {hotspot.hasHint && (
            <>
              <button type="button" onClick={onShowHint} disabled={isBusy || Boolean(hint)}>
                הצג רמז
              </button>
              {hint && <p>{hint}</p>}
            </>
          )}

          <button type="submit" disabled={isBusy || !userAnswer.trim()}>
            בדוק תשובה
          </button>
        </form>
      )}

      {feedback && <p role="status">{feedback}</p>}

      <button type="button" onClick={onClose}>
        סגור
      </button>
    </section>
  );
}
