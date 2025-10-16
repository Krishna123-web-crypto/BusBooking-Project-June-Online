import React, { useState, useEffect } from "react";
import sampleBuses from "../data/buses";
import "./admin.css";
export default function BookingManagement() {
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem("bookings")) || []);
  const [buses, setBuses] = useState(() => JSON.parse(localStorage.getItem("buses")) || sampleBuses);
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem("buses", JSON.stringify(buses));
  }, [buses]);
  const cancelBooking = (id) => {
    const bookingToCancel = bookings.find((b) => b.id === id);
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus.id === bookingToCancel.busId
          ? { ...bus, bookedSeats: bus.bookedSeats.filter((s) => s !== bookingToCancel.seatNumber) }
          : bus
      )
    );
    setBookings(bookings.filter((b) => b.id !== id));
  };
  return (
    <div>
      <h2>📖 Booking Management</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="admin-list">
          {bookings.map((b) => (
            <li key={b.id}>
              <span>
                <strong>{b.user || "User"}</strong> – {b.busName || "Bus"} – {b.date || "Date"} – ₹{b.fare || 0} – Seat {b.seatNumber || "-"}
              </span>
              <button onClick={() => cancelBooking(b.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
