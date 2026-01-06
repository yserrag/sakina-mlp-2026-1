import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Moon, CloudMoon, Loader2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface Interpretation {
  type: 'GOOD' | 'BAD' | 'MIXED';
  summary: string;
  symbols: string[];
  advice: string;
}

export const DreamInterpreter: React.FC = () => {
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Interpretation | null>(null);

  // [MOCK] Simulates AI Interpretation for MLP Demo
  const interpretDream = async () => {
    if (!dream.trim() || loading) return;
    
    setLoading(true);
    setResult(null);

    // Simulate AI thinking time
    setTimeout(() => {
      const lowerDream = dream.toLowerCase();
      let mockResponse: Interpretation;

      // Simple keyword logic for demo purposes
      if (lowerDream.includes('snake') || lowerDream.includes('fire') || lowerDream.includes('falling') || lowerDream.includes('dark')) {
        mockResponse = {
          type: 'BAD',
          summary: "This dream may represent hidden fears or an enemy. In Islamic tradition, unpleasant dreams are often from Shaytan to cause distress.",
          symbols: ['Darkness/Fear', 'Warning'],
          advice: "Seek refuge in Allah (recite A'udhu billahi min ash-shaytan ir-rajim) and dry spit to your left 3 times. Do not share this dream."
        };
      } else if (lowerDream.includes('light') || lowerDream.includes('garden') || lowerDream.includes('flying') || lowerDream.includes('water')) {
        mockResponse = {
          type: 'GOOD',
          summary: "A beautiful vision. Gardens and light often symbolize spiritual growth, peace, and the mercy of Allah.",
          symbols: ['Light/Garden', 'Mercy'],
          advice: "Praise Allah (Alhamdulillah) for this good news. You may share this with those you love and trust."
        };
      } else {
        mockResponse = {
          type: 'MIXED',
          summary: "This dream appears to be a reflection of your daily thoughts ('Hadith an-Nafs') rather than a clear spiritual message.",
          symbols: ['Daily Life', 'Thoughts'],
          advice: "Do not worry about it. Focus on your waking life and connection with Allah."
        };
      }

      setResult(mockResponse);
      setLoading(false);
    }, 2000); // 2 second delay
  };

  return (
    <Card className="border-l-4 border-indigo-500 bg-gradient-to-br from-slate-900 to-indigo-950/50 text-white min-h-[320px] flex flex-col shadow-xl">
      <div className="flex justify-between items-start mb-4 p-4 pb-0">
        <div>
          <h2 className="text-xl font-serif font-bold text-indigo-100 flex items-center gap-2">
            Dream Interpreter
          </h2>
          <p className="text-xs text-indigo-300">Tafseer Al-Ahlam</p>
        </div>
        <div className="bg-indigo-500/10 p-2 rounded-lg backdrop-blur-sm border border-indigo-500/20">
          <Moon className="w-5 h-5 text-indigo-300" />
        </div>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col space-y-4 p-4 pt-0">
          <div className="bg-indigo-900/20 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
            <span className="font-bold text-indigo-100 block mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Etiquette of Dreams:</span>
            True dreams are from Allah, bad dreams are from Shaytan. If you see something you dislike, do not share it.
          </div>
          
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="I saw myself flying over a green garden..."
            className="flex-1 w-full bg-slate-950/50 border border-indigo-500/30 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-indigo-400/30 resize-none transition-all"
          />
          
          <Button 
            onClick={interpretDream} 
            disabled={!dream.trim() || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-900/20 h-12"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CloudMoon className="w-4 h-4 mr-2" />}
            {loading ? "Analyzing Symbols..." : "Interpret Dream"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 p-4 pt-0">
          <div className={`p-3 rounded-xl flex items-center gap-3 border ${
            result.type === 'BAD' ? 'bg-red-500/10 text-red-200 border-red-500/20' : 
            result.type === 'GOOD' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' :
            'bg-slate-700/30 text-slate-200 border-white/10'
          }`}>
             {result.type === 'BAD' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <ShieldCheck className="w-5 h-5 shrink-0" />}
             <div>
                <span className="font-bold text-sm block">
                    {result.type === 'BAD' ? 'Unpleasant Dream' : result.type === 'GOOD' ? 'Positive Vision' : 'Mixed / Psychological'}
                </span>
                <span className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                    {result.type === 'BAD' ? 'Seek Refuge' : result.type === 'GOOD' ? 'Good Omen' : 'Neutral'}
                </span>
             </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Interpretation</h3>
            <p className="text-sm leading-relaxed text-indigo-50 font-medium bg-white/5 p-3 rounded-lg border border-white/5">"{result.summary}"</p>
          </div>

          {result.symbols.length > 0 && result.type !== 'BAD' && (
             <div className="flex flex-wrap gap-2">
                {result.symbols.map((s, i) => (
                   <span key={i} className="text-[10px] bg-indigo-500/20 border border-indigo-400/20 px-2 py-1 rounded-md text-indigo-200">
                      #{s}
                   </span>
                ))}
             </div>
          )}

          <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/20">
             <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Advice</h3>
             <p className="text-xs text-indigo-100 italic">{result.advice}</p>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-white">
                Analyze Another
            </Button>
          </div>
          
          <p className="text-[9px] text-center text-indigo-400/50">
             AI interpretation (Demo Mode). Consult a scholar for serious matters.
          </p>
        </div>
      )}
    </Card>
  );
};