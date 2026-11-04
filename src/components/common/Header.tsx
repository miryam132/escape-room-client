import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <NavLink to="/" className="brand" end>
        Mysteria<span aria-hidden="true">◆</span>
      </NavLink>

      <nav>
        <NavLink to="/rooms">חדרים</NavLink>
        {user?.role === "ADMIN" && (
          <>
            <NavLink to="/admin/rooms">ניהול חדרים</NavLink>
            <NavLink to="/admin/users">ניהול משתמשים</NavLink>
          </>
        )}
      </nav>

      <div className="header-user">
        {user ? (
          <>
            <NavLink to="/profile">{user.name}</NavLink>
            <button type="button" className="btn-ghost" onClick={logout}>
              התנתק
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">התחברות</NavLink>
            <NavLink to="/register" className="btn btn-primary">
              הרשמה
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
