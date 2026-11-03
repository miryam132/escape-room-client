import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <NavLink to="/" end>
          בית
        </NavLink>
        <NavLink to="/rooms">חדרים</NavLink>
        {user?.role === "admin" && (
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
            <NavLink to="/register">הרשמה</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
