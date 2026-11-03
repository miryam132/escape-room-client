import type { Hotspot } from "../../types/hotspot";

type RoomImageProps = {
  imageUrl: string;
  alt: string;
  hotspots?: Hotspot[];
  solvedHotspotIds?: string[];
  onHotspotClick?: (hotspot: Hotspot) => void;
};

export function RoomImage({
  imageUrl,
  alt,
  hotspots = [],
  solvedHotspotIds = [],
  onHotspotClick,
}: RoomImageProps) {
  return (
    <div className="room-image-container">
      <img src={imageUrl} alt={alt} className="room-image" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={() => onHotspotClick?.(h)}
          className={solvedHotspotIds.includes(h.id) ? "hotspot hotspot-solved" : "hotspot"}
          style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
        >
          {h.label}
        </button>
      ))}
    </div>
  );
}
