import { Link, useLocation } from "react-router-dom";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { useDeleteRoom, useRooms } from "../../hooks/rooms";

export default function AdminRooms() {
  const { data: rooms, isPending, isError } = useRooms();
  const deleteMutation = useDeleteRoom();
  const successMessage = (useLocation().state as { successMessage?: string } | null)?.successMessage;

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage="Error loading rooms." />;

  function handleDelete(id: string, title: string) {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את החדר "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <>
      <h1>Admin Rooms</h1>

      {(successMessage || deleteMutation.isSuccess) && (
        <p role="status">
          {deleteMutation.isSuccess ? "החדר נמחק בהצלחה." : successMessage}
        </p>
      )}
      {deleteMutation.isError && <p role="alert">מחיקת החדר נכשלה. נסה שוב.</p>}
      {rooms.length === 0 && <p>אין חדרים להצגה.</p>}

      <Link to="/admin/rooms/new">צור חדר חדש</Link>

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <span>{room.title}</span>{" "}
            <Link to={`/admin/rooms/${room.id}/edit`}>עריכה</Link>
            <button
              type="button"
              onClick={() => handleDelete(room.id, room.title)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && deleteMutation.variables === room.id ? "מוחק..." : "מחיקה"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
