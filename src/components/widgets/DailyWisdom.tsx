import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';
import { VERIFIED_SOURCES } from '../../features/ai/data/verifiedSources';

export const DailyWisdom: React.FC = () => {
  // [ANALYSIS]: State to manage local rotation of verified content
  const [index, setIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const wisdom = VERIFIED_SOURCES[index];

  const handleRefresh = () => {
    setIsSpinning(true);
    // Cycle to the next item in the array
    const nextIndex = (index + 1) % VERIFIED_SOURCES.length;
    
    // Artificial delay to give a "searching" feel (MLP UX)
    setTimeout(() => {
      setIndex(nextIndex);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-900 to-teal-950 p-6 text-white shadow-xl">
      <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-10">
        <Sparkles className="h-48 w-48 text-white" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
              Verse of the Day
            </span>
          </div>
          
          {/* [FIX]: Refresh button now triggers rotation logic */}
          <button 
            onClick={handleRefresh}
            className={`rounded-full p-1.5 hover:bg-white/10 transition-all ${isSpinning ? 'rotate-180 opacity-50' : ''}`}
            disabled={isSpinning}
          >
            <RefreshCw className={`h-4 w-4 text-emerald-300/50 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4 text-center min-h-[180px] flex flex-col justify-center animate-in fade-in zoom-in duration-500">
          <Quote className="mx-auto h-8 w-8 rotate-180 text-emerald-400/30" />
          
          <p className="font-serif text-3xl leading-relaxed tracking-wide text-white drop-shadow-md" dir="rtl">
            {wisdom.arabic}
          </p>

          <p className="text-[11px] italic text-emerald-200/60">
            {wisdom.transliteration}
          </p>

          <div className="space-y-1">
            <p className="text-lg font-medium leading-snug text-white">
              "{wisdom.text}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
              — {wisdom.source}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-black/30 p-4 backdrop-blur-sm border border-white/5 transition-all">
          <p className="text-xs leading-relaxed text-emerald-50/90">
            <span className="font-bold text-emerald-400">Reflection: </span>
            {wisdom.reflection}
          </p>
        </div>
      </div>
    </Card>
  );
};