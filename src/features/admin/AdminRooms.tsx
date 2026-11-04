import { Link, useLocation } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { useDeleteRoom, useRooms } from "../../hooks/rooms";

export default function AdminRooms() {
  const { data, isPending, isError, error } = useRooms({ pageSize: 100 });
  const deleteMutation = useDeleteRoom();
  const successMessage = (useLocation().state as { successMessage?: string } | null)
    ?.successMessage;

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage={errorMessage(error, "שגיאה בטעינת החדרים.")} />;

  function handleDelete(id: string, title: string) {
    const warning = `למחוק את החדר "${title}"? כל הנקודות וההתקדמות של השחקנים יימחקו, ואי אפשר לשחזר.`;
    if (window.confirm(warning)) deleteMutation.mutate(id);
  }

  return (
    <>
      <h1>ניהול חדרים</h1>

      {(successMessage || deleteMutation.isSuccess) && (
        <p role="status">{deleteMutation.isSuccess ? "החדר נמחק בהצלחה." : successMessage}</p>
      )}
      {deleteMutation.isError && (
        <p role="alert">{errorMessage(deleteMutation.error, "מחיקת החדר נכשלה.")}</p>
      )}
      {data.items.length === 0 && <p>אין חדרים להצגה.</p>}

      <Link to="/admin/rooms/new" className="btn btn-primary">
        צור חדר חדש
      </Link>

      <ul className="admin-list">
        {data.items.map((room) => (
          <li key={room.id}>
            <span>{room.title}</span>
            {!room.isPlayable && <em> (לא ניתן לשחק: חסרה חידה סופית)</em>}{" "}
            <Link to={`/admin/rooms/${room.id}/edit`}>עריכה</Link>
            <button
              type="button"
              onClick={() => handleDelete(room.id, room.title)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && deleteMutation.variables === room.id
                ? "מוחק..."
                : "מחיקה"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
