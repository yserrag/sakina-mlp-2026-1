import React, { useState } from 'react';
import { Card } from '../ui/Card'; // [FACTS]: Verified import path
import { RevertEngine } from '../../services/RevertEngine';
import { BookOpen, Lock, CheckCircle, ChevronRight } from 'lucide-react';

export const RevertJourney: React.FC = () => {
  const [state] = useState(RevertEngine.getInitialState());

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/40 to-indigo-900/20 border-indigo-500/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif font-bold text-white text-lg">Revert Journey</h3>
          <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Learning Roadmap</p>
        </div>
        <BookOpen className="w-5 h-5 text-indigo-400" />
      </div>

      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
          <span>Overall Progress</span>
          <span className="text-indigo-400">{state.totalProgress}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000" 
            style={{ width: `${state.totalProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {state.modules.map((module) => (
          <div 
            key={module.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              module.status === 'locked' 
                ? 'bg-black/20 border-white/5 opacity-50' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${
                module.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                module.status === 'available' ? 'bg-indigo-500/10 text-indigo-400' :
                'bg-slate-500/10 text-slate-500'
              }`}>
                {module.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                 module.status === 'locked' ? <Lock className="w-4 h-4" /> :
                 <BookOpen className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{module.title}</h4>
                <p className="text-[10px] text-slate-500">{module.description}</p>
              </div>
            </div>
            {module.status !== 'locked' && <ChevronRight className="w-4 h-4 text-slate-600" />}
          </div>
        ))}
      </div>
    </Card>
  );
};