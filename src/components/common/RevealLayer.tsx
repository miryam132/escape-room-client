import { useEffect, useId, useRef } from "react";

export type RevealMark = { id: string; x: number; y: number };

type RevealLayerProps = {
  /** Same picture as the base image: it is shown re-coloured, only inside the light blob. */
  imageUrl: string;
  /** Evidence markers (position in %) that are drawn inside the hidden layer. */
  marks?: RevealMark[];
  /** Reveal the whole layer (accessibility / touch / reduced motion). */
  pinned?: boolean;
  /** Called once, the first time the light moves over the picture. */
  onFirstMove?: () => void;
};

const RADIUS = 104; // px, main blob
const SATELLITES = [
  { r: 0.6, orbit: 0.95, speed: 1.0, phase: 0.0 },
  { r: 0.5, orbit: 1.15, speed: -0.8, phase: 2.1 },
  { r: 0.45, orbit: 1.0, speed: 1.3, phase: 4.2 },
  { r: 0.38, orbit: 1.25, speed: -1.1, phase: 5.4 },
];
const TOUCH_HOLD_MS = 2200;

/**
 * A hidden "UV" layer over a picture, revealed through a liquid blob that follows the pointer
 * (an SVG goo filter turns a few moving circles into one organic shape). The blob only moves
 * while the pointer is over the picture; when it leaves, the blob shrinks away and nothing
 * keeps animating. The parent element must be `position: relative`.
 *
 * Hotspot buttons inside the parent that carry `data-hid` get a `lit` class while the light
 * is on top of them, so the surrounding UI can react to the same light.
 */
export function RevealLayer({
  imageUrl,
  marks = [],
  pinned = false,
  onFirstMove,
}: RevealLayerProps) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const pinnedRef = useRef(pinned);
  const marksRef = useRef(marks);
  const onFirstMoveRef = useRef(onFirstMove);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    pinnedRef.current = pinned;
    marksRef.current = marks;
    onFirstMoveRef.current = onFirstMove;
    wake.current(); // re-evaluate the light when a prop changes
  });

  useEffect(() => {
    const svg = svgRef.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = svg.querySelector<SVGCircleElement>("[data-blob='main']")!;
    const sats = [...svg.querySelectorAll<SVGCircleElement>("[data-blob='sat']")];

    const state = {
      x: 0,
      y: 0,
      active: false,
      scale: 0,
      sats: sats.map(() => ({ x: 0, y: 0 })),
      frame: 0,
      hold: 0,
      moved: false,
    };

    const setLit = (id: string, on: boolean) =>
      host.querySelector(`[data-hid="${CSS.escape(id)}"]`)?.classList.toggle("lit", on);

    const tick = (time: number) => {
      state.frame = 0;
      const all = pinnedRef.current;
      const goal = state.active || all ? 1 : 0;
      state.scale += (goal - state.scale) * 0.2;
      if (Math.abs(goal - state.scale) < 0.004) state.scale = goal;

      const big = all ? Math.max(host.clientWidth, host.clientHeight) * 1.6 : RADIUS;
      main.setAttribute("cx", String(state.x));
      main.setAttribute("cy", String(state.y));
      main.setAttribute("r", String(big * state.scale));

      sats.forEach((circle, i) => {
        const cfg = SATELLITES[i];
        const angle = reduce ? cfg.phase : (time / 900) * cfg.speed + cfg.phase;
        const tx = state.x + Math.cos(angle) * RADIUS * cfg.orbit;
        const ty = state.y + Math.sin(angle) * RADIUS * cfg.orbit;
        const s = state.sats[i];
        const k = reduce ? 1 : 0.13;
        s.x += (tx - s.x) * k;
        s.y += (ty - s.y) * k;
        circle.setAttribute("cx", String(s.x));
        circle.setAttribute("cy", String(s.y));
        circle.setAttribute("r", String(all ? 0 : RADIUS * cfg.r * state.scale));
      });

      const w = host.clientWidth;
      const h = host.clientHeight;
      for (const mark of marksRef.current) {
        const dx = (mark.x / 100) * w - state.x;
        const dy = (mark.y / 100) * h - state.y;
        const near = Math.hypot(dx, dy) < RADIUS * 0.95 * state.scale;
        setLit(mark.id, all || near);
      }

      // Keep animating while the blob is alive (orbiting satellites) or still easing.
      if (state.active || state.scale !== goal || (!goal && state.scale > 0)) {
        state.frame = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (!state.frame) state.frame = requestAnimationFrame(tick);
    };
    wake.current = start;

    const place = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const first = !state.active;
      state.x = event.clientX - rect.left;
      state.y = event.clientY - rect.top;
      if (first) {
        // Start the satellites on the pointer so the blob grows out of it.
        state.sats.forEach((s) => Object.assign(s, { x: state.x, y: state.y }));
      }
      state.active = true;
      clearTimeout(state.hold);
      if (!state.moved) {
        state.moved = true;
        onFirstMoveRef.current?.();
      }
      start();
    };

    const leave = (event: PointerEvent) => {
      clearTimeout(state.hold);
      if (event.pointerType === "touch") {
        // A finger lifts instantly: let the light linger for a moment.
        state.hold = window.setTimeout(() => {
          state.active = false;
          start();
        }, TOUCH_HOLD_MS);
      } else {
        state.active = false;
        start();
      }
    };

    host.addEventListener("pointerenter", place);
    host.addEventListener("pointermove", place);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerup", leave);
    host.addEventListener("pointercancel", leave);

    return () => {
      host.removeEventListener("pointerenter", place);
      host.removeEventListener("pointermove", place);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerup", leave);
      host.removeEventListener("pointercancel", leave);
      cancelAnimationFrame(state.frame);
      clearTimeout(state.hold);
      wake.current = () => {};
      host.querySelectorAll(".lit[data-hid]").forEach((el) => el.classList.remove("lit"));
    };
  }, []);

  const filterId = `goo-${uid}`;
  const maskId = `mask-${uid}`;

  return (
    <svg ref={svgRef} className="uv-layer" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id={filterId}
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8.5" />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <g filter={`url(#${filterId})`} fill="#fff">
            <circle data-blob="main" r="0" />
            {SATELLITES.map((_, i) => (
              <circle key={i} data-blob="sat" r="0" />
            ))}
          </g>
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <image
          href={imageUrl}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          className="uv-image"
        />
        <rect width="100%" height="100%" className="uv-tint" />
        {marks.map((mark, i) => (
          <g key={mark.id} className="uv-mark">
            <circle cx={`${mark.x}%`} cy={`${mark.y}%`} r="34" />
            <rect
              x={`${mark.x}%`}
              y={`${mark.y}%`}
              width="24"
              height="20"
              rx="5"
              transform="translate(18 -42)"
            />
            <text x={`${mark.x}%`} y={`${mark.y}%`} transform="translate(30 -32)">
              {i + 1}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
