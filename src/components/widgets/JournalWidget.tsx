import React, { useState } from 'react';
import { Lock, Unlock, Plus, Save, Trash2, Book } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSecureJournal, type JournalEntry } from '../../hooks/useSecureJournal';

export const JournalWidget = () => {
  const { entries, saveEntry, loadEntries, obliterateData, loading } = useSecureJournal();
  
  // UI State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [view, setView] = useState<'list' | 'new'>('list');
  
  // New Entry State
  const [newText, setNewText] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('grateful');

  const handleUnlock = async () => {
    if (pin.length < 4) return;
    setIsUnlocked(true);
    // Attempt to decrypt/load using the provided PIN
    await loadEntries(['entry-1'], pin); 
  };

  const handleSave = async () => {
    if (!newText.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood,
      text: newText,
      tags: []
    };

    await saveEntry(entry, pin);
    setNewText('');
    setView('list');
  };

  // LOCKED VIEW
  if (!isUnlocked) {
    return (
      <Card className="h-64 flex flex-col items-center justify-center space-y-4 bg-slate-900 border-slate-800 relative overflow-hidden">
        {/* [FIX] Added pointer-events-none so this doesn't block clicks */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 relative z-10">
          <Lock className="w-6 h-6 text-emerald-500" />
        </div>
        
        <div className="text-center relative z-10">
          <h3 className="text-white font-bold">Sakina Vault</h3>
          <p className="text-xs text-slate-500 mt-1">End-to-End Encrypted Journal</p>
        </div>

        {/* [FIX] Added relative z-10 to ensure input is clickable */}
        <div className="flex gap-2 relative z-10">
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-center text-white tracking-widest focus:border-emerald-500 outline-none placeholder:tracking-normal"
            maxLength={6}
          />
          <Button onClick={handleUnlock} disabled={!pin || pin.length < 4}>
            <Unlock className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  // UNLOCKED VIEW (Remains the same)
  return (
    <Card className="min-h-[300px] bg-slate-900 border-slate-800 flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-white">My Reflections</span>
        </div>
        <div className="flex gap-2">
           {view === 'list' && (
             <Button size="sm" onClick={() => setView('new')} className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white border-none">
               <Plus className="w-3 h-3 mr-1" /> New
             </Button>
           )}
           {view === 'new' && (
             <Button size="sm" variant="ghost" onClick={() => setView('list')}>
               Cancel
             </Button>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto max-h-64">
        {view === 'new' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['grateful', 'anxious', 'hopeful', 'sad'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setMood(m as any)}
                  className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${
                    mood === m 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                      : 'border-slate-700 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Start writing... (Encrypted)"
              className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500/50 outline-none resize-none placeholder:text-slate-600"
            />
            <Button onClick={handleSave} disabled={loading || !newText} className="w-full bg-emerald-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Encrypt & Save
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <p className="text-xs">Your vault is empty.</p>
                <p className="text-[10px] mt-1">Entries are encrypted with your PIN.</p>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 animate-in fade-in">
                   <div className="flex justify-between items-start mb-1">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                       entry.mood === 'grateful' ? 'bg-green-500/10 text-green-400' :
                       entry.mood === 'anxious' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                     }`}>
                       {entry.mood}
                     </span>
                     <span className="text-[10px] text-slate-500">
                       {new Date(entry.timestamp).toLocaleDateString()}
                     </span>
                   </div>
                   <p className="text-sm text-slate-300 line-clamp-2">{entry.text}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-center">
        <button 
          onClick={obliterateData}
          className="text-[10px] text-slate-600 hover:text-red-500 flex items-center gap-1 transition-colors"
          title="Permanently delete keys and data"
        >
          <Trash2 className="w-3 h-3" /> Shred Vault
        </button>
      </div>
    </Card>
  );
};