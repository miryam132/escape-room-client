import { useLeaderboard } from "../../hooks/results";
import { formatTime } from "../../lib/score";

export function Leaderboard({ roomId }: { roomId: string }) {
  const { data: results, isPending } = useLeaderboard(roomId);

  if (isPending) return null;

  return (
    <section>
      <h2>לוח תוצאות</h2>
      {results?.length ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>שחקן</th>
              <th>ניקוד</th>
              <th>זמן</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.userName}</td>
                <td>{r.score}</td>
                <td>{formatTime(r.seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>עדיין אין תוצאות. היה הראשון!</p>
      )}
    </section>
  );
}
