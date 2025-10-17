import React from "react";
import "../assets/About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About MyBusBook</h1>
      <p className="about-text">
        MyBusBook is your one-stop platform for booking bus tickets online quickly and securely.
      </p>
      <p className="about-text">
        Our platform is user-friendly, responsive, and ensures your travel plans are just a few clicks away.
        Thank you for choosing MyBusBook!
      </p>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2025 MyBusBook. All rights reserved.</p>
        <p>
          Contact us: <a href="mailto:contact@mybusbook.com">contact@mybusbook.com</a>
        </p>
      </footer>
    </div>
  );
}
