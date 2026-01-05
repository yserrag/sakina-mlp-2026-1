import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, HeartHandshake, Baby, Sparkles, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Navigation Item Component
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} className="flex flex-col items-center gap-1 min-w-[60px] group">
      <div className={`p-2 rounded-xl transition-all duration-300 ${
        isActive(to) 
          ? 'bg-emerald-500/20 text-emerald-400' 
          : 'text-slate-500 hover:text-slate-300'
      }`}>
        <Icon className={`w-6 h-6 ${isActive(to) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
      </div>
      <span className={`text-[10px] font-medium tracking-wide transition-colors ${
        isActive(to) ? 'text-emerald-400' : 'text-slate-600'
      }`}>
        {label}
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30">
      
      {/* 1. Main Content Area (The Page) */}
      <main className="pb-24 animate-in fade-in duration-500">
        {children}
      </main>

      {/* 2. Persistent Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 pb-6 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/reverts" icon={HeartHandshake} label="Reverts" />
          <NavItem to="/kids" icon={Baby} label="Kids" />
          <NavItem to="/ai" icon={Sparkles} label="AI" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </nav>
    </div>
  );
};