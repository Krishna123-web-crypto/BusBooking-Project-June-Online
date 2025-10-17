import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="admin-page-container">
      {/* Sidebar + Main content */}
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div>
            <h2 className="admin-title">Admin Panel</h2>
            <ul className="admin-menu">
              <li>
                <Link
                  to="buses"
                  className={`admin-link ${
                    location.pathname.endsWith("/buses") ? "active" : ""
                  }`}
                >
                  🚌 Bus Management
                </Link>
              </li>
              <li>
                <Link
                  to="routes"
                  className={`admin-link ${
                    location.pathname.endsWith("/routes") ? "active" : ""
                  }`}
                >
                  🗺️ Route Management
                </Link>
              </li>
              <li>
                <Link
                  to="bookings"
                  className={`admin-link ${
                    location.pathname.endsWith("/bookings") ? "active" : ""
                  }`}
                >
                  📖 Booking Management
                </Link>
              </li>
              <li>
                <Link
                  to="reports"
                  className={`admin-link ${
                    location.pathname.endsWith("/reports") ? "active" : ""
                  }`}
                >
                  📊 Reports
                </Link>
              </li>
            </ul>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <Outlet /> {/* Nested routes render here */}
        </main>
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>© 2025 MyBusBook Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

