import type { EscapeRoom } from "../../types/escapeRoom";
import { Link } from "react-router-dom";
import { Badge } from "./Common";
export function RoomCard({room}:{room:EscapeRoom}) {
    return (
        <article className="room-card">
            <img src={room.imageUrl} alt={room.title} />
            <h3>{room.title}</h3>
            <p>{room.description}</p>
            <Badge text={room.difficulty} />
            <Badge text={room.category} />
            <Link to={`/rooms/${room.id}`}>View Details</Link>
        </article>
    )

}