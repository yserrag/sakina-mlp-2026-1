import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Globe, Send, Info } from 'lucide-react';
import { selectBestModel, AIModelType } from '../../entities/ai-model/lib/selector';

export const ChatInterface = () => {
  const [modelType, setModelType] = useState<AIModelType>('UNAVAILABLE');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    selectBestModel().then(setModelType);
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] relative overflow-hidden">
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" /> Hikmah AI
        </h3>
        {/* Model Indicator [cite: 108] */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          modelType === 'LOCAL_NANO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {modelType === 'LOCAL_NANO' ? (
            <><ShieldCheck className="w-3 h-3" /> On-Device (Private)</>
          ) : (
            <><Globe className="w-3 h-3" /> Cloud Assisted</>
          )}
        </div>
      </header>

      <div className="space-y-4 mb-6">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          "Ask me about finding peace, morning adhkars, or understanding a verse."
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="How do I find Sakina today?"
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-white text-sm focus:border-blue-500 outline-none transition-all"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20">
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Hallucination Guard Warning [cite: 143-144] */}
      <div className="mt-6 flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <p className="text-[10px] text-slate-500 leading-tight">
          Sakina is an AI companion, not a Mufti. For legal rulings (Fatwa), please consult a local scholar [cite: 136-140].
        </p>
      </div>
    </div>
  );
};