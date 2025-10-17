import React, { useState, useEffect } from "react";
import "./admin.css";

export default function RouteManagement() {
  const [routes, setRoutes] = useState(() => JSON.parse(localStorage.getItem("routes")) || []);
  const [newRoute, setNewRoute] = useState({ from: "", to: "", distance: "" });

  useEffect(() => {
    localStorage.setItem("routes", JSON.stringify(routes));
  }, [routes]);

  const addRoute = () => {
    if (!newRoute.from || !newRoute.to || !newRoute.distance)
      return alert("Please fill all fields");

    const route = { id: Date.now(), ...newRoute };
    setRoutes([...routes, route]);
    setNewRoute({ from: "", to: "", distance: "" });
  };

  const deleteRoute = (id) => setRoutes(routes.filter((r) => r.id !== id));

  return (
    <div>
      <h2>🗺️ Route Management</h2>
      <div className="admin-form">
        <input placeholder="From" value={newRoute.from} onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })} />
        <input placeholder="To" value={newRoute.to} onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })} />
        <input placeholder="Distance (km)" type="number" value={newRoute.distance} onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })} />
        <button onClick={addRoute}>Add Route</button>
      </div>
      <ul className="admin-list">
        {routes.map((route) => (
          <li key={route.id}>
            <span>{route.from} → {route.to} ({route.distance} km)</span>
            <button onClick={() => deleteRoute(route.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
