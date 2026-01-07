import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const DHIKR_PRESETS = [
  { id: 'subhanallah', label: 'SubhanAllah', target: 33, color: 'text-emerald-400', bg: 'bg-emerald-500' },
  { id: 'alhamdulillah', label: 'Alhamdulillah', target: 33, color: 'text-amber-400', bg: 'bg-amber-500' },
  { id: 'allahuakbar', label: 'Allahu Akbar', target: 34, color: 'text-rose-400', bg: 'bg-rose-500' },
  { id: 'istighfar', label: 'Astaghfirullah', target: 100, color: 'text-blue-400', bg: 'bg-blue-500' },
];

export const SmartDhikr = () => {
  const [activeDhikr, setActiveDhikr] = useState(0); // Index of current preset
  const [count, setCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('sakina_dhikr_count');
    const savedIndex = localStorage.getItem('sakina_dhikr_index');
    if (saved) setCount(parseInt(saved));
    if (savedIndex) setActiveDhikr(parseInt(savedIndex));
  }, []);

  // Save progress on change
  useEffect(() => {
    localStorage.setItem('sakina_dhikr_count', count.toString());
    localStorage.setItem('sakina_dhikr_index', activeDhikr.toString());
  }, [count, activeDhikr]);

  const current = DHIKR_PRESETS[activeDhikr];
  const progress = Math.min((count / current.target) * 100, 100);

  const handleTap = () => {
    // 1. Haptic Feedback (Vibration)
    if (navigator.vibrate) {
      navigator.vibrate(15); // Short sharp tick
    }

    // 2. Increment
    const newCount = count + 1;
    setCount(newCount);
    setSessionTotal(p => p + 1);

    // 3. Cycle if target reached
    if (newCount === current.target) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Success vibration
    }
  };

  const reset = () => {
    setCount(0);
  };

  const nextDhikr = () => {
    setCount(0);
    setActiveDhikr((prev) => (prev + 1) % DHIKR_PRESETS.length);
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[300px] relative">
      
      {/* BACKGROUND GLOW */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${current.bg} blur-[100px] opacity-10 pointer-events-none transition-colors duration-500`} />

      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1.5 rounded-lg">
            <Activity className={`w-4 h-4 ${current.color}`} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Smart Dhikr</h3>
            <p className="text-[10px] text-slate-400">Total Session: {sessionTotal}</p>
          </div>
        </div>
        <button onClick={reset} className="text-slate-500 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN TAP AREA */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10" onClick={handleTap}>
        
        {/* Progress Ring */}
        <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer active:scale-95 transition-transform duration-100">
          {/* SVG Ring Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
            <circle 
              cx="96" cy="96" r="88" 
              stroke="currentColor" strokeWidth="12" 
              fill="transparent" 
              strokeDasharray={552} // 2 * PI * 88
              strokeDashoffset={552 - (552 * progress) / 100}
              className={`${current.color} transition-all duration-300 ease-out`} 
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-bold text-white tabular-nums tracking-tighter">
              {count}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-2">
              / {current.target}
            </span>
          </div>
        </div>

        <p className="mt-6 text-slate-300 font-medium text-lg tracking-wide">{current.label}</p>
        <p className="text-xs text-slate-500 mt-1">Tap anywhere to count</p>

      </div>

      {/* FOOTER CONTROLS */}
      <div className="p-4 border-t border-white/5 flex justify-between items-center bg-slate-950/30 z-10">
        <div className="flex gap-1">
          {DHIKR_PRESETS.map((d, i) => (
            <div 
              key={d.id} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeDhikr ? d.bg : 'bg-slate-700'}`} 
            />
          ))}
        </div>
        <Button variant="ghost" onClick={nextDhikr} className="text-xs text-slate-400 hover:text-white">
          Next Routine <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

    </Card>
  );
};