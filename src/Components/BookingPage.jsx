import React, { useState, useEffect, useMemo } from "react";
import SearchForm from "../Components/SearchForm"; // expects props: onSearch({ from, to, date, busType })
import "../assets/BookingPage.css";
const sampleBuses = [
  { id: 1, name: "Garuda", type: "AC", departure: "9:00 PM", arrival: "6:00 AM", fare: 500 , from: "Hyderabad", to: "Vijayawada"},
  { id: 2, name: "Garuda Plus", type: "Non-AC", departure: "6:00 AM", arrival: "2:00 PM", fare: 600 ,  from: "Hyderabad", to: "Tirupati"},
  { id: 3, name: "Amaravati", type: "AC", departure: "5:00 PM", arrival: "11:00 PM", fare: 550 , from: "Vijayawada", to: "Rajampet"},
  { id: 4, name: "Ultra Deluxe", type: "Non-AC", departure: "5:00 AM", arrival: "8:30 AM", fare: 400 , from: "Tirupati", to: "Rajampet",},
  { id: 5, name: "Vennela", type: "AC", departure: "7:30 PM", arrival: "6:00 AM", fare: 600 ,  from: "Hyderabad", to: "Rajampet"},
  { id: 6, name: "Super Luxury", type: "AC", departure: "8:00 PM", arrival: "5:00 AM", fare: 500 , from: "Vijayawada", to: "Hyderabad"},
  { id: 7, name: "Express", type: "Non-AC", departure: "9:00 PM", arrival: "6:30 AM", fare: 480 , from: "Vijayawada", to: "Tirupati" },
  { id: 8, name: "Telangana Express", type: "Non-AC", departure: "6:30 PM", arrival: "5:00 AM", fare: 600 , from: "Rajampet", to: "Hyderabad"},
  { id: 9, name: "Krishna Express", type: "AC", departure: "7:00 PM", arrival: "5:30 AM", fare: 530 , from: "Rajampet", to: "Vijayawada"},
  { id: 10, name: "Tirupati Rajadhani", type: "Non-AC", departure: "6:00 PM", arrival: "9:00 PM", fare: 200 , from: "Rajampet", to: "Tirupati"},
];
const LS_KEY = "bookedSeatsByBus";
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
  const [buses, setBuses] = useState([]);
  const [journeyDetails, setJourneyDetails] = useState(null); // {from,to,date,busType}
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(() => loadBookedSeats()); // { [busId]: [seatNums] }
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  useEffect(() => {
    saveBookedSeats(bookedSeats);
  }, [bookedSeats]);
  const handleSearch = ({ from, to, date, busType }) => {
    const results = sampleBuses.filter(
      (bus) => busType === "All" || bus.type === busType
    );
    setBuses(results);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
    setPassengerPhone("");
    setShowPayment(false);
    setPaymentMethod("");
    setJourneyDetails({ from, to, date, busType });
  };
  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setShowPayment(false);
    setPaymentMethod("");
  };
  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };
  const isSeatBooked = (busId, seat) => (bookedSeats[busId] || []).includes(seat);
  const totalSeatsPerBus = 36;
  const seatRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      const start = i * 4 + 1;
      rows.push([start, start + 1, start + 2, start + 3]);
    }
    rows.push([33, 34, 35, 36]);
    return rows;
  }, []);
  const handleProceedToPayment = () => {
    if (
      !selectedBus ||
      !passengerName.trim() ||
      !passengerEmail.trim() ||
      !passengerPhone.trim() ||
      selectedSeats.length === 0
    ) {
      alert("Please fill all passenger details and select at least one seat.");
      return;
    }
    setShowPayment(true);
  };
  const handleBookingConfirm = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    const busId = selectedBus.id;
    const existing = bookedSeats[busId] || [];
    const updated = [...new Set([...existing, ...selectedSeats])];
    const newBookedSeats = { ...bookedSeats, [busId]: updated };
    setBookedSeats(newBookedSeats);
    alert(`✅ Booking Confirmed via ${paymentMethod}!
Route: ${journeyDetails?.from} → ${journeyDetails?.to}
Date: ${journeyDetails?.date}
Bus: ${selectedBus.name}
Seats: ${selectedSeats.join(", ")}
Passenger: ${passengerName} (${passengerEmail}, ${passengerPhone})
Total: ₹${selectedSeats.length * selectedBus.fare}`);
    setSelectedSeats([]);
    setPassengerName("");
    setPassengerEmail("");
    setPassengerPhone("");
    setShowPayment(false);
    setPaymentMethod("");
  };
  return (
    <div className="booking-container">
      <SearchForm onSearch={handleSearch} />
      {buses.length > 0 && !selectedBus && (
        <div className="bus-list">
          {buses.map((bus) => {
            const taken = (bookedSeats[bus.id] || []).length;
            const available = totalSeatsPerBus - taken;
            return (
              <div key={bus.id} className="bus-card">
                <h3>
                  {bus.name} ({bus.type})
                </h3>
                {journeyDetails && (
                  <p>
                    {journeyDetails.from} → {journeyDetails.to} on {journeyDetails.date}
                  </p>
                )}
                <p>
                  {bus.departure} - {bus.arrival}
                </p>
                <p>Fare: ₹{bus.fare} per seat</p>
                <p>
                  Available: {available} / {totalSeatsPerBus}
                </p>
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
      )}
      {selectedBus && journeyDetails && (
        <>
          <div className="journey-info">
            <h4>Journey Details</h4>
            <p>
              <strong>From:</strong> {journeyDetails.from}
            </p>
            <p>
              <strong>To:</strong> {journeyDetails.to}
            </p>
            <p>
              <strong>Date:</strong> {journeyDetails.date}
            </p>
          </div>
          <div className="seat-selection">
            <h2>{selectedBus.name} – Seat Selection</h2>
            <p>Fare per seat: ₹{selectedBus.fare}</p>
            <div className="seats-layout">
              {seatRows.map((row, rowIndex) => {
                const isBackRow = rowIndex === seatRows.length - 1;
                return (
                  <div key={rowIndex} className="seat-row">
                    {/* Left pair for first 8 rows */}
                    {!isBackRow &&
                      row.slice(0, 2).map((seat) => {
                        const booked = isSeatBooked(selectedBus.id, seat);
                        const selected = selectedSeats.includes(seat);
                        return (
                          <button
                            key={seat}
                            className={
                              "seat" +
                              (selected ? " selected" : "") +
                              (booked ? " booked" : "")
                            }
                            disabled={booked}
                            onClick={() => handleSeatSelect(seat)}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    {!isBackRow && <div className="aisle" />}
                    {(isBackRow ? row : row.slice(2)).map((seat) => {
                      const booked = isSeatBooked(selectedBus.id, seat);
                      const selected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          className={
                            "seat" +
                            (selected ? " selected" : "") +
                            (booked ? " booked" : "")
                          }
                          disabled={booked}
                          onClick={() => handleSeatSelect(seat)}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="contact-form-box">
              <h3>Passenger Contact</h3>
              <form
                className="contact-form inline-passenger"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Name"
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
              </form>
            </div>
            <div className="summary">
              <p>
                <strong>Selected Seats:</strong>{" "}
                {selectedSeats.join(", ") || "None"}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {selectedSeats.length * selectedBus.fare}
              </p>
              {!showPayment ? (
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                >
                  Proceed to Payment
                </button>
              ) : (
                <div className="payment-section">
                  <h3>Select Payment Method</h3>
                  <div className="payment-options">
                    <label>
                      <input
                        type="radio"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      UPI (PhonePe / Paytm)
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="Card"
                        checked={paymentMethod === "Card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      Credit/Debit Card
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="NetBanking"
                        checked={paymentMethod === "NetBanking"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      NetBanking
                    </label>
                  </div>
                  <button onClick={handleBookingConfirm} disabled={!paymentMethod}>
                    Confirm &amp; Pay ₹{selectedSeats.length * selectedBus.fare}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

