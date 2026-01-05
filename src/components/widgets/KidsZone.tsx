import React, { useState } from 'react';
import { 
  Star, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  Play, 
  Music,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// [COMPONENT] Animated Star Button
const StarButton = ({ onClick, active }: { onClick: () => void, active: boolean }) => (
  <button 
    onClick={onClick}
    className={`relative group p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
      active 
        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
        : 'bg-slate-800 border-2 border-slate-700 hover:border-yellow-400/50'
    }`}
  >
    <Star className={`w-8 h-8 ${active ? 'text-white fill-white animate-spin-slow' : 'text-slate-500'}`} />
    {active && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full absolute animate-ping opacity-20 bg-yellow-400 rounded-2xl"></div>
      </div>
    )}
  </button>
);

export const KidsPage = () => {
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(3);
  const [activeStory, setActiveStory] = useState<string | null>(null);
  
  // Daily Deeds State
  const [deeds, setDeeds] = useState([
    { id: 1, text: "Smiled at Mom/Dad", points: 50, completed: false },
    { id: 2, text: "Said Bismillah", points: 30, completed: false },
    { id: 3, text: "Cleaned my room", points: 100, completed: false },
    { id: 4, text: "Shared a toy", points: 75, completed: false },
  ]);

  const toggleDeed = (id: number) => {
    setDeeds(deeds.map(d => {
      if (d.id === id && !d.completed) {
        setXp(prev => prev + d.points);
        // Simple level up logic
        if (xp + d.points > level * 500) setLevel(l => l + 1);
        return { ...d, completed: true };
      }
      return d;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pb-32 relative overflow-hidden font-sans">
      
      {/* Background Fun */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-900/40 to-transparent pointer-events-none" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full"></div>
      <div className="absolute top-40 left-10 w-24 h-24 bg-blue-500/20 blur-[50px] rounded-full"></div>

      {/* HEADER: Profile & XP */}
      <header className="relative z-10 p-6 pt-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 p-1 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-2xl">🦁</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hamza the Hero</h1>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Level {level} Explorer</p>
            </div>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur border border-yellow-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold font-mono">{xp} XP</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
            style={{ width: `${(xp % 500) / 5}%` }}
          ></div>
        </div>
      </header>

      <div className="px-5 space-y-8 relative z-10">

        {/* 1. DAILY DEEDS (Gamified Checklist) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-bold text-lg">Today's Missions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {deeds.map((deed) => (
              <Card 
                key={deed.id}
                onClick={() => toggleDeed(deed.id)}
                className={`border-0 relative overflow-hidden cursor-pointer transition-all ${
                  deed.completed 
                    ? 'bg-emerald-500/20 ring-2 ring-emerald-500/50' 
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="p-4 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-full transition-all ${
                    deed.completed ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-bold ${deed.completed ? 'text-white' : 'text-slate-300'}`}>
                    {deed.text}
                  </p>
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                    +{deed.points} XP
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. STORY TIME (Audio Player) */}
        <section>
           <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <h2 className="text-white font-bold text-lg">Story Time</h2>
          </div>

          <Card className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-500/20 overflow-hidden relative">
            <div className="p-5 flex items-start gap-4">
               <div className="w-16 h-16 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
                 <Music className="w-8 h-8 text-pink-400" />
               </div>
               <div className="flex-1">
                 <h3 className="text-white font-bold">The Whale & The Prophet</h3>
                 <p className="text-pink-200/60 text-xs mt-1">Prophet Yunus (AS) was alone in the deep dark ocean...</p>
                 
                 <div className="flex items-center gap-3 mt-4">
                   <Button size="sm" className="bg-pink-600 hover:bg-pink-500 text-white border-none rounded-full px-6">
                     <Play className="w-4 h-4 mr-2 fill-current" /> Listen
                   </Button>
                   <span className="text-xs text-slate-400 font-mono">5:30</span>
                 </div>
               </div>
            </div>
          </Card>
        </section>

        {/* 3. MINI QUIZ */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold text-lg">Quick Quiz</h2>
          </div>

          <Card className="bg-cyan-950/30 border-cyan-500/20 p-5">
            <p className="text-cyan-100 text-center font-medium mb-6 text-lg">
              Which foot do we enter the bathroom with?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-200 h-12 text-lg">
                Right 🦶
              </Button>
              <Button variant="outline" className="flex-1 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-200 h-12 text-lg">
                Left 🦶
              </Button>
            </div>
          </Card>
        </section>

        {/* 4. PARENTAL LOCK FOOTER */}
        <div className="flex justify-center mt-8 opacity-50">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
            <Lock className="w-3 h-3" />
            Parental Controls Active
          </div>
        </div>

      </div>
    </div>
  );
};