import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card } from '../ui/Card';
import { 
  BookOpen, Sparkles, Lightbulb, CheckCircle2, Circle, ArrowRight, Loader2, 
  User, Mic, Star, X, List, Pause, Play, Search
} from 'lucide-react';
import { PrayerWidget } from './PrayerWidget';

// [TYPES]
interface ConceptExplanation { definition: string; analogy: string; benefit: string; }
interface FeedbackResult { score: number; feedback: string; }

// [DATA]
const SUGGESTED_QUESTIONS = ["What is Wudu?", "Why do we pray?", "What is Halal?", "Who is the Prophet?"];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const RevertJourney: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'LIBRARY'>('LEARN');
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isHoldingRef = useRef<boolean>(false);

  // [CRITICAL] Standard Vite Access
  const getApiKey = () => {
      const key = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!key) console.warn("⚠️ API Key not found in Environment Variables");
      return key;
  };

  const analyzeAudio = async (blob: Blob, text: string) => {
      setIsAnalyzing(true);
      const apiKey = getApiKey();
      
      if (!apiKey) {
          setFeedback({ score: 0, feedback: "Configuration Error: API Key missing on Cloudflare." });
          setIsAnalyzing(false);
          return;
      }

      try {
          const ai = new GoogleGenerativeAI(apiKey);
          const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
          const base64Audio = await blobToBase64(blob);

          const prompt = `User practicing: "${text}". Rate pronunciation 0-100 and give 1 short sentence of feedback. Return ONLY JSON: { "score": number, "feedback": "string" }`;

          const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: "audio/webm", data: base64Audio } }
                ]
            }]
          });

          const cleanJson = result.response.text().replace(/```json|```/g, '').trim();
          setFeedback(JSON.parse(cleanJson));
      } catch (e) {
          console.error(e);
          setFeedback({ score: 0, feedback: "Audio analysis failed. Please try again." });
      } finally {
          setIsAnalyzing(false);
      }
  };

  const startRecording = async (id: string, text: string) => {
      try {
          isHoldingRef.current = true;
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (!isHoldingRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          chunksRef.current = [];
          mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
          mediaRecorder.onstop = () => {
              setIsRecording(false);
              if (chunksRef.current.length > 0) analyzeAudio(new Blob(chunksRef.current, { type: 'audio/webm' }), text);
              stream.getTracks().forEach(t => t.stop());
          };
          mediaRecorder.start();
          setIsRecording(true);
          setFeedback(null);
      } catch (err) { alert("Mic Access Denied."); }
  };

  const stopRecording = useCallback(() => {
      isHoldingRef.current = false;
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  }, []);

  const explainConcept = async (queryOverride?: string) => {
    const query = queryOverride || concept;
    if (!query.trim() || loading) return;
    setLoading(true);
    setExplanation(null);
    setConcept(query);
    
    const apiKey = getApiKey();
    if (!apiKey) {
        setExplanation({ definition: "System Error", analogy: "Missing Key", benefit: "Check Cloudflare Settings." });
        setLoading(false);
        return;
    }

    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Explain "${query}" to a beginner Muslim. Return ONLY JSON: { "definition": "string", "analogy": "string", "benefit": "string" }`;
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const cleanJson = result.response.text().replace(/```json|```/g, '').trim();
      setExplanation(JSON.parse(cleanJson));
    } catch (e) {
      setExplanation({ definition: "Connection Error", analogy: "Please Retry", benefit: "Network or Key issue." });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 p-5 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">My Journey</h2>
                <p className="text-teal-200/60 text-xs flex items-center gap-2 mt-1 uppercase font-bold tracking-widest"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Path of Light</p>
             </div>
             <div className="text-right"><div className="text-xl font-bold text-yellow-400 font-mono">50%</div><div className="text-[9px] uppercase tracking-widest text-teal-300/50">Complete</div></div>
          </div>
          <div className="bg-[#0f172a] p-1 rounded-2xl flex text-[10px] font-bold uppercase border border-white/5">
             {['LEARN', 'LIBRARY'].map((tab) => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2.5 rounded-xl transition-all ${activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
             ))}
          </div>
        </div>
      </div>

      {activeTab === 'LEARN' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Ask Your Guide */}
            <Card className="border-l-4 border-amber-500 bg-[#0f172a] shadow-lg shadow-amber-900/10">
                <div className="flex items-start gap-3 mb-4"><div className="bg-amber-500/20 p-2 rounded-lg shrink-0"><Sparkles className="w-5 h-5 text-amber-500" /></div><div><h3 className="font-bold text-lg text-slate-200">Ask Your Guide</h3><p className="text-xs text-slate-500">Clarify concepts simply.</p></div></div>
                <div className="space-y-4">
                    <div className="relative">
                        <input type="text" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="e.g. What is Ghusl?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" onKeyDown={(e) => e.key === 'Enter' && explainConcept()} />
                        <button onClick={() => explainConcept()} className="absolute right-2 top-2 p-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">{loading ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</button>
                    </div>
                    {!explanation && !loading && (
                        <div className="flex flex-wrap gap-2">{SUGGESTED_QUESTIONS.map((q, i) => <button key={i} onClick={() => explainConcept(q)} className="text-[10px] px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:text-amber-400 hover:border-amber-500/50 transition-all">{q}</button>)}</div>
                    )}
                    {explanation && (
                        <div className="bg-[#1e293b] border border-amber-500/20 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 relative">
                             <div className="flex justify-between items-start"><span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Definition</span><button onClick={() => setExplanation(null)} className="text-slate-500 hover:text-slate-200"><X className="w-4 h-4" /></button></div>
                             <p className="text-slate-200 font-medium leading-relaxed">{explanation.definition}</p>
                             <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20"><span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1 mb-1"><Lightbulb className="w-3 h-3" /> Think of it like...</span><p className="text-amber-200 text-sm italic">"{explanation.analogy}"</p></div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Practice Interaction Area */}
            <Card className="bg-[#0f172a] border border-white/5 p-6 text-center">
                 <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">🤲</div>
                 <h4 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">Takbir</h4>
                 <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">Raise hands to ears, palms facing forward. Say "Allahu Akbar".</p>
                 <button 
                    onMouseDown={() => startRecording('takbir', 'Allahu Akbar')}
                    onTouchStart={() => startRecording('takbir', 'Allahu Akbar')}
                    onMouseUp={stopRecording}
                    onTouchEnd={stopRecording}
                    className={`px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 mx-auto shadow-xl select-none touch-none ${isRecording ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/40' : 'bg-white/10 text-slate-300 hover:bg-white/20 active:scale-95'}`}
                 >
                    {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? "Listening..." : isAnalyzing ? "Checking..." : "Hold to Practice"}
                 </button>
                 {feedback && (
                     <div className="mt-6 bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-center gap-2 mb-1"><div className="text-2xl font-black text-emerald-400">{feedback.score}%</div><div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Accuracy</div></div>
                        <p className="text-xs text-emerald-200 font-medium">{feedback.feedback}</p>
                     </div>
                 )}
            </Card>
        </div>
      )}
      <div className="pt-4 px-1 opacity-60 hover:opacity-100 transition-opacity"><PrayerWidget /></div>
    </div>
  );
};