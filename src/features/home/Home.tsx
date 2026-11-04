import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "../../components/fx/Marquee";
import Reveal from "../../components/fx/Reveal";
import { useAuth } from "../auth/authContext";

const TICKER = [
  "חידות",
  "רמזים",
  "קודים סודיים",
  "מנעולים",
  "מפות עתיקות",
  "מסתורין",
  "שעון חול",
  "מפתחות נסתרים",
];

const STEPS = [
  { mark: "observe", title: "מתבוננים", text: "סורקים את החדר ומחפשים כל פרט קטן שמסתתר בצל." },
  {
    mark: "connect",
    title: "מחברים",
    text: "מקשרים בין רמזים, סמלים ומספרים עד שהתמונה מתחילה להסתדר.",
  },
  { mark: "reveal", title: "חושפים", text: "פותחים את המנעול האחרון ובורחים — לפני שהזמן נגמר." },
];

const FEATURES = [
  { icon: "🗝️", title: "חדרים בכל רמה", text: "ממתחילים ועד מומחים. בוחרים רמת קושי ורצים." },
  { icon: "⏳", title: "מרוץ נגד השעון", text: "כל שנייה נספרת, והזמן שלכם נכנס ללוח המובילים." },
  { icon: "🏆", title: "לוח מובילים", text: "מי הבורח המהיר ביותר? הוכיחו שזה אתם." },
];

/** Decorative countdown that loops forever, just to keep the hero ticking. */
function HeroClock() {
  const [left, setLeft] = useState(59 * 60 + 59);
  useEffect(() => {
    const id = window.setInterval(() => setLeft((s) => (s <= 0 ? 59 * 60 + 59 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="hero-clock" dir="ltr" aria-hidden="true">
      {mm}:{ss}
    </div>
  );
}

export function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />

        <div className="hero-copy">
          <span className="eyebrow">
            <i className="live-dot" aria-hidden="true" /> חדרי בריחה דיגיטליים
          </span>
          <h1 className="hero-title">
            <span>הדלת נעולה.</span>
            <span className="hero-title-glow">הסוד בפנים.</span>
          </h1>
          <p className="hero-sub">פתרו חידות, מצאו רמזים והצליחו לברוח מהחדר לפני כולם.</p>
          <div className="hero-cta">
            <Link to="/rooms" className="btn btn-primary" data-magnetic>
              <span>לחדרי הבריחה</span>
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-ghost" data-magnetic>
                <span>הרשמה</span>
              </Link>
            )}
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="keyhole" data-tilt>
            <span className="ring ring-1" />
            <span className="ring ring-2" />
            <span className="ring ring-3" />
            <svg viewBox="0 0 100 130" className="keyhole-svg">
              <defs>
                <linearGradient id="kh" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd37a" />
                  <stop offset="1" stopColor="#a874ff" />
                </linearGradient>
              </defs>
              <path
                d="M50 6a30 30 0 0 0-14 56.4L24 124h52L64 62.4A30 30 0 0 0 50 6Z"
                fill="none"
                stroke="url(#kh)"
                strokeWidth="3"
              />
              <circle cx="50" cy="36" r="9" fill="url(#kh)" />
            </svg>
          </div>
          <HeroClock />
        </div>
      </section>

      <Marquee items={TICKER} />

      <Reveal as="section" className="section">
        <h2 className="section-title">איך בורחים?</h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.mark} delay={i * 120} className="step-wrap">
              <article className="step card" data-spot data-tilt>
                <span className={`step-mark ${s.mark}`} aria-hidden="true" />
                <span className="step-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Marquee items={[...TICKER].reverse()} reverse />

      <Reveal as="section" className="section">
        <div className="features">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 120} className="feature-wrap">
              <article className="feature card" data-spot data-tilt>
                <span className="feature-icon" aria-hidden="true">
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="section cta-band">
        <h2 className="section-title">מוכנים להיכנס?</h2>
        <Link to="/rooms" className="btn btn-primary btn-lg" data-magnetic>
          <span>בואו נתחיל</span>
        </Link>
      </Reveal>
    </div>
  );
}
