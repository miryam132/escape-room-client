import { useEffect, useRef } from "react";

/**
 * Fixed background behind the whole app: soft colour glows, a faint grid, a slow
 * scanning beam and a light that follows the cursor like a flashlight.
 */
export default function Ambient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${event.clientX}px`);
        el.style.setProperty("--my", `${event.clientY}px`);
        el.classList.add("is-tracking");
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <span className="ambient-glow ambient-glow-a" />
      <span className="ambient-glow ambient-glow-b" />
      <span className="ambient-grid" />
      <span className="ambient-beam" />
      <span className="ambient-cursor" />
    </div>
  );
}
