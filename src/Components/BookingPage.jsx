import React, { useState } from "react";
import "../assets/BookingPage.css";
export default function BookingPage() {
  const farePerSeat = 500;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const places = ["Hyderabad", "Vijayawada", "Chennai", "Bangalore", "Mumbai"];
  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  const handleBookingConfirm = () => {
    setBookedSeats([...bookedSeats, ...selectedSeats]);
    alert(`Booked Seats: ${selectedSeats.join(", ")}`);
    setSelectedSeats([]);
  };
  return (
    <div className="booking-container">
      <h2>Bus Ticket Booking</h2>
      {/* Journey Form */}
      <form className="journey-form">
        <select value={from} onChange={(e) => setFrom(e.target.value)} required>
          <option value="">Select From</option>
          {places.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} required>
          <option value="">Select To</option>
          {places
            .filter((place) => place !== from)
            .map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </form>
      {from && to && date && (
        <>
          <div className="journey-info">
            <p><strong>From:</strong> {from}</p>
            <p><strong>To:</strong> {to}</p>
            <p><strong>Date:</strong> {date}</p>
          </div>
          <h3>Seat Layout</h3>
          <div className="seats-layout">
            {/* 7 Rows: 2+2 layout = 28 seats */}
            {[...Array(7)].map((_, row) => {
              const base = row * 4;
              return (
                <div className="seat-row" key={row}>
                  {[0, 1].map((i) => {
                    const seat = base + i + 1;
                    return (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${isSeatBooked(seat) ? "booked" : ""}`}
                        disabled={isSeatBooked(seat)}
                        onClick={() => handleSeatSelect(seat)}
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
                        className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${isSeatBooked(seat) ? "booked" : ""}`}
                        disabled={isSeatBooked(seat)}
                        onClick={() => handleSeatSelect(seat)}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              );
            })}
            {/* Last Row: 8 seats straight = seats 29-36 */}
            <div className="seat-row">
              {[...Array(8)].map((_, i) => {
                const seat = 29 + i;
                return (
                  <button
                    key={seat}
                    className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${isSeatBooked(seat) ? "booked" : ""}`}
                    disabled={isSeatBooked(seat)}
                    onClick={() => handleSeatSelect(seat)}
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
            <button
              disabled={selectedSeats.length === 0}
              onClick={handleBookingConfirm}
            >
              Confirm Booking
            </button>
          </div>
        </>
      )}
    </div>
  );
}
