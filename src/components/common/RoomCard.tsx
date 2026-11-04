import { Link } from "react-router-dom";
import { DIFFICULTY_LABELS } from "../../constants";
import type { RoomSummary } from "../../types/escapeRoom";
import { Badge } from "./Common";

export function RoomCard({ room }: { room: RoomSummary }) {
  return (
    <article className="room-card card" data-spot data-tilt>
      <div className="room-card-media">
        <img src={room.imageUrl} alt={room.title} />
      </div>
      <h3>{room.title}</h3>
      <p>{room.description}</p>
      <div className="room-card-tags">
        <Badge text={DIFFICULTY_LABELS[room.difficulty]} />
        <Badge text={room.category} />
      </div>
      <Link to={`/rooms/${room.id}`} className="btn btn-ghost">
        <span>לפרטים</span>
      </Link>
    </article>
  );
}
