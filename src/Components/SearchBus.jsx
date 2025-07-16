import React, { useState } from "react";
import "../assets/SearchBus.css";
export default function SearchBus() {
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
      totalSeats: 32,
      bookedSeats: [1, 5, 10],
    },
    {
      id: 2,
      name: "National Travels",
      type: "Non-AC",
      from: "Hyderabad",
      to: "Vijayawada",
      date: "2025-07-20",
      departure: "11:00 AM",
      arrival: "4:00 PM",
      fare: 450,
    },
    {
      id: 3,
      name: "SRS Deluxe",
      type: "Deluxe",
      from: "Hyderabad",
      to: "Chennai",
      date: "2025-07-22",
      departure: "6:00 PM",
      arrival: "11:00 PM",
      fare: 600,
    },
  ];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busType, setBusType] = useState("All");
  const [results, setResults] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) {
      alert("Please fill both From and To fields.");
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
  return (
    <div className="search-container">
      <h2>Search Buses</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <select value={busType} onChange={(e) => setBusType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="AC">AC</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Express">Express</option>
          <option value="Non-AC">Non-AC</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results.length > 0 ? (
          results.map((bus) => {
            const availableSeats = bus.totalSeats - bus.bookedSeats.length;
            return (
              <div key={bus.id} className="bus-card">
                <h3>
                  {bus.name} ({bus.type})
                </h3>
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
