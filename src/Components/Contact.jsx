import React from "react";
import "../assets/Contact.css";
export default function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-heading">Contact Us</h1>
      <p className="contact-text">
        Have questions? We're here to help. Reach us through email or phone anytime.
      </p>
      {/* Footer specific to Contact */}
      <footer className="contact-footer">
        <p>📧 Email: contact@mybusbook.com | ☎️ Phone: +91-9876543210</p>
        <p>© 2025 MyBusBook | Connecting you safely to your destination.</p>
      </footer>
    </div>
  );
}
