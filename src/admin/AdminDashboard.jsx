import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");  // remove logged-in user
    navigate("/signin");              // redirect to sign-in page
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div>
          <h2 className="admin-title">Admin Panel</h2>
          <ul className="admin-menu">
            <li><Link to="buses" className="admin-link">🚌 Bus Management</Link></li>
            <li><Link to="routes" className="admin-link">🗺️ Route Management</Link></li>
            <li><Link to="bookings" className="admin-link">📖 Booking Management</Link></li>
            <li><Link to="reports" className="admin-link">📊 Reports</Link></li>
          </ul>
        </div>
        <button className="admin-logout" onClick={handleLogout}>Sign Out</button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
