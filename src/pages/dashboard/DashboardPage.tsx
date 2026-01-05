import React from 'react';
// [FACTS]: Importing from Shared and Widgets layers per FSD
import { WidgetWrapper } from '../../components/ui/WidgetWrapper';
import { useWidgetStore } from '../../shared/lib/widgetStore';
import { PrayerWidget } from '../../components/widgets/PrayerWidget';
import { QiblaWidget } from '../../components/widgets/QiblaWidget';
import { DailyWisdom } from '../../components/widgets/DailyWisdom';
import { ZakatCalculator } from '../../components/widgets/ZakatCalculator';
import { AiAssistant } from '../../components/widgets/AiAssistant';
import { AffiliateDock } from '../../components/widgets/AffiliateDock';

export const DashboardPage: React.FC = () => {
  const { order } = useWidgetStore();

  const renderWidget = (id: string) => {
    switch (id) {
      case 'prayer': 
        return <WidgetWrapper id="prayer" title="Prayer Times"><PrayerWidget /></WidgetWrapper>;
      case 'qibla': 
        return <WidgetWrapper id="qibla" title="Qibla Finder"><QiblaWidget /></WidgetWrapper>;
      case 'wisdom': 
        return <WidgetWrapper id="wisdom" title="Daily Wisdom"><DailyWisdom /></WidgetWrapper>;
      case 'zakat': 
        return <WidgetWrapper id="zakat" title="Zakat Wealth"><ZakatCalculator /></WidgetWrapper>;
      case 'ai': 
        return <WidgetWrapper id="ai" title="Sakina AI"><AiAssistant /></WidgetWrapper>;
      case 'affiliate': 
        // [FIX]: Added required 'context' prop for compliance with AffiliateDock logic
        return <WidgetWrapper id="affiliate" title="Recommended"><AffiliateDock context="morning" /></WidgetWrapper>;
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-28 space-y-4 max-w-2xl mx-auto animate-in fade-in duration-500">
      <header className="py-4">
        <h1 className="text-2xl font-serif font-bold text-white">As-salaam alaykum</h1>
        <p className="text-xs text-slate-400 italic">"In the remembrance of Allah do hearts find rest."</p>
      </header>

      {/* [ANALYSIS]: Rendering widgets dynamically based on the stored user order */}
      <div className="grid gap-4">
        {order.map(id => (
          <div key={id}>
            {renderWidget(id)}
          </div>
        ))}
      </div>
    </div>
  );
};