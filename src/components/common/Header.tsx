import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/rooms">Rooms</NavLink>
        {user?.role === "admin" && <NavLink to="/admin/rooms">Admin Rooms</NavLink>}
        {user ? (
          <>
            <span>שלום, {user.name}</span>
            <button type="button" onClick={logout}>התנתק</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
