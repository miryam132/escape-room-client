import { Link, useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import RoomForm from "../../components/common/admin/RoomForms";
import type { RoomFormValues } from "../../components/common/admin/RoomForms";
import { Loading, ErrorMessage } from "../../components/common/Common";
import { hotspots } from "../../data/hotspot";
import { useNavigate } from "react-router-dom";
import { useSaveRoom } from "../../hooks/useRoomEditor";


export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
const saveRoom = useSaveRoom(id);

async function handleSave(values: RoomFormValues) {
  await saveRoom.mutateAsync(values);

  navigate("/admin/rooms", {
    state: { successMessage: "החדר עודכן בהצלחה" },
  });
}
  const { data: room, isPending, isError } = useRoom(id!);
  

  if (!id) {
    return <ErrorMessage errorMessage="Missing room ID" />;
  }

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage errorMessage="Error loading room" />;
  }

  if (!room) {
    return (
      <div>
        <p>Room not found.</p>
        <Link to="/admin/rooms">Back to room management</Link>
      </div>
    );
  }

  const initialValues: RoomFormValues = {
    title: room.title,
    description: room.description,
    category: room.category,
    difficulty: room.difficulty,
    imageUrl: room.imageUrl,
    hotspots: hotspots
  .filter((hotspot) => hotspot.roomId === room.id)
  .map((hotspot) => ({
    id: hotspot.id,
    type: hotspot.type,
    label: hotspot.label,
    xPercent: hotspot.xPercent,
    yPercent: hotspot.yPercent,
    content: hotspot.content,
    requiresHotspotId: hotspot.requiresHotspotId ?? "",

    question: hotspot.type === "puzzle" ? hotspot.question : "",
    answerType: hotspot.type === "puzzle" ? hotspot.answerType : "text",
    answer: hotspot.type === "puzzle" ? hotspot.answer : "",
    hint: hotspot.type === "puzzle" ? hotspot.hint : "",
    isFinal: hotspot.type === "puzzle" ? hotspot.isFinal : false,
  })),
  };

  return (
    <>
      <h1>Edit room: {room.title}</h1>
<RoomForm
  key={room.id}
  initialValues={initialValues}
  onSave={handleSave}
/>    </>
  );
}