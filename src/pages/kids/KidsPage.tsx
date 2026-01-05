import React from 'react';
import { Card } from '../../components/ui/Card';
import { Play, Star, Trophy, Heart, Flower, Sprout, CloudSun } from 'lucide-react';

export const KidsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-28 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Little Believers</h1>
          <p className="text-xs text-slate-400">Learn, Play, and Pray!</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-400 font-bold text-xs">150 Seeds</span>
        </div>
      </header>

      {/* Hero: Story of the Day */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <Card className="relative h-48 border-none overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Star className="w-32 h-32 text-white rotate-12" />
          </div>
          
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                Story Time
              </span>
              <Heart className="w-6 h-6 text-white/50" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">The Whale & The Prophet</h2>
              <p className="text-white/80 text-xs line-clamp-2">
                Join Prophet Yunus (AS) on an adventure deep under the sea! 
                Learn about patience and reliance on Allah.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Play Button Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>

      {/* [ETHICAL REFACTOR]: Replaced "Streak" with "Prayer Garden" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-emerald-400" />
            My Prayer Garden
          </h3>
          <span className="text-[10px] text-slate-400">Today's Blooms</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, idx) => {
            // Simulation Logic: First 2 prayers are "Bloomed" (Completed)
            const isBloomed = idx < 2; 
            
            return (
              <Card 
                key={prayer} 
                className={`p-2 border-white/5 flex flex-col items-center gap-2 transition-all cursor-pointer group ${
                  isBloomed ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 hover:bg-slate-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isBloomed 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  {isBloomed ? (
                    <Flower className="w-6 h-6 fill-emerald-500/20" />
                  ) : (
                    <Sprout className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase ${
                  isBloomed ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {prayer}
                </span>
              </Card>
            );
          })}
        </div>
        
        <p className="text-[10px] text-center text-slate-500 italic mt-2">
          "Every prayer plants a seed in Jannah."
        </p>
      </div>

      {/* Mini Games Grid */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Card className="p-4 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">🕌</span>
          </div>
          <h4 className="font-bold text-white text-sm">Mosque Builder</h4>
          <p className="text-[10px] text-sky-200 mt-1">Design your own Masjid!</p>
        </Card>

        <Card className="p-4 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">🌙</span>
          </div>
          <h4 className="font-bold text-white text-sm">Moon Sighting</h4>
          <p className="text-[10px] text-rose-200 mt-1">Find the new moon.</p>
        </Card>
      </div>

    </div>
  );
};