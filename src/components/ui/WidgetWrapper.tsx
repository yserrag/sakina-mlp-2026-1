import React from 'react';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { useWidgetStore } from '../../shared/lib/widgetStore';

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const WidgetWrapper: React.FC<Props> = ({ id, title, children }) => {
  const { collapsed, toggleCollapse, order, setOrder } = useWidgetStore();
  const isCollapsed = collapsed[id];

  const move = (direction: 'up' | 'down') => {
    const idx = order.indexOf(id);
    const newOrder = [...order];
    if (direction === 'up' && idx > 0) {
      [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
    } else if (direction === 'down' && idx < order.length - 1) {
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    }
    setOrder(newOrder);
  };

  return (
    // [THEME]: Deep Slate-900 Glass Card
    <div className="group relative mb-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/5 shadow-lg transition-all hover:border-white/10 hover:shadow-emerald-900/20">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Reorder Handles */}
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 -space-y-1">
            <button onClick={() => move('up')} className="text-slate-600 hover:text-emerald-400 p-0.5"><ArrowUp className="w-3 h-3" /></button>
            <button onClick={() => move('down')} className="text-slate-600 hover:text-emerald-400 p-0.5"><ArrowDown className="w-3 h-3" /></button>
          </div>
          
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            {title}
          </h3>
        </div>

        <button 
          onClick={() => toggleCollapse(id)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="animate-in slide-in-from-top-2 duration-300">
           {children}
        </div>
      )}
    </div>
  );
};