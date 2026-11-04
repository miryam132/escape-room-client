import { useLeaderboard } from "../../hooks/game";
import { formatTime } from "../../lib/format";

export function Leaderboard({ roomId }: { roomId: string }) {
  const { data, isPending, isError } = useLeaderboard(roomId);

  if (isPending || isError) return null;

  return (
    <section>
      <h2>לוח תוצאות – הזמנים המהירים ביותר</h2>
      {data.items.length ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>שחקן</th>
              <th>זמן</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((entry, i) => (
              <tr key={`${entry.userName}-${entry.completedAt}`}>
                <td>{i + 1}</td>
                <td>{entry.userName}</td>
                <td>{formatTime(entry.seconds)}</td>
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
