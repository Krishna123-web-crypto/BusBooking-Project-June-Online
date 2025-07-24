import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/MapModal.css";
export default function MapModal({ buses, onClose }) {
  const routeStops = buses?.[0]?.routeStops || [];
  const center = routeStops.length > 0
    ? [routeStops[0].lat, routeStops[0].lng]
    : [17.385, 78.4867]; 
  const positions = routeStops.map(stop => [stop.lat, stop.lng]);
  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="close-map-btn" onClick={onClose}>×</button>
        <MapContainer center={center} zoom={8} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {positions.length > 1 && <Polyline positions={positions} color="blue" />}
          {routeStops.map((stop, idx) => (
            <Marker key={idx} position={[stop.lat, stop.lng]}>
              <Popup>
                <strong>{stop.stop}</strong><br />
                Arrival: {stop.time}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
