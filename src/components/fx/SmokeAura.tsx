import { useEffect, useRef } from "react";

const HUES = [40, 268, 335]; // amber, violet, rose: the palette of the site
const SCALE = 0.5; // the veil is drawn at half resolution: it is soft anyway and much cheaper

/**
 * A flowing "chiffon" veil of light. It trails the pointer like drifting fabric and,
 * when nobody is moving the mouse, keeps wandering on its own so the page never feels still.
 */
export default function SmokeAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let tx = window.innerWidth * 0.6;
    let ty = window.innerHeight * 0.4;
    let x = tx;
    let y = ty;
    let lastMove = 0;
    const heads = [0, 1, 2].map(() => ({ x, y }));

    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * SCALE));
      h = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      lastMove = performance.now();
    };

    const blob = (px: number, py: number, r: number, a: number, hue: number) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `hsla(${hue}, 95%, 66%, ${a})`);
      g.addColorStop(0.45, `hsla(${hue + 8}, 90%, 58%, ${a * 0.45})`);
      g.addColorStop(1, `hsla(${hue + 16}, 85%, 52%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (t: number) => {
      const idle = t - lastMove > 1800;
      if (idle) {
        // wander along a slow lissajous curve while the mouse rests
        tx = window.innerWidth * (0.5 + 0.38 * Math.sin(t / 4200));
        ty = window.innerHeight * (0.45 + 0.3 * Math.sin(t / 3100 + 1));
      }
      const px = x;
      const py = y;
      x += (tx - x) * (idle ? 0.025 : 0.09);
      y += (ty - y) * (idle ? 0.025 : 0.09);
      const speed = Math.min(60, Math.hypot(x - px, y - py));

      // old veil slowly dissolves
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // several wisps with different lag and sway make the fabric ripple
      heads.forEach((hd, i) => {
        const sway = Math.sin(t / (900 + i * 330) + i * 2) * (28 + speed);
        const cx = x * SCALE + Math.cos(t / (1300 + i * 400) + i) * sway * 0.6;
        const cy = y * SCALE + Math.sin(t / (1100 + i * 350) + i) * sway * 0.6;
        hd.x += (cx - hd.x) * (0.22 - i * 0.05);
        hd.y += (cy - hd.y) * (0.22 - i * 0.05);
        blob(hd.x, hd.y, 40 + speed * 0.9 + i * 18, idle ? 0.07 : 0.12, HUES[i]);
      });
      raf = requestAnimationFrame(frame);
    };

    resize();
    if (!calm) raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" className="svg-defs" aria-hidden="true" focusable="false">
        <filter id="chiffon" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="7" />
          <feDisplacementMap
            in="SourceGraphic"
            scale="90"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </svg>
      <canvas ref={canvasRef} className="smoke" aria-hidden="true" />
    </>
  );
}
