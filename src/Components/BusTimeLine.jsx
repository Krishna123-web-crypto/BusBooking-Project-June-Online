import React from "react";
import "../assets/BusTimeline.css";
export default function BusTimeline({ stops }) {
  return (
    <div className="timeline-container">
      {stops.map((stop, index) => (
        <div className="timeline-item" key={index}>
          <div className="timeline-time">
            {stop.time ? stop.time : "--"}
          </div>
          <div className="timeline-line-wrapper">
            <span className="dot"></span>
            {index !== stops.length - 1 && <span className="line"></span>}
          </div>
          <div className="timeline-stop">
            {stop.stop}
          </div>
        </div>
      ))}
    </div>
  );
}
