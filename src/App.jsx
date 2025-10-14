import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminDashboard from "./admin/AdminDashboard.jsx";
import BusManagement from "./admin/BusManagement.jsx";
import RouteManagement from "./admin/RouteManagement.jsx";
import BookingManagement from "./admin/BookingManagement.jsx";
import Reports from "./admin/Reports.jsx";
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
            <Route path="/admin" element={<AdminDashboard />}>
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
