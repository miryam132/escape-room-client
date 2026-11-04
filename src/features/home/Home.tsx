import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const WORDS = ["חידות", "רמזים", "סודות", "מנעולים", "אתגרים", "מסתורין"];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="hero">
      <p className="kicker">חדרי בריחה דיגיטליים</p>
      <h1 className="hero-title">
        <span style={{ "--i": 0 } as React.CSSProperties}>הדלת</span>{" "}
        <span style={{ "--i": 1 } as React.CSSProperties}>נעולה.</span>
        <br />
        <span className="accent" style={{ "--i": 2 } as React.CSSProperties}>
          רק החידות
        </span>{" "}
        <span className="accent" style={{ "--i": 3 } as React.CSSProperties}>
          פותחות אותה.
        </span>
      </h1>
      <p className="lead">
        הסתכלו בחדר, מצאו רמזים, פתרו חידות ונסו לצאת לפני כולם. כל משחק נמדד, וכל זמן נכנס ללוח
        התוצאות.
      </p>

      <div className="hero-actions">
        <Link to="/rooms" className="btn btn-primary">
          לחדרי הבריחה
        </Link>
        {!user && (
          <Link to="/register" className="btn">
            יצירת חשבון
          </Link>
        )}
      </div>

      <div className="marquee" aria-hidden="true" dir="ltr">
        <div className="marquee-track">
          {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((word, i) => (
            <span key={i}>
              {word} <b>◆</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
