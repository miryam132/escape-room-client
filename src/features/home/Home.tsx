import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/common/Icon";
import type { IconName } from "../../components/common/Icon";
import { Reveal } from "../../components/common/Reveal";
import { RevealLayer } from "../../components/common/RevealLayer";
import { useAuth } from "../auth/authContext";
import { DoorSection } from "./DoorSection";
import { SECRET_CODE_SPACED } from "./secretCode";

const SCENE_IMAGE = "/images/detective-office.png";

const PERKS: { icon: IconName; text: string }[] = [
  { icon: "target", text: "חידות על גבי תמונה אמיתית של החדר" },
  { icon: "bulb", text: "רמזים כשנתקעים" },
  { icon: "trophy", text: "לוח תוצאות לכל חדר" },
];

/** Headline words that switch on one after another, like lights in a dark room (once). */
function LightsOn({
  text,
  start = 0,
  accent = false,
}: {
  text: string;
  start?: number;
  accent?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className={`lights-word ${accent ? "hero-accent" : ""}`}
          style={{ "--w": start + i } as CSSProperties}
        >
          {word}
        </span>
      ))}
    </>
  );
}

/** A dark room. The light shows what is hidden in it: a note and a code only the UV can see. */
function HeroScene() {
  const [showAll, setShowAll] = useState(false);
  const [explored, setExplored] = useState(false);

  return (
    <figure className="hero-scene frame" aria-label="חדר חשוך עם קוד נסתר">
      <div className="room-image-container has-uv">
        <img src={SCENE_IMAGE} alt="" className="room-image" />
        <RevealLayer
          imageUrl={SCENE_IMAGE}
          pinned={showAll}
          radius={120}
          onFirstMove={() => setExplored(true)}
        >
          <g transform="rotate(-4 52 36)">
            <text x="52%" y="38%" className="uv-code">
              {SECRET_CODE_SPACED}
            </text>
          </g>
          <text x="46%" y="56%" className="uv-note">
            הדלת נפתחת רק למי שמחפש
          </text>
        </RevealLayer>
        <span className="room-image-vignette" aria-hidden="true" />
        <button
          type="button"
          className="uv-toggle"
          aria-pressed={showAll}
          onClick={() => setShowAll((v) => !v)}
        >
          <Icon name="eye" size={16} />
          {showAll ? "כיבוי תאורת UV" : "הדלקת תאורת UV"}
        </button>
        <p className={`uv-hint ${explored ? "is-gone" : ""}`} aria-hidden="true">
          ( העבירו את הפנס על החדר )
        </p>
      </div>
      <figcaption className="sr-only">
        בתמונה מוסתר, באור אולטרה-סגול, הקוד 7 3 1 והמשפט: הדלת נפתחת רק למי שמחפש.
      </figcaption>
    </figure>
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
            <LightsOn text="הדלת נעולה." />
            <br />
            <LightsOn text="תצליחו לברוח?" start={2} accent />
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

        <HeroScene />
      </section>

      <DoorSection />

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
