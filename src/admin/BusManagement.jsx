import React, { useState, useEffect } from "react";
export default function BusManagement() {
  const [buses, setBuses] = useState(JSON.parse(localStorage.getItem("buses")) || []);
  const [newBus, setNewBus] = useState({ name: "", type: "", seats: 40, route: "", fare: "" });

  useEffect(() => {
    localStorage.setItem("buses", JSON.stringify(buses));
  }, [buses]);

  const addBus = () => {
    if (!newBus.name || !newBus.route) return alert("Please fill all fields");
    setBuses([...buses, { id: Date.now(), ...newBus }]);
    setNewBus({ name: "", type: "", seats: 40, route: "", fare: "" });
  };

  const deleteBus = (id) => setBuses(buses.filter((b) => b.id !== id));

  return (
    <div>
      <h2>🚌 Bus Management</h2>
      <div>
        <input placeholder="Bus Name" value={newBus.name} onChange={(e) => setNewBus({ ...newBus, name: e.target.value })} />
        <input placeholder="Type" value={newBus.type} onChange={(e) => setNewBus({ ...newBus, type: e.target.value })} />
        <input placeholder="Seats" type="number" value={newBus.seats} onChange={(e) => setNewBus({ ...newBus, seats: e.target.value })} />
        <input placeholder="Route" value={newBus.route} onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} />
        <input placeholder="Fare" type="number" value={newBus.fare} onChange={(e) => setNewBus({ ...newBus, fare: e.target.value })} />
        <button onClick={addBus}>Add Bus</button>
      </div>

      <ul>
        {buses.map((bus) => (
          <li key={bus.id}>
            {bus.name} ({bus.route}) – ₹{bus.fare}
            <button onClick={() => deleteBus(bus.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
