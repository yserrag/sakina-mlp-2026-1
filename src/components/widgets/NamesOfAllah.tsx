import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Card } from './ui/Card';
import { Sparkles, RefreshCw, Loader2, BookHeart } from 'lucide-react';

interface NameData {
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
}

export const NamesOfAllah: React.FC = () => {
  const [data, setData] = useState<NameData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchName = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Select one of the 99 Names of Allah (Asma ul Husna) randomly. 
        Provide the Arabic, Transliteration, English Meaning, and a short "Life Application" reflection.
        Constraint: Ensure meanings are based on orthodox understanding.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              arabic: { type: Type.STRING },
              transliteration: { type: Type.STRING },
              meaning: { type: Type.STRING },
              reflection: { type: Type.STRING }
            },
            required: ["arabic", "transliteration", "meaning", "reflection"]
          } as Schema
        }
      });

      if (response.text) {
        setData(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Names Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchName();
  }, []);

  return (
    <Card className="bg-white border-l-4 border-gold-500 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <BookHeart className="w-24 h-24 text-gold-600" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-gold-500" />
                 <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Know Your Lord</span>
             </div>
             <button 
                onClick={fetchName} 
                disabled={loading}
                className="text-slate-300 hover:text-gold-500 transition-colors p-1"
             >
                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
        </div>

        {!data || loading ? (
             <div className="flex flex-col items-center justify-center py-6 space-y-3">
                 <Loader2 className="w-8 h-8 text-gold-300 animate-spin" />
                 <p className="text-xs text-slate-400">Seeking Light...</p>
             </div>
        ) : (
            <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div>
                    <h2 className="text-4xl font-serif text-slate-800 mb-1 drop-shadow-sm">{data.arabic}</h2>
                    <p className="text-lg font-bold text-gold-600">{data.transliteration}</p>
                    <p className="text-sm text-slate-500 font-medium">{data.meaning}</p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mx-2">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{data.reflection}"
                    </p>
                </div>
            </div>
        )}
      </div>
    </Card>
  );
};