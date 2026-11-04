import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  ph: number;
};

const LINK_DIST = 150;

/** Floating embers that drift upward, flee from the pointer and link up around it. */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts: Particle[] = [];
    let raf = 0;

    const make = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.1 + Math.random() * 0.45),
      r: 0.6 + Math.random() * 1.9,
      hue: Math.random() < 0.7 ? 42 : 268, // amber lamp light / arcane violet
      ph: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.round((w * h) / 15000));
      parts = Array.from({ length: count }, make);
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!calm) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130 && d2 > 1) {
            const d = Math.sqrt(d2);
            const force = (1 - d / 130) * 0.9;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 + -0.012;
          p.x += p.vx + Math.sin(t / 1800 + p.ph) * 0.15;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }
        const tw = 0.55 + 0.45 * Math.sin(t / 700 + p.ph);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 95%, 66%, ${0.55 * tw})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, 0.9)`;
        ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Threads of light between the particles gathered around the pointer.
      if (!calm) {
        const near = parts.filter((p) => Math.hypot(p.x - mouse.x, p.y - mouse.y) < 220);
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
            if (d < LINK_DIST) {
              ctx.strokeStyle = `rgba(245, 184, 61, ${(1 - d / LINK_DIST) * 0.35})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
