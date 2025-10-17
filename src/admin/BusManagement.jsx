import React, { useState, useEffect } from "react";
import sampleBuses from "../data/buses";
import "./admin.css";
export default function BusManagement() {
  // Load buses from localStorage or default to sampleBuses
  const [buses, setBuses] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("buses"));
    return stored && stored.length > 0 ? stored : sampleBuses;
  });
  const [newBus, setNewBus] = useState({ name: "", from: "", to: "", fare: "" });
  useEffect(() => {
    localStorage.setItem("buses", JSON.stringify(buses));
  }, [buses]);
  const addBus = () => {
    if (!newBus.name || !newBus.from || !newBus.to || !newBus.fare)
      return alert("Please fill all fields");
    const bus = {
      id: Date.now(),
      ...newBus,
      fare: parseFloat(newBus.fare),
      totalSeats: 42,
    };
    setBuses([...buses, bus]);
    setNewBus({ name: "", from: "", to: "", fare: "" });
  };
  const deleteBus = (id) => {
    setBuses(buses.filter((b) => b.id !== id));
  };

  return (
    <div className="bus-management-container">
      <h2>🚌 Bus Management</h2>
      {/* Form for adding new bus */}
      <div className="admin-form">
        <input
          placeholder="Bus Name"
          value={newBus.name}
          onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
        />
        <input
          placeholder="From"
          value={newBus.from}
          onChange={(e) => setNewBus({ ...newBus, from: e.target.value })}
        />
        <input
          placeholder="To"
          value={newBus.to}
          onChange={(e) => setNewBus({ ...newBus, to: e.target.value })}
        />
        <input
          placeholder="Fare"
          type="number"
          value={newBus.fare}
          onChange={(e) => setNewBus({ ...newBus, fare: e.target.value })}
        />
        <button onClick={addBus}>Add Bus</button>
      </div>
      {/* Table showing all buses */}
      <div className="table-container">
        {buses.length > 0 ? (
          <table className="bus-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Bus Name</th>
                <th>From</th>
                <th>To</th>
                <th>Fare (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, index) => (
                <tr key={bus.id || index}>
                  <td>{index + 1}</td>
                  <td>{bus.name}</td>
                  <td>{bus.from}</td>
                  <td>{bus.to}</td>
                  <td>{bus.fare}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteBus(bus.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No buses available. Add one above!</p>
        )}
      </div>
    </div>
  );
}