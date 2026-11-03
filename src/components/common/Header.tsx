import { NavLink } from "react-router-dom";

function Header() {
  return ( 
    <header>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/rooms">Rooms</NavLink>
        <NavLink to="/admin/rooms">Admin Rooms</NavLink>
      </nav>
    </header>
  );
}

export default Header;