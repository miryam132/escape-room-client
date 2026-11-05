import { useEffect, useRef } from "react";
import { PLAN_TILE_H, PLAN_TILE_URL, PLAN_TILE_W } from "./planTile";

const mod = (value: number, size: number) => ((value % size) + size) % size;

/**
 * Fixed background behind the whole app: a very faint architectural floor plan that is
 * lit up by the cursor (the same "light reveals" idea as the rooms). It only moves in
 * response to the user: slow parallax when scrolling and a tiny shift with the pointer.
 */
export default function Ambient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const paint = () => {
      frame = 0;
      const tx = reduce ? 0 : (0.5 - pointerX) * 26;
      const ty = reduce ? 0 : -window.scrollY * 0.18 + (0.5 - pointerY) * 18;
      el.style.setProperty("--tx", `${mod(tx, PLAN_TILE_W)}px`);
      el.style.setProperty("--ty", `${mod(ty, PLAN_TILE_H)}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
      el.style.setProperty("--mx", `${event.clientX}px`);
      el.style.setProperty("--my", `${event.clientY}px`);
      el.classList.add("is-tracking");
      schedule();
    };

    paint();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <span className="ambient-glow ambient-glow-a" />
      <span className="ambient-glow ambient-glow-b" />
      <div className="ambient-plan">
        <span className="plan-tile" style={{ backgroundImage: PLAN_TILE_URL }} />
      </div>
      <div className="ambient-plan is-lit">
        <span className="plan-tile" style={{ backgroundImage: PLAN_TILE_URL }} />
      </div>
      <span className="ambient-cursor" />
    </div>
  );
}
