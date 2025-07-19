import React, { useState } from "react";
import "../assets/SearchForm.css";
const LOCATIONS = ["Hyderabad", "Vijayawada", "Rajampet", "Tirupati", "Tirumala", "Kadapa", "Bengaluru", "Sri Kalahasti"];
const BUS_TYPES = ["All", "AC", "Non-AC", "Deluxe", "Ultra Deluxe", "Express"];
export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [busType, setBusType] = useState("All");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please select all fields (From, To, Date)");
      return;
    }
    if (from === to) {
      alert("Source and destination cannot be the same");
      return;
    }
    onSearch({ from, to, date, busType });
  };
  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <select value={from} onChange={(e) => setFrom(e.target.value)} required>
        <option value="">From</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <select value={to} onChange={(e) => setTo(e.target.value)} required>
        <option value="">To</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select value={busType} onChange={(e) => setBusType(e.target.value)}>
        {BUS_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <button type="submit">Search</button>
    </form>
  );
}
