import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
import BusTimeline from "./BusTimeline";
import LiveBusTracker from "./LiveBustracker";
const locations = ["Hyderabad", "Vijayawada", "Rajampet", "Tirupati"];
const busTypes = ["All Types", "AC", "Non-AC", "Ultra Deluxe"];
const sampleBuses = [
  {
    id: 1,
    name: "APSRTC Express",
    type: "AC",
    from: "Hyderabad",
    to: "Vijayawada",
    date: "2025-07-20",
    departure: "9:00 PM",
    arrival: "6:00 AM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "9:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "9:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Nalgonda", time: "10:30 PM", lat: 17.05, lng: 79.27 },
      { stop: "Kodad", time: "12:00 AM", lat: 16.99, lng: 79.97 },
      { stop: "Suryapet", time: "12:45 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "2:00 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "6:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 2,
    name: "APSRTC ULTRA Deluxe",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Tirupati",
    date: "2025-07-21",
    departure: "6:00 AM",
    arrival: "2:00 PM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [5, 10, 11],
    routeStops: [
      { stop: "Hyderabad", time: "6:00 AM", lat: 17.385, lng: 78.4867 },
      { stop: "Nalgonda", time: "7:30 AM", lat: 17.05, lng: 79.27 },
      { stop: "Miryalaguda", time: "8:30 AM", lat: 16.8722, lng: 79.5625 },
      { stop: "Guntur", time: "10:00 AM", lat: 16.3067, lng: 80.4365 },
      { stop: "Ongole", time: "12:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "2:00 PM", lat: 14.44, lng: 79.99 },
      { stop: "Naidupeta", time: "3:30 PM", lat: 13.9046, lng: 79.8969 },
      { stop: "Srikalahasti", time: "4:15 PM", lat: 13.7499, lng: 79.6984 },
      { stop: "Tirupati", time: "5:00 PM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 3,
    name: "Rajampet Deluxe",
    type: "AC",
    from: "Vijayawada",
    to: "Rajampet",
    date: "2025-07-22",
    departure: "5:00 PM",
    arrival: "11:00 PM",
    fare: 550,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Guntur", time: "6:00 PM", lat: 16.3067, lng: 80.4365 },
      { stop: "Ongole", time: "7:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Kavali", time: "8:00 PM", lat: 14.9163, lng: 79.9945 },
      { stop: "Nellore", time: "8:30 PM", lat: 14.44, lng: 79.99 },
      { stop: "Rapur", time: "9:30 PM", lat: 14.2052, lng: 79.6132 },
      { stop: "Rajampet", time: "11:00 PM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 4,
    name: "Tirupati Rajampet Express",
    type: "Non-AC",
    from: "Tirupati",
    to: "Rajampet",
    date: "2025-07-23",
    departure: "5:00 AM",
    arrival: "8:30 AM",
    fare: 400,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "5:00 AM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "5:20 AM", lat: 13.6368, lng: 79.5126 },
      { stop: "Mamanduru", time: "5:50 AM", lat: 13.6986, lng: 79.3486 },
      { stop: "Kodur", time: "7:15 AM", lat: 14.1176, lng: 79.5503 },
      { stop: "Pullampeta", time: "8:00 AM", lat: 14.2731, lng: 79.1953 },
      { stop: "Rajampet", time: "8:30 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
];
function isOvernight(departure, arrival) {
  const parseTime = (t) => {
    const [h, m, mer] = t.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
    let hours = parseInt(h);
    if (mer.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (mer.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours;
  };
  return parseTime(arrival) < parseTime(departure);
}
export default function SearchBus() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [stopFilter, setStopFilter] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = () => {
    let filtered = sampleBuses.filter(
      (bus) =>
        bus.from === from &&
        bus.to === to &&
        (typeFilter === "All Types" || bus.type === typeFilter)
    );
    if (stopFilter !== "") {
      filtered = filtered.filter((bus) =>
        bus.routeStops?.some(
          (stop) => stop.stop.toLowerCase() === stopFilter.toLowerCase()
        )
      );
    }
    setResults(filtered);
  };
  const allStops = Array.from(
    new Set(sampleBuses.flatMap((bus) => bus.routeStops.map((stop) => stop.stop)))
  );
  const groupedResults = results.reduce((acc, bus) => {
    const routeKey = `${bus.from} → ${bus.to}`;
    if (!acc[routeKey]) acc[routeKey] = [];
    acc[routeKey].push(bus);
    return acc;
  }, {});

  return (
    <div className="booking-container">
      <div className="search-form">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">From</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">To</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {busTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select value={stopFilter} onChange={(e) => setStopFilter(e.target.value)}>
          <option value="">Filter by Stop</option>
          {allStops.map((stop) => (
            <option key={stop} value={stop}>
              {stop}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {Object.entries(groupedResults).length === 0 && results.length === 0 && (
        <p style={{ padding: "20px", textAlign: "center" }}>
          No buses found for the selected route.
        </p>
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
                <p>Departure: {bus.departure} | Arrival: {bus.arrival}</p>
                <p>Fare: ₹{bus.fare}</p>
                <p>Seats Available: {availableSeats}</p>
                <p
                  style={{
                    color: isOvernight(bus.departure, bus.arrival) ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {isOvernight(bus.departure, bus.arrival)
                    ? "Overnight Journey"
                    : "Day Journey"}
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
                  <Polyline
                    positions={bus.routeStops.map((s) => [s.lat, s.lng])}
                    color="blue"
                  />
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





