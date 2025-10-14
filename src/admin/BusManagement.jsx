import React, { useState, useEffect } from "react";
import sampleBuses from "../data/buses";

export default function BusManagement() {
  const [buses, setBuses] = useState(() => JSON.parse(localStorage.getItem("buses")) || sampleBuses);

  useEffect(() => {
    localStorage.setItem("buses", JSON.stringify(buses));
  }, [buses]);

  const deleteBus = (id) => setBuses(buses.filter((b) => b.id !== id));

  return (
    <div>
      <h2>🚌 Bus Management</h2>
      <ul>
        {buses.map((bus) => (
          <li key={bus.id}>
            {bus.name} ({bus.from} → {bus.to}) – ₹{bus.fare}
            <button
              onClick={() => deleteBus(bus.id)}
              style={{ marginLeft: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
