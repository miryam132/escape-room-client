import { Link, useParams } from "react-router-dom";
import { Badge, ErrorMessage, Loading } from "../../components/common/Common";
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
      <>
        <p>החדר לא נמצא</p>
        <Link to="/rooms">חזרה לחדרים</Link>
      </>
    );
  }

  return (
    <div className="details">
      <div className="badges">
        <Badge text={DIFFICULTY_LABELS[room.difficulty]} />
        <Badge text={room.category} />
      </div>
      <h1>{room.title}</h1>
      <p className="lead">{room.description}</p>
      <div className="hero-actions">
        {room.isPlayable ? (
          <Link to={`/play/${room.id}`} className="btn btn-primary">
            התחל לשחק
          </Link>
        ) : (
          <em>החדר עדיין לא מוכן למשחק.</em>
        )}
        <Link to="/rooms" className="btn">
          חזרה לחדרים
        </Link>
      </div>
      <RoomImage imageUrl={room.imageUrl} alt={room.title} />
      <Leaderboard roomId={room.id} />
    </div>
  );
}
