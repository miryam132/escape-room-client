import { useRooms } from "../../hooks/useRooms";
import { Loading,ErrorMessage } from "../../components/common/Common";
import {Link} from "react-router-dom";
import { useDeleteRoom } from "../../hooks/useDeleteRoom";

function AdminRooms(){
    
    const {data:rooms, isPending, isError} = useRooms();
    const deleteMutation = useDeleteRoom();
    if (isPending) {
        return <Loading />;
      }
      if (isError) {
        return <ErrorMessage errorMessage="Error loading rooms." />;
      }
      function handleDelete(id: string, title: string) {
        const confirmed = window.confirm(
           `האם אתה בטוח שברצונך למחוק את החדר "${title}"?`);
    if (!confirmed) return;
  deleteMutation.mutate(id);
}
    return(
        <>
        <h1>Admin Rooms</h1>
        {deleteMutation.isSuccess && (
  <p role="status">החדר נמחק בהצלחה.</p>
)}

{deleteMutation.isError && (
  <p role="alert">מחיקת החדר נכשלה. נסה שוב.</p>
)}

{rooms.length === 0 && <p>אין חדרים להצגה.</p>}
     <Link to="/admin/rooms/new">צור חדר חדש</Link>

<ul>
  {rooms.map((room) => (
    <li key={room.id}>
      <span>{room.title}</span>{" "}
      <Link to={`/admin/rooms/${room.id}/edit`}>עריכה</Link>
     <button type="button" onClick={() => handleDelete(room.id, room.title)}
      disabled={deleteMutation.isPending}>
  {deleteMutation.isPending && deleteMutation.variables === room.id
    ? "מוחק..."
    : "מחיקה"}
</button>
    </li>
  ))}
</ul>
        </>
    )
}
export default AdminRooms;