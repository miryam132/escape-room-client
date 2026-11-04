import { Link } from "react-router-dom";
import Marquee from "../../components/fx/Marquee";
import Secret from "../../components/fx/Secret";
import { useAuth } from "../auth/authContext";

const TICKER = [
  "חידות",
  "רמזים",
  "קודים סודיים",
  "מנעולים",
  "מסתורין",
  "שעון חול",
  "מפתחות נסתרים",
];
const STEPS = ["מתבוננים", "מחברים", "חושפים"];

/** One screen, no scrolling: everything a visitor needs sits in front of them. */
export function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <span className="eyebrow">
          <i className="live-dot" aria-hidden="true" /> חדרי בריחה דיגיטליים
        </span>

        <h1 className="hero-title">
          הדלת נעולה. <em>הסוד</em> בפנים.
        </h1>

        <p className="hero-secret">
          <Secret>הפתרון כבר קיים. אתם רק חושפים אותו.</Secret>
        </p>

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

        <ol className="hero-steps" aria-label="איך זה עובד">
          {STEPS.map((step, i) => (
            <li key={step}>
              <b>0{i + 1}</b> {step}
            </li>
          ))}
        </ol>

        <div className="sticker" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="circ" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
            </defs>
            <text>
              <textPath href="#circ" xlinkHref="#circ">
                MYSTERIA · ESCAPE · MYSTERIA · ESCAPE ·
              </textPath>
            </text>
          </svg>
          <span>🗝️</span>
        </div>
      </section>

      <div className="home-marquees">
        <Marquee items={TICKER} />
        <Marquee items={[...TICKER].reverse()} reverse />
      </div>
    </div>
  );
}
