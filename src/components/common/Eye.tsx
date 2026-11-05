import { useEffect, useRef } from "react";

const MAX_X = 9;
const MAX_Y = 5;

/**
 * An eye drawn around (0, 0), about 60 units wide, for use inside an <svg>. The pupil
 * looks toward the pointer (only while the pointer moves; nothing animates on its own).
 */
export function EyeGlyph() {
  const sclera = useRef<SVGPathElement>(null);
  const pupil = useRef<SVGGElement>(null);

  useEffect(() => {
    let frame = 0;
    const look = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = sclera.current?.getBoundingClientRect();
        if (!box || !pupil.current) return;
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 260);
        const x = (dx / dist) * MAX_X * reach;
        const y = (dy / dist) * MAX_Y * reach;
        pupil.current.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      });
    };
    window.addEventListener("pointermove", look, { passive: true });
    return () => {
      window.removeEventListener("pointermove", look);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <g className="eye">
      <path ref={sclera} className="eye-sclera" d="M-30 0Q0 -27 30 0Q0 27 -30 0Z" />
      <g ref={pupil}>
        <circle className="eye-iris" r="13" />
        <circle className="eye-pupil" r="6" />
        <circle className="eye-glint" cx="-3.5" cy="-4" r="2.4" />
      </g>
    </g>
  );
}

/** Stand-alone eye (an <svg> of its own). */
export function Eye({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`eye-svg ${className}`}
      viewBox="-34 -30 68 60"
      aria-hidden="true"
      focusable="false"
    >
      <EyeGlyph />
    </svg>
  );
}
