import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Settings, Bell, Cloud, Sun, CloudRain } from 'lucide-react';
import { useWidgetStore } from '../../shared/lib/widgetStore';
import { WidgetWrapper } from '../../components/ui/WidgetWrapper';

// Widget Imports
import { DailyWisdom } from '../../components/widgets/DailyWisdom';
import { HalalScanner } from '../../components/widgets/HalalScanner';
import { PrayerWidget } from '../../components/widgets/PrayerWidget';
import { QiblaWidget } from '../../components/widgets/QiblaWidget';
import { MosqueFinder } from '../../components/widgets/MosqueFinder';
import { AiAssistant } from '../../components/widgets/AiAssistant';
import { SmartDhikr } from '../../components/widgets/SmartDhikr';
import { NamesOfAllah } from '../../components/widgets/NamesOfAllah';
import { ZakatCalculator } from '../../components/widgets/ZakatCalculator';

// Header Weather Badge
const WeatherBadge = () => {
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,weather_code,is_day')
      .then(res => res.json())
      .then(data => {
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code
          });
        }
      })
      .catch(console.error);
  }, []);

  if (!weather) return null;

  let Icon = Sun;
  let label = "Clear";
  if (weather.code > 3) { Icon = Cloud; label = "Cloudy"; }
  if (weather.code > 50) { Icon = CloudRain; label = "Rain"; }

  return (
    <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all hover:bg-slate-800/50 hover:border-white/10">
      <Icon className="w-4 h-4 text-amber-400" />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold text-white">{weather.temp}°C</span>
        <span className="text-[9px] text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { order } = useWidgetStore();
  
  // [CRITICAL FIX] Force scroll to top IMMEDIATELY on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
    'prayer-times': <PrayerWidget />, 
    'prayer-widget': <PrayerWidget />, 
    'daily-wisdom': <DailyWisdom />,
    'ai-assistant': <AiAssistant />,
    'halal-scanner': <HalalScanner />,
    'names-of-allah': <NamesOfAllah />,
    'smart-dhikr': <SmartDhikr />,
    'qibla': <QiblaWidget />,
    'mosque-finder': <MosqueFinder />,
    'zakat': <ZakatCalculator />
  };

  const TITLES: Record<string, string> = {
    'daily-wisdom': 'Daily Wisdom',
    'ai-assistant': 'Sakina AI',
    'halal-scanner': 'Halal Scanner',
    'names-of-allah': 'Know Your Lord',
    'smart-dhikr': 'Smart Dhikr',
    'qibla': 'Qibla Direction',
    'mosque-finder': 'Mosque Finder',
    'zakat': 'Zakat Calculator'
  };

  const hasPrayerWidget = order.includes('prayer-times') || order.includes('prayer-widget');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 relative selection:bg-emerald-500/30">
      
      {/* Background Ambience */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 px-5 pt-12 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
             <p className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase mb-1">Ramadan 2026</p>
             <h1 className="text-2xl font-bold text-white tracking-tight">{greeting}</h1>
          </div>
          <WeatherBadge />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <div className="flex gap-2">
             <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"><Bell className="w-4 h-4" /></button>
             <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-4 mt-6 relative z-10 space-y-3">
        {!hasPrayerWidget && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
             <PrayerWidget />
          </div>
        )}

        {/* Normal Grid */}
        {order.map((id) => {
          if (!WIDGET_REGISTRY[id]) return null;

          if (id === 'prayer-times' || id === 'prayer-widget') {
            return <div key={id} className="mb-4">{WIDGET_REGISTRY[id]}</div>;
          }

          return (
            <WidgetWrapper key={id} id={id} title={TITLES[id] || id}>
               {WIDGET_REGISTRY[id]}
            </WidgetWrapper>
          );
        })}
      </div>
    </div>
  );
};