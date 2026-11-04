import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Mysteria - לדף הבית">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        Mysteria
      </Link>
      <nav>
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
        {user ? (
          <>
            <NavLink to="/profile">שלום, {user.name}</NavLink>
            <button type="button" onClick={logout}>
              התנתק
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">התחברות</NavLink>
            <NavLink to="/register" className="nav-cta">
              הרשמה
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
