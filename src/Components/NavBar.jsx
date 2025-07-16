import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/NavBar.css";
export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = localStorage.getItem("user");
  const handleSignOut = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    navigate("/signin");
    window.location.reload(); 
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <span className="logo-icon">🚌</span>
          <span className="logo-text">MyBusBook</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/about" className="nav-item">About</Link></li>
          <li><Link to="/contact" className="nav-item">Contact</Link></li>
          <li><Link to="/search" className="nav-item">SearchBus</Link></li>
          {isLoggedIn && user ? (
            <>
              <li><Link to="/booking" className="nav-item">Booking</Link></li>
              <li><span className="nav-user">👤 {user}</span></li>
              <li>
                <button className="nav-item logout-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/signin" className="nav-item">Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

