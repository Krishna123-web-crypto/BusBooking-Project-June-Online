import React, { useState, useEffect } from "react";
import sampleBuses from "../data/buses";
import "./admin.css";
export default function BusManagement() {
  const [buses, setBuses] = useState(() => JSON.parse(localStorage.getItem("buses")) || []);
  const [newBus, setNewBus] = useState({ name: "", from: "", to: "", fare: "" });
  useEffect(() => {
    localStorage.setItem("buses", JSON.stringify(buses));
  }, [buses]);
  const addBus = () => {
    if (!newBus.name || !newBus.from || !newBus.to || !newBus.fare)
      return alert("Please fill all fields");
    const bus = { id: Date.now(), ...newBus, fare: parseFloat(newBus.fare), totalSeats: 42 };
    setBuses([...buses, bus]);
    setNewBus({ name: "", from: "", to: "", fare: "" });
  };
  const deleteBus = (id) => setBuses(buses.filter((b) => b.id !== id));
  return (
    <div>
      <h2>🚌 Bus Management</h2>
      <div className="admin-form">
        <input placeholder="Bus Name" value={newBus.name} onChange={(e) => setNewBus({ ...newBus, name: e.target.value })} />
        <input placeholder="From" value={newBus.from} onChange={(e) => setNewBus({ ...newBus, from: e.target.value })} />
        <input placeholder="To" value={newBus.to} onChange={(e) => setNewBus({ ...newBus, to: e.target.value })} />
        <input placeholder="Fare" type="number" value={newBus.fare} onChange={(e) => setNewBus({ ...newBus, fare: e.target.value })} />
        <button onClick={addBus}>Add Bus</button>
      </div>

      <ul className="admin-list">
        {buses.map((bus) => (
          <li key={bus.id}>
            <span><strong>{bus.name}</strong> ({bus.from} → {bus.to}) – ₹{bus.fare}</span>
            <button onClick={() => deleteBus(bus.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

