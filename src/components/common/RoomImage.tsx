import type { HotspotSummary } from "../../types/hotspot";

type RoomImageProps = {
  imageUrl: string;
  alt: string;
  hotspots?: HotspotSummary[];
  onHotspotClick?: (hotspot: HotspotSummary) => void;
};

export function RoomImage({ imageUrl, alt, hotspots = [], onHotspotClick }: RoomImageProps) {
  return (
    <div className="room-image-container">
      <img src={imageUrl} alt={alt} className="room-image" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={() => onHotspotClick?.(h)}
          className={`hotspot hotspot-${h.state.toLowerCase()}`}
          style={{ left: `${h.xpercent}%`, top: `${h.ypercent}%` }}
        >
          <span className="hotspot-label">
            {h.state === "LOCKED" && "🔒 "}
            {h.label}
          </span>
        </button>
      ))}
    </div>
  );
}
