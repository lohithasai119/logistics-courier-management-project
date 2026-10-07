import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../Services/auth";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme);
  const user = getUser();
  const admin = user?.role === "admin";

  function logout() {
    clearSession();
    navigate("/login");
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🚚 LogiTrack</Link>

      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? "✕" : "☰"}
      </button>

      <div className={open ? "nav-links open" : "nav-links"} onClick={() => setOpen(false)}>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/shipments">{admin ? "All Shipments" : "My Shipments"}</NavLink>}
        <NavLink to="/track">Track</NavLink>
        {user && <NavLink to="/add-shipment">{admin ? "+ New" : "+ Book"}</NavLink>}
        {admin && <NavLink to="/users">Users</NavLink>}

        {user && (
          <span className="nav-user">
            👤 {user.name} <em className={`role-pill ${user.role}`}>{admin ? "Admin" : "User"}</em>
          </span>
        )}

        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <button className="logout-btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
