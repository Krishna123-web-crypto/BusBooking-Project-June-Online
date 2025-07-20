import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61244.png",
  iconSize: [30, 30],
});
export default function LiveBusTracker({ bus, onStopChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex < bus.routeStops.length - 1 ? prevIndex + 1 : prevIndex;
        if (newIndex !== prevIndex && onStopChange) {
          onStopChange(newIndex); // Notify parent about current stop
        }
        if (newIndex === prevIndex && prevIndex === bus.routeStops.length - 1) {
          clearInterval(interval);
        }
        return newIndex;
      });
    }, 1800000); 
    return () => clearInterval(interval);
  }, [bus.routeStops, onStopChange]);
  const busPosition = bus.routeStops[currentIndex];
  return (
    <Marker position={[busPosition.lat, busPosition.lng]} icon={busIcon}>
      <Popup>
        Live Location: <strong>{busPosition.stop}</strong>
        <br />
        Time: {busPosition.time}
      </Popup>
    </Marker>
  );
}
