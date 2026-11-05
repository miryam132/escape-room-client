import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/common/Common";
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
      <PageTitle eyebrow="ניהול" title="יצירת חדר" />
      <RoomForm onSave={handleSave} />
    </>
  );
}
