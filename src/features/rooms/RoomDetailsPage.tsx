import { Link, useParams } from "react-router-dom";
import { Badge, ErrorMessage, Loading } from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { Leaderboard } from "../../components/game/Leaderboard";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../../constants";
import { useRoom } from "../../hooks/rooms";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const { data: room, isPending, isError } = useRoom(id);

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage="שגיאה בטעינת פרטי החדר." />;
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
      <Badge text={CATEGORY_LABELS[room.category]} />
      <p>
        <Link to={`/play/${room.id}`}>התחל לשחק</Link>
      </p>
      <Leaderboard roomId={room.id} />
    </>
  );
}
