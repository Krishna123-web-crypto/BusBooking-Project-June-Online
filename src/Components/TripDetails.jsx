import React, { useMemo } from "react";
import "../assets/TripDetails.css";
function parseTime(timeStr) {
  if (!timeStr) return null;
  const [time, mer] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mer?.toUpperCase() === "PM" && h !== 12) h += 12;
  if (mer?.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + (m || 0);
}
export default function TripDetails({ stops = [], currentIndex = -1 }) {
  const now = useMemo(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }, []);
  return (
    <div className="trip-details">
      <div className="trip-header">
        <div>Arrival</div>
        <div>Stop Name</div>
        <div>Departure</div>
        <div>Status</div>
        <div>ETA</div>
      </div>
      {stops.map((s, i) => {
        const stopTime = parseTime(s.time);
        let status = "Upcoming";
        if (i < currentIndex) status = "Left";
        else if (i === currentIndex) status = "Current Stop";
        let eta = "-";
        if (status === "Upcoming" && stopTime != null) {
          const diff = stopTime - now;
          if (diff > 0) eta = `${Math.floor(diff / 60)}h ${diff % 60}m`;
        }
        return (
          <div key={i} className={`trip-row ${i === currentIndex ? "highlight-row" : ""}`}>
            <div>{s.arrival || s.time || "-"}</div>
            <div>{s.stop}</div>
            <div>{s.departure || s.time || "-"}</div>
            <div>{status}</div>
            <div>{eta}</div>
          </div>
        );
      })}
    </div>
  );
}
