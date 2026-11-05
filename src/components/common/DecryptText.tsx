import { useEffect, useState } from "react";

const LETTERS = "אבגדהוזחטיכלמנסעפצקרשת";
const randomLetter = () => LETTERS[Math.floor(Math.random() * LETTERS.length)];

/** Text that "decrypts" from random letters into the real word once, on mount. */
export function DecryptText({ text, durationMs = 1100 }: { text: string; durationMs?: number }) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    const timer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / durationMs);
      const settled = Math.floor(progress * text.length);
      setShown(
        [...text].map((ch, i) => (ch === " " || i < settled ? ch : randomLetter())).join(""),
      );
      if (progress >= 1) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, [text, durationMs]);

  return (
    <span className="decrypt" aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
