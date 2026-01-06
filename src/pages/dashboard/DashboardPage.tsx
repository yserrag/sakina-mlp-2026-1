import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Settings, Bell, Cloud, Sun, CloudRain, RotateCcw } from 'lucide-react';
import { useWidgetStore, DEFAULT_WIDGETS } from '../../shared/lib/widgetStore';
import { WidgetWrapper } from '../../components/ui/WidgetWrapper';

// Widget Imports
import { DailyWisdom } from '../../components/widgets/DailyWisdom';
import { HalalScanner } from '../../components/widgets/HalalScanner';
import { PrayerWidget } from '../../components/widgets/PrayerWidget';
import { QiblaWidget } from '../../components/widgets/QiblaWidget';
import { MosqueFinder } from '../../components/widgets/MosqueFinder';
import { SmartDhikr } from '../../components/widgets/SmartDhikr';
import { NamesOfAllah } from '../../components/widgets/NamesOfAllah';
import { ZakatCalculator } from '../../components/widgets/ZakatCalculator';
import { AffiliateDock } from '../../components/widgets/AffiliateDock'; 
import { JournalWidget } from '../../components/widgets/JournalWidget';
import { DreamInterpreter } from '../../components/widgets/DreamInterpreter';
import { SoulComfort } from '../../components/widgets/SoulComfort';

// Weather Badge (Proxied)
const WeatherBadge = () => {
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  
  useEffect(() => {
    fetch(`/api/proxy/weather?lat=51.5074&lon=-0.1278`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.temp !== undefined) setWeather({ temp: data.temp, code: data.code });
      })
      .catch(console.error);
  }, []);

  if (!weather) return null;
  let Icon = Sun;
  let label = "Clear";
  if (weather.code > 3) { Icon = Cloud; label = "Cloudy"; }
  if (weather.code > 50) { Icon = CloudRain; label = "Rain"; }

  return (
    <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all hover:bg-slate-800/50 hover:border-white/10 animate-in fade-in">
      <Icon className="w-4 h-4 text-amber-400" />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold text-white">{weather.temp}°C</span>
        <span className="text-[9px] text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { order, ensureWidgetsExist, resetLayout } = useWidgetStore();
  
  useLayoutEffect(() => { 
    window.scrollTo(0, 0); 
    // [CRITICAL] Ensure new features appear even for returning users
    ensureWidgetsExist(['dream-interpreter', 'soul-comfort', 'journal', 'affiliate-dock', 'prayer-times']);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Dual Calendar Logic
  const today = new Date();
  const gregorianDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(today);

  // Widget Registry
  const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
    'prayer-times': <PrayerWidget />, 
    'prayer-widget': <PrayerWidget />, 
    'affiliate-dock': <AffiliateDock />,
    'journal': <JournalWidget />,
    'dream-interpreter': <DreamInterpreter />,
    'soul-comfort': <SoulComfort />,
    'daily-wisdom': <DailyWisdom />,
    'halal-scanner': <HalalScanner />,
    'names-of-allah': <NamesOfAllah />,
    'smart-dhikr': <SmartDhikr />,
    'qibla': <QiblaWidget />,
    'mosque-finder': <MosqueFinder />,
    'zakat': <ZakatCalculator />
  };

  const TITLES: Record<string, string> = {
    'prayer-times': 'Prayer Times',
    'affiliate-dock': 'Recommended For You',
    'journal': 'Private Journal',
    'dream-interpreter': 'Dream Interpreter',
    'soul-comfort': 'Soul Comfort',
    'daily-wisdom': 'Daily Wisdom',
    'ai-assistant': 'Sakina AI',
    'halal-scanner': 'Halal Scanner',
    'names-of-allah': 'Know Your Lord',
    'smart-dhikr': 'Smart Dhikr',
    'qibla': 'Qibla Direction',
    'mosque-finder': 'Mosque Finder',
    'zakat': 'Zakat Calculator'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 relative selection:bg-emerald-500/30">
      
      {/* Background Ambience */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 px-5 pt-12 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
             <p className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase mb-1">Ramadan 2026</p>
             <h1 className="text-2xl font-bold text-white tracking-tight">{greeting}</h1>
          </div>
          <WeatherBadge />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-slate-400 text-xs font-medium">{gregorianDate}</p>
            <p className="text-emerald-600/80 text-[10px] uppercase tracking-wide font-bold">{hijriDate}</p>
          </div>
          
          <div className="flex gap-2">
             <button 
                onClick={resetLayout}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"
                title="Reset Widgets"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
             <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Content Stream (Fully Movable Grid) */}
      <div className="px-4 mt-6 relative z-10">
        {order.map((id) => {
          if (!WIDGET_REGISTRY[id]) return null;

          // Special case for Affiliate Dock to keep it clean (or wrap it too if you prefer)
          // For consistency with "All widgets movable", we wrap it.
          
          return (
            <WidgetWrapper key={id} id={id} title={TITLES[id] || id}>
               {WIDGET_REGISTRY[id]}
            </WidgetWrapper>
          );
        })}
        
        {/* Helper message if grid is empty */}
        {order.length === 0 && (
           <div className="text-center py-10 opacity-50">
              <p>No widgets enabled.</p>
              <button onClick={resetLayout} className="text-emerald-400 text-sm underline mt-2">Reset Default Layout</button>
           </div>
        )}
      </div>
    </div>
  );
};