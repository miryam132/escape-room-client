import { useEffect, useRef } from "react";
import type { PublicHotspot } from "../../types/hotspot";

type HotspotPanelProps = {
  hotspot: PublicHotspot;
  userAnswer: string;
  feedback: { text: string; ok: boolean } | null;
  isBusy: boolean;
  onAnswerChange: (value: string) => void;
  onCheckAnswer: () => void;
  onClose: () => void;
};

/** Drawer that slides up from the bottom of the room when a point is opened. */
export function HotspotPanel({
  hotspot,
  userAnswer,
  feedback,
  isBusy,
  onAnswerChange,
  onCheckAnswer,
  onClose,
}: HotspotPanelProps) {
  const isOpen = hotspot.state === "AVAILABLE" && hotspot.type === "PUZZLE";
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) input.current?.focus();
  }, [isOpen, hotspot.id]);

  return (
    <section className="drawer" role="dialog" aria-labelledby="drawer-title">
      <button type="button" className="drawer-x" onClick={onClose} aria-label="סגירה">
        ×
      </button>
      <div className="label">{hotspot.type === "PUZZLE" ? "חידה" : "פריט בחדר"}</div>
      <h3 id="drawer-title">{hotspot.label}</h3>

      {hotspot.state === "LOCKED" ? (
        <p className="drawer-text">🔒 {hotspot.lockedMessage}</p>
      ) : (
        hotspot.content && <p className="drawer-text">{hotspot.content}</p>
      )}

      {isOpen && (
        <form
          className="drawer-form"
          onSubmit={(e) => {
            e.preventDefault();
            onCheckAnswer();
          }}
        >
          {hotspot.question && <p className="paper">{hotspot.question}</p>}
          <div className="answer-row">
            <input
              ref={input}
              id={`answer-${hotspot.id}`}
              type="text"
              inputMode={hotspot.answerType === "number" ? "numeric" : "text"}
              autoComplete="off"
              aria-label={hotspot.answerType === "number" ? "הקוד שלך (ספרות)" : "התשובה שלך"}
              placeholder={hotspot.answerType === "number" ? "הקלידו קוד…" : "הקלידו תשובה…"}
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isBusy || !userAnswer.trim()}
            >
              <span>בדיקה</span>
            </button>
          </div>
        </form>
      )}

      {feedback && (
        <p
          role="status"
          key={feedback.text + (feedback.ok ? "ok" : "no")}
          className={`fb ${feedback.ok ? "ok" : "no"}`}
        >
          {feedback.text}
        </p>
      )}
    </section>
  );
}
