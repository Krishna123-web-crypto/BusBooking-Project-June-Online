import React, { useState, useEffect } from "react";
export default function MyBookings() {
  const [bookings, setBookings] = useState(JSON.parse(localStorage.getItem("bookings")) || []);
  const cancelBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };
  return (
    <div>
      <h2>🎟️ My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              <strong>{b.busName}</strong> ({b.route}) on {b.date} – ₹{b.fare}
              <button onClick={() => cancelBooking(b.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
