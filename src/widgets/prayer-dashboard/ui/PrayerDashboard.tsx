import React, { useEffect, useState, useMemo } from 'react';
import { Clock, AlertCircle, Sun, Moon, Sunrise, ArrowRight } from 'lucide-react';
import { getPrayerCalculations } from '../../../entities/prayer-times/lib/calculations';

export const PrayerDashboard = () => {
  // MLP Strategy: Using local coordinates for "Offline-First" availability 
  const [location, setLocation] = useState({ lat: 51.5074, lng: -0.1278 }); // Default: London
  const [now, setNow] = useState(new Date());

  const { times, forbidden } = useMemo(() => 
    getPrayerCalculations(location.lat, location.lng), [location, now.toDateString()]
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current time falls within a Forbidden Zone (Makruh) [cite: 153]
  const activeForbidden = forbidden.find(zone => now >= zone.start && now <= zone.end);

  return (
    <div className={`relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-700 backdrop-blur-xl 
      ${activeForbidden 
        ? 'bg-rose-900/20 border-rose-500/30 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]' 
        : 'bg-white/5 border-white/10 shadow-2xl'}`}>
      
      {/* Background Ambience */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors 
        ${activeForbidden ? 'bg-rose-500/20' : 'bg-blue-500/10'}`} />

      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${activeForbidden ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {activeForbidden ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            {activeForbidden ? 'Forbidden Time' : 'Next Prayer'}
          </span>
        </div>
        <div className="text-right">
          <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-tighter">
            {activeForbidden ? activeForbidden.name : times.nextPrayer().toUpperCase()}
          </h2>
        </div>
      </header>

      {/* Main Clock / Countdown Area */}
      <div className="flex flex-col items-center py-4">
        <span className={`text-6xl font-black tracking-tighter mb-2 transition-colors 
          ${activeForbidden ? 'text-rose-100' : 'text-white'}`}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <p className={`text-sm font-medium ${activeForbidden ? 'text-rose-400' : 'text-emerald-400'}`}>
          {activeForbidden ? activeForbidden.message : `Time until ${times.nextPrayer()}`}
        </p>
      </div>

      {/* Horizontal Prayer Ribbon */}
      <div className="grid grid-cols-5 gap-2 mt-8">
        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
          const isNext = times.nextPrayer().toLowerCase() === p.toLowerCase();
          return (
            <div key={p} className={`flex flex-col items-center p-3 rounded-2xl border transition-all 
              ${isNext ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent opacity-40'}`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">{p}</span>
              <span className="text-xs font-medium text-white">
                {times[p.toLowerCase()].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};