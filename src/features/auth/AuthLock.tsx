/** Padlock for the auth cards: the shackle lifts while a field has focus (see .auth-card CSS). */
export function AuthLock() {
  return (
    <svg className="auth-lock" viewBox="0 0 64 64" aria-hidden="true">
      <path className="auth-lock-shackle" d="M21 29V21a11 11 0 0 1 22 0v8" />
      <rect className="auth-lock-body" x="12" y="28" width="40" height="28" rx="7" />
      <circle className="auth-lock-hole" cx="32" cy="40" r="3.6" />
      <path className="auth-lock-hole" d="M30.2 42h3.6l1 7h-5.6z" />
    </svg>
  );
}
