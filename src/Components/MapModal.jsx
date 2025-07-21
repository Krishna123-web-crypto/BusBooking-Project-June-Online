import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
const getRandomColor = () => {
  const colors = ["red", "green", "blue", "orange", "purple", "teal"];
  return colors[Math.floor(Math.random() * colors.length)];
};
export default function MapModal({ buses, onClose }) {
  const center = buses?.[0]?.routeStops?.[0]
    ? [buses[0].routeStops[0].lat, buses[0].routeStops[0].lng]
    : [17.385, 78.4867];
    return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="map-modal-close" onClick={onClose}>✕ Close</button>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Bus Routes – Meeting Point Map
        </h3>
        <MapContainer
          style={{ height: "400px", width: "100%" }}
          center={center}
          zoom={7}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {buses.map((bus, busIndex) => (
            <Polyline
              key={busIndex}
              positions={bus.routeStops.map((s) => [s.lat, s.lng])}
              color={getRandomColor()}
            />
          ))}
          {buses.map((bus, busIndex) =>
            bus.routeStops.map((stop, i) => (
              <Marker key={`${busIndex}-${i}`} position={[stop.lat, stop.lng]}>
                <Popup>
                  <b>{bus.name}</b><br />
                  {stop.stop} - {stop.time}
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
}
