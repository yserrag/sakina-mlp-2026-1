import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { PrayerEngine } from '@/services/PrayerEngine';
import { usePrayerTimes } from '@/features/prayer/hooks/usePrayerTimes';

export const PrayerWidget: React.FC = () => {
  // [FACTS]: Fixed destructuring to match updated hook
  const { location, loading } = usePrayerTimes(); 
  
  const times = useMemo(() => {
    if (!location) return null;
    return PrayerEngine.calculate(location.lat, location.lng);
  }, [location.lat, location.lng]);

  if (loading || !times) return <Card className="p-6 animate-pulse bg-slate-900/40">Loading...</Card>;

  return (
    <Card className="p-6 bg-slate-900/80 backdrop-blur-xl border-white/5">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(times).map(([name, time]) => (
          <div key={name} className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase font-black text-slate-500">{name}</span>
            <span className="text-sm font-bold text-white">{time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};