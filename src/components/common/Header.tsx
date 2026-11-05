import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Mysteria – דף הבית">
      <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="url(#brand-grad)" />
        <circle cx="16" cy="13.5" r="5" fill="#0b1020" />
        <path d="M14.2 17.5h3.6l1.2 7h-6z" fill="#0b1020" />
        <defs>
          <linearGradient id="brand-grad" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#ff7a5c" />
            <stop offset="1" stopColor="#ff4b6e" />
          </linearGradient>
        </defs>
      </svg>
      <span className="brand-name">Mysteria</span>
    </Link>
  );
}

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="ניווט ראשי">
        <NavLink to="/" end>
          בית
        </NavLink>
        <NavLink to="/rooms">חדרים</NavLink>
        {user?.role === "ADMIN" && (
          <>
            <NavLink to="/admin/rooms">ניהול חדרים</NavLink>
            <NavLink to="/admin/users">ניהול משתמשים</NavLink>
          </>
        )}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <NavLink to="/profile" className="user-chip">
              <span className="avatar" aria-hidden="true">
                {user.name.trim().charAt(0)}
              </span>
              <span className="user-chip-name">שלום, {user.name}</span>
            </NavLink>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              התנתק
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-plain">
              התחברות
            </NavLink>
            <Link to="/register" className="btn btn-primary btn-sm">
              הרשמה
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
