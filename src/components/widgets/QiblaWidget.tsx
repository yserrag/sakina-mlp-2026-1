import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card'; // [FACTS]: Verified import path
import { QiblaEngine } from '@/services/QiblaEngine'; // [FACTS]: Using corrected engine
import { usePrayerTimes } from '@/features/prayer/hooks/usePrayerTimes';
import { Compass, Navigation2, RefreshCw } from 'lucide-react';

/**
 * QiblaWidget Component
 * [ANALYSIS]: Maps geographic coordinates to a high-fidelity compass UI.
 */
export const QiblaWidget: React.FC = () => {
  const { location } = usePrayerTimes();
  const [qiblaDir, setQiblaDir] = useState<number | null>(null);

  useEffect(() => {
    if (location) {
      // [FACTS]: Calling the verified static engine method
      const dir = QiblaEngine.calculateDirection(location.lat, location.lng);
      setQiblaDir(dir);
    }
  }, [location?.lat, location?.lng]);

  return (
    <Card className="p-6 bg-slate-900/60 backdrop-blur-2xl border-white/5 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-serif font-bold text-white text-lg">Qibla Direction</h3>
          <p className="text-[10px] text-teal-400 uppercase font-black tracking-widest">Holy City Alignment</p>
        </div>
        <Compass className="w-5 h-5 text-teal-400" />
      </div>

      <div className="relative flex justify-center py-8">
        {/* Outer Decorative Ring */}
        <div className="w-44 h-44 rounded-full border-2 border-white/5 flex items-center justify-center relative shadow-[0_0_50px_-12px_rgba(20,184,166,0.15)]">
          
          {/* Degree Markers [ANALYSIS]: Restoring high-fidelity typography */}
          {[0, 90, 180, 270].map((deg) => (
            <span 
              key={deg} 
              className="absolute text-[8px] font-black text-slate-700"
              style={{ 
                transform: `rotate(${deg}deg) translateY(-18px)`,
                top: '50%',
                left: '50%',
                marginTop: '-4px',
                marginLeft: '-4px'
              }}
            >
              {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
            </span>
          ))}

          {/* Qibla Pointer */}
          <div 
            className="transition-transform duration-700 ease-out flex flex-col items-center"
            style={{ transform: `rotate(${qiblaDir || 0}deg)` }}
          >
            <Navigation2 className="w-10 h-10 text-teal-500 fill-teal-500/20 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            <div className="w-0.5 h-12 bg-gradient-to-t from-teal-500/40 to-transparent -mt-1 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Bearing to Kaaba</p>
          <p className="text-2xl font-black text-white tabular-nums">
            {qiblaDir ? `${qiblaDir.toFixed(1)}°` : '--°'}
          </p>
        </div>
        <button 
          onClick={() => setQiblaDir(null)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <RefreshCw className="w-4 h-4 text-slate-600 group-active:animate-spin" />
        </button>
      </div>
    </Card>
  );
};