import { useState, useEffect } from 'react';

// [BLUEPRINT] Travel Thresholds
const TRAVEL_SPEED_THRESHOLD_MPS = 8.9; // ~20 mph (Vehicle detection)
const TRAVEL_DISTANCE_KM = 48; // Fiqh distance for Qasr

export const useTravelDetection = () => {
  const [isTraveling, setIsTraveling] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [homeLocation, setHomeLocation] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: gpsSpeed } = position.coords;
        setSpeed(gpsSpeed || 0);

        if (!homeLocation) {
          setHomeLocation({ lat: latitude, lon: longitude });
          return;
        }

        const dist = calculateDistance(
          homeLocation.lat, homeLocation.lon,
          latitude, longitude
        );

        if (dist > TRAVEL_DISTANCE_KM || (gpsSpeed || 0) > TRAVEL_SPEED_THRESHOLD_MPS) {
          setIsTraveling(true);
        } else {
          setIsTraveling(false);
        }
      },
      (err) => console.error('GPS Error', err),
      { enableHighAccuracy: false, timeout: 5000 } 
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [homeLocation]);

  return { isTraveling, speed };
};

// Helper: Haversine Distance in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}