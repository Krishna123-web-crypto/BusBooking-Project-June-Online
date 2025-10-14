import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Panel</h2>
        <nav>
          <ul style={styles.menu}>
            <li><Link to="/admin/buses" style={styles.link}>🚌 Bus Management</Link></li>
            <li><Link to="/admin/routes" style={styles.link}>🗺️ Route Management</Link></li>
            <li><Link to="/admin/bookings" style={styles.link}>📖 Booking Management</Link></li>
            <li><Link to="/admin/reports" style={styles.link}>📊 Reports</Link></li>
          </ul>
        </nav>
        <button style={styles.logout} onClick={handleLogout}>Sign Out</button>
      </aside>

      <main style={styles.content}>
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Manage buses, routes, bookings, and view reports here.</p>

        {/* ✅ Admin Sub-Pages Load Here */}
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
    borderBottom: "1px solid #334155",
  },
  logout: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "30px",
  },
};
