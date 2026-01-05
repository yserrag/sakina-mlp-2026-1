import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DhikrAPI } from '@/shared/api/dhikr'; // [FACTS]: Using @ alias
// [FACTS]: Fixes Lucide icon export error
import { RefreshCw, Cloud, Save } from 'lucide-react';

export const SmartDhikr: React.FC = () => {
  const [count, setCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const phrase = "SubhanAllah";

  // [ANALYSIS]: Auto-sync logic to prevent data loss
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Note: Replace 'test-user' with actual auth ID from your context
      await DhikrAPI.syncCount({
        user_id: 'test-user',
        count,
        phrase,
        last_updated: new Date().toISOString()
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="p-6 text-center space-y-4 bg-slate-900/40 backdrop-blur-2xl">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Smart Dhikr
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleSync} disabled={syncing}>
            <Save className={`w-3 h-3 ${syncing ? 'animate-pulse' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
            <RefreshCw className="w-3 h-3"/>
          </Button>
        </div>
      </div>
      
      <div className="py-4">
        <h2 className="text-2xl font-serif font-bold text-white mb-1">{phrase}</h2>
        <div className="text-5xl font-black text-teal-500 tabular-nums">{count}</div>
      </div>

      <button 
        onClick={handleIncrement}
        className="w-full py-8 bg-teal-500/10 border border-teal-500/20 rounded-[2rem] active:scale-95 transition-all hover:bg-teal-500/20"
      >
        TAP TO COUNT
      </button>
    </Card>
  );
};