import { Link } from "react-router-dom";
import { DIFFICULTY_LABELS } from "../../constants";
import type { RoomSummary } from "../../types/escapeRoom";
import { Badge } from "./Common";

export function RoomCard({ room }: { room: RoomSummary }) {
  return (
    <article className="room-card">
      <div className="room-card-media">
        <img src={room.imageUrl} alt={room.title} loading="lazy" />
      </div>
      <div className="room-card-body">
        <div className="badges">
          <Badge text={DIFFICULTY_LABELS[room.difficulty]} />
          <Badge text={room.category} />
        </div>
        <h3>{room.title}</h3>
        <p>{room.description}</p>
        <Link to={`/rooms/${room.id}`} className="card-link">
          לפרטים ←
        </Link>
      </div>
    </article>
  );
}
