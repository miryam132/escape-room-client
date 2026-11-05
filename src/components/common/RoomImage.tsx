import { useState } from "react";
import type { CSSProperties } from "react";
import type { HotspotSummary } from "../../types/hotspot";
import { Icon } from "./Icon";
import { RevealLayer } from "./RevealLayer";

type RoomImageProps = {
  imageUrl: string;
  alt: string;
  hotspots?: HotspotSummary[];
  onHotspotClick?: (hotspot: HotspotSummary) => void;
};

/** The light is small on purpose: items only show up where you shine it. */
const GAME_LIGHT_RADIUS = 68;

function HotspotIcon({ hotspot }: { hotspot: HotspotSummary }) {
  if (hotspot.state === "LOCKED") return <Icon name="lock" size={16} />;
  if (hotspot.state === "SOLVED") return <Icon name="check" size={18} />;
  return <Icon name={hotspot.type === "PUZZLE" ? "question" : "eye"} size={18} />;
}

export function RoomImage({ imageUrl, alt, hotspots = [], onHotspotClick }: RoomImageProps) {
  const [showAll, setShowAll] = useState(false);
  const [explored, setExplored] = useState(false);
  const interactive = hotspots.length > 0;

  return (
    <div className={`room-image-container ${interactive ? "has-uv" : ""}`}>
      <img src={imageUrl} alt={alt} className="room-image" />

      {interactive && (
        <>
          <RevealLayer
            imageUrl={imageUrl}
            marks={hotspots.map((h) => ({ id: h.id, x: h.xpercent, y: h.ypercent }))}
            pinned={showAll}
            radius={GAME_LIGHT_RADIUS}
            onFirstMove={() => setExplored(true)}
          />
          <span className="room-image-vignette" aria-hidden="true" />
          <button
            type="button"
            className="uv-toggle"
            aria-pressed={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            <Icon name="eye" size={16} />
            {showAll ? "כיבוי תאורת UV" : "הדלקת תאורת UV"}
          </button>
          <p className={`uv-hint ${explored ? "is-gone" : ""}`} aria-hidden="true">
            ( העבירו את הפנס על החדר )
          </p>
        </>
      )}

      {hotspots.map((h, i) => (
        <button
          key={h.id}
          type="button"
          data-hid={h.id}
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
