import { Link, useParams } from "react-router-dom";
import { Badge, ErrorMessage, Loading } from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { useRoom } from "../../hooks/rooms";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const { data: room, isPending, isError } = useRoom(id);

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage="Error loading room details." />;
  if (!room) {
    return (
      <>
        <p>The room was not found</p>
        <Link to="/rooms">Return to Catalog</Link>
      </>
    );
  }

  return (
    <>
      <h1>{room.title}</h1>
      <RoomImage imageUrl={room.imageUrl} alt={room.title} />
      <p>{room.description}</p>
      <Badge text={room.difficulty} />
      <Badge text={room.category} />
      <Link to={`/play/${room.id}`}>Start to play</Link>
    </>
  );
}
