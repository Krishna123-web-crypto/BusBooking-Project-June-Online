import React, { useState, useEffect, useMemo, useCallback } from "react";
import SearchForm from "../Components/SearchForm";
import sampleBuses from "../data/buses";
import "../assets/BookingPage.css";
const LS_KEY = "bookedSeatsByBus_v2";
function parseTimeTo24hHours(timeStr) {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let [, h, m, mer] = match;
  let hours = parseInt(h, 10);
  const minutes = m ? parseInt(m, 10) : 0;
  if (mer.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (mer.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours + minutes / 60;
}
function calcDuration(depStr, arrStr) {
  const dep = parseTimeTo24hHours(depStr);
  const arrRaw = parseTimeTo24hHours(arrStr);
  if (dep == null || arrRaw == null) return "";
  const arr = arrRaw < dep ? arrRaw + 24 : arrRaw;
  const diff = arr - dep;
  const hrs = Math.floor(diff);
  const mins = Math.round((diff - hrs) * 60);
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
function calculateSplitFare(bus, from, to) {
  const stops = bus.routeStops.map((s) => s.stop);
  const startIndex = stops.indexOf(from);
  const endIndex = stops.indexOf(to);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return bus.fare;
  const segments = stops.length - 1;
  const usedSegments = endIndex - startIndex;
  const perSegmentFare = bus.fare / segments;
  return Math.round(perSegmentFare * usedSegments);
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
  const [passengerAge, setPassengerAge] = useState("");
  const [passengerGender, setPassengerGender] = useState("");
  const [upiApp, setUpiApp] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  useEffect(() => {
    saveBookedSeats(bookedSeatsLS);
  }, [bookedSeatsLS]);
  const handleSearch = useCallback(({ from, to, date, busType }) => {
    const results = sampleBuses.filter(
      (b) => b.from === from && b.to === to && (busType === "All" || b.type === busType)
    );
    setFilteredBuses(results);
    setJourneyDetails({ from, to, date, busType });
    setSearchPerformed(true);
    setSelectedBus(null);
    setSelectedSeats([]);
    setShowPayment(false);
  }, []);
  const effectiveBookedSeats = useMemo(() => {
    if (!selectedBus) return new Set();
    const stored = new Set(bookedSeatsLS[selectedBus.id] || []);
    return new Set(stored);
  }, [selectedBus, bookedSeatsLS]);
  const toggleSeat = (seat) => {
    if (effectiveBookedSeats.has(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };
  const handleProceedToPayment = () => {
    if (
      !passengerName.trim() ||
      !passengerEmail.trim() ||
      !passengerPhone.trim() ||
      !passengerAge.trim() ||
      !passengerGender ||
      selectedSeats.length === 0 ||
      !boardingPoint ||
      !droppingPoint
    ) {
      alert("Please fill all passenger details and select seats.");
      return;
    }
    setShowPayment(true);
  };
  const handleConfirmBooking = () => {
    if (!upiApp) {
      alert("Please select a UPI app.");
      return;
    }
    const splitFare = calculateSplitFare(selectedBus, boardingPoint, droppingPoint);
    const total = selectedSeats.length * splitFare;
    const updated = {
      ...bookedSeatsLS,
      [selectedBus.id]: [...(bookedSeatsLS[selectedBus.id] || []), ...selectedSeats],
    };
    setBookedSeatsLS(updated);
    alert(`✅ Booking Confirmed!
Route: ${journeyDetails.from} → ${journeyDetails.to}
Date: ${journeyDetails.date}
Bus: ${selectedBus.name}
Boarding: ${boardingPoint}
Dropping: ${droppingPoint}
Passenger: ${passengerName} | Age: ${passengerAge} | Gender: ${passengerGender}
Seats: ${selectedSeats.join(", ")}
Total: ₹${total}
Payment: ${upiApp}`);
    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
    setPassengerPhone("");
    setPassengerAge("");
    setPassengerGender("");
    setBoardingPoint("");
    setDroppingPoint("");
    setUpiApp("");
    setShowPayment(false);
  };
  const renderSeatLayout = () => {
    if (!selectedBus) return null;
    const total = selectedBus.totalSeats;
    const layout = [];
    const seatsPerRow = 4;
    const lastRowSeats = 8;
    const numRows = Math.floor((total - lastRowSeats) / seatsPerRow);
    let seatNum = 1;
    for (let i = 0; i < numRows; i++) {
      layout.push(
        <div key={`row-${i}`} className="seat-row">
          <div className="seat-block">
            {[0, 1].map((pos) => {
              const isWindow = pos === 0;
              const num = seatNum++;
              return (
                <button
                  key={num}
                  className={`seat ${selectedSeats.includes(num) ? "selected" : ""}
                    ${effectiveBookedSeats.has(num) ? "booked" : ""}
                    ${isWindow ? "window" : ""}`}
                  title={isWindow ? "Window Seat" : "Aisle Seat"}
                  onClick={() => toggleSeat(num)}
                  disabled={effectiveBookedSeats.has(num)}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <div className="seat-block">
            {[0, 1].map((pos) => {
              const isWindow = pos === 1;
              const num = seatNum++;
              return (
                <button
                  key={num}
                  className={`seat ${selectedSeats.includes(num) ? "selected" : ""}
                    ${effectiveBookedSeats.has(num) ? "booked" : ""}
                    ${isWindow ? "window" : ""}`}
                  title={isWindow ? "Window Seat" : "Aisle Seat"}
                  onClick={() => toggleSeat(num)}
                  disabled={effectiveBookedSeats.has(num)}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    layout.push(
      <div key="last-row" className="seat-row back-row" style={{ gap: 0 }}>
        {[...Array(lastRowSeats)].map((_, i) => {
          const num = seatNum++;
          const isWindow = i === 0 || i === lastRowSeats - 1;
          return (
            <button
              key={num}
              className={`seat ${selectedSeats.includes(num) ? "selected" : ""}
                ${effectiveBookedSeats.has(num) ? "booked" : ""}
                ${isWindow ? "window" : ""}`}
              onClick={() => toggleSeat(num)}
              disabled={effectiveBookedSeats.has(num)}
              title={isWindow ? "Window Seat" : "Back Row Seat"}
            >
              {num}
            </button>
          );
        })}
      </div>
    );
    return layout;
  };
  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />
      {!selectedBus && searchPerformed && (
        <div className="results-section">
          <h3>Available Buses</h3>
          {filteredBuses.length === 0 ? (
            <p>No buses found.</p>
          ) : (
            filteredBuses.map((bus) => (
              <div key={bus.id} className="bus-card">
                <h4>{bus.name} ({bus.type})</h4>
                <p>{bus.from} → {bus.to} | ₹{bus.fare}</p>
                <p>Departure: {bus.departure}, Arrival: {bus.arrival} | Duration: {calcDuration(bus.departure, bus.arrival)}</p>
                <button onClick={() => setSelectedBus(bus)}>Book Now</button>
              </div>
            ))
          )}
        </div>
      )}
      {selectedBus && (
        <div className="seat-booking-section">
          <h3>{selectedBus.name} ({selectedBus.type})</h3>
          <p>{selectedBus.from} → {selectedBus.to} | ₹{selectedBus.fare} max fare</p>
          <div className="seats-grid">{renderSeatLayout()}</div>
          {selectedSeats.length > 0 && (
            <div className="selected-seats-info" style={{marginBottom: "1rem", fontWeight: "bold"}}>
              Selected Seats: {selectedSeats.join(", ")}
            </div>
          )}
          <div className="passenger-form big-inputs">
            <input type="text" placeholder="Passenger Name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} />
            <input type="email" placeholder="Email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} />
            <input type="tel" placeholder="Phone" value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} />
            <input type="number" placeholder="Age" value={passengerAge} onChange={(e) => setPassengerAge(e.target.value)} />
            <select value={passengerGender} onChange={(e) => setPassengerGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select value={boardingPoint} onChange={(e) => {
              setBoardingPoint(e.target.value);
              setDroppingPoint("");
            }}>
              <option value="">Select Boarding Point</option>
              {selectedBus.routeStops.map((stop, i) => (
                <option key={i} value={stop.stop}>{stop.stop} ({stop.time})</option>
              ))}
            </select>
            <select value={droppingPoint} onChange={(e) => setDroppingPoint(e.target.value)} disabled={!boardingPoint}>
              <option value="">Select Dropping Point</option>
              {selectedBus.routeStops
                .slice(selectedBus.routeStops.findIndex((s) => s.stop === boardingPoint) + 1)
                .map((stop, i) => (
                  <option key={i} value={stop.stop}>{stop.stop} ({stop.time})</option>
                ))}
            </select>
            {boardingPoint && droppingPoint && (
              <p className="fare-info">Per Seat Fare for this route: ₹{calculateSplitFare(selectedBus, boardingPoint, droppingPoint)}</p>
            )}
            {!showPayment ? (
              <button onClick={handleProceedToPayment}>Proceed to Payment</button>
            ) : (
              <div className="payment-section">
                <label>
                  Select UPI App:
                  <select
                    value={upiApp}
                    onChange={(e) => setUpiApp(e.target.value)}
                  >
                    <option value="">--Choose UPI App--</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Paytm">Paytm</option>
                  </select>
                </label>
                <button
                  onClick={handleConfirmBooking}
                  style={{marginTop: "1rem"}}
                >
                  Pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}