import { useNavigate } from "react-router-dom";
import RoomForm from "../../components/common/admin/RoomForms";
import type { RoomFormValues } from "../../components/common/admin/RoomForms";
import { useSaveRoom } from "../../hooks/useRoomEditor";

export default function NewRoom() {
  const navigate = useNavigate();
  const saveRoom = useSaveRoom();

  async function handleSave(values: RoomFormValues) {
    await saveRoom.mutateAsync(values);

    navigate("/admin/rooms", {
      state: { successMessage: "החדר נוצר בהצלחה" },
    });
  }

  return (
    <>
      <h1>Create room</h1>
      <RoomForm onSave={handleSave} />
    </>
  );
}