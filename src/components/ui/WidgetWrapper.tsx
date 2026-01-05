import React from 'react';
import { Card } from './Card';
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
    <Card className="overflow-hidden border-white/5 bg-slate-900/40">
      <div className="p-3 flex items-center justify-between border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          {/* Reorder Buttons */}
          <div className="flex flex-col -space-y-1">
            <button onClick={() => move('up')} className="p-0.5 hover:text-white text-slate-600"><ArrowUp className="w-3 h-3" /></button>
            <button onClick={() => move('down')} className="p-0.5 hover:text-white text-slate-600"><ArrowDown className="w-3 h-3" /></button>
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        </div>
        <button onClick={() => toggleCollapse(id)} className="p-2 hover:bg-white/10 rounded-lg">
          {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
      {!isCollapsed && <div className="animate-in slide-in-from-top-2 duration-300">{children}</div>}
    </Card>
  );
};