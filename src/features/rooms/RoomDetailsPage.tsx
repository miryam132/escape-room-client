import { ErrorMessage, Loading, Badge } from "../../components/common/Common";
import { useRoom } from "../../hooks/useRoom";
import { useParams, Link } from "react-router-dom";
import "../../index.css";
import { RoomImage } from "../../components/common/RoomImage";
import { hotspots } from "../../data/hotspot";

function RoomDetailsPage() {
  const { id } = useParams();
  const { data: room, isPending, isError } = useRoom(id!);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage errorMessage="Error loading room details." />;
  }

  if (!room) {
    return (
      <>
        <p>The room was not found</p>
        <Link to="/rooms">Return to Catalog</Link>
      </>
    );
  }

  const roomHotspots = hotspots.filter((hotspot) => hotspot.roomId === room.id);

  return (
    <>
      <h1>{room.title}</h1>
      <RoomImage
        imageUrl={room.imageUrl}
        hotspots={roomHotspots}
        solvedHotspotIds={[]}
        onHotspotClick={() => {}}
      />
      <p>{room.description}</p>
      <Badge text={room.difficulty} />
      <Badge text={room.category} />
      <Link to={"/play/" + room.id}>Start to play</Link>
    </>
  );
}

export default RoomDetailsPage;
