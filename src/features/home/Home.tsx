import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>ברוכים הבאים ל־Mysteria</h1>
      <p>פתרו חידות, מצאו רמזים והצליחו לברוח מהחדר לפני כולם.</p>
      <Link to="/rooms">לחדרי הבריחה</Link>
      {!user && (
        <>
          {" · "}
          <Link to="/register">הרשמה</Link>
        </>
      )}
    </div>
  );
}
