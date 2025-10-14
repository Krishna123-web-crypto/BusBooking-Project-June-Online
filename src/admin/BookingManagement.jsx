import React, { useState, useEffect } from "react";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookings(parsed);
      } catch (err) {
        console.error("Failed to parse bookings:", err);
      }
    }
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Booking Management</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id} style={{ marginBottom: "10px" }}>
              <strong>{b.user || "Unknown User"}</strong> booked{" "}
              <strong>{b.busName || "Unknown Bus"}</strong> ({b.route || "-"}) –{" "}
              {b.date || "-"}
              <button
                onClick={() => cancelBooking(b.id)}
                style={{
                  marginLeft: "10px",
                  padding: "4px 8px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
