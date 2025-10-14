import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/NavBar.css";
import { AuthContext } from "./Context/AuthContext";
export default function NavBar() {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignOut = () => {
    logout();
    navigate("/signin");
  };
  const userDisplay = user?.email || user?.phone || user?.name || "";
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <span className="logo-icon">🚌</span>
          <span className="logo-text">MyBusBook</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/" className="nav-item">Admin Dashboard</Link></li>
          <li><Link to="/about" className="nav-item">About</Link></li>
          <li><Link to="/contact" className="nav-item">Contact</Link></li>
          <li><Link to="/search" className="nav-item">SearchBus</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/booking" className="nav-item">Booking</Link></li>
              {userDisplay && <li><span className="nav-user">👤 {userDisplay}</span></li>}
              <li><button className="nav-item logout-button" onClick={handleSignOut}>Sign Out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/signin" className="nav-item">Sign In</Link></li>
              <li><Link to="/register" className="nav-item">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
