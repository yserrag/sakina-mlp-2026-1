import React, { Suspense, useLayoutEffect } from 'react';
import { RefreshCcw, Settings } from 'lucide-react';
import { useWidgetStore } from '../../shared/lib/widgetStore';
import { WidgetWrapper } from '../../components/ui/WidgetWrapper';
import { PrayerWidget } from '../../components/widgets/PrayerWidget';

// Lazy Load the complex RevertJourney to prevent main thread blocking
const RevertJourney = React.lazy(() => import('../../components/widgets/RevertJourney').then(m => ({ default: m.RevertJourney })));

export const DashboardPage = () => {
  const { order } = useWidgetStore();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleForceSync = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="p-6 flex justify-between items-center bg-slate-900/50 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight">Sakina <span className="text-emerald-500 text-xs">2026</span></h1>
        <div className="flex gap-2">
          <button onClick={handleForceSync} className="p-2 bg-slate-800 rounded-lg"><RefreshCcw className="w-4 h-4" /></button>
          <button className="p-2 bg-slate-800 rounded-lg"><Settings className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {/* Priority Widget */}
        <PrayerWidget />

        {/* Dynamic Widgets with Error Boundary/Suspense */}
        <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse font-medium">Aligning Path of Light...</div>}>
          <RevertJourney />
        </Suspense>
        
        <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest pt-8">Powered by Gemini Flash 1.5</p>
      </main>
    </div>
  );
};