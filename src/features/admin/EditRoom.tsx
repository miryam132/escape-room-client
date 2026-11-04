import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError, errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { useAdminRoom, useSaveRoom } from "../../hooks/rooms";
import RoomForm from "./components/RoomForm";
import { toHotspotFormValues } from "./mappers";
import type { RoomFormValues } from "./mappers";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = useAdminRoom(id);
  const saveRoom = useSaveRoom(room.data);

  if (!id) return <ErrorMessage errorMessage="חסר מזהה חדר" />;
  if (room.isPending) return <Loading />;
  if (room.isError) {
    return room.error instanceof ApiError && room.error.status === 404 ? (
      <div>
        <p>החדר לא נמצא.</p>
        <Link to="/admin/rooms">חזרה לניהול חדרים</Link>
      </div>
    ) : (
      <ErrorMessage errorMessage={errorMessage(room.error, "שגיאה בטעינת החדר")} />
    );
  }

  const { title, description, category, difficulty, imageUrl, imageKey, hotspots } = room.data;
  const initialValues: RoomFormValues = {
    title,
    description,
    category,
    difficulty,
    imageUrl,
    imageKey: imageKey ?? "",
    hotspots: hotspots.map(toHotspotFormValues),
  };

  async function handleSave(values: RoomFormValues) {
    const warning =
      "שמירת שינויים בנקודות או בתמונה מאפסת את ההתקדמות של כל השחקנים בחדר הזה. להמשיך?";
    if (!window.confirm(warning)) return;

    await saveRoom.mutateAsync(values);
    navigate("/admin/rooms", { state: { successMessage: "החדר עודכן בהצלחה" } });
  }

  return (
    <>
      <h1>עריכת חדר: {title}</h1>
      <RoomForm key={room.data.revision} initialValues={initialValues} onSave={handleSave} />
    </>
  );
}
