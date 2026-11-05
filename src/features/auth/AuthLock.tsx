import { EyeGlyph } from "../../components/common/Eye";

/**
 * Padlock for the auth cards. The shackle lifts while a field has focus (see .auth-card CSS)
 * and the keyhole is an eye that follows the pointer.
 */
export function AuthLock() {
  return (
    <svg className="auth-lock" viewBox="0 0 64 64" aria-hidden="true">
      <path className="auth-lock-shackle" d="M21 29V21a11 11 0 0 1 22 0v8" />
      <rect className="auth-lock-body" x="12" y="28" width="40" height="28" rx="7" />
      <g transform="translate(32 42) scale(0.44)">
        <EyeGlyph />
      </g>
    </svg>
  );
}
