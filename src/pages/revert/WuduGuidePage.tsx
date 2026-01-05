import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface RevertPageProps {
  onBack: () => void;
}

export const WuduGuidePage = ({ onBack }: RevertPageProps) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 mb-8 p-2 hover:bg-white/5 rounded-xl transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </button>
      <h1 className="text-3xl font-bold">Wudu Step-by-Step</h1>
      <div className="mt-8 p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem]">
        <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Active Guide</p>
        <h2 className="text-xl font-bold mt-2">Niyyah (Intention)</h2>
        <p className="text-slate-400 mt-2">Intend to perform wudu for the sake of Allah.</p>
      </div>
    </div>
  );
};