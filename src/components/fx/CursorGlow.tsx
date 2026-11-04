import { useEffect, useRef } from "react";

/**
 * Pointer layer: a small ring + dot that follow the mouse, grow over interactive elements and
 * burst on click. It also feeds pointer positions to `[data-spot]` (spotlight), `[data-tilt]`
 * (3D tilt), `[data-magnetic]` and `[data-secret]` (hidden text revealed by the veil) elements
 * through CSS variables, so components only need to add a data attribute.
 */
export default function CursorGlow() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    const root = document.documentElement;
    const ring = ringRef.current;
    const dot = dotRef.current;
    let tx = -9999; // off-screen until the first pointer move, so nothing is revealed early
    let ty = -9999;
    let ax = tx;
    let ay = ty;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let shown = false;

    const resetMagnet = () => {
      if (!magnet) return;
      magnet.style.setProperty("--magX", "0px");
      magnet.style.setProperty("--magY", "0px");
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        ax = tx;
        ay = ty;
        root.classList.add("has-aura");
      }
      const target = e.target instanceof Element ? e.target : null;

      const hot = target?.closest("a, button, input, select, textarea, label, [data-hot]");
      root.classList.toggle("aura-hot", Boolean(hot));

      const spot = target?.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }

      const tilt = target?.closest<HTMLElement>("[data-tilt]");
      if (tilt && !calm) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", `${(px * 12).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-py * 12).toFixed(2)}deg`);
      }

      const mag = target?.closest<HTMLElement>("[data-magnetic]");
      if (mag !== magnet) resetMagnet();
      if (mag && !calm) {
        magnet = mag;
        const r = mag.getBoundingClientRect();
        mag.style.setProperty(
          "--magX",
          `${((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px`,
        );
        mag.style.setProperty(
          "--magY",
          `${((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px`,
        );
      }
    };

    // Tilt cards settle back when the pointer leaves them.
    const onOut = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-tilt]") : null;
      if (el && !el.contains(e.relatedTarget as Node | null)) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
      if (!e.relatedTarget) {
        root.classList.remove("has-aura");
        shown = false;
        resetMagnet();
      }
    };

    const onDown = (e: PointerEvent) => {
      root.classList.add("aura-down");
      if (calm) return;
      const burst = document.createElement("span");
      burst.className = "click-ring";
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      document.body.appendChild(burst);
      burst.addEventListener("animationend", () => burst.remove(), { once: true });
    };
    const onUp = () => root.classList.remove("aura-down");

    const tick = () => {
      ax += (tx - ax) * 0.18;
      ay += (ty - ay) * 0.18;
      if (ring) ring.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      if (dot) dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      // hidden text: tell each secret where the veil is, relative to itself
      document.querySelectorAll<HTMLElement>("[data-secret]").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${ax - r.left}px`);
        el.style.setProperty("--sy", `${ay - r.top}px`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("has-aura", "aura-hot", "aura-down");
    };
  }, []);

  return (
    <div className="aura-layer" aria-hidden="true">
      <div ref={ringRef} className="aura-ring" />
      <div ref={dotRef} className="aura-dot" />
    </div>
  );
}
