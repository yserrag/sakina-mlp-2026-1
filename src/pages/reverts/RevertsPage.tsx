import React from 'react';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Circle, Lock, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useRevertJourney } from '../../features/reverts/logic/useRevertJourney';

export const RevertsPage: React.FC = () => {
  const { milestones, toggleMilestone } = useRevertJourney();

  return (
    <div className="min-h-screen bg-slate-950 p-4 space-y-6 pb-28 max-w-2xl mx-auto animate-in fade-in duration-700">
      
      <header className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Your Journey</h1>
        </div>
        <p className="text-sm text-slate-400">
          "And He found you lost and guided you." (93:7)
        </p>
      </header>

      <div className="space-y-4 relative">
        {/* Timeline Line */}
        <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-white/5 z-0" />

        {milestones.map((step) => (
          <div key={step.id} className="relative z-10">
            <Card 
              onClick={() => !step.locked && toggleMilestone(step.id)}
              className={`p-4 border transition-all duration-300 ${
                step.locked 
                  ? 'bg-slate-900/20 border-white/5 opacity-50 cursor-not-allowed' 
                  : step.completed 
                    ? 'bg-emerald-900/10 border-emerald-500/30 cursor-pointer'
                    : 'bg-slate-900/60 border-white/10 hover:border-indigo-500/30 cursor-pointer'
              }`}
            >
              <div className="flex gap-4">
                <div className="mt-0.5">
                  {step.locked ? (
                    <Lock className="w-5 h-5 text-slate-600" />
                  ) : step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-indigo-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${step.completed ? 'text-emerald-400' : 'text-white'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                </div>

                {!step.locked && !step.completed && (
                  <ArrowRight className="w-4 h-4 text-slate-500 self-center" />
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card className="p-5 bg-indigo-900/10 border-indigo-500/20 text-center">
        <Heart className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-white font-bold text-sm">You are never alone.</h3>
        <p className="text-xs text-slate-400 mt-1">
          2,410 other reverts are praying Fajr with you today.
        </p>
      </Card>

    </div>
  );
};