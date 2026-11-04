/**
 * Almost invisible text. The mouse veil lights up the part of it that is close to the
 * pointer (CursorGlow feeds `--sx`/`--sy`), so the line is "discovered" rather than read.
 */
export default function Secret({ children }: { children: string }) {
  return (
    <span className="secret" data-secret>
      <span className="secret-base">{children}</span>
      <span className="secret-lit" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
