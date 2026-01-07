import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Calendar, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Entry {
  id: string;
  date: string;
  text: string;
}

export const JournalWidget = () => {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [view, setView] = useState<'write' | 'list'>('write');

  // Load entries on mount
  useEffect(() => {
    const saved = localStorage.getItem('sakina_journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      text: text
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('sakina_journal', JSON.stringify(updated));
    setText('');
    setView('list');
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('sakina_journal', JSON.stringify(updated));
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[350px]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500/10 p-1.5 rounded-lg">
            <PenTool className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Reflection</h3>
            <p className="text-[10px] text-slate-400">Your Private Vault</p>
          </div>
        </div>
        <div className="flex gap-2">
           {view === 'list' ? (
             <Button variant="ghost" onClick={() => setView('write')} className="text-xs text-purple-400">
               + New Entry
             </Button>
           ) : (
             <Button variant="ghost" onClick={() => setView('list')} className="text-xs text-slate-400">
               View History
             </Button>
           )}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-4 flex flex-col">
        
        {view === 'write' ? (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are you grateful for today? (This stays on your device)"
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 resize-none placeholder:text-slate-600 mb-4"
            />
            <Button onClick={handleSave} disabled={!text.trim()} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save to Device
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            {entries.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No entries yet. Start writing!
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="bg-slate-950/50 border border-white/5 p-3 rounded-lg group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
                       <Calendar className="w-3 h-3" /> {entry.date}
                     </span>
                     <button onClick={() => handleDelete(entry.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                       <Trash2 className="w-3 h-3" />
                     </button>
                   </div>
                   <p className="text-sm text-slate-300 whitespace-pre-wrap">{entry.text}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </Card>
  );
};