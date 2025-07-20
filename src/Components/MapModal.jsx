import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import LiveBusTracker from "../Components/LiveBustracker";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
export default function MapModal({ bus, onClose }) {
  const center = bus.routeStops?.[0]
    ? [bus.routeStops[0].lat, bus.routeStops[0].lng]
    : [17.385, 78.4867]; 
    return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="map-modal-close" onClick={onClose}>✕ Close</button>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          {bus.name} – Route Map
        </h3>
        <MapContainer
          style={{ height: "400px", width: "100%" }}
          center={center}
          zoom={7}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={bus.routeStops.map((s) => [s.lat, s.lng])} color="blue" />
          {bus.routeStops.map((stop, i) => (
            <Marker key={i} position={[stop.lat, stop.lng]}>
              <Popup>{stop.stop} - {stop.time}</Popup>
            </Marker>
          ))}
          <LiveBusTracker bus={bus} />
        </MapContainer>
      </div>
    </div>
  );
}
