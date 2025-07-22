import React from "react";
import "../assets/TripDetails.css";

export default function TripDetails({ stops = [], currentIndex = -1 }) {
  return (
    <div className="trip-timeline">
      {stops.map((stop, index) => {
        const isActive = index === currentIndex;
        return (
          <div key={index} className={`timeline-item ${isActive ? "active" : ""}`}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h4>{stop.stop || stop.stopName}</h4>
              <p>
                <strong>Arrival:</strong> {stop.arrival || stop.time || "-"} <br />
                <strong>Departure:</strong> {stop.departure || stop.time || "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
