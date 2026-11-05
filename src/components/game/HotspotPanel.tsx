import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "../common/Icon";
import { TextInput } from "../common/Common";
import type { PublicHotspot } from "../../types/hotspot";

export type PanelFeedback = { text: string; ok: boolean; n: number };

type PanelFrameProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

/** Modal shell for an opened hotspot: dimmed backdrop, Escape / click-outside to close. */
export function PanelFrame({ title, children, onClose, className = "" }: PanelFrameProps) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // An autofocused answer field keeps focus; otherwise focus the dialog itself.
    if (!ref.current?.contains(document.activeElement)) ref.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="panel-layer">
      <div className="panel-backdrop" onClick={onClose} />
      <section
        ref={ref}
        className={`hotspot-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <button type="button" className="panel-close" aria-label="סגור" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
        {children}
      </section>
    </div>
  );
}

type HotspotPanelProps = {
  hotspot: PublicHotspot;
  userAnswer: string;
  feedback: PanelFeedback | null;
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
  const isNumber = hotspot.answerType === "number";

  return (
    <PanelFrame title={hotspot.label} onClose={onClose}>
      <div className={`panel-head panel-head-${hotspot.state.toLowerCase()}`}>
        <span className="panel-icon">
          <Icon
            name={
              hotspot.state === "LOCKED"
                ? "lock"
                : hotspot.state === "SOLVED"
                  ? "check"
                  : hotspot.type === "PUZZLE"
                    ? "question"
                    : "eye"
            }
            size={22}
          />
        </span>
        <div>
          <p className="eyebrow">
            {hotspot.state === "LOCKED"
              ? "נעול"
              : hotspot.state === "SOLVED"
                ? "נפתר"
                : hotspot.type === "PUZZLE"
                  ? "חידה"
                  : "פריט בחדר"}
          </p>
          <h2>{hotspot.label}</h2>
        </div>
      </div>

      {hotspot.state === "LOCKED" ? (
        <p className="panel-text panel-locked">{hotspot.lockedMessage}</p>
      ) : (
        <p className="panel-text">{hotspot.content}</p>
      )}

      {isOpen && (
        <form
          className="panel-form"
          onSubmit={(e) => {
            e.preventDefault();
            onCheckAnswer();
          }}
        >
          <p className="panel-question">{hotspot.question}</p>

          <TextInput
            id={`answer-${hotspot.id}`}
            label={isNumber ? "הקוד שלך (ספרות)" : "התשובה שלך"}
            value={userAnswer}
            onChange={onAnswerChange}
            autoFocus
            inputMode={isNumber ? "numeric" : "text"}
            className={isNumber ? "code-input" : undefined}
          />

          {hint && (
            <p className="hint-box">
              <Icon name="bulb" size={18} />
              {hint}
            </p>
          )}

          {feedback && (
            <p
              key={feedback.n}
              role="status"
              className={`feedback ${feedback.ok ? "feedback-ok" : "feedback-bad"}`}
            >
              {feedback.text}
            </p>
          )}

          <div className="panel-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isBusy || !userAnswer.trim()}
            >
              בדוק תשובה
            </button>
            {hotspot.hasHint && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onShowHint}
                disabled={isBusy || Boolean(hint)}
              >
                <Icon name="bulb" size={18} />
                הצג רמז
              </button>
            )}
          </div>
        </form>
      )}

      {!isOpen && feedback && (
        <p
          key={feedback.n}
          role="status"
          className={`feedback ${feedback.ok ? "feedback-ok" : "feedback-bad"}`}
        >
          {feedback.text}
        </p>
      )}
    </PanelFrame>
  );
}
