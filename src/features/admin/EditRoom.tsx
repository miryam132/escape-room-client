import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { useRoom, useRoomHotspots, useSaveRoom } from "../../hooks/rooms";
import RoomForm from "./components/RoomForm";
import { toHotspotFormValues } from "./mappers";
import type { RoomFormValues } from "./mappers";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const saveRoom = useSaveRoom(id);
  const room = useRoom(id);
  const hotspots = useRoomHotspots(id);

  if (!id) return <ErrorMessage errorMessage="Missing room ID" />;
  if (room.isPending || hotspots.isPending) return <Loading />;
  if (room.isError || hotspots.isError) return <ErrorMessage errorMessage="Error loading room" />;

  if (!room.data) {
    return (
      <div>
        <p>Room not found.</p>
        <Link to="/admin/rooms">Back to room management</Link>
      </div>
    );
  }

  const { title, description, category, difficulty, imageUrl } = room.data;
  const initialValues: RoomFormValues = {
    title,
    description,
    category,
    difficulty,
    imageUrl,
    hotspots: hotspots.data.map(toHotspotFormValues),
  };

  async function handleSave(values: RoomFormValues) {
    await saveRoom.mutateAsync(values);
    navigate("/admin/rooms", { state: { successMessage: "החדר עודכן בהצלחה" } });
  }

  return (
    <>
      <h1>Edit room: {title}</h1>
      <RoomForm key={id} initialValues={initialValues} onSave={handleSave} />
    </>
  );
}
