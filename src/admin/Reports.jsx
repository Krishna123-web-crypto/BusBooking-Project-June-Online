import React, { useEffect, useState } from "react";
export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(allBookings);

    const revenue = allBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
    setTotalRevenue(revenue);
  }, []);
  return (
    <div>
      <h2>📊 Reports & Analytics</h2>
      <p>Total Bookings: {bookings.length}</p>
      <p>Total Revenue: ₹{totalRevenue}</p>
    </div>
  );
}
