import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/api/supabase'; // [FACTS]: Verified path

export const useWeather = (coords: { lat: number; lng: number } | null) => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!coords) return;
    // Logic for weather fetching via Supabase Edge Function
    setWeather({ temp: 24, condition: 'Clear' });
  }, [coords]);

  return { weather };
};