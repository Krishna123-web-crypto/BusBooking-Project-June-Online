import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import SearchBus from "./Components/SearchBus";
import BookingPage from "./Components/BookingPage";
import SignIn from "./Components/SignIn";
import NotFound from "./Components/NotFound";
export default function App() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchBus />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/booking"
          element={isLoggedIn ? <BookingPage /> : <Navigate to="/signin" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}


