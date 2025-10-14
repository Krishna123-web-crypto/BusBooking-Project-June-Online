import React, { useState } from "react";

export default function BusManagement() {
  const [buses, setBuses] = useState(busesData);

  const deleteBus = (id) => {
    setBuses(buses.filter((b) => b.id !== id));
  };

  return (
    <div>
      <h2>🚌 Bus Management</h2>
      <ul>
        {buses.map((bus) => (
          <li key={bus.id}>
            {bus.name} ({bus.route}) – ₹{bus.fare}
            <button
              onClick={() => deleteBus(bus.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
