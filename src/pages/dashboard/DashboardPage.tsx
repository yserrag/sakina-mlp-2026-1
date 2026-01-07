import React, { useLayoutEffect } from 'react';
import { Bell, Settings, CloudRain } from 'lucide-react';

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
import { ZakatCalculator } from '../../components/widgets/ZakatCalculator'; // [NEW] Widget I

// [INLINE COMPONENT] WeatherBadge (Kept here to prevent file errors)
const WeatherBadge = () => {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
      <CloudRain className="w-3 h-3 text-emerald-400" />
      <span className="text-xs text-white">London</span>
      <span className="text-xs text-emerald-400 font-bold">12°C</span>
    </div>
  );
};

export const DashboardPage = () => {
  const { order } = useWidgetStore();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  
  // [DATE LOGIC]
  const hijriDate = getHijriDate();
  const gregorianDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // [REGISTRY] Maps ID strings to Real Components
  const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
    // Core A (Time)
    'prayer-times': <PrayerWidget />,
    'prayer-widget': <PrayerWidget />,
    
    // Core B (Body)
    'halal-scanner': <HalalScanner />,
    
    // Core C (Mind)
    'ai-assistant': <DreamInterpreter />, 
    'dream-interpreter': <DreamInterpreter />,
    
    // Core D (Heart)
    'daily-wisdom': <SoulComfort />,
    // 'soul-comfort': <SoulComfort />, // Commented out to prevent double rendering
    
    // Core F (Habit)
    'smart-dhikr': <SmartDhikr />,

    // Core E (Knowledge)
    'names-of-allah': <NamesOfAllah />,

    // Core G (Reflection)
    'journal': <JournalWidget />,

    // Core H (Guidance)
    'revert-journey': <RevertJourney />,
    
    // Core I (Charity) - [NEW]
    'zakat': <ZakatCalculator />,
    
    // Future Placeholders
    'qibla': <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-slate-500 text-xs text-center">Qibla (Coming Soon)</div>,
    'mosque-finder': <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-slate-500 text-xs text-center">Mosque Finder (Coming Soon)</div>
  };

  const TITLES: Record<string, string> = {
    'daily-wisdom': 'Soul Comfort',
    'soul-comfort': 'Soul Comfort',
    'ai-assistant': 'Dream Guide',
    'dream-interpreter': 'Dream Guide',
    'halal-scanner': 'Halal Scanner',
    'smart-dhikr': 'Smart Dhikr',
    'names-of-allah': 'Know Your Lord',
    'journal': 'Reflection Vault',
    'revert-journey': 'My Journey',
    'zakat': 'Zakat Calculator', // [NEW] Title
    'qibla': 'Qibla Direction',
    'mosque-finder': 'Mosque Finder'
  };

  const hasPrayerWidget = order.includes('prayer-times') || order.includes('prayer-widget');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 relative selection:bg-emerald-500/30">

      {/* Ambient Background */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 px-5 pt-12 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            {/* CAMPAIGN LABEL */}
            <p className="text-emerald-500/50 text-[9px] font-bold tracking-widest uppercase mb-1">Ramadan 2026 • Target</p>
            
            {/* GREETING */}
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{greeting}</h1>
            
            {/* HIJRI DATE */}
            <div className="flex items-center gap-2">
               <span className="text-amber-400 font-serif text-sm tracking-wide">{hijriDate}</span>
               <span className="text-slate-600 text-[10px]">•</span>
               <span className="text-slate-400 text-xs">{gregorianDate}</span>
            </div>
          </div>
          <WeatherBadge />
        </div>
        
        {/* ICONS ROW */}
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-xs hidden">Offset</p>
          <div className="flex gap-2 w-full justify-end">
            <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Widget Grid */}
      <div className="px-4 mt-6 relative z-10 space-y-3">
        {/* Force Prayer Widget at top if missing */}
        {!hasPrayerWidget && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <PrayerWidget />
          </div>
        )}

        {/* Render Dynamic Widgets */}
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