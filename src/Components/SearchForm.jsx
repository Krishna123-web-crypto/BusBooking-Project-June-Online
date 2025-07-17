import React, { useState } from "react";
import "../assets/SearchForm.css";
const PLACES = ["Hyderabad", "Vijayawada", "Rajampet", "Tirupati"];
export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [busType, setBusType] = useState("All");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill in all required fields.");
      return;
    }
    if (from === to) {
      alert("From and To cannot be the same city.");
      return;
    }
    onSearch({ from, to, date, busType });
  };
  const toOptions = PLACES.filter((p) => p !== from);
  return (
    <div className="search-form-container">
      <h2>Search Buses</h2>
      <form className="search-form" onSubmit={handleSubmit}>
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={busType} onChange={(e) => setBusType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Express">Express</option>
        </select>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
