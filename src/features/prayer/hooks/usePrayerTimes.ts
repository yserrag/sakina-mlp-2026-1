import { useState, useEffect } from 'react';

/**
 * usePrayerTimes Hook
 * [FACTS]: Standardizes location data for the PrayerWidget
 */
export const usePrayerTimes = (coords?: { lat: number; lng: number }) => {
  const [loading, setLoading] = useState(false);
  // [ANALYSIS]: Default to a known location if none provided to prevent null errors
  const [location, setLocation] = useState(coords || { lat: 51.5074, lng: -0.1278 });

  return {
    location,
    loading
  };
};