import React, { useState } from 'react';
import { Camera, Search, ShieldAlert, Info, ExternalLink } from 'lucide-react';
import { HMC_RULES } from '../model/rules';

export const ScannerCard = () => {
  const [result, setResult] = useState<any>(null);

  const checkIngredient = (text: string) => {
    const found = Object.keys(HMC_RULES).find(k => text.toLowerCase().includes(k));
    if (found) setResult(HMC_RULES[found]);
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" /> Halal Scanner
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HMC Standard</span>
      </div>

      {result ? (
        <div className={`p-4 rounded-2xl border transition-all ${
          result.status === 'Haram' ? 'bg-rose-900/20 border-rose-500/30' : 'bg-amber-900/20 border-amber-500/30'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <ShieldAlert className={result.status === 'Haram' ? 'text-rose-400' : 'text-amber-400'} />
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-tighter">{result.status} Ingredient Detected</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{result.reason}</p>
            </div>
          </div>
          
          {/* Transparency Link */}
          <a 
            href={result.link} 
            target="_blank" 
            className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 p-2 rounded-lg w-fit"
          >
            <Info className="w-3 h-3" /> VERIFY ON HMC WEBSITE <ExternalLink className="w-3 h-3" />
          </a>
          
          <button onClick={() => setResult(null)} className="mt-4 text-xs text-slate-500 underline">Scan another item</button>
        </div>
      ) : (
        <button className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:border-blue-500/30 transition group">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-600/20 transition">
            <Search className="w-6 h-6 text-slate-500 group-hover:text-blue-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Point camera at ingredients list</span>
        </button>
      )}
    </div>
  );
};