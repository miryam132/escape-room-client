import { Link } from "react-router-dom";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../../constants";
import type { EscapeRoom } from "../../types/escapeRoom";
import { Badge } from "./Common";

export function RoomCard({ room }: { room: EscapeRoom }) {
  return (
    <article className="room-card">
      <img src={room.imageUrl} alt={room.title} />
      <h3>{room.title}</h3>
      <p>{room.description}</p>
      <Badge text={DIFFICULTY_LABELS[room.difficulty]} />
      <Badge text={CATEGORY_LABELS[room.category]} />
      <Link to={`/rooms/${room.id}`}>לפרטים</Link>
    </article>
  );
}
