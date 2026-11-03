import type { Hotspot } from "../../types/hotspot";

type RoomImageProps = {
  imageUrl: string;
  alt: string;
  hotspots?: Hotspot[];
  solvedHotspotIds?: string[];
  lockedHotspotIds?: string[];
  onHotspotClick?: (hotspot: Hotspot) => void;
};

export function RoomImage({
  imageUrl,
  alt,
  hotspots = [],
  solvedHotspotIds = [],
  lockedHotspotIds = [],
  onHotspotClick,
}: RoomImageProps) {
  const statusClass = (id: string) =>
    solvedHotspotIds.includes(id)
      ? " hotspot-solved"
      : lockedHotspotIds.includes(id)
        ? " hotspot-locked"
        : "";

  return (
    <div className="room-image-container">
      <img src={imageUrl} alt={alt} className="room-image" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={() => onHotspotClick?.(h)}
          className={`hotspot${statusClass(h.id)}`}
          style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
        >
          {lockedHotspotIds.includes(h.id) && "🔒 "}
          {h.label}
        </button>
      ))}
    </div>
  );
}
