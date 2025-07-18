import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61244.png",
  iconSize: [30, 30],
});
export default function LiveBusTracker({ bus }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < bus.routeStops.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(interval); 
          return prevIndex;
        }
      });
    }, 1800000); 
    return () => clearInterval(interval);
  }, [bus.routeStops]);
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
