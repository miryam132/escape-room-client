import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

type Position = { xPercent: number; yPercent: number };

type HotspotEditorProps = {
  imageUrl: string;
  hotspots: (Position & { id: string })[];
  maxHotspots: number;
  onAdd: (position: Position) => void;
  onMove: (index: number, position: Position) => void;
  onRemoveLast: () => void;
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export default function HotspotEditor({
  imageUrl,
  hotspots,
  maxHotspots,
  onAdd,
  onMove,
  onRemoveLast,
}: HotspotEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFull = hotspots.length >= maxHotspots;

  function toPosition(event: { clientX: number; clientY: number }): Position | null {
    const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
    if (width === 0 || height === 0) return null;
    return {
      xPercent: clamp(((event.clientX - left) / width) * 100),
      yPercent: clamp(((event.clientY - top) / height) * 100),
    };
  }

  function handleImageClick(event: MouseEvent) {
    const position = !isFull && toPosition(event);
    if (position) onAdd(position);
  }

  function handleDrag(event: PointerEvent, index: number) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const position = toPosition(event);
    if (position) onMove(index, position);
  }

  return (
    <div className="hotspot-editor">
      <p>
        {isFull
          ? `מוקמו כל ${maxHotspots} הנקודות.`
          : `לחץ על התמונה כדי למקם את נקודה ${hotspots.length + 1}. אפשר לגרור נקודה כדי להזיז אותה.`}
      </p>

      <div ref={containerRef} className="hotspot-editor-image-container">
        <img
          src={imageUrl}
          alt="תצוגה מקדימה למיקום נקודות"
          draggable={false}
          className={
            isFull ? "hotspot-editor-image" : "hotspot-editor-image hotspot-editor-image-active"
          }
          onClick={handleImageClick}
        />

        {hotspots.map((hotspot, index) => (
          <span
            key={hotspot.id}
            className="hotspot-editor-marker"
            style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
            onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
            onPointerMove={(e) => handleDrag(e, index)}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <p>
        נקודות: {hotspots.length} / {maxHotspots}
      </p>

      <button type="button" disabled={hotspots.length === 0} onClick={onRemoveLast}>
        הסר את הנקודה האחרונה
      </button>
    </div>
  );
}
