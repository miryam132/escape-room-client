import { Link, useParams } from "react-router-dom";
import { Badge, ErrorMessage, Loading } from "../../components/common/Common";
import { Icon } from "../../components/common/Icon";
import { RoomImage } from "../../components/common/RoomImage";
import { Leaderboard } from "../../components/game/Leaderboard";
import { DIFFICULTY_LABELS } from "../../constants";
import { errorMessage } from "../../api/client";
import { useRoom } from "../../hooks/rooms";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const { data: room, isPending, isError, error } = useRoom(id);

  if (isPending) return <Loading />;
  if (isError)
    return <ErrorMessage errorMessage={errorMessage(error, "שגיאה בטעינת פרטי החדר.")} />;
  if (!room) {
    return (
      <div className="empty">
        <p>החדר לא נמצא</p>
        <Link to="/rooms" className="btn btn-ghost">
          חזרה לחדרים
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/rooms" className="back-link">
        <Icon name="arrow" size={16} />
        כל החדרים
      </Link>

      <div className="room-detail">
        <div className="frame">
          <RoomImage imageUrl={room.imageUrl} alt={room.title} />
        </div>

        <aside className="room-detail-info">
          <div className="badges">
            <Badge text={DIFFICULTY_LABELS[room.difficulty]} tone={room.difficulty} />
            <Badge text={room.category} />
          </div>
          <h1>{room.title}</h1>
          <p className="lead">{room.description}</p>

          <dl className="facts">
            <div>
              <dt>חידות</dt>
              <dd>{room.puzzleCount}</dd>
            </div>
            <div>
              <dt>קושי</dt>
              <dd>{DIFFICULTY_LABELS[room.difficulty]}</dd>
            </div>
          </dl>

          {room.isPlayable ? (
            <Link to={`/play/${room.id}`} className="btn btn-primary btn-lg btn-block">
              התחל לשחק
              <Icon name="arrow" />
            </Link>
          ) : (
            <p className="notice">
              <Icon name="lock" size={18} />
              החדר עדיין לא מוכן למשחק.
            </p>
          )}
        </aside>
      </div>

      <Leaderboard roomId={room.id} />
    </>
  );
}
