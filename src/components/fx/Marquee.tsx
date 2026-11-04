type MarqueeProps = { items: string[]; reverse?: boolean };

/** Endless ticker (the content is repeated so the loop never shows a seam). */
export default function Marquee({ items, reverse = false }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`}>
          <span>{item}</span>
          <i aria-hidden="true">✦</i>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee${reverse ? " marquee-reverse" : ""}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
