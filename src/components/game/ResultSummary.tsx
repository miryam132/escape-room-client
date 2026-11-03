import { Link } from "react-router-dom";
import { calcScore, formatTime } from "../../lib/score";
import type { GameStats } from "../../lib/score";
import { Leaderboard } from "./Leaderboard";

type Props = { roomId: string; stats: GameStats; onReplay: () => void };

export function ResultSummary({ roomId, stats, onReplay }: Props) {
  return (
    <section role="status">
      <h2>כל הכבוד!</h2>
      <p>השלמת את החדר בהצלחה.</p>
      <ul>
        <li>זמן: {formatTime(stats.seconds)}</li>
        <li>רמזים: {stats.hintsUsed}</li>
        <li>תשובות שגויות: {stats.wrongAnswers}</li>
        <li>
          <strong>ניקוד: {calcScore(stats)}</strong>
        </li>
      </ul>
      <button type="button" onClick={onReplay}>
        שחק שוב
      </button>{" "}
      <Link to="/rooms">חזרה לחדרים</Link>
      <Leaderboard roomId={roomId} />
    </section>
  );
}
