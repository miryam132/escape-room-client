import { useNavigate } from "react-router-dom";
import { useSaveRoom } from "../../hooks/rooms";
import RoomForm from "./components/RoomForm";
import type { RoomFormValues } from "./mappers";

export default function NewRoom() {
  const navigate = useNavigate();
  const saveRoom = useSaveRoom();

  async function handleSave(values: RoomFormValues) {
    await saveRoom.mutateAsync(values);
    navigate("/admin/rooms", { state: { successMessage: "החדר נוצר בהצלחה" } });
  }

  return (
    <>
      <h1>יצירת חדר</h1>
      <RoomForm onSave={handleSave} />
    </>
  );
}
