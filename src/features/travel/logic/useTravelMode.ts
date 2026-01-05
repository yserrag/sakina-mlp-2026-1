import { useState, useEffect } from 'react';
import { SovereignStorage, STORAGE_KEYS } from '../../../shared/lib/storage';

const TRAVEL_THRESHOLD_KM = 80;

// Helper functions placed before usage or defined as valid function declarations
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export const useTravelMode = () => {
  const [isTraveler, setIsTraveler] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkTravelStatus = async () => {
      // FIX: Added ': any' to prevent TypeScript from complaining about .lat/.lng
      const home: any = await SovereignStorage.load(STORAGE_KEYS.HOME_LOCATION, null);
      
      if (!home) return; 

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const dist = calculateDistance(home.lat, home.lng, current.lat, current.lng);
          
          setDistance(Math.round(dist));
          
          if (dist > TRAVEL_THRESHOLD_KM) {
            console.log(`TRAVEL MODE ACTIVE: Distance is ${dist}km`);
            setIsTraveler(true);
          } else {
            console.log(`HOME MODE: Distance is ${dist}km`);
            setIsTraveler(false);
          }
        },
        (err) => console.error("Location Error:", err)
      );
    };

    checkTravelStatus();
  }, []);

  return { isTraveler, distance };
};