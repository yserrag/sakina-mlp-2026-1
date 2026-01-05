import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Baby, Sparkles } from 'lucide-react';

export const NavigationDock = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/revert', icon: Heart, label: 'Revert' },
    { to: '/kids', icon: Baby, label: 'Kids' },
    { to: '/hikmah', icon: Sparkles, label: 'Hikmah' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex justify-around items-center shadow-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300
              ${isActive 
                ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};