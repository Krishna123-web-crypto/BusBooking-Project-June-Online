import React from "react";
import { Link, Outlet } from "react-router-dom";
export default function AdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#222",
        color: "#fff",
        padding: "20px",
      }}>
        <h2>🚌 Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="buses" style={{ color: "#fff" }}>Bus Management</Link></li>
            <li><Link to="routes" style={{ color: "#fff" }}>Route Management</Link></li>
            <li><Link to="bookings" style={{ color: "#fff" }}>Booking Management</Link></li>
            <li><Link to="reports" style={{ color: "#fff" }}>Reports & Analytics</Link></li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f9f9f9" }}>
        <Outlet />
      </div>
    </div>
  );
}
