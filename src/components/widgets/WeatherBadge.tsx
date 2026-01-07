import React from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';

export const WeatherBadge = () => {
  // [PHASE 1] Static Placeholder
  // In Phase 2, we will hook this to the OpenWeather API
  return (
    <div className="bg-slate-900 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
      <CloudRain className="w-3 h-3 text-emerald-400" />
      <span className="text-xs text-white">London</span>
      <span className="text-xs text-emerald-400 font-bold">12°C</span>
    </div>
  );
};