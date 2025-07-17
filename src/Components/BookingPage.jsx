import React, { useContext } from "react";
import "../assets/BookingPage.css";
import { BookingContext } from "./Context/BookingContext";
export default function BookingPage() {
  const {
    selectedBus,
    selectedSeats,
    bookedSeats,
    toggleSeat,
    confirmBooking,
  } = useContext(BookingContext);
  if (!selectedBus) {
    return (
      <div className="booking-container">
        <h2>No Bus Selected</h2>
        <p>Please go to Search and choose a bus.</p>
      </div>
    );
  }
  const farePerSeat = selectedBus.fare;
  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  return (
    <div className="booking-container">
      <h2>Booking for {selectedBus.name}</h2>
      <p>
        {selectedBus.from} → {selectedBus.to} on {selectedBus.date}
      </p>

      <h3>Seat Layout</h3>
      <div className="seats-layout">
        {[...Array(7)].map((_, row) => {
          const base = row * 4;
          return (
            <div className="seat-row" key={row}>
              {[0, 1].map((i) => {
                const seat = base + i + 1;
                return (
                  <button
                    key={seat}
                    className={`seat ${
                      selectedSeats.includes(seat) ? "selected" : ""
                    } ${isSeatBooked(seat) ? "booked" : ""}`}
                    disabled={isSeatBooked(seat)}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </button>
                );
              })}
              <div className="aisle" />
              {[2, 3].map((i) => {
                const seat = base + i + 1;
                return (
                  <button
                    key={seat}
                    className={`seat ${
                      selectedSeats.includes(seat) ? "selected" : ""
                    } ${isSeatBooked(seat) ? "booked" : ""}`}
                    disabled={isSeatBooked(seat)}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          );
        })}
        <div className="seat-row">
          {[...Array(8)].map((_, i) => {
            const seat = 29 + i;
            return (
              <button
                key={seat}
                className={`seat ${
                  selectedSeats.includes(seat) ? "selected" : ""
                } ${isSeatBooked(seat) ? "booked" : ""}`}
                disabled={isSeatBooked(seat)}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </button>
            );
          })}
        </div>
      </div>
      <div className="summary">
        <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Total Fare: ₹{selectedSeats.length * farePerSeat}</p>
        <button disabled={selectedSeats.length === 0} onClick={confirmBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
