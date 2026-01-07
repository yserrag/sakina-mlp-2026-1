import React, { useState } from 'react';
import { Moon, Sparkles, AlertTriangle, BookOpen, Loader2, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGemini } from '../../features/ai/model/useGemini';

export const DreamInterpreter = () => {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<{ type: string; interpretation: string; advice: string } | null>(null);
  
  // Use our Iron Dome AI Hook
  const { generateResponse, loading, error } = useGemini();

  const handleInterpret = async () => {
    if (!dream.trim()) return;

    // [UPGRADE] A stricter prompt that forces symbol extraction based on Ibn Sirin
    const prompt = `
      Act as an expert Islamic Dream Interpreter using Ibn Sirin's "Muntakhab al-Kalam fi Tafsir al-Ahlam".
      
      User's Dream: "${dream}"

      Instructions:
      1. Extract key symbols (e.g., Water, Snake, Flying, Teeth).
      2. Match each symbol to Ibn Sirin's specific classical meaning.
      3. Classify the dream type based on the symbols.

      Output ONLY JSON in this format:
      {
        "type": "RUYA" | "HULM" | "NAFS",
        "interpretation": "Specific meaning of the symbols found (e.g., 'The snake represents a hidden enemy...'). Avoid vague horoscopes.",
        "advice": "Specific Sunnah action based on the result (e.g. 'Seek refuge', 'Give sadaqah', 'Praise Allah')."
      }
    `;

    // 2. Ask Gemini
    const response = await generateResponse(prompt);

    // 3. Parse Response
    if (response) {
      try {
        const cleanJson = response.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        setResult(data);
      } catch (e) {
        // Fallback if AI output is messy
        setResult({
          type: 'NAFS',
          interpretation: 'Analysis inconclusive. This may be a reflection of daily thoughts.',
          advice: 'Perform Wudu and recite Ayatul Kursi before sleeping.'
        });
      }
    }
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[350px]">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-indigo-950/30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-1.5 rounded-lg">
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Dream Guide</h3>
            <p className="text-[10px] text-slate-400">Based on Ibn Sirin's Methodology</p>
          </div>
        </div>
        <Info className="w-4 h-4 text-slate-500" />
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
             <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {!result ? (
          <div className="flex-1 flex flex-col gap-4">
             <textarea 
               value={dream}
               onChange={(e) => setDream(e.target.value)}
               placeholder="Example: I saw myself drinking fresh milk in a green garden..."
               className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
             />
             <Button 
               onClick={handleInterpret}
               disabled={loading || !dream.trim()}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
               Interpret Dream
             </Button>
          </div>
        ) : (
          /* Result Card */
          <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className={`flex-1 rounded-xl p-6 border flex flex-col items-center text-center justify-center mb-4 ${
               result.type === 'RUYA' ? 'bg-indigo-900/20 border-indigo-500/30' :
               result.type === 'HULM' ? 'bg-slate-800 border-slate-600' :
               'bg-slate-900 border-white/10'
            }`}>
               
               {result.type === 'RUYA' && <Sparkles className="w-10 h-10 text-indigo-400 mb-3" />}
               {result.type === 'HULM' && <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />}
               {result.type === 'NAFS' && <BookOpen className="w-10 h-10 text-slate-400 mb-3" />}

               <h2 className="text-xl font-bold text-white mb-1">
                 {result.type === 'RUYA' ? 'Good Vision (Ru\'ya)' : 
                  result.type === 'HULM' ? 'Unpleasant Dream' : 
                  'Psychological'}
               </h2>
               
               <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                 {result.interpretation}
               </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
               <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Recommended Action</p>
               <p className="text-sm text-indigo-300">{result.advice}</p>
            </div>

            <Button variant="ghost" onClick={() => { setResult(null); setDream(''); }} className="mt-4 text-slate-400">
               Interpret Another
            </Button>
          </div>
        )}
      </div>
      
      {/* Disclaimer Footer */}
      <div className="p-3 bg-slate-950 border-t border-white/5 text-[10px] text-slate-500 text-center">
        Disclaimer: AI interpretation for reflection only. Not a Fatwa. Only Allah knows the unseen.
      </div>
    </Card>
  );
};