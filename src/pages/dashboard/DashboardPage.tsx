import React, { useLayoutEffect } from 'react';
import { Bell, Settings, CloudRain, RefreshCcw } from 'lucide-react';

// [IMPORTS] Core Utilities
import { useWidgetStore } from '../../shared/lib/widgetStore';
import { getHijriDate } from '../../shared/lib/dateUtils';
import { WidgetWrapper } from '../../components/ui/WidgetWrapper';

// [IMPORTS] Real Widgets
import { PrayerWidget } from '../../components/widgets/PrayerWidget';
import { HalalScanner } from '../../components/widgets/HalalScanner';
import { DreamInterpreter } from '../../components/widgets/DreamInterpreter';
import { SoulComfort } from '../../components/widgets/SoulComfort';
import { SmartDhikr } from '../../components/widgets/SmartDhikr';
import { NamesOfAllah } from '../../components/widgets/NamesOfAllah';
import { JournalWidget } from '../../components/widgets/JournalWidget';
import { RevertJourney } from '../../components/widgets/RevertJourney';
import { ZakatCalculator } from '../../components/widgets/ZakatCalculator';

const WeatherBadge = () => (
  <div className="bg-slate-900 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
    <CloudRain className="w-3 h-3 text-emerald-400" />
    <span className="text-xs text-white">London</span>
    <span className="text-xs text-emerald-400 font-bold">12°C</span>
  </div>
);

export const DashboardPage = () => {
  const { order } = useWidgetStore();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleForceSync = () => {
    if (confirm("Reset layout and sync with latest updates?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const hijriDate = getHijriDate();
  const gregorianDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
    'prayer-times': <PrayerWidget />,
    'prayer-widget': <PrayerWidget />,
    'halal-scanner': <HalalScanner />,
    'ai-assistant': <DreamInterpreter />, 
    'dream-interpreter': <DreamInterpreter />,
    'daily-wisdom': <SoulComfort />,
    'smart-dhikr': <SmartDhikr />,
    'names-of-allah': <NamesOfAllah />,
    'journal': <JournalWidget />,
    'revert-journey': <RevertJourney />,
    'zakat': <ZakatCalculator />,
    'qibla': <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-slate-500 text-xs text-center">Qibla (Coming Soon)</div>,
    'mosque-finder': <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-slate-500 text-xs text-center">Mosque Finder (Coming Soon)</div>
  };

  const TITLES: Record<string, string> = {
    'daily-wisdom': 'Soul Comfort',
    'ai-assistant': 'Dream Guide',
    'halal-scanner': 'Halal Scanner',
    'smart-dhikr': 'Smart Dhikr',
    'names-of-allah': 'Know Your Lord',
    'journal': 'Reflection Vault',
    'revert-journey': 'My Journey',
    'zakat': 'Zakat Calculator'
  };

  const hasPrayerWidget = order.includes('prayer-times') || order.includes('prayer-widget');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 relative selection:bg-emerald-500/30">
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      <header className="sticky top-0 z-40 px-5 pt-12 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-emerald-500/50 text-[9px] font-bold tracking-widest uppercase mb-1">Ramadan 2026 • Target</p>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{greeting}</h1>
            <div className="flex items-center gap-2">
               <span className="text-amber-400 font-serif text-sm tracking-wide">{hijriDate}</span>
               <span className="text-slate-600 text-[10px]">•</span>
               <span className="text-slate-400 text-xs">{gregorianDate}</span>
            </div>
          </div>
          <WeatherBadge />
        </div>
        
        <div className="flex justify-end gap-2">
            <button 
              onClick={handleForceSync}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all"
              title="Force Sync"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all">
              <Settings className="w-4 h-4" />
            </button>
        </div>
      </header>

      <div className="px-4 mt-6 relative z-10 space-y-3">
        {!hasPrayerWidget && <div className="mb-4"><PrayerWidget /></div>}
        {order.map((id) => {
          if (!WIDGET_REGISTRY[id]) return null;
          if (id === 'prayer-times' || id === 'prayer-widget') return <div key={id} className="mb-4">{WIDGET_REGISTRY[id]}</div>;
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