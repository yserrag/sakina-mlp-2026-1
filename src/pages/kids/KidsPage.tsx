import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Trophy, 
  Play, 
  Music,
  Heart,
  Sparkles,
  Gamepad2,
  Check,
  Lock
} from 'lucide-react';

// [COMPONENT] Bouncy Button for Kids
const BouncyButton = ({ 
  onClick, 
  children, 
  color = "from-indigo-500 to-purple-600",
  icon: Icon
}: { onClick: () => void, children: React.ReactNode, color?: string, icon?: any }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      className={`relative w-full group transition-all duration-100 ${pressed ? 'scale-95' : 'hover:scale-105'}`}
    >
      {/* Shadow Layer */}
      <div className={`absolute inset-0 translate-y-2 rounded-2xl bg-black/40 blur-sm`}></div>
      
      {/* Main Button */}
      <div className={`relative h-24 rounded-2xl bg-gradient-to-br ${color} p-4 flex items-center justify-between shadow-inner border-t border-white/20`}>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="text-left text-white">
            <h3 className="text-lg font-black tracking-wide uppercase shadow-black drop-shadow-md">{children}</h3>
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
    </button>
  );
};

export const KidsPage = () => {
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  // Simple "Level Up" Logic
  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#2e0249] pb-32 relative overflow-hidden font-sans selection:bg-pink-500">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Stars */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce [animation-duration:3s]"></div>
      <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* --- HEADER: HERO PROFILE --- */}
      <header className="relative z-10 p-6 pt-12 text-center">
        
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full p-1 shadow-[0_0_40px_rgba(251,191,36,0.4)]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl shadow-inner">
              🦁
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-lg rotate-3">
            LVL {level}
          </div>
        </div>

        <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tight mb-1">
          Hamza the Hero
        </h1>
        
        {/* XP Bar */}
        <div className="max-w-xs mx-auto mt-4 relative group">
          <div className="flex justify-between text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1 px-1">
            <span>Explorer</span>
            <span>{xp} / 2000 XP</span>
          </div>
          <div className="h-6 bg-black/40 rounded-full overflow-hidden border border-white/10 p-1">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-500"
              style={{ width: `${(xp / 2000) * 100}%` }}
            >
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-[slide_1s_linear_infinite]"></div>
            </div>
          </div>
          
          {/* Confetti Effect Overlay */}
          {showConfetti && (
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
               ⭐ +50 XP!
             </div>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="px-5 space-y-8 relative z-10 max-w-md mx-auto">

        {/* 1. DAILY CHALLENGE (Featured) */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
            <h2 className="text-white font-black text-xl italic tracking-wide">DAILY CHALLENGE</h2>
          </div>
          
          <div className="bg-gradient-to-b from-indigo-800 to-indigo-900 border-2 border-indigo-400/30 rounded-3xl p-1 shadow-2xl">
             <div className="bg-[#1e0b36] rounded-[20px] p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                
                <h3 className="text-2xl font-black text-white mb-2">Help Your Parents!</h3>
                <p className="text-indigo-200 mb-6 text-sm font-medium">
                  Prophet Muhammad (ﷺ) said paradise lies at the feet of your mother.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => addXp(50)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    I Did It!
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_rgb(15,23,42)] active:shadow-none active:translate-y-[4px] transition-all">
                    Not Yet
                  </button>
                </div>
             </div>
          </div>
        </section>

        {/* 2. ADVENTURE MODE (Buttons) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Gamepad2 className="w-6 h-6 text-pink-400" />
            <h2 className="text-white font-black text-xl italic tracking-wide">ADVENTURE MODE</h2>
          </div>

          <BouncyButton onClick={() => addXp(20)} color="from-pink-500 to-rose-600" icon={Music}>
             Story Time
          </BouncyButton>
          
          <BouncyButton onClick={() => addXp(20)} color="from-cyan-500 to-blue-600" icon={Star}>
             Learn a Du'aa
          </BouncyButton>
          
          <BouncyButton onClick={() => addXp(20)} color="from-violet-500 to-purple-600" icon={Sparkles}>
             Mini Quiz
          </BouncyButton>
        </section>

        {/* 3. PARENTAL LOCK */}
        <div className="text-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Parent Dashboard Locked</span>
          </div>
        </div>

      </div>
    </div>
  );
};