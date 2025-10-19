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

/* ----------------- Map Auto-Fit Component ----------------- */
function FitBoundsOnRoute({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 1) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [stops, map]);
  return null;
}

/* ----------------- Booking Page ----------------- */
export default function BookingPage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      navigate("/signin");
    }
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

  // map panel state
  const [mapBus, setMapBus] = useState(null);
  const [showMapPanel, setShowMapPanel] = useState(false);

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
    // close map if open
    setMapBus(null);
    setShowMapPanel(false);
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

  // ----------------- Updated Open Map Function -----------------
  const openMapForBus = (bus) => {
    setMapBus(bus);
    setShowMapPanel(true);
    // Do NOT modify selectedBus, selectedSeats, or showPayment
  };

  const closeMapPanel = () => {
    setShowMapPanel(false);
    setMapBus(null);
  };

  const getStopsBetween = (bus) => {
    if (!bus) return [];
    if (!journeyDetails) return bus.routeStops || [];
    const stops = bus.routeStops || [];
    const startIdx = stops.findIndex((s) => s.stop === journeyDetails.from);
    const endIdx = stops.findIndex((s) => s.stop === journeyDetails.to);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      return stops.slice(startIdx, endIdx + 1);
    }
    return stops;
  };

  const stopsForMap = useMemo(() => (mapBus ? getStopsBetween(mapBus) : []), [mapBus, journeyDetails]);

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
    alert(`✅ Booking Confirmed!\nSeats: ${selectedSeats.join(", ")}\nTotal: ₹${total}`);
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

  const handleCancelSeat = (seat) => {
    const data = effectiveBookedSeats[seat];
    if (!data) return;
    const sameUser =
      data.name === passengerName &&
      data.email === passengerEmail &&
      data.phone === passengerPhone;
    if (!sameUser) {
      alert("Only the person who booked the seat can cancel it.");
      return;
    }
    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;
    const key = `${selectedBus.id}_${journeyDetails.date}`;
    const updated = { ...bookedSeatsLS[key] };
    updated[seat] = { ...data, status: "cancelled", reason };
    setBookedSeatsLS((prev) => ({ ...prev, [key]: updated }));
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
      <div key="driver" className="seat-row" style={{ marginBottom: "1rem", justifyContent: "flex-start", paddingLeft: "1rem" }}>
        <div className="seat driver-seat" style={{ background: "#374151", color: "white", cursor: "default" }}>D</div>
      </div>
    );

    const seatsPerRow = 4;
    const lastRowSeats = 8;
    const numRows = Math.floor((total - lastRowSeats) / seatsPerRow);
    let seatNum = 1;
    for (let i = 0; i < numRows; i++) {
      layout.push(
        <div key={`row-${i}`} className="seat-row">
          <div className="seat-block">
            {renderSeat(seatNum++, true)}
            {renderSeat(seatNum++)}
          </div>
          <div className="seat-block">
            {renderSeat(seatNum++)}
            {renderSeat(seatNum++, true)}
          </div>
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

  const routeSegment =
    selectedBus &&
    boardingPoint &&
    droppingPoint &&
    selectedBus.routeStops.slice(
      selectedBus.routeStops.findIndex((s) => s.stop === boardingPoint),
      selectedBus.routeStops.findIndex((s) => s.stop === droppingPoint) + 1
    );

  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />

      {/* Map panel */}
      {showMapPanel && mapBus && (
        <div className="map-panel">
          <div className="map-panel-header">
            <div>
              <h3>{mapBus.name} — {mapBus.from} → {mapBus.to}</h3>
              <p className="muted">Departure: {mapBus.departure} · Arrival: {mapBus.arrival} · {calcDuration(mapBus.departure, mapBus.arrival)}</p>
            </div>
            <div>
              <button className="btn" onClick={closeMapPanel}>Close Map</button>
            </div>
          </div>

          <div className="map-panel-body">
            <div className="map-panel-map">
              <MapContainer center={[15.9129, 79.74]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                {stopsForMap.map((stop, idx) => (
                  <Marker key={idx} position={[stop.lat, stop.lng]} title={`${stop.stop} — ${stop.time || ""}`} />
                ))}
                <Polyline positions={stopsForMap.map((s) => [s.lat, s.lng])} color="blue" weight={4} />
                <FitBoundsOnRoute stops={stopsForMap} />
              </MapContainer>
            </div>

            <aside className="map-panel-stops">
              <h4>Stops & ETA</h4>
              <ul>
                {stopsForMap.map((s, i) => (
                  <li key={i}>
                    <div className="stop-name">{s.stop}</div>
                    <div className="stop-meta">{s.time || "-"}</div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      )}

      {/* Bus list */}
      {!selectedBus && searchPerformed && (
        <div className="results-section">
          <h3>Available Buses</h3>
          {filteredBuses.length === 0 ? (
            <p>No buses found.</p>
          ) : (
            filteredBuses.map((bus) => {
              const stopsBetween = getStopsBetween(bus);
              return (
                <div key={bus.id} className="bus-card">
                  <h4 className="bus-name">{bus.name} ({bus.type})</h4>
                  <div className="route-timeline">
                    {stopsBetween.map((stop, index) => (
                      <div key={index} className="route-stop">
                        <div className="stop-dot"></div>
                        <div className="stop-details">
                          <strong>{stop.stop}</strong>
                          <span className="muted">{stop.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p>{bus.from} → {bus.to} | ₹{bus.fare}</p>
                  <p>Departure: {bus.departure}, Arrival: {bus.arrival} | Duration: {calcDuration(bus.departure, bus.arrival)}</p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setSelectedBus(bus)}>Book Now</button>
                    <button onClick={() => openMapForBus(bus)}>Open Map</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Seat booking section */}
      {selectedBus && (
        <div className="seat-booking-section">
          <h3>{selectedBus.name} ({selectedBus.type})</h3>
          <p>{selectedBus.from} → {selectedBus.to} | ₹{selectedBus.fare} max fare</p>

          {routeSegment && (
            <div className="route-map-container" style={{ margin: "1rem 0" }}>
              <h4>Route Preview</h4>
              <MapContainer center={[15.9129, 79.74]} zoom={6} style={{ height: "300px", width: "100%", borderRadius: "10px" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {routeSegment.map((stop, index) => (
                  <Marker key={index} position={[stop.lat, stop.lng]} title={stop.stop} />
                ))}
                <Polyline positions={routeSegment.map((s) => [s.lat, s.lng])} color="blue" weight={4} />
                <FitBoundsOnRoute stops={routeSegment} />
              </MapContainer>
            </div>
          )}

          <div className="seats-grid">{renderSeatLayout()}</div>

          {selectedSeats.length > 0 && <div className="selected-seats-info">Selected Seats: {selectedSeats.join(", ")}</div>}

          {/* Passenger details */}
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

            <select
              value={boardingPoint}
              onChange={(e) => {
                setBoardingPoint(e.target.value);
                setDroppingPoint("");
              }}
            >
              <option value="">Select Boarding Point</option>
              {selectedBus.routeStops.map((stop, i) => (
                <option key={i} value={stop.stop}>{stop.stop} ({stop.time})</option>
              ))}
            </select>

            <select
              value={droppingPoint}
              onChange={(e) => setDroppingPoint(e.target.value)}
              disabled={!boardingPoint}
            >
              <option value="">Select Dropping Point</option>
              {selectedBus.routeStops
                .slice(selectedBus.routeStops.findIndex((s) => s.stop === boardingPoint) + 1)
                .map((stop, i) => (
                  <option key={i} value={stop.stop}>{stop.stop} ({stop.time})</option>
                ))}
            </select>

            {boardingPoint && droppingPoint && (
              <p className="fare-info">
                Per Seat Fare for this route: ₹{calculateSplitFare(selectedBus, boardingPoint, droppingPoint)}
              </p>
            )}

            {!showPayment ? (
              <button onClick={handleProceedToPayment}>Proceed to Payment</button>
            ) : (
              <div className="payment-section">
                <label>
                  Select UPI App:
                  <select value={upiApp} onChange={(e) => setUpiApp(e.target.value)}>
                    <option value="">--Choose UPI App--</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Paytm">Paytm</option>
                  </select>
                </label>
                <button onClick={handleConfirmBooking} style={{ marginTop: "1rem" }}>Pay</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
