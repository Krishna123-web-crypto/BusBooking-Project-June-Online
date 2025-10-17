import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../Components/SearchForm";
import sampleBuses from "../data/buses";
import "../assets/BookingPage.css";
import { AuthContext } from "../Components/Context/AuthContext";

const LS_KEY = "bookedSeatsByBus_v3";

// Helper functions
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
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveBookedSeats(obj) { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }

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
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") navigate("/signin");
  }, [isLoggedIn, user, navigate]);

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

  useEffect(() => { saveBookedSeats(bookedSeatsLS); }, [bookedSeatsLS]);

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
    if (!selectedBus || !journeyDetails) return {};
    const key = `${selectedBus.id}_${journeyDetails.date}`;
    return bookedSeatsLS[key] || {};
  }, [selectedBus, bookedSeatsLS, journeyDetails]);

  const toggleSeat = (seat) => {
    if (effectiveBookedSeats[seat]?.status === "booked") return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedToPayment = () => {
    if (!passengerName || !passengerEmail || !passengerPhone || !passengerAge || !passengerGender || selectedSeats.length === 0 || !boardingPoint || !droppingPoint) {
      alert("Please fill all passenger details and select seats.");
      return;
    }
    setShowPayment(true);
  };

  const handleConfirmBooking = () => {
    if (!upiApp) { alert("Please select a UPI app."); return; }

    const key = `${selectedBus.id}_${journeyDetails.date}`;
    const splitFare = calculateSplitFare(selectedBus, boardingPoint, droppingPoint);
    const total = selectedSeats.length * splitFare;
    const updatedSeats = { ...(bookedSeatsLS[key] || {}) };

    selectedSeats.forEach((seat) => {
      updatedSeats[seat] = { status: "booked", name: passengerName, email: passengerEmail, phone: passengerPhone };
    });

    setBookedSeatsLS(prev => ({ ...prev, [key]: updatedSeats }));
    alert(`✅ Booking Confirmed!\nSeats: ${selectedSeats.join(", ")}\nTotal: ₹${total}`);

    setSelectedSeats([]); setPassengerName(""); setPassengerEmail(""); setPassengerPhone("");
    setPassengerAge(""); setPassengerGender(""); setBoardingPoint(""); setDroppingPoint(""); setUpiApp("");
    setShowPayment(false);
  };

  const handleCancelSeat = (seat) => {
    const data = effectiveBookedSeats[seat];
    if (!data) return;

    const sameUser = data.name === passengerName && data.email === passengerEmail && data.phone === passengerPhone;
    if (!sameUser) { alert("Only the person who booked the seat can cancel it."); return; }

    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;

    const key = `${selectedBus.id}_${journeyDetails.date}`;
    const updated = { ...bookedSeatsLS[key] };
    updated[seat] = { ...data, status: "cancelled", reason };
    setBookedSeatsLS(prev => ({ ...prev, [key]: updated }));
    alert(`Seat ${seat} cancelled.`);
  };

  const renderSeat = (num, isWindow = false) => {
    const seatData = effectiveBookedSeats[num];
    const isBooked = seatData?.status === "booked";
    const isCancelled = seatData?.status === "cancelled";
    if (isCancelled) return null;

    return (
      <button
        key={num}
        className={`seat ${selectedSeats.includes(num) ? "selected" : ""} ${isBooked ? "booked" : ""} ${isWindow ? "window-seat" : ""}`}
        onClick={() => (isBooked ? handleCancelSeat(num) : toggleSeat(num))}
        disabled={isBooked}
        title={isBooked ? `Booked by ${seatData.name}` : isWindow ? "Window Seat" : "Available Seat"}
      >
        {num}
      </button>
    );
  };

  const renderSeatLayout = () => {
    if (!selectedBus) return null;
    const total = selectedBus.totalSeats;
    const layout = [];
    layout.push(
      <div key="driver-seat" className="seat-row" style={{ marginBottom: "1rem", justifyContent: "flex-start", paddingLeft: "1rem" }}>
        <div className="seat driver-seat" title="Driver Seat" style={{ background: "#374151", color: "white", cursor: "default", fontWeight: "bold" }}>D</div>
      </div>
    );
    const seatsPerRow = 4;
    const lastRowSeats = 8;
    const numRows = Math.floor((total - lastRowSeats) / seatsPerRow);
    let seatNum = 1;

    for (let i = 0; i < numRows; i++) {
      layout.push(
        <div key={`row-${i}`} className="seat-row">
          <div className="seat-block">{renderSeat(seatNum++, true)}{renderSeat(seatNum++)}</div>
          <div className="seat-block">{renderSeat(seatNum++)}{renderSeat(seatNum++, true)}</div>
        </div>
      );
    }

    layout.push(
      <div key="last-row" className="seat-row back-row" style={{ gap: 0 }}>
        {[...Array(lastRowSeats)].map((_, i) => renderSeat(seatNum++, i === 0 || i === lastRowSeats - 1))}
      </div>
    );

    return layout;
  };

  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />

      {searchPerformed && filteredBuses.length === 0 && <p>No buses found.</p>}

      {filteredBuses.length > 0 && !selectedBus && (
        <div className="bus-list">
          <h3>Select a Bus:</h3>
          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bus-item" onClick={() => setSelectedBus(bus)}>
              <strong>{bus.name}</strong> | {bus.type} | {bus.departure} - {bus.arrival} | Duration: {calcDuration(bus.departure, bus.arrival)} | Fare: ₹{bus.fare}
            </div>
          ))}
        </div>
      )}

      {selectedBus && (
        <div className="seat-selection">
          <h3>Selected Bus: {selectedBus.name}</h3>
          <div className="seats">{renderSeatLayout()}</div>

          <div className="passenger-details">
            <h4>Passenger Details:</h4>
            <input placeholder="Name" value={passengerName} onChange={e => setPassengerName(e.target.value)} />
            <input placeholder="Email" value={passengerEmail} onChange={e => setPassengerEmail(e.target.value)} />
            <input placeholder="Phone" value={passengerPhone} onChange={e => setPassengerPhone(e.target.value)} />
            <input placeholder="Age" value={passengerAge} onChange={e => setPassengerAge(e.target.value)} />
            <select value={passengerGender} onChange={e => setPassengerGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select value={boardingPoint} onChange={e => setBoardingPoint(e.target.value)}>
              <option value="">Select Boarding</option>
              {selectedBus.routeStops.map(s => <option key={s.stop} value={s.stop}>{s.stop}</option>)}
            </select>
            <select value={droppingPoint} onChange={e => setDroppingPoint(e.target.value)}>
              <option value="">Select Dropping</option>
              {selectedBus.routeStops.map(s => <option key={s.stop} value={s.stop}>{s.stop}</option>)}
            </select>
          </div>

          {!showPayment && <button onClick={handleProceedToPayment} className="proceed-btn">Proceed to Payment</button>}

          {showPayment && (
            <div className="payment-section">
              <h4>Payment</h4>
              <select value={upiApp} onChange={e => setUpiApp(e.target.value)}>
                <option value="">Select UPI App</option>
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
              </select>
              <button onClick={handleConfirmBooking} className="confirm-btn">Confirm Booking</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
