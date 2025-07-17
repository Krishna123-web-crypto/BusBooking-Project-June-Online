import React, { useState, useEffect } from "react";
import SearchForm from "../Components/SearchForm"; 
import "../assets/BookingPage.css";
const sampleBuses = [
  { id: 1, name: "APSRTC Express", type: "AC",     departure: "9:00 AM",  arrival: "2:00 PM",  fare: 500 },
  { id: 2, name: "National Travels", type: "Non-AC", departure: "11:00 AM", arrival: "4:00 PM",  fare: 450 },
  { id: 3, name: "SRS Deluxe",      type: "Deluxe", departure: "6:00 PM",  arrival: "11:00 PM", fare: 600 },
];
const LS_KEY = "bookedSeatsByBus";
function loadBookedSeats() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveBookedSeats(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}
export default function BookingPage() {
  const [buses, setBuses] = useState([]);
  const [journeyDetails, setJourneyDetails] = useState(null); // {from,to,date,busType}
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(() => loadBookedSeats()); // {busId:[...]}
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  useEffect(() => {
    saveBookedSeats(bookedSeats);
  }, [bookedSeats]);
  const handleSearch = ({ from, to, date, busType }) => {
    const results = sampleBuses.filter(
      (bus) => busType === "All" || bus.type === busType
    );
    setBuses(results);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
    setJourneyDetails({ from, to, date, busType });
  };
  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };
  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };
  const isSeatBooked = (busId, seat) => (bookedSeats[busId] || []).includes(seat);
  const handleBookingConfirm = () => {
    if (!selectedBus) return;
    if (!journeyDetails?.from || !journeyDetails?.to || !journeyDetails?.date) {
      alert("Missing journey details.");
      return;
    }
    if (!passengerName || !passengerEmail) {
      alert("Please enter passenger name & email.");
      return;
    }
    if (!selectedSeats.length) {
      alert("Select at least one seat.");
      return;
    }
    const busId = selectedBus.id;
    const existing = bookedSeats[busId] || [];
    const updated = [...new Set([...existing, ...selectedSeats])];
    const newBookedSeats = { ...bookedSeats, [busId]: updated };
    setBookedSeats(newBookedSeats);
    alert(
      `Booking Confirmed!\n` +
        `Route: ${journeyDetails.from} → ${journeyDetails.to}\n` +
        `Date: ${journeyDetails.date}\n` +
        `Bus: ${selectedBus.name}\n` +
        `Seats: ${selectedSeats.join(", ")}\n` +
        `Passenger: ${passengerName} (${passengerEmail})\n` +
        `Total: ₹${selectedSeats.length * selectedBus.fare}`
    );

    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
  };
  const seatRows = [...Array(8)].map((_, rowIndex) => {
    const base = rowIndex * 4;
    return [base + 1, base + 2, base + 3, base + 4]; // L1,L2,R1,R2
  });
  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />
      {buses.length > 0 && !selectedBus && (
        <div className="bus-list">
          {buses.map((bus) => {
            const totalSeats = 32;
            const taken = (bookedSeats[bus.id] || []).length;
            const available = totalSeats - taken;
            return (
              <div key={bus.id} className="bus-card">
                <h3>
                  {bus.name} ({bus.type})
                </h3>
                {journeyDetails && (
                  <p>
                    {journeyDetails.from} → {journeyDetails.to} on {journeyDetails.date}
                  </p>
                )}
                <p>
                  {bus.departure} - {bus.arrival}
                </p>
                <p>Fare: ₹{bus.fare} per seat</p>
                <p>
                  Available: {available} / {totalSeats}
                </p>
                <button
                  disabled={available <= 0}
                  onClick={() => handleSelectBus(bus)}
                >
                  {available > 0 ? "Select Bus" : "Sold Out"}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {selectedBus && journeyDetails && (
        <>
          <div className="journey-info">
            <h4>Journey Details</h4>
            <p>
              <strong>From:</strong> {journeyDetails.from}
            </p>
            <p>
              <strong>To:</strong> {journeyDetails.to}
            </p>
            <p>
              <strong>Date of Journey:</strong> {journeyDetails.date}
            </p>
          </div>

          <div className="seat-selection">
            <h2>{selectedBus.name} – Seat Selection</h2>
            <p>Fare per seat: ₹{selectedBus.fare}</p>

            <div className="seats-layout">
              {seatRows.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {row.slice(0, 2).map((seat) => {
                    const booked = isSeatBooked(selectedBus.id, seat);
                    const selected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        className={`seat ${selected ? "selected" : ""} ${
                          booked ? "booked" : ""
                        }`}
                        disabled={booked}
                        onClick={() => handleSeatSelect(seat)}
                      >
                        {seat}
                      </button>
                    );
                  })}
                  <div className="aisle" />
                  {row.slice(2, 4).map((seat) => {
                    const booked = isSeatBooked(selectedBus.id, seat);
                    const selected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        className={`seat ${selected ? "selected" : ""} ${
                          booked ? "booked" : ""
                        }`}
                        disabled={booked}
                        onClick={() => handleSeatSelect(seat)}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="contact-form-box">
              <h3>Passenger Contact</h3>
              <form
                className="contact-form inline-passenger"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Passenger Name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                />
              </form>
            </div>
            <div className="summary">
              <p>
                <strong>Selected Seats:</strong>{" "}
                {selectedSeats.join(", ") || "None"}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {selectedSeats.length * selectedBus.fare}
              </p>
              <button
                onClick={handleBookingConfirm}
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

