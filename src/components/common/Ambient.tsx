import { useEffect, useRef } from "react";
import { CLUE_TILE_H, CLUE_TILE_URL, CLUE_TILE_W } from "./clueTile";

const mod = (value: number, size: number) => ((value % size) + size) % size;

/**
 * Fixed background behind the whole app: clues scribbled on the wall of a dark room (keyholes,
 * keys, clocks, cipher scraps), almost invisible until the cursor's light falls on them (the same
 * "light reveals" idea as the rooms). It only moves in response to the user: slow parallax when
 * scrolling and a tiny shift with the pointer.
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
      el.style.setProperty("--tx", `${mod(tx, CLUE_TILE_W)}px`);
      el.style.setProperty("--ty", `${mod(ty, CLUE_TILE_H)}px`);
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
      <div className="ambient-clues">
        <span className="clue-tile" style={{ backgroundImage: CLUE_TILE_URL }} />
      </div>
      <div className="ambient-clues is-lit">
        <span className="clue-tile" style={{ backgroundImage: CLUE_TILE_URL }} />
      </div>
      <span className="ambient-cursor" />
    </div>
  );
}
