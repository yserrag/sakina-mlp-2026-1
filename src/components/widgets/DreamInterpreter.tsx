import React, { useState } from 'react';
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Moon, CloudMoon, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

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

  const interpretDream = async () => {
    if (!dream.trim() || loading) return;
    
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Act as a wise Islamic Dream Interpreter. Analyze this dream: "${dream}".
        
        Guidelines:
        1. STRICT ADHERENCE: Use principles from established Islamic dream interpretation (e.g., Ibn Sirin) but be cautious.
        2. If it seems like a nightmare or scary, classify as 'BAD'. Advise the user to seek refuge in Allah (Ayatul Kursi, spitting dryly to left) and NOT interpret the details.
        3. If it is pleasant or symbolic, classify as 'GOOD' or 'MIXED'. Interpret symbols based on traditional Islamic symbolism.
        4. Tone: Tentative ("Allah knows best"), gentle, and spiritual.
        5. Advice: Provide practical spiritual advice based on the dream type.
        6. Do not make specific predictions about the future (Ghayb).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["GOOD", "BAD", "MIXED"] },
              summary: { type: Type.STRING, description: "Brief interpretation of the meaning." },
              symbols: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key symbols identified." },
              advice: { type: Type.STRING, description: "Spiritual recommendation." }
            },
            required: ["type", "summary", "symbols", "advice"]
          } as Schema
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Dream Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-indigo-900 bg-gradient-to-br from-slate-900 to-indigo-950 text-white min-h-[320px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-indigo-100 flex items-center gap-2">
            Dream Interpreter
          </h2>
          <p className="text-sm text-indigo-300">Tafseer Al-Ahlam</p>
        </div>
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
          <Moon className="w-5 h-5 text-indigo-200" />
        </div>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="bg-indigo-900/30 p-3 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
            <span className="font-bold text-indigo-100 block mb-1">Etiquette of Dreams:</span>
            True dreams are from Allah, bad dreams are from Shaytan. If you see something you dislike, do not share it.
          </div>
          
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="I saw myself flying over a green garden..."
            className="flex-1 w-full bg-slate-800/50 border border-indigo-500/30 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-indigo-400/50 resize-none transition-all"
          />
          
          <Button 
            onClick={interpretDream} 
            disabled={!dream.trim() || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-900/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CloudMoon className="w-4 h-4 mr-2" />}
            Interpret Dream
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-3 rounded-xl flex items-center gap-3 ${
            result.type === 'BAD' ? 'bg-red-500/20 text-red-100 border border-red-500/30' : 
            'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30'
          }`}>
             {result.type === 'BAD' ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
             <div>
                <span className="font-bold text-sm block">
                    {result.type === 'BAD' ? 'Unpleasant Dream' : 'Positive Vision'}
                </span>
                <span className="text-xs opacity-80">
                    {result.type === 'BAD' ? 'Seek refuge in Allah from it.' : 'A good omen, inshaAllah.'}
                </span>
             </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Interpretation</h3>
            <p className="text-sm leading-relaxed text-indigo-50 font-medium">"{result.summary}"</p>
          </div>

          {result.symbols.length > 0 && result.type !== 'BAD' && (
             <div className="flex flex-wrap gap-2">
                {result.symbols.map((s, i) => (
                    <span key={i} className="text-[10px] bg-indigo-500/30 border border-indigo-400/30 px-2 py-1 rounded-md text-indigo-200">
                        {s}
                    </span>
                ))}
             </div>
          )}

          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
             <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Advice</h3>
             <p className="text-xs text-indigo-100 italic">{result.advice}</p>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="w-full border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-400">
                Analyze Another
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-indigo-400/50">
             Disclaimer: AI interpretation. Consult a scholar for serious matters.
          </p>
        </div>
      )}
    </Card>
  );
};