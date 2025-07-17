import React, { useState, useContext } from "react";
import "../assets/SearchBus.css";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "./Context/BookingContext";
const PLACES = ["Hyderabad", "Vijayawada", "Rajampet", "Tirupati"];
const sampleBuses = [
  {
    id: 1,
    name: "APSRTC Express",
    type: "AC",
    from: "Hyderabad",
    to: "Vijayawada",
    date: "2025-07-20",
    departure: "9:00 AM",
    arrival: "2:00 PM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 2,
    name: "National Travels",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Rajampet",
    date: "2025-07-20",
    departure: "11:00 AM",
    arrival: "4:00 PM",
    fare: 450,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 3,
    name: "SRS Deluxe",
    type: "Deluxe",
    from: "Hyderabad",
    to: "Tirupati",
    date: "2025-07-22",
    departure: "6:00 PM",
    arrival: "11:00 PM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 4,
    name: "National Travels",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Vijayawada",
    date: "2025-07-20",
    departure: "9:00 AM",
    arrival: "2:00 PM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 5,
    name: "Ultra Deluxe",
    type: "Deluxe",
    from: "Hyderabad",
    to: "Rajampet",
    date: "2025-07-22",
    departure: "6:00 PM",
    arrival: "11:00 PM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 6,
    name: "APSRTC Express",
    type: "AC",
    from: "Hyderabad",
    to: "Rajampet",
    date: "2025-07-20",
    departure: "9:00 AM",
    arrival: "2:00 PM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
  },
  {
    id: 7,
    name: "APSRTC Express",
    type: "AC",
    from: "Hyderabad",
    to: "Tirupati",
    date: "2025-07-20",
    departure: "9:00 AM",
    arrival: "2:00 PM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
  },
];
export default function SearchBus() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busType, setBusType] = useState("All");
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const { selectBus } = useContext(BookingContext);
  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) {
      alert("Please fill all fields.");
      return;
    }
    if (from === to) {
      alert("From and To cannot be the same city.");
      return;
    }
    const filtered = sampleBuses.filter(
      (bus) =>
        bus.from.toLowerCase() === from.toLowerCase() &&
        bus.to.toLowerCase() === to.toLowerCase() &&
        (busType === "All" || bus.type === busType)
    );
    setResults(filtered);
  };
  const handleSelectBus = (bus) => {
    selectBus(bus);
    navigate("/booking");
  };
  const toOptions = PLACES.filter((p) => p !== from);
  return (
    <div className="search-container">
      <header className="app-bar">
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          ←
        </button>
        MYBUSBOOK
      </header>
      <form className="search-form" onSubmit={handleSearch}>
        <select
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            if (e.target.value === to) setTo("");
          }}
          required
        >
          <option value="">From</option>
          {PLACES.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          disabled={!from}
        >
          <option value="">To</option>
          {toOptions.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
        <select value={busType} onChange={(e) => setBusType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Express">Express</option>
        </select>

        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results === null ? (
          <p>Enter details above and click Search.</p>
        ) : results.length > 0 ? (
          results.map((bus) => {
            const availableSeats = bus.totalSeats - bus.bookedSeats.length;
            return (
              <div key={bus.id} className="bus-card">
                <div className="bus-header">
                  <span className="service-no">Service No: {bus.id}</span>
                  <span className="bus-type">{bus.type}</span>
                </div>
                <p>
                  {bus.from} → {bus.to}
                </p>
                <p>
                  Departure: {bus.departure}, Arrival: {bus.arrival}
                </p>
                <p>Fare: ₹{bus.fare}</p>
                <p>
                  Available Seats: {availableSeats} / {bus.totalSeats}
                </p>
                <button
                  className="btn-select-bus"
                  disabled={availableSeats <= 0}
                  onClick={() => handleSelectBus(bus)}
                >
                  {availableSeats > 0 ? "Select Bus" : "Sold Out"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No buses available for this route.</p>
        )}
      </div>
    </div>
  );
}
