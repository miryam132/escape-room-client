import type { CSSProperties } from "react";
import type { HotspotSummary } from "../../types/hotspot";
import { Icon } from "./Icon";

type RoomImageProps = {
  imageUrl: string;
  alt: string;
  hotspots?: HotspotSummary[];
  onHotspotClick?: (hotspot: HotspotSummary) => void;
};

function HotspotIcon({ hotspot }: { hotspot: HotspotSummary }) {
  if (hotspot.state === "LOCKED") return <Icon name="lock" size={16} />;
  if (hotspot.state === "SOLVED") return <Icon name="check" size={18} />;
  return <Icon name={hotspot.type === "PUZZLE" ? "question" : "eye"} size={18} />;
}

export function RoomImage({ imageUrl, alt, hotspots = [], onHotspotClick }: RoomImageProps) {
  return (
    <div className="room-image-container">
      <img src={imageUrl} alt={alt} className="room-image" />
      {hotspots.length > 0 && <span className="room-image-vignette" aria-hidden="true" />}
      {hotspots.map((h, i) => (
        <button
          key={h.id}
          type="button"
          onClick={() => onHotspotClick?.(h)}
          className={`hotspot hotspot-${h.state.toLowerCase()} hotspot-${h.type.toLowerCase()}`}
          style={{ left: `${h.xpercent}%`, top: `${h.ypercent}%`, "--i": i } as CSSProperties}
        >
          <span className="hotspot-dot">
            <HotspotIcon hotspot={h} />
          </span>
          <span className="hotspot-label">{h.label}</span>
        </button>
      ))}
    </div>
  );
}
