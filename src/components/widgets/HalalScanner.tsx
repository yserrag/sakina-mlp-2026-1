import React, { useState } from 'react';
import { Scan, Search, CheckCircle, XCircle, AlertTriangle, Loader2, Camera, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGemini } from '../../features/ai/model/useGemini'; // Import the Brain

export const HalalScanner = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'SCAN' | 'SEARCH'>('SEARCH');
  const [result, setResult] = useState<{ status: string; details: string; flagged: string } | null>(null);
  
  // Connect to our new AI Brain
  const { generateResponse, loading, error } = useGemini();

  // THE SCANNER BRAIN 🧠
  const analyzeIngredients = async (text: string) => {
    if (!text.trim()) return;
    
    // 1. The Strict "System Prompt"
    const prompt = `
      Act as a strict Halal Food Auditor. Analyze this input: "${text}".
      
      Rules:
      1. Identify forbidden items: Pork, Lard, Carmine (E120), Gelatin (unless plant/fish), Alcohol (ethanol), Cochineal.
      2. Statuses: 
         - "HARAM" (Explicitly forbidden)
         - "MASHBOOH" (Doubtful/Unknown origin, e.g., "Mono- and diglycerides", "Gelatin" without source)
         - "HALAL" (Safe ingredients)
      
      Output ONLY raw JSON (no markdown) in this format:
      {
        "status": "HALAL" | "HARAM" | "MASHBOOH",
        "details": "Short reason (max 10 words)",
        "flagged": "List of suspicious ingredients or 'None'"
      }
    `;

    // 2. Ask the AI
    const response = await generateResponse(prompt);

    // 3. Parse the Intelligence
    if (response) {
      try {
        // Clean up markdown if Gemini adds it (```json ...)
        const cleanJson = response.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        setResult(data);
      } catch (e) {
        console.error("AI Parse Error", e);
        setResult({ status: 'MASHBOOH', details: 'Analysis Unclear', flagged: 'Please try again' });
      }
    }
  };

  const handleScanSimulation = () => {
    // In Phase 1, we simulate the "OCR" part (getting text from camera)
    // But we use REAL AI to analyze it.
    const mockScannedText = "Glucose Syrup, Sugar, Gelatin, Citric Acid, Red 40"; 
    setQuery(mockScannedText); // Show the user what we "scanned"
    setMode('SEARCH');
    analyzeIngredients(mockScannedText);
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[350px]">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg">
            <Scan className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Halal Scanner</h3>
            <p className="text-[10px] text-slate-400">AI Ingredient Analyst</p>
          </div>
        </div>
        
        {/* Toggle Modes */}
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
           <button onClick={() => setMode('SEARCH')} className={`p-1.5 rounded-md transition-all ${mode === 'SEARCH' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>
             <Search className="w-4 h-4" />
           </button>
           <button onClick={() => setMode('SCAN')} className={`p-1.5 rounded-md transition-all ${mode === 'SCAN' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>
             <Camera className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col p-4">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-4">
            <p className="text-xs text-red-400">AI Error: {error}. Check API Key.</p>
          </div>
        )}

        {/* SCAN MODE (Visual Only for MLP) */}
        {mode === 'SCAN' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 border-2 border-dashed border-emerald-500/30 rounded-xl flex items-center justify-center animate-pulse">
               <Camera className="w-8 h-8 text-emerald-500/50" />
            </div>
            <p className="text-xs text-slate-400 text-center max-w-[200px]">
              Point camera at ingredients list. <br/> (Simulating OCR for Demo)
            </p>
            <Button onClick={handleScanSimulation} className="bg-emerald-600 text-white">
              Capture & Analyze
            </Button>
          </div>
        ) : (
          /* SEARCH/RESULT MODE */
          <>
            {!result ? (
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && analyzeIngredients(query)}
                    placeholder="Paste ingredients (e.g. Gelatin, E120)..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none text-white placeholder:text-slate-600"
                  />
                  <button 
                    onClick={() => analyzeIngredients(query)}
                    disabled={loading || !query.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Hints */}
                <div className="flex gap-2 justify-center flex-wrap">
                   {['Gelatin', 'E120', 'Lecithin', 'Chicken'].map(item => (
                     <button key={item} onClick={() => { setQuery(item); analyzeIngredients(item); }} className="text-[10px] bg-slate-800 border border-white/5 px-2 py-1 rounded-md text-slate-400 hover:text-white hover:border-emerald-500/50 transition-colors">
                       {item}
                     </button>
                   ))}
                </div>
              </div>
            ) : (
              /* RESULT CARD */
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className={`rounded-xl p-6 border flex flex-col items-center text-center mb-4 ${
                   result.status === 'HALAL' ? 'bg-emerald-900/20 border-emerald-500/30' :
                   result.status === 'HARAM' ? 'bg-red-900/20 border-red-500/30' :
                   'bg-amber-900/20 border-amber-500/30'
                }`}>
                   {result.status === 'HALAL' && <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />}
                   {result.status === 'HARAM' && <XCircle className="w-12 h-12 text-red-500 mb-2" />}
                   {result.status === 'MASHBOOH' && <AlertTriangle className="w-12 h-12 text-amber-500 mb-2" />}
                   
                   <h2 className={`text-2xl font-black tracking-wider ${
                      result.status === 'HALAL' ? 'text-emerald-400' :
                      result.status === 'HARAM' ? 'text-red-400' :
                      'text-amber-400'
                   }`}>{result.status}</h2>
                   
                   <p className="text-white font-medium mt-1">{result.details}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2">
                   <p className="text-[10px] uppercase text-slate-500 font-bold">Flagged Items</p>
                   <p className="text-sm text-slate-300 font-mono">{result.flagged}</p>
                </div>

                <Button variant="outline" onClick={() => { setResult(null); setQuery(''); }} className="w-full mt-4 border-white/10 text-slate-400 hover:text-white">
                   Check Another
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};