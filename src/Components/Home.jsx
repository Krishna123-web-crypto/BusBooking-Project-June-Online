import React from "react";
import { Link } from "react-router-dom";
import "../assets/Home.css";

export default function Home() {
  // Helper for Popular Routes buttons
  const bookPopularRoute = (routeFrom, routeTo) => {
    const today = new Date().toISOString().split("T")[0];
    window.location.href = `/booking?from=${routeFrom}&to=${routeTo}&date=${today}`;
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Welcome to the Online Bus Tickets Booking</h1>
          <p>Book your bus tickets online easily and quickly!</p>
          <Link to="/booking" className="book-now-btn">Book Now</Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="popular-routes">
        <h2>Popular Routes</h2>
        <div className="routes-grid">
          <div className="route-card">
            <h3>Hyderabad → Vijayawada</h3>
            <p>Fare: ₹500</p>
            <button onClick={() => bookPopularRoute("Hyderabad", "Vijayawada")}>Book</button>
          </div>
          <div className="route-card">
            <h3>Chennai → Bangalore</h3>
            <p>Fare: ₹600</p>
            <button onClick={() => bookPopularRoute("Chennai", "Bangalore")}>Book</button>
          </div>
          <div className="route-card">
            <h3>Mumbai → Pune</h3>
            <p>Fare: ₹400</p>
            <button onClick={() => bookPopularRoute("Mumbai", "Pune")}>Book</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose MyBusBook?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🚌 Easy Booking</h3>
            <p>Book tickets in just a few clicks from anywhere, anytime.</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>Pay safely using UPI, cards, or wallets — all encrypted.</p>
          </div>
          <div className="feature-card">
            <h3>📞 24/7 Support</h3>
            <p>Our support team is available round the clock for help.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Passengers Say</h2>
        <div className="testimonial">
          <p>"Smooth booking experience and clean buses!"</p>
        </div>
        <div className="testimonial">
          <p>"I loved the quick search and easy interface."</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 MyBusBook | All rights reserved.</p>
      </footer>
    </div>
  );
}
