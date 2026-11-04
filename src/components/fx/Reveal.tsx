import { useEffect, useRef } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
};

/** Fades and lifts its content into view the first time it scrolls on screen. */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal-on ${className}`.trim()}
      style={{ ["--d" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
