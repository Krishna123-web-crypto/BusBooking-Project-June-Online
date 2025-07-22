import React, { useState, useMemo, useCallback, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
import TripDetails from "../Components/TripDetails";
import sampleBuses from "../data/buses";
const uniq = (arr) => [...new Set(arr)];
function parseTimeTo24hHours(timeStr) {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let [_, h, m, mer] = match;
  let hours = parseInt(h, 10);
  const minutes = m ? parseInt(m, 10) : 0;
  if (mer.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (mer.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours + minutes / 60;
}
function isOvernight(departure, arrival) {
  const dep = parseTimeTo24hHours(departure);
  const arr = parseTimeTo24hHours(arrival);
  if (dep == null || arr == null) return false;
  return arr < dep;
}
export default function SearchBus() {
  const locations = useMemo(
    () => uniq([...sampleBuses.map((b) => b.from), ...sampleBuses.map((b) => b.to)]),
    []
  );
  const busTypes = useMemo(
    () => ["All Types", ...uniq(sampleBuses.map((b) => b.type))],
    []
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const resultsRef = useRef(null);
  const runSearch = useCallback(() => {
    setSearched(true);
    if (!from || !to || from === to) {
      setResults([]);
      return;
    }
    const filtered = sampleBuses.filter(
      (bus) =>
        bus.from === from &&
        bus.to === to &&
        (typeFilter === "All Types" || bus.type === typeFilter)
    );
    setResults(filtered);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [from, to, typeFilter]);
  const groupedResults = useMemo(() => {
    return results.reduce((acc, bus) => {
      const routeKey = `${bus.from} → ${bus.to}`;
      if (!acc[routeKey]) acc[routeKey] = [];
      acc[routeKey].push(bus);
      return acc;
    }, {});
  }, [results]);
  const noResultMessage = useMemo(() => {
    if (!from && !to) return "Please select 'From' and 'To' locations.";
    if (from && !to) return "Please select a destination.";
    if (to && !from) return "Please select a starting location.";
    if (from === to && from) return "'From' and 'To' cannot be the same.";
    return "No buses found for the selected route.";
  }, [from, to]);
  const handleOpenMap = (bus) => {
    alert(`Open map for: ${bus.name}`);
  };
  return (
    <div className="booking-container">
      <div className="search-form">
        <div className="filters-row">
          <label>
            From:
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">From</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
          <label>
            To:
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">To</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type:
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {busTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="search-button-wrapper">
          <button onClick={runSearch}>Search</button>
        </div>
      </div>
      <div ref={resultsRef}>
        {searched && Object.keys(groupedResults).length === 0 && (
          <p style={{ padding: "20px", textAlign: "center" }}>{noResultMessage}</p>
        )}
        {Object.entries(groupedResults).map(([route, buses]) => (
          <div key={route} className="route-group">
            <h2 className="route-title">{route}</h2>
            {buses.map((bus) => {
              const availableSeats = bus.totalSeats - bus.bookedSeats.length;
              return (
                <div key={bus.id} className="bus-card apsrtc-style">
                  <div className="bus-header">
                    <h3 className="bus-name">{bus.name}</h3>
                    <p className="bus-type">{bus.type}</p>
                  </div>
                  <p className="bus-info">
                    <strong>Departure:</strong> {bus.departure} | <strong>Arrival:</strong> {bus.arrival}
                  </p>
                  <p className="bus-info">
                    <strong>Fare:</strong> ₹{bus.fare}
                  </p>
                  <p className="bus-info">
                    <strong>Seats Available:</strong> {availableSeats}
                  </p>
                  <p
                    className="journey-type"
                    style={{
                      color: isOvernight(bus.departure, bus.arrival) ? "red" : "green",
                    }}
                  >
                    {isOvernight(bus.departure, bus.arrival) ? "Overnight Journey" : "Day Journey"}
                  </p>
                  <TripDetails
                    stops={bus.routeStops}
                    currentIndex={bus.currentStopIndex || -1}
                  />
                  <div style={{ textAlign: "right", marginTop: "10px" }}>
                    <button
                      className="open-map-button"
                      onClick={() => handleOpenMap(bus)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Open Map
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
