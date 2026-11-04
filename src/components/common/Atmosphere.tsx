import { useEffect } from "react";

/** Moving colour blobs + film grain behind the whole app, and a soft light that follows the mouse. */
export default function Atmosphere() {
  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
        document.documentElement.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="backdrop">
        <i />
        <i />
        <i />
      </div>
      <div className="cursor-glow" />
      <div className="grain" />
    </div>
  );
}
