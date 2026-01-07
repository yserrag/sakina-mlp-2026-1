import React, { useState } from 'react';
import { Calculator, Coins, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const ZakatCalculator = () => {
  const [values, setValues] = useState({
    cash: '',
    gold: '',
    stocks: ''
  });
  
  // Safe static value for Gold Nisab (85g Gold @ ~£50/g)
  // In a real app, we would fetch live gold prices
  const NISAB_THRESHOLD = 4250; 

  const totalWealth = (Number(values.cash) || 0) + (Number(values.gold) || 0) + (Number(values.stocks) || 0);
  const isEligible = totalWealth >= NISAB_THRESHOLD;
  const zakatDue = isEligible ? totalWealth * 0.025 : 0;

  const handleChange = (field: string, val: string) => {
    setValues(prev => ({ ...prev, [field]: val }));
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[400px]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500/10 p-1.5 rounded-lg">
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Zakat Check</h3>
            <p className="text-[10px] text-slate-400">Annual Purification</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-full border border-white/5">
          <Info className="w-3 h-3" />
          <span>Nisab: £{NISAB_THRESHOLD.toLocaleString()}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        
        {/* INPUTS */}
        <div className="space-y-3">
          <div className="group">
            <label className="text-xs text-slate-400 ml-1 mb-1 block group-focus-within:text-emerald-400 transition-colors">Cash / Bank Balance</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">£</span>
              <input 
                type="number" 
                value={values.cash}
                onChange={(e) => handleChange('cash', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-xs text-slate-400 ml-1 mb-1 block group-focus-within:text-emerald-400 transition-colors">Gold & Silver Value</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">£</span>
              <input 
                type="number" 
                value={values.gold}
                onChange={(e) => handleChange('gold', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-xs text-slate-400 ml-1 mb-1 block group-focus-within:text-emerald-400 transition-colors">Stocks / Crypto</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">£</span>
              <input 
                type="number" 
                value={values.stocks}
                onChange={(e) => handleChange('stocks', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* RESULT CARD */}
        <div className={`mt-auto rounded-xl p-4 border transition-all duration-500 ${isEligible ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-950 border-white/5'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Wealth</p>
              <p className="text-lg text-white font-mono">£{totalWealth.toLocaleString()}</p>
            </div>
            {isEligible ? (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded font-bold border border-emerald-500/20">ELIGIBLE</span>
            ) : (
               <span className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded font-bold border border-white/5">BELOW NISAB</span>
            )}
          </div>

          {isEligible ? (
             <div className="mt-3 pt-3 border-t border-emerald-500/20">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-emerald-400 font-bold">Zakat Due (2.5%)</span>
                 <span className="text-2xl text-white font-bold font-mono">£{zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               <p className="text-[10px] text-emerald-400/60 mt-2">
                 *Ensure this wealth has been held for one lunar year (Hawl).
               </p>
             </div>
          ) : (
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              <span>You are below the Nisab threshold (£{NISAB_THRESHOLD}). No Zakat due yet.</span>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
};