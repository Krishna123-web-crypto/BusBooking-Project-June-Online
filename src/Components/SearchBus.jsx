import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
import BusTimeline from "./BusTimeline";
import LiveBusTracker from "./LiveBustracker";
import sampleBuses from "../data/buses";
const uniq = (arr) => [...new Set(arr)];
function parseTimeTo24hHours(timeStr) {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let [_, h, m, mer] = match;
  let hours = parseInt(h, 10);
  const minutes = m ? parseInt(m, 10) : 0;
  const upper = mer.toUpperCase();
  if (upper === "PM" && hours !== 12) hours += 12;
  if (upper === "AM" && hours === 12) hours = 0;
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
  const busTypes = useMemo(() => ["All Types", ...uniq(sampleBuses.map((b) => b.type))], []);
  const allStops = useMemo(
    () => uniq(sampleBuses.flatMap((bus) => bus.routeStops.map((stop) => stop.stop))).sort(),
    []
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [stopFilter, setStopFilter] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const runSearch = useCallback(() => {
    setSearched(true);
    if (!from || !to || from === to) {
      setResults([]);
      return;
    }
    let filtered = sampleBuses.filter(
      (bus) =>
        bus.from === from &&
        bus.to === to &&
        (typeFilter === "All Types" || bus.type === typeFilter)
    );
    if (stopFilter) {
      const stopLower = stopFilter.toLowerCase();
      filtered = filtered.filter((bus) =>
        bus.routeStops?.some((s) => s.stop.toLowerCase() === stopLower)
      );
    }
    setResults(filtered);
  }, [from, to, typeFilter, stopFilter]);
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
          <label>
            Stop:
            <select value={stopFilter} onChange={(e) => setStopFilter(e.target.value)}>
              <option value="">Filter by Stop</option>
              {allStops.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="search-button-wrapper">
          <button onClick={runSearch}>Search</button>
        </div>
      </div>
      {searched && Object.keys(groupedResults).length === 0 && results.length === 0 && (
        <p style={{ padding: "20px", textAlign: "center" }}>{noResultMessage}</p>
      )}
      {Object.entries(groupedResults).map(([route, buses]) => (
        <div key={route} className="route-group">
          <h3>{route}</h3>
          {buses.map((bus) => {
            const availableSeats = bus.totalSeats - bus.bookedSeats.length;
            const center = bus.routeStops?.[0]
              ? [bus.routeStops[0].lat, bus.routeStops[0].lng]
              : [17.385, 78.4867];
            return (
              <div key={bus.id} className="bus-card">
                <h4>{bus.name}</h4>
                <p>
                  Departure: {bus.departure} | Arrival: {bus.arrival}
                </p>
                <p>Fare: ₹{bus.fare}</p>
                <p>Seats Available: {availableSeats}</p>
                <p
                  style={{
                    color: isOvernight(bus.departure, bus.arrival) ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {isOvernight(bus.departure, bus.arrival) ? "Overnight Journey" : "Day Journey"}
                </p>
                <div className="stops">
                  <strong>Route Stops:</strong>
                  <BusTimeline stops={bus.routeStops} />
                </div>
                <MapContainer
                  style={{ height: "200px", width: "100%", marginTop: "10px" }}
                  center={center}
                  zoom={7}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polyline positions={bus.routeStops.map((s) => [s.lat, s.lng])} color="blue" />
                  {bus.routeStops.map((stop, i) => (
                    <Marker key={i} position={[stop.lat, stop.lng]}>
                      <Popup>
                        {stop.stop} - {stop.time}
                      </Popup>
                    </Marker>
                  ))}
                  <LiveBusTracker bus={bus} />
                </MapContainer>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
