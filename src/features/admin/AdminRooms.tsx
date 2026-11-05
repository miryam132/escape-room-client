import { Link, useLocation } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { Badge, ErrorMessage, Loading, PageTitle } from "../../components/common/Common";
import { Icon } from "../../components/common/Icon";
import { DIFFICULTY_LABELS } from "../../constants";
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
      <PageTitle eyebrow="ניהול" title="ניהול חדרים">
        <Link to="/admin/rooms/new" className="btn btn-primary">
          <Icon name="plus" size={18} />
          צור חדר חדש
        </Link>
      </PageTitle>

      {(successMessage || deleteMutation.isSuccess) && (
        <p role="status" className="feedback feedback-ok">
          {deleteMutation.isSuccess ? "החדר נמחק בהצלחה." : successMessage}
        </p>
      )}
      {deleteMutation.isError && (
        <p role="alert">{errorMessage(deleteMutation.error, "מחיקת החדר נכשלה.")}</p>
      )}
      {data.items.length === 0 && (
        <div className="empty">
          <p>אין חדרים להצגה.</p>
        </div>
      )}

      <ul className="admin-list">
        {data.items.map((room) => (
          <li key={room.id} className="admin-row">
            <img src={room.imageUrl} alt="" className="admin-thumb" loading="lazy" />
            <div className="admin-row-main">
              <span className="admin-row-title">{room.title}</span>
              <span className="badges">
                <Badge text={DIFFICULTY_LABELS[room.difficulty]} tone={room.difficulty} />
                <Badge text={room.category} />
              </span>
              {!room.isPlayable && <em className="warn">לא ניתן לשחק: חסרה חידה סופית</em>}
            </div>
            <div className="admin-row-actions">
              <Link to={`/admin/rooms/${room.id}/edit`} className="btn btn-ghost btn-sm">
                <Icon name="edit" size={16} />
                עריכה
              </Link>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(room.id, room.title)}
                disabled={deleteMutation.isPending}
              >
                <Icon name="trash" size={16} />
                {deleteMutation.isPending && deleteMutation.variables === room.id
                  ? "מוחק..."
                  : "מחיקה"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
