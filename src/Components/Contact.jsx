import React, { useState } from "react";
import "../assets/Contact.css";
export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  return (
    <div className="contact-container">
      <h1 className="contact-heading">Contact Us</h1>
      {isSubmitted ? (
        <p className="thank-you">
          Thanks for reaching out! We’ll get back to you as soon as possible.
        </p>
      ) : (
        <form className="contact-form" onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" name="name" required />
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" required />
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="4" required />
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
}
