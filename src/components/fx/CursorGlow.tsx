import { useEffect, useRef } from "react";

const TRAIL = 7;

/**
 * Mouse "aura": a soft light that follows the pointer with a comet trail, grows over
 * interactive elements and bursts on click. It also feeds pointer positions to
 * `[data-spot]` (spotlight), `[data-tilt]` (3D tilt) and `[data-magnetic]` elements
 * through CSS variables, so components only need to add a data attribute.
 */
export default function CursorGlow() {
  const auraRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    const root = document.documentElement;
    const aura = auraRef.current;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let ax = tx;
    let ay = ty;
    const trail = Array.from({ length: TRAIL }, () => ({ x: tx, y: ty }));
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
      const ring = document.createElement("span");
      ring.className = "click-ring";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
    };
    const onUp = () => root.classList.remove("aura-down");

    const tick = () => {
      ax += (tx - ax) * 0.16;
      ay += (ty - ay) * 0.16;
      if (aura) aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      root.style.setProperty("--mx", `${ax}px`);
      root.style.setProperty("--my", `${ay}px`);

      let px = ax;
      let py = ay;
      trail.forEach((p, i) => {
        p.x += (px - p.x) * 0.34;
        p.y += (py - p.y) * 0.34;
        px = p.x;
        py = p.y;
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
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
      <div ref={auraRef} className="aura" />
      {Array.from({ length: TRAIL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="aura-trail"
          style={{ ["--i" as string]: i }}
        />
      ))}
    </div>
  );
}
