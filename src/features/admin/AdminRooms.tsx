import { useRooms } from "../../hooks/useRooms";
import { Loading,ErrorMessage } from "../../components/common/Common";
import {Link} from "react-router-dom";

function AdminRooms(){
    
    const {data:rooms, isPending, isError} = useRooms();
    if (isPending) {
        return <Loading />;
      }
      if (isError) {
        return <ErrorMessage errorMessage="Error loading rooms." />;
      }
      function handleDelete(id: string, title: string) {
  const confirmed = window.confirm(
    `האם אתה בטוח שברצונך למחוק את החדר "${title}"?`
  );

  if (!confirmed) return;

  console.log("Room to delete:", id);
}
    return(
        <>
        <h1>Admin Rooms</h1>
     <Link to="/admin/rooms/new">צור חדר חדש</Link>

<ul>
  {rooms.map((room) => (
    <li key={room.id}>
      <span>{room.title}</span>{" "}
      <Link to={`/admin/rooms/${room.id}/edit`}>עריכה</Link>
      <button
  type="button"
  onClick={() => handleDelete(room.id, room.title)}
>
  מחיקה
</button>
    </li>
  ))}
</ul>
        </>
    )
}
export default AdminRooms;