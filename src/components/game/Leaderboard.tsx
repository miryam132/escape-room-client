import { Icon } from "../common/Icon";
import { useLeaderboard } from "../../hooks/game";
import { formatTime } from "../../lib/format";

export function Leaderboard({ roomId }: { roomId: string }) {
  const { data, isPending, isError } = useLeaderboard(roomId);

  if (isPending || isError) return null;

  return (
    <section className="card leaderboard">
      <h2>
        <Icon name="trophy" size={22} />
        לוח תוצאות – הזמנים המהירים ביותר
      </h2>
      {data.items.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>שחקן</th>
                <th>זמן</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((entry, i) => (
                <tr key={`${entry.userName}-${entry.completedAt}`} className={`rank-${i + 1}`}>
                  <td>
                    <span className="rank">{i + 1}</span>
                  </td>
                  <td>{entry.userName}</td>
                  <td className="mono">{formatTime(entry.seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">עדיין אין תוצאות. היה הראשון!</p>
      )}
    </section>
  );
}
