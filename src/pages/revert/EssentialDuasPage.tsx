import React from 'react';
import { ArrowLeft, Book, Heart } from 'lucide-react';

// [FACTS]: This interface explicitly allows the 'onBack' prop from routes.tsx
interface RevertPageProps {
  onBack: () => void;
}

export const EssentialDuasPage = ({ onBack }: RevertPageProps) => {
  const duas = [
    { 
      title: "Before Eating", 
      arabic: "بِسْمِ اللَّهِ", 
      transliteration: "Bismillah", 
      meaning: "In the name of Allah" 
    },
    { 
      title: "For Parents", 
      arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", 
      transliteration: "Rabbi irhamhuma kama rabbayani sagheera", 
      meaning: "My Lord, have mercy upon them as they brought me up [when I was] small" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-24">
      {/* Navigation Header */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-400 mb-8 p-3 bg-white/5 rounded-2xl border border-white/10 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
            <Book className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold">Essential Duas</h1>
        </div>
        <p className="text-slate-400 text-sm">Daily protection and peace for your heart.</p>
      </header>

      <div className="space-y-4">
        {duas.map((dua, index) => (
          <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-amber-400 text-sm uppercase tracking-widest">{dua.title}</h3>
              <Heart className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-3xl text-right font-arabic leading-loose" dir="rtl">{dua.arabic}</p>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 italic">"{dua.transliteration}"</p>
              <p className="text-xs text-slate-500">{dua.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};