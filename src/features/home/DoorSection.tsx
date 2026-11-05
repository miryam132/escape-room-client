import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "../../components/common/Eye";
import { Icon } from "../../components/common/Icon";
import type { IconName } from "../../components/common/Icon";
import { SECRET_CODE } from "./secretCode";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "door",
    title: "בוחרים חדר",
    text: "חדרים בכל רמות הקושי – מחקירה ומסתורין ועד הרפתקאות.",
  },
  {
    icon: "search",
    title: "חוקרים את החדר",
    text: "לוחצים על פריטים בתמונה, אוספים רמזים ופותחים נעילות.",
  },
  {
    icon: "key",
    title: "מפענחים את הקוד",
    text: "פותרים את החידה הסופית, בורחים ונכנסים ללוח התוצאות.",
  },
];

const OPEN_FROM = 0.1; // scroll progress where the doors start to part
const OPEN_SPAN = 0.6; // ...and how much progress they take to open fully
const NAVIGATE_AFTER_MS = 1100;

/**
 * Scrolling = walking into the room: a tall section whose sticky stage starts with two closed
 * doors; the scroll position parts them and the room behind (the three steps) comes closer.
 * The keypad on the doors is the shortcut: the code hidden in the hero picture opens them.
 */
export function DoorSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [digits, setDigits] = useState("");
  const [status, setStatus] = useState<"locked" | "wrong" | "open">("locked");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      el.style.setProperty("--p", p.toFixed(4));
      el.classList.toggle("is-passed", (p - OPEN_FROM) / OPEN_SPAN > 0.55);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (status !== "open") return;
    const timer = setTimeout(() => navigate("/rooms"), NAVIGATE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  useEffect(() => {
    if (status !== "wrong") return;
    const timer = setTimeout(() => {
      setStatus("locked");
      setDigits("");
    }, 700);
    return () => clearTimeout(timer);
  }, [status]);

  function onChange(raw: string) {
    if (status !== "locked") return;
    const next = raw.replace(/\D/g, "").slice(0, SECRET_CODE.length);
    setDigits(next);
    if (next.length < SECRET_CODE.length) return;
    setStatus(next === SECRET_CODE ? "open" : "wrong");
  }

  const onSubmit = (event: FormEvent) => event.preventDefault();

  return (
    <section
      ref={sectionRef}
      className={`door-section ${status === "open" ? "is-unlocked" : ""}`}
      aria-labelledby="how-heading"
    >
      <div className="door-stage">
        <div className="door-room">
          <p className="eyebrow">איך זה עובד</p>
          <h2 id="how-heading">שלושה שלבים בין הכניסה ליציאה</h2>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <div className="step">
                  <span className="step-num">{i + 1}</span>
                  <span className="step-icon">
                    <Icon name={step.icon} size={26} />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="door-leaf door-leaf-left" aria-hidden="true" />
        <div className="door-leaf door-leaf-right" aria-hidden="true" />
        <span className="door-seam" aria-hidden="true" />

        <form className={`door-lock door-lock-${status}`} onSubmit={onSubmit}>
          <Eye className="door-eye" />
          <p className="door-label">( הקלידו את הקוד )</p>
          <label className="sr-only" htmlFor="door-code">
            קוד הדלת, שלוש ספרות
          </label>
          <div className="door-code-row" dir="ltr">
            <span className="led" aria-hidden="true" />
            <input
              id="door-code"
              className="door-code"
              inputMode="numeric"
              autoComplete="off"
              maxLength={SECRET_CODE.length}
              placeholder="• • •"
              value={digits}
              disabled={status === "open"}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <p className="door-status" role="status">
            {status === "open" && "הדלת נפתחת..."}
            {status === "wrong" && "הקוד שגוי"}
            {status === "locked" && "הקוד מוסתר בחדר החשוך למעלה"}
          </p>
        </form>
      </div>
    </section>
  );
}
