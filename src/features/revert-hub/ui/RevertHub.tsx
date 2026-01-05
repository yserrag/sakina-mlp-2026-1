import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { UserService } from '@/services/UserService';
import { BookOpen, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export const RevertHub: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, title: 'Shahada', desc: 'The Declaration of Faith' },
    { id: 2, title: 'Wudu', desc: 'The Method of Purification' },
    { id: 3, title: 'Salah', desc: 'Learning the 5 Daily Prayers' },
    { id: 4, title: 'Quran', desc: 'Foundations of Recitation' },
    { id: 5, title: 'Community', desc: 'Connecting with the Ummah' }
  ];

  // [FACTS]: Load progress from database on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const profile = await UserService.getProfile();
        if (profile) setCurrentStep(profile.revert_step || 1);
      } catch (e) {
        console.error("Failed to load journey progress", e);
      }
    };
    loadProgress();
  }, []);

  const handleStepComplete = async (stepId: number) => {
    try {
      await UserService.updateRevertStep(stepId);
      setCurrentStep(stepId);
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      <header className="px-2">
        <h1 className="text-2xl font-serif font-bold text-white">Revert Journey</h1>
        <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mt-1">Pillar 2: Guided Path</p>
      </header>

      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <Card 
              key={step.id} 
              className={`p-5 transition-all duration-500 border-white/5 ${
                isCurrent ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-slate-900/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-slate-700" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                    {step.id}. {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>

                {isCurrent && (
                  <button 
                    onClick={() => handleStepComplete(step.id + 1)}
                    className="p-2 bg-indigo-500 rounded-lg text-white hover:bg-indigo-400 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};