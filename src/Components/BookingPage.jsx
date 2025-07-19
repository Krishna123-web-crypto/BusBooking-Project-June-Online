// src/pages/BookingPage.jsx (example path)
import React, { useState, useEffect, useMemo, useCallback } from "react";
import SearchForm from "../Components/SearchForm";
import sampleBuses from "../data/buses";   // <-- your large data file
import "../assets/BookingPage.css";
const LS_KEY = "bookedSeatsByBus_v2";
function parseTimeTo24hHours(timeStr) {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let [, h, m, mer] = match;
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
function calcDuration(depStr, arrStr) {
  const dep = parseTimeTo24hHours(depStr);
  const arrRaw = parseTimeTo24hHours(arrStr);
  if (dep == null || arrRaw == null) return "";
  const arr = arrRaw < dep ? arrRaw + 24 : arrRaw;
  const diffHrs = arr - dep;
  const hrs = Math.floor(diffHrs);
  const mins = Math.round((diffHrs - hrs) * 60);
  return `${hrs}h ${mins}m${arrRaw < dep ? " (overnight)" : ""}`;
}
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
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [journeyDetails, setJourneyDetails] = useState(null); 
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatsLS, setBookedSeatsLS] = useState(() => loadBookedSeats()); 
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  useEffect(() => {
    saveBookedSeats(bookedSeatsLS);
  }, [bookedSeatsLS]);
  const handleSearch = useCallback(({ from, to, date, busType }) => {
    setSearchPerformed(true);
    let results = sampleBuses.filter(
      (b) =>
        b.from === from &&
        b.to === to &&
        (busType === "All" || busType === "All Types" || b.type === busType)
    );
    setFilteredBuses(results);
    setJourneyDetails({ from, to, date, busType });
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
    setPassengerPhone("");
    setShowPayment(false);
    setPaymentMethod("");
  }, []);
  const effectiveBookedForSelectedBus = useMemo(() => {
    if (!selectedBus) return new Set();
    const dataset = new Set(selectedBus.bookedSeats || []);
    const stored = new Set(bookedSeatsLS[selectedBus.id] || []);
    return new Set([...dataset, ...stored]);
  }, [selectedBus, bookedSeatsLS]);
  const isSeatBooked = (seat) =>
    effectiveBookedForSelectedBus.has(seat);
  function toggleSeat(seat) {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  }
  const seatRows = useMemo(() => {
    if (!selectedBus) return [];
    const total = selectedBus.totalSeats || 36;
    const rows = [];
    let cur = 1;
    while (cur <= total) {
      rows.push(
        Array.from({ length: Math.min(4, total - cur + 1) }, (_, i) => cur + i)
      );
      cur += 4;
    }
    return rows;
  }, [selectedBus]);
  function handleSelectBus(bus) {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setShowPayment(false);
    setPaymentMethod("");
  }
  function handleProceedToPayment() {
    if (
      !selectedBus ||
      !passengerName.trim() ||
      !passengerEmail.trim() ||
      !passengerPhone.trim() ||
      selectedSeats.length === 0
    ) {
      alert("Fill passenger info & choose at least one seat.");
      return;
    }
    setShowPayment(true);
  }
  function handleConfirmBooking() {
    if (!paymentMethod) {
      alert("Select a payment method.");
      return;
    }
    const busId = selectedBus.id;
    const prev = bookedSeatsLS[busId] || [];
    const merged = [...new Set([...prev, ...selectedSeats])];
    setBookedSeatsLS({ ...bookedSeatsLS, [busId]: merged });
    alert(
      `✅ Booking Confirmed!
Route: ${journeyDetails.from} → ${journeyDetails.to}
Date: ${journeyDetails.date}
Bus: ${selectedBus.name}
Seats: ${selectedSeats.join(", ")}
Passenger: ${passengerName}
Total: ₹${selectedSeats.length * selectedBus.fare}
Payment: ${paymentMethod}`
    );
    setSelectedSeats([]);
    setShowPayment(false);
    setPaymentMethod("");
  }
  function handleChangeBus() {
    setSelectedBus(null);
    setSelectedSeats([]);
    setShowPayment(false);
    setPaymentMethod("");
  }
  const noResultMessage = useMemo(() => {
    if (!journeyDetails) return "";
    if (filteredBuses.length === 0)
      return `No buses found for ${journeyDetails.from} → ${journeyDetails.to} (${journeyDetails.busType}).`;
    return "";
  }, [filteredBuses, journeyDetails]);
  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />
      {!selectedBus && searchPerformed && (
        <div className="results-section">
          <h2 style={{ marginTop: "1rem" }}>Available Buses</h2>
          {journeyDetails && (
            <p className="journey-summary">
              {journeyDetails.from} → {journeyDetails.to} on{" "}
              {journeyDetails.date} | Type: {journeyDetails.busType}
            </p>
          )}
          {filteredBuses.length === 0 && (
            <div className="no-results">{noResultMessage}</div>
          )}
          <div className="bus-list">
            {filteredBuses.map((bus) => {
              const datasetTaken = bus.bookedSeats?.length || 0;
              const userTaken = (bookedSeatsLS[bus.id] || []).length;
              const totalTaken = datasetTaken + userTaken;
              const available = (bus.totalSeats || 36) - totalTaken;
              return (
                <div key={bus.id} className="bus-card">
                  <div className="bus-card-head">
                    <h3>
                      {bus.name} <span className="bus-type">({bus.type})</span>
                    </h3>
                    <span
                      className={
                        "overnight-tag " +
                        (isOvernight(bus.departure, bus.arrival)
                          ? "overnight"
                          : "day")
                      }
                    >
                      {isOvernight(bus.departure, bus.arrival)
                        ? "Overnight"
                        : "Day"}
                    </span>
                  </div>
                  <p>
                    {bus.departure} - {bus.arrival}{" "}
                    <span className="duration">
                      {calcDuration(bus.departure, bus.arrival)}
                    </span>
                  </p>
                  <p>
                    Fare: <strong>₹{bus.fare}</strong> | Seats Available:{" "}
                    <strong>{available}</strong> / {bus.totalSeats || 36}
                  </p>
                  {/* Collapsible route stops */}
                  {bus.routeStops && (
                    <details className="stops-details">
                      <summary>Route Stops ({bus.routeStops.length})</summary>
                      <ul className="stops-list">
                        {bus.routeStops.map((s, i) => (
                          <li key={i}>
                            <span>{s.stop}</span>{" "}
                            <small style={{ color: "#555" }}>{s.time}</small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
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
        </div>
      )}
      {selectedBus && journeyDetails && (
        <div className="seat-booking-section">
          <div className="seat-header">
            <h2>
              {selectedBus.name} ({selectedBus.type}) – Seat Selection
            </h2>
            <button className="back-btn" onClick={handleChangeBus}>
              ← Back to results
            </button>
          </div>
          <div className="journey-info">
            <p>
              <strong>Route:</strong> {journeyDetails.from} →{" "}
              {journeyDetails.to} on {journeyDetails.date}
            </p>
            <p>
              <strong>Timing:</strong> {selectedBus.departure} –{" "}
              {selectedBus.arrival}{" "}
              <span className="duration">
                {calcDuration(selectedBus.departure, selectedBus.arrival)}
              </span>
            </p>
            <p>
              <strong>Fare / Seat:</strong> ₹{selectedBus.fare}
            </p>
          </div>
          {selectedBus.routeStops && (
            <details className="stops-details wide">
              <summary>View Route Stops</summary>
              <ol className="stops-list numbered">
                {selectedBus.routeStops.map((s, i) => (
                  <li key={i}>
                    <span>{s.stop}</span>{" "}
                    <small style={{ color: "#555" }}>{s.time}</small>
                  </li>
                ))}
              </ol>
            </details>
          )}
          <div className="seats-layout">
            {seatRows.map((row, idx) => {
              const isLast = idx === seatRows.length - 1;
              const left = !isLast ? row.slice(0, 2) : [];
              const right = !isLast ? row.slice(2) : row; 
              return (
                <div key={idx} className="seat-row">
                  {!isLast && (
                    <div className="seat-pair">
                      {left.map((seat) => {
                        const booked = isSeatBooked(seat);
                        const sel = selectedSeats.includes(seat);
                        return (
                          <button
                            key={seat}
                            className={
                              "seat" +
                              (booked ? " booked" : "") +
                              (sel ? " selected" : "")
                            }
                            onClick={() => !booked && toggleSeat(seat)}
                            disabled={booked}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!isLast && <div className="aisle" />}
                  <div className={"seat-pair" + (isLast ? " last-row" : "")}>
                    {right.map((seat) => {
                      const booked = isSeatBooked(seat);
                      const sel = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          className={
                            "seat" +
                            (booked ? " booked" : "") +
                            (sel ? " selected" : "")
                          }
                          onClick={() => !booked && toggleSeat(seat)}
                          disabled={booked}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="passenger-box">
            <h3>Passenger Details</h3>
            <div className="passenger-grid">
              <input
                type="text"
                placeholder="Full Name"
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
              <input
                type="tel"
                placeholder="Phone"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="summary-box">
            <p>
              <strong>Selected Seats:</strong>{" "}
              {selectedSeats.length ? selectedSeats.join(", ") : "None"}
            </p>
            <p>
              <strong>Total:</strong> ₹{selectedSeats.length * selectedBus.fare}
            </p>
            {!showPayment && (
              <button
                className="proceed-btn"
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Payment
              </button>
            )}
            {showPayment && (
              <div className="payment-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  {["UPI", "Card", "NetBanking"].map((m) => (
                    <label key={m}>
                      <input
                        type="radio"
                        name="payment"
                        value={m}
                        checked={paymentMethod === m}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      {m}
                    </label>
                  ))}
                </div>
                <button
                  className="confirm-btn"
                  onClick={handleConfirmBooking}
                  disabled={!paymentMethod}
                >Confirm & Pay ₹{selectedSeats.length * selectedBus.fare}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
