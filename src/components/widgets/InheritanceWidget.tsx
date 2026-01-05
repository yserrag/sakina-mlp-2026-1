import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { InheritanceEngine } from '../services/inheritanceEngine';
import { Heir, InheritanceResult } from '../types';
import { AlertTriangle, CheckCircle, RefreshCcw, Plus, Trash2, Calculator, PieChart, ChevronDown, ChevronUp } from 'lucide-react';

export const InheritanceWidget: React.FC = () => {
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: '1', relation: 'Husband', count: 1 },
    { id: '2', relation: 'Daughter', count: 2 },
  ]);
  const [results, setResults] = useState<{data: InheritanceResult[], isAwl: boolean} | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const availableRelations = ['Husband', 'Wife', 'Father', 'Mother', 'Son', 'Daughter'];
  const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-indigo-500', 'bg-slate-500'];

  const addHeir = (relation: any) => {
    const exists = (rel: string) => heirs.some(h => h.relation === rel);
    if (relation === 'Husband' && (exists('Husband') || exists('Wife'))) return;
    if (relation === 'Wife' && exists('Husband')) return;
    if ((relation === 'Father' || relation === 'Mother') && exists(relation)) return;

    setHeirs(prev => {
        const existing = prev.find(h => h.relation === relation);
        if (existing) {
            if (relation === 'Wife' && existing.count >= 4) return prev;
            return prev.map(h => h.relation === relation ? { ...h, count: h.count + 1 } : h);
        }
        return [...prev, { id: Date.now().toString(), relation, count: 1 }];
    });
    setResults(null);
  };

  const removeHeir = (id: string) => {
    setHeirs(prev => prev.filter(h => h.id !== id));
    setResults(null);
  };

  const updateCount = (id: string, delta: number) => {
    setHeirs(prev => prev.map(h => {
        if (h.id !== id) return h;
        const newCount = h.count + delta;
        if (newCount < 1) return h;
        if (h.relation === 'Wife' && newCount > 4) return h;
        return { ...h, count: newCount };
    }));
    setResults(null);
  };

  const calculate = () => {
    const output = InheritanceEngine.calculate(heirs);
    setResults({ data: output.results, isAwl: output.isAwl });
  };

  return (
    <Card className={`border-l-4 border-gold-500 transition-all duration-300 ${isExpanded ? 'h-full' : 'h-auto'}`}>
      <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
            <div className="bg-gold-500/20 p-2 rounded-lg">
                <Calculator className="w-5 h-5 text-gold-400" />
            </div>
            <div>
                <h2 className="text-lg font-serif font-bold text-slate-100">Inheritance</h2>
                <p className="text-xs text-slate-500">Faraid Calculator</p>
            </div>
        </div>
        <div className="text-slate-500">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-4 duration-300 mt-6">
            <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {availableRelations.map(rel => (
                        <button
                            key={rel}
                            onClick={() => addHeir(rel)}
                            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> {rel}
                        </button>
                    ))}
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {heirs.length === 0 && <p className="text-center text-sm text-slate-600 py-4">Add heirs to begin</p>}
                    {heirs.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                            <span className="font-medium text-slate-200">{h.relation}</span>
                            <div className="flex items-center gap-3">
                                {['Son', 'Daughter', 'Wife'].includes(h.relation) && (
                                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                        <button onClick={() => updateCount(h.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white">-</button>
                                        <span className="text-xs font-bold w-4 text-center text-slate-200">{h.count}</span>
                                        <button onClick={() => updateCount(h.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white">+</button>
                                    </div>
                                )}
                                <button onClick={() => removeHeir(h.id)} className="text-rose-400/70 hover:text-rose-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!results ? (
                <Button onClick={calculate} disabled={heirs.length === 0} className="w-full bg-gold-600 hover:bg-gold-700 text-white">
                Calculate
                </Button>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className={`p-3 rounded-lg mb-4 flex items-start gap-3 ${results.isAwl ? 'bg-amber-900/30 text-amber-200' : 'bg-emerald-900/30 text-emerald-200'}`}>
                    {results.isAwl ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5" />}
                    <div className="text-sm">
                    <span className="font-bold block">{results.isAwl ? 'Awl Applied' : 'Standard'}</span>
                    <span className="text-xs opacity-70">{results.isAwl ? "Shares adjusted." : "Valid distribution."}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <PieChart className="w-3 h-3" /> Breakdown
                    </h4>
                    <div className="h-4 w-full rounded-full flex overflow-hidden bg-black/30">
                        {results.data.map((r, idx) => (
                            <div key={idx} className={`h-full ${COLORS[idx % COLORS.length]}`} style={{ width: `${r.percentage}%` }} />
                        ))}
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    {results.data.map((r, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-8 rounded-full ${COLORS[idx % COLORS.length]}`} />
                            <div>
                                <span className="font-bold text-slate-200 block text-sm">{r.heir}</span>
                                {r.note && <span className="text-[10px] text-slate-500">{r.note}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                        <span className="font-mono font-bold text-gold-400 block">{r.share}</span>
                        <span className="text-[10px] text-slate-500 block">{r.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                    ))}
                </div>

                <Button variant="outline" size="sm" onClick={() => setResults(null)} className="w-full border-white/10 text-slate-300 hover:bg-white/5">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Recalculate
                </Button>
                </div>
            )}
        </div>
      )}
    </Card>
  );
};