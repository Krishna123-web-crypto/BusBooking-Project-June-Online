import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Components
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import SearchBus from "./Components/SearchBus";
import BookingPage from "./Components/BookingPage";
import SignIn from "./Components/Signin";
import Register from "./Components/Register";
import NotFound from "./Components/NotFound";
import MyBookings from "./Components/MyBookings";
// Context Providers
import { AuthProvider, AuthContext } from "./Components/Context/AuthContext";
import { BookingProvider } from "./Components/Context/BookingContext";
// Admin dashboard imports
import AdminDashboard from "./admin/AdminDashboard";
import BusManagement from "./admin/BusManagement";
import RouteManagement from "./admin/RouteManagement";
import BookingManagement from "./admin/BookingManagement";
import Reports from "./admin/Reports";
/* -------------------------------------------------------
   Private Admin Route (Checks user role = 'admin')
------------------------------------------------------- */
function PrivateAdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  let role = user?.role;
  // LocalStorage fallback (for reload)
  if (!role) {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        role = JSON.parse(raw).role;
      } catch {
        role = null;
      }
    }
  }
  return role === "admin" ? children : <Navigate to="/signin" replace />;
}
/* -------------------------------------------------------
   Private User Route (Checks user role = 'user')
------------------------------------------------------- */
function PrivateUserRoute({ children }) {
  const { user } = useContext(AuthContext);
  let role = user?.role;

  if (!role) {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        role = JSON.parse(raw).role;
      } catch {
        role = null;
      }
    }
  }
  return role === "user" ? children : <Navigate to="/signin" replace />;
}
/* -------------------------------------------------------
   App Component
------------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchBus />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            {/* Protected User Routes */}
            <Route
              path="/booking"
              element={
                <PrivateUserRoute>
                  <BookingPage />
                </PrivateUserRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateUserRoute>
                  <MyBookings />
                </PrivateUserRoute>
              }
            />
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateAdminRoute>
                  <AdminDashboard />
                </PrivateAdminRoute>
              }
            >
              <Route index element={<Navigate to="buses" replace />} />
              <Route path="buses" element={<BusManagement />} />
              <Route path="routes" element={<RouteManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}
