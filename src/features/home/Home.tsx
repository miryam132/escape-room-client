import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { DecryptText } from "../../components/common/DecryptText";
import { Icon } from "../../components/common/Icon";
import type { IconName } from "../../components/common/Icon";
import { Reveal } from "../../components/common/Reveal";
import { useAuth } from "../auth/authContext";

const CODE = [7, 3, 1];
const STRIP = [...Array(20).keys()].map((n) => n % 10);

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

const PERKS: { icon: IconName; text: string }[] = [
  { icon: "target", text: "חידות על גבי תמונה אמיתית של החדר" },
  { icon: "bulb", text: "רמזים כשנתקעים" },
  { icon: "trophy", text: "לוח תוצאות לכל חדר" },
];

/** Decorative combination lock: three reels spin and settle, then the LED turns green. */
function Vault() {
  return (
    <div className="vault" aria-hidden="true">
      <div className="vault-dial" />
      <div className="vault-panel">
        <div className="vault-status">
          <span className="led" />
          <span className="vault-status-text">
            <span className="vault-locked">נעול</span>
            <span className="vault-open">נפתח</span>
          </span>
        </div>
        <div className="reels" dir="ltr">
          {CODE.map((digit, i) => (
            <div className="reel" key={i}>
              <div
                className="reel-strip"
                style={{ "--stop": digit, "--d": `${i * 380}ms` } as CSSProperties}
              >
                {STRIP.map((n, j) => (
                  <span key={j}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="vault-caption">הקוד נמצא איפשהו בחדר</p>
      </div>
    </div>
  );
}

export function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pulse-dot" /> Mysteria · חדרי בריחה
          </p>
          <h1>
            הדלת נעולה.
            <br />
            <span className="hero-accent">
              <DecryptText text="הצליחו לברוח?" />
            </span>
          </h1>
          <p className="lead">פתרו חידות, מצאו רמזים והצליחו לברוח מהחדר לפני כולם.</p>

          <div className="hero-actions">
            <Link to="/rooms" className="btn btn-primary btn-lg">
              לחדרי הבריחה
              <Icon name="arrow" />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-ghost btn-lg">
                הרשמה
              </Link>
            )}
          </div>

          <ul className="perks">
            {PERKS.map((perk) => (
              <li key={perk.text}>
                <Icon name={perk.icon} size={18} />
                {perk.text}
              </li>
            ))}
          </ul>
        </div>

        <Vault />
      </section>

      <section className="home-section" aria-labelledby="how-heading">
        <Reveal>
          <p className="eyebrow">איך זה עובד</p>
          <h2 id="how-heading">שלושה שלבים בין הכניסה ליציאה</h2>
        </Reveal>

        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 120} className="step">
                <span className="step-num">{i + 1}</span>
                <span className="step-icon">
                  <Icon name={step.icon} size={26} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Reveal className="cta-band">
        <div>
          <h2>מוכנים לנעילה הבאה?</h2>
          <p>השעון מתחיל לרוץ ברגע שנכנסים לחדר.</p>
        </div>
        <Link to={user ? "/rooms" : "/register"} className="btn btn-primary btn-lg">
          {user ? "בחרו חדר" : "יוצרים חשבון ומתחילים"}
          <Icon name="arrow" />
        </Link>
      </Reveal>
    </div>
  );
}
