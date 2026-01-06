import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useWidgetStore } from '../../shared/lib/widgetStore';
import { Card } from './Card';

interface WidgetWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ id, title, children, icon }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { moveWidget, order } = useWidgetStore();

  const isFirst = order[0] === id;
  const isLast = order[order.length - 1] === id;

  return (
    <Card className={`relative transition-all duration-300 border-white/5 bg-slate-900/40 backdrop-blur-sm ${isCollapsed ? 'mb-2' : 'mb-4'}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          {icon && <div className="text-emerald-500">{icon}</div>}
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">{title}</h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            onClick={() => moveWidget(id, 'up')}
            disabled={isFirst}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            title="Move Up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => moveWidget(id, 'down')}
            disabled={isLast}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            title="Move Down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Collapse/Expand */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}`}>
        <div className="p-1">
           {children}
        </div>
      </div>
    </Card>
  );
};