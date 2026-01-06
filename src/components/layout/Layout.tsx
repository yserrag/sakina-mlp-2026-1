import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { Home, User, Settings, Smile } from 'lucide-react'; // Removed Sparkles import
import { AiFloatingButton } from '../widgets/AiFloatingButton';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 relative">
      
      {/* 1. Main Content Area */}
      <main className="pb-24">
        {children || <Outlet />}
      </main>

      {/* 2. Global AI Companion (Floating) */}
      <AiFloatingButton />

      {/* 3. Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-40 pb-safe">
        <div className="flex justify-around items-center h-20">
          <Link to="/" className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive('/') ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          
          <Link to="/reverts" className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive('/reverts') ? 'text-emerald-400' : 'text-slate-500'}`}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Reverts</span>
          </Link>

          {/* [FIX] Removed the spacer div here */}

          <Link to="/kids" className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive('/kids') ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Smile className="w-6 h-6" />
            <span className="text-[10px] font-bold">Kids</span>
          </Link>

          <Link to="/settings" className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive('/settings') ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-bold">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};