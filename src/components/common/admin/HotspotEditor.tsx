import type { MouseEvent } from "react";

type HotspotPosition = {
  xPercent: number;
  yPercent: number;
};

type HotspotEditorProps = {
  imageUrl: string;
  hotspots: (HotspotPosition & { id: string })[];
  maxHotspots: number;
  onAdd: (position: HotspotPosition) => void;
  onRemoveLast: () => void;
};

export default function HotspotEditor({
  imageUrl,
  hotspots,
  maxHotspots,
  onAdd,
  onRemoveLast,
}: HotspotEditorProps) {
  const isFull = hotspots.length >= maxHotspots;

  function handleImageClick(event: MouseEvent<HTMLImageElement>) {
    if (isFull) return;

    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();

    if (width === 0 || height === 0) return;

    const xPercent = Math.min(
      100,
      Math.max(0, ((event.clientX - left) / width) * 100)
    );

    const yPercent = Math.min(
      100,
      Math.max(0, ((event.clientY - top) / height) * 100)
    );

    onAdd({ xPercent, yPercent });
  }

  return (
    <div className="hotspot-editor">
      <p>
        {isFull
          ? `All ${maxHotspots} hotspots have been placed.`
          : `Click on the image to place hotspot ${hotspots.length + 1}.`}
      </p>

      <div className="hotspot-editor-image-container">
        <img
          src={imageUrl}
          alt="Room preview for placing hotspots"
          draggable={false}
          className={
            isFull
              ? "hotspot-editor-image"
              : "hotspot-editor-image hotspot-editor-image-active"
          }
          onClick={handleImageClick}
        />

        {hotspots.map((hotspot, index) => (
          <span
            key={hotspot.id}
            className="hotspot-editor-marker"
            style={{
              left: `${hotspot.xPercent}%`,
              top: `${hotspot.yPercent }%`,
            }}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <p>
        Hotspots: {hotspots.length} / {maxHotspots}
      </p>

      <button
        type="button"
        disabled={hotspots.length === 0}
        onClick={onRemoveLast}
      >
        Remove last hotspot
      </button>
    </div>
  );
}