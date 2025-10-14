import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import SearchBus from "./Components/SearchBus";
import BookingPage from "./Components/BookingPage";
import SignIn from "./Components/SignIn";
import Register from "./Components/Register";
import MyBookings from "./Components/MyBookings";
import NotFound from "./Components/NotFound";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import BusManagement from "./admin/BusManagement";
import RouteManagement from "./admin/RouteManagement";
import BookingManagement from "./admin/BookingManagement";
import Reports from "./admin/Reports";

// Context
import { AuthProvider } from "./Components/Context/AuthContext";
import { BookingProvider } from "./Components/Context/BookingContext";

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchBus />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="buses" replace />} />
              <Route path="buses" element={<BusManagement />} />
              <Route path="routes" element={<RouteManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}
