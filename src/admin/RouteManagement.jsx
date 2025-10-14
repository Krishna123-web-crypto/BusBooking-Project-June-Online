import React, { useState, useEffect } from "react";

export default function RouteManagement() {
  const [routes, setRoutes] = useState(JSON.parse(localStorage.getItem("routes")) || []);
  const [newRoute, setNewRoute] = useState({ from: "", to: "", distance: "" });

  useEffect(() => {
    localStorage.setItem("routes", JSON.stringify(routes));
  }, [routes]);

  const addRoute = () => {
    if (!newRoute.from || !newRoute.to) return alert("Enter valid route");
    setRoutes([...routes, { id: Date.now(), ...newRoute }]);
    setNewRoute({ from: "", to: "", distance: "" });
  };

  const deleteRoute = (id) => setRoutes(routes.filter((r) => r.id !== id));

  return (
    <div>
      <h2>🗺️ Route Management</h2>
      <div>
        <input placeholder="From" value={newRoute.from} onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })} />
        <input placeholder="To" value={newRoute.to} onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })} />
        <input placeholder="Distance (km)" type="number" value={newRoute.distance} onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })} />
        <button onClick={addRoute}>Add Route</button>
      </div>

      <ul>
        {routes.map((r) => (
          <li key={r.id}>
            {r.from} → {r.to} ({r.distance} km)
            <button onClick={() => deleteRoute(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
