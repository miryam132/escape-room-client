import type { CSSProperties, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { DIFFICULTY_LABELS } from "../../constants";
import type { RoomSummary } from "../../types/escapeRoom";
import { Badge } from "./Common";
import { Icon } from "./Icon";

/** Moves the card's light spot to the pointer (see .room-card::after in the stylesheet). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--px", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--py", `${event.clientY - rect.top}px`);
}

export function RoomCard({ room, index = 0 }: { room: RoomSummary; index?: number }) {
  return (
    <article
      className="room-card"
      style={{ "--i": index } as CSSProperties}
      onPointerMove={trackPointer}
    >
      <div className="room-card-media">
        <img src={room.imageUrl} alt={room.title} loading="lazy" />
        <Badge text={DIFFICULTY_LABELS[room.difficulty]} tone={room.difficulty} />
      </div>
      <div className="room-card-body">
        <h3>{room.title}</h3>
        <p>{room.description}</p>
        <div className="room-card-footer">
          <Badge text={room.category} />
          <Link to={`/rooms/${room.id}`} className="room-card-link">
            לפרטים
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
