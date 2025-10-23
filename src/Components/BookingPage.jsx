import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchForm from "../Components/SearchForm";
import sampleBuses from "../data/buses";
import "../assets/BookingPage.css";
import { AuthContext } from "../Components/Context/AuthContext";

const LS_KEY = "bookedSeatsByBus_v3";

/* ----------------- Helper Functions ----------------- */
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

/* ----------------- Map Auto-Fit ----------------- */
function FitBoundsOnRoute({ stops }) {
  const map = useMap();
  useEffect(() => {
    const validStops = stops.filter((s) => s.lat && s.lng);
    if (validStops.length > 1) {
      const bounds = L.latLngBounds(validStops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [stops, map]);
  return null;
}

/* ----------------- Ticket Confirmation ----------------- */
function TicketConfirmation({ ticket, onClose }) {
  if (!ticket) return null;
  return (
    <div className="ticket-confirmation">
      <h2>🎫 Booking Confirmed!</h2>
      <h3>
        {ticket.bus.name} ({ticket.bus.type})
      </h3>
      <p>
        {ticket.from} → {ticket.to} | Date: {ticket.date}
      </p>
      <p>Seats: {ticket.seats.join(", ")}</p>
      <p>
        Passenger: {ticket.passenger.name}, {ticket.passenger.age} yrs,{" "}
        {ticket.passenger.gender}
      </p>
      <p>Total Fare: ₹{ticket.total}</p>
      <p>Paid via: {ticket.paymentMethod}</p>
      <button className="btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

/* ----------------- Booking Page ----------------- */
export default function BookingPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filteredBuses, setFilteredBuses] = useState([]);
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookedSeatsLS, setBookedSeatsLS] = useState(() => loadBookedSeats());
  const [ticketInfo, setTicketInfo] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerAge, setPassengerAge] = useState("");
  const [passengerGender, setPassengerGender] = useState("");
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [upiApp, setUpiApp] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    saveBookedSeats(bookedSeatsLS);
  }, [bookedSeatsLS]);

  const handleSearch = useCallback(({ from, to, date, busType }) => {
    const results = sampleBuses
      .filter(
        (b) =>
          b.from === from &&
          b.to === to &&
          (busType === "All" || b.type === busType)
      )
      .map((b) => ({ ...b, showMap: false })); // 👈 initialize showMap
    setFilteredBuses(results);
    setJourneyDetails({ from, to, date, busType });
    setSearchPerformed(true);
    setSelectedBus(null);
    setSelectedSeats([]);
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

  const renderSeat = (num, isWindow = false) => {
    const seatData = effectiveBookedSeats[num];
    const isBooked = seatData?.status === "booked";
    return (
      <button
        key={num}
        className={`seat ${selectedSeats.includes(num) ? "selected" : ""} ${
          isBooked ? "booked" : ""
        } ${isWindow ? "window-seat" : ""}`}
        onClick={() => (isBooked ? null : toggleSeat(num))}
        disabled={isBooked}
      >
        {num}
      </button>
    );
  };

  const renderSeatLayout = () => {
    if (!selectedBus) return null;
    let seatLayout = [];
    let seatNum = 1;

    seatLayout.push(
      <div key="driver" className="driver-row">
        <div className="seat driver-seat">🚍</div>
      </div>
    );

    for (let row = 0; row < 8; row++) {
      seatLayout.push(
        <div key={`row-${row}`} className="seat-row">
          <div className="seat-block">
            {renderSeat(seatNum++, true)}
            {renderSeat(seatNum++)}
          </div>
          <div className="aisle" />
          <div className="seat-block">
            {renderSeat(seatNum++)}
            {renderSeat(seatNum++, true)}
          </div>
        </div>
      );
    }

    seatLayout.push(
      <div key="last" className="seat-row back-row">
        {Array.from({ length: 8 }, (_, i) => renderSeat(seatNum++, i === 0 || i === 7))}
      </div>
    );
    return seatLayout;
  };

  const handleProceedToPayment = () => {
    if (
      !passengerName ||
      !passengerEmail ||
      !passengerPhone ||
      !passengerAge ||
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
    const key = `${selectedBus.id}_${journeyDetails.date}`;
    const splitFare = calculateSplitFare(selectedBus, boardingPoint, droppingPoint);
    const total = selectedSeats.length * splitFare;
    const updatedSeats = { ...(bookedSeatsLS[key] || {}) };
    selectedSeats.forEach((seat) => {
      updatedSeats[seat] = {
        status: "booked",
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
      };
    });
    setBookedSeatsLS((prev) => ({ ...prev, [key]: updatedSeats }));

    setTicketInfo({
      bus: selectedBus,
      seats: [...selectedSeats],
      passenger: {
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
        age: passengerAge,
        gender: passengerGender,
      },
      from: boardingPoint,
      to: droppingPoint,
      date: journeyDetails.date,
      total,
      paymentMethod: upiApp,
    });

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
    setSelectedBus(null);
  };

  return (
    <div className="booking-container">
      {ticketInfo && (
        <TicketConfirmation ticket={ticketInfo} onClose={() => setTicketInfo(null)} />
      )}
      <SearchForm onSearch={handleSearch} />

      {searchPerformed && (
        <>
          <div className="results-section">
            <h3>Available Buses</h3>
            {filteredBuses.length === 0 ? (
              <p>No buses found.</p>
            ) : (
              filteredBuses.map((bus) => {
                const validStops = bus.routeStops.filter((s) => s.lat && s.lng);
                return (
                  <div key={bus.id} className="bus-card">
                    <h4>
                      {bus.name} ({bus.type})
                    </h4>
                    <p>
                      {bus.from} → {bus.to} | ₹{bus.fare}
                    </p>
                    <p>
                      Departure: {bus.departure} | Arrival: {bus.arrival} | Duration:{" "}
                      {calcDuration(bus.departure, bus.arrival)}
                    </p>

                    <div className="route-stops">
                      <h5>Route Stops:</h5>
                      <ul>
                        {bus.routeStops.map((stop, index) => (
                          <li key={index}>{stop.stop}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 🔘 Open / Close Map Button */}
                    {validStops.length > 0 && (
                      <div className="map-toggle-section">
                        <button
                          className="btn toggle-map-btn"
                          onClick={() =>
                            setFilteredBuses((prev) =>
                              prev.map((b) =>
                                b.id === bus.id ? { ...b, showMap: !b.showMap } : b
                              )
                            )
                          }
                        >
                          {bus.showMap ? "Close Map" : "Open Map"}
                        </button>

                        {bus.showMap && (
                          <div className="map-panel">
                            <div className="map-panel-header">
                              <span>
                                🗺️ {bus.name} ({bus.type}) — Route Map
                              </span>
                            </div>
                            <div className="map-panel-body">
                              <MapContainer
                                style={{ height: "400px", width: "100%" }}
                                zoom={7}
                                center={[validStops[0].lat, validStops[0].lng]}
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution="© OpenStreetMap contributors"
                                />
                                <Polyline
                                  positions={validStops.map((s) => [s.lat, s.lng])}
                                  color="blue"
                                  weight={4}
                                />
                                {validStops.map((s, i) => (
                                  <Marker key={i} position={[s.lat, s.lng]} />
                                ))}
                                <FitBoundsOnRoute stops={validStops} />
                              </MapContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <button className="book-btn" onClick={() => setSelectedBus(bus)}>
                      Book Now
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {selectedBus && (
            <div className="seat-booking-section">
              <h3>
                {selectedBus.name} ({selectedBus.type})
              </h3>
              <p>
                {selectedBus.from} → {selectedBus.to} | ₹{selectedBus.fare} max fare
              </p>

              <div className="seats-grid">{renderSeatLayout()}</div>

              {selectedSeats.length > 0 && (
                <div className="selected-seats-info">
                  Selected Seats: {selectedSeats.join(", ")}
                </div>
              )}

              <div className="passenger-form big-inputs">
                <h3>Passenger Details</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(e.target.value)}
                  />
                  <select
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value)}
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                  >
                    <option value="">Boarding Point</option>
                    {selectedBus.routeStops.map((s, i) => (
                      <option key={i} value={s.stop}>
                        {s.stop}
                      </option>
                    ))}
                  </select>
                  <select
                    value={droppingPoint}
                    onChange={(e) => setDroppingPoint(e.target.value)}
                  >
                    <option value="">Dropping Point</option>
                    {selectedBus.routeStops.map((s, i) => (
                      <option key={i} value={s.stop}>
                        {s.stop}
                      </option>
                    ))}
                  </select>
                </div>

                {!showPayment ? (
                  <button className="btn proceed" onClick={handleProceedToPayment}>
                    Proceed to Payment
                  </button>
                ) : (
                  <div className="payment-section">
                    <select
                      value={upiApp}
                      onChange={(e) => setUpiApp(e.target.value)}
                    >
                      <option value="">Select UPI App</option>
                      <option value="PhonePe">PhonePe</option>
                      <option value="Google Pay">Google Pay</option>
                      <option value="Paytm">Paytm</option>
                    </select>
                    <button className="btn confirm" onClick={handleConfirmBooking}>
                      Confirm Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* 🌐 Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SmartBus Booking Portal | All Rights Reserved.</p>
        <p>
          Designed & Developed by <strong>Team SmartBus</strong>
        </p>
      </footer>
    </div>
  );
}
