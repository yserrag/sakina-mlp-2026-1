import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Baby, Sparkles, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-white/5 pb-6 pt-4 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        {/* Home */}
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </button>

        {/* Reverts */}
        <button 
          onClick={() => navigate('/reverts')}
          className={`flex flex-col items-center gap-1 ${isActive('/reverts') ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Reverts</span>
        </button>

        {/* Kids */}
        <button 
          onClick={() => navigate('/kids')}
          className={`flex flex-col items-center gap-1 ${isActive('/kids') ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Baby className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Kids</span>
        </button>

        {/* AI */}
        <button 
          onClick={() => navigate('/ai')}
          className={`flex flex-col items-center gap-1 ${isActive('/ai') ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Ask AI</span>
        </button>

        {/* [FACTS]: The Missing Link - Settings */}
        <button 
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Settings</span>
        </button>

      </div>
    </div>
  );
};