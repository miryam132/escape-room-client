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
    <>
      <h1>{room.title}</h1>
      <RoomImage imageUrl={room.imageUrl} alt={room.title} />
      <p>{room.description}</p>
      <Badge text={DIFFICULTY_LABELS[room.difficulty]} />
      <Badge text={room.category} />
      <p>
        {room.isPlayable ? (
          <Link to={`/play/${room.id}`}>התחל לשחק</Link>
        ) : (
          <em>החדר עדיין לא מוכן למשחק.</em>
        )}
      </p>
      <Leaderboard roomId={room.id} />
    </>
  );
}
