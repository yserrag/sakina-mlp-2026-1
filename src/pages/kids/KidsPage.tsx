import React, { useState, useEffect } from 'react';
import { Trophy, Play, Music, Heart, Star, Gamepad2, Check, Lock, Clock, Shield } from 'lucide-react';

// [COMPLIANCE] PDPL Article 8: Guardian Consent Config
const SESSION_LIMIT_MINUTES = 20;
const PARENTAL_GATE_ANSWER = '12'; // 7 + 5

// ==================== PARENTAL GATE COMPONENT ====================
const ParentalGate = ({ onUnlock, onCancel }: { onUnlock: () => void, onCancel: () => void }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // [CRITICAL] Verify Guardian Identity
    if (answer.trim() === PARENTAL_GATE_ANSWER) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-amber-400" />
          <h2 className="text-2xl font-black text-white">Guardian Check</h2>
        </div>
        
        <p className="text-slate-300 mb-6 text-sm">
          To access settings, please verify you are a parent:
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-800 rounded-xl p-6 mb-6 text-center">
            <p className="text-4xl font-black text-white mb-4">7 + 5 = ?</p>
            <input 
              type="tel"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-full bg-slate-700 text-white text-2xl text-center font-bold py-3 px-4 rounded-lg border-2 ${error ? 'border-red-500' : 'border-slate-600'} focus:outline-none focus:border-emerald-500`}
              placeholder="?"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 animate-pulse">Incorrect. Try again.</p>}
          </div>
          
          <div className="flex gap-3">
             <button 
               type="button"
               onClick={onCancel}
               className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg"
             >
               Unlock
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== TASK & SESSION LOGIC ====================

const SimpleButton = ({ onClick, children, color, icon: Icon, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full group transition-all duration-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <div className={`relative h-24 rounded-2xl bg-gradient-to-br ${color} p-4 flex items-center justify-between shadow-lg border-t border-white/20`}>
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
        {disabled ? <Check className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white fill-white" />}
      </div>
    </div>
  </button>
);

export const KidsPage = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Help Parents', description: 'Paradise lies at the feet of your mother.', icon: Heart, color: 'from-pink-500 to-rose-600', completed: false },
    { id: '2', title: 'Story Time', description: 'Listen to stories of the Prophets', icon: Music, color: 'from-cyan-500 to-blue-600', completed: false },
    { id: '3', title: "Learn Du'aa", description: 'Memorize a new supplication', icon: Star, color: 'from-violet-500 to-purple-600', completed: false }
  ]);

  const [sessionLocked, setSessionLocked] = useState(false);
  const [showParentalGate, setShowParentalGate] = useState(false);

  // [SAFETY] Session Timer
  useEffect(() => {
    const timer = setTimeout(() => setSessionLocked(true), SESSION_LIMIT_MINUTES * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
  };

  if (sessionLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-3xl font-black text-white mb-4">Time for a Break! 🌙</h2>
          <p className="text-slate-400">Great job today. Go help your parents!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2e0249] pb-32 p-6 font-sans relative selection:bg-pink-500">
      
      {/* Parental Gate Overlay */}
      {showParentalGate && (
        <ParentalGate 
          onUnlock={() => {
            setShowParentalGate(false);
            alert("Parent Settings Unlocked (Placeholder)"); 
          }} 
          onCancel={() => setShowParentalGate(false)} 
        />
      )}

      <header className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-[#2e0249]">🦁</div>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-emerald-400 font-bold border border-white/5">
          <Clock className="w-4 h-4" /> 20m Limit
        </div>
      </header>

      <h1 className="text-3xl font-black text-white mb-2">Hamza's Activities</h1>
      <p className="text-purple-200 mb-8 font-medium">0 of {tasks.length} completed today</p>

      <div className="space-y-4 max-w-md mx-auto">
        {tasks.map(task => (
          <SimpleButton 
            key={task.id} 
            {...task} 
            onClick={() => handleTaskComplete(task.id)} 
            disabled={task.completed}
          >
            {task.title}
          </SimpleButton>
        ))}
      </div>

      <div className="text-center mt-12">
        <button 
          onClick={() => setShowParentalGate(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black/20 rounded-full border border-white/10 hover:bg-black/30 transition-colors"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Parent Settings</span>
        </button>
      </div>
    </div>
  );
};