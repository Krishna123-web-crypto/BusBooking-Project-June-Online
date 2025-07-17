import React, { createContext, useState } from "react";
export const BookingContext = createContext();
export const BookingProvider = ({ children }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const selectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setBookedSeats(bus.bookedSeats || []);
  };
  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  const confirmBooking = () => {
    const updatedSeats = [...bookedSeats, ...selectedSeats];
    setBookedSeats(updatedSeats);
    alert(`Booking Confirmed! Seats: ${selectedSeats.join(", ")}`);
    setSelectedSeats([]);
  };
  return (
    <BookingContext.Provider
      value={{
        selectedBus,
        selectedSeats,
        bookedSeats,
        selectBus,
        toggleSeat,
        confirmBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
