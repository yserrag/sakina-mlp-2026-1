import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card'; // [FACTS]: Verified import path
import { ZakatEngine } from '@/services/ZakatEngine'; // [FACTS]: Using @ alias for service
import { ZakatAssets } from '@/entities/user/model/store'; // [FACTS]: Importing from standardized store
import { Coins, AlertCircle, TrendingUp } from 'lucide-react';

/**
 * ZakatCalculator Component
 * [ANALYSIS]: Interactive MLP widget that purification of wealth based on 2.5% Sharia rule.
 */
export const ZakatCalculator: React.FC = () => {
  const [assets, setAssets] = useState<ZakatAssets>({
    cash: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    businessAssets: 0
  });

  // [FACTS]: Memoizing calculation to ensure high-fidelity performance
  const result = useMemo(() => ZakatEngine.calculate(assets), [assets]);

  const updateAsset = (key: keyof ZakatAssets, value: string) => {
    setAssets(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  return (
    <Card className="p-6 bg-slate-900/40 backdrop-blur-2xl border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif font-bold text-white text-lg">Zakat Calculator</h3>
          <p className="text-[10px] text-amber-400 uppercase font-black tracking-widest">Financial Purification</p>
        </div>
        <div className="p-2 bg-amber-500/10 rounded-full">
          <Coins className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {Object.keys(assets).map((key) => (
          <div key={key} className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input 
                type="number"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-7 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-700"
                placeholder="0.00"
                onChange={(e) => updateAsset(key as keyof ZakatAssets, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 overflow-hidden">
        <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/5 opacity-10" />
        
        <div className="relative text-center">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">Total Zakat Payable</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-bold text-amber-500/50 mt-1">$</span>
            <span className="text-4xl font-black text-white tabular-nums">
              {result.due.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          {!result.isEligible && (
            <div className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-slate-950/50 rounded-full inline-flex mx-auto">
              <AlertCircle className="w-3 h-3 text-slate-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                Below Nisab Threshold ($5,000)
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};