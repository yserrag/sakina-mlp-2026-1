import React, { useState } from 'react';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Heart, Sparkles, BookOpen, Loader2, Quote, ScrollText } from 'lucide-react';

interface Prescription {
  verse: {
    arabic: string;
    english: string;
    reference: string;
  };
  hadith: {
    text: string;
    source: string;
  };
  dua: {
    arabic: string;
    transliteration: string;
    english: string;
  };
}

export const SoulComfort: React.FC = () => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prescription | null>(null);

  const getComfort = async () => {
    if (!mood.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `The user is feeling: "${mood}". Provide a comforting Islamic spiritual prescription.
        1. A highly relevant Quranic verse (Ayah).
        2. A comforting Hadith (Prophetic Tradition) relevant to the emotion.
        3. A short, powerful Dua (Supplication) from the Sunnah.
        Constraint: Ensure all references are authentic.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verse: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  english: { type: Type.STRING },
                  reference: { type: Type.STRING, description: "e.g. Surah Al-Baqarah 2:286" }
                },
                required: ["arabic", "english", "reference"]
              },
              hadith: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The English text of the Hadith" },
                    source: { type: Type.STRING, description: "e.g. Sahih Bukhari" }
                },
                required: ["text", "source"]
              },
              dua: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  english: { type: Type.STRING }
                },
                required: ["arabic", "transliteration", "english"]
              }
            },
            required: ["verse", "hadith", "dua"]
          } as Schema
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Soul Comfort Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Anxious", "Grateful", "Lonely", "Overwhelmed"];

  return (
    <Card className="border-l-4 border-rose-400 min-h-[300px] flex flex-col bg-gradient-to-br from-white to-rose-50/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary-900 flex items-center gap-2">
            Soul Comfort
          </h2>
          <p className="text-sm text-slate-500">Prescriptions for the Heart</p>
        </div>
        <div className="bg-rose-100 p-2 rounded-lg">
          <Heart className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">How is your heart feeling?</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setMood(s)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    mood === s 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Worried about my family..."
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none placeholder:text-rose-300"
                onKeyDown={(e) => e.key === 'Enter' && getComfort()}
              />
              <button 
                onClick={getComfort}
                disabled={!mood.trim() || loading}
                className="absolute right-2 top-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-center">
             <Quote className="w-8 h-8 text-rose-200 mx-auto mb-2" />
             <p className="text-xs text-slate-400 italic">"Verily, in the remembrance of Allah do hearts find rest."</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Verse Section */}
          <div className="text-center space-y-2 bg-white/60 p-4 rounded-xl border border-rose-100">
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3" /> Quranic Wisdom
            </h3>
            <p className="font-serif text-xl text-slate-800 leading-loose" dir="rtl">{result.verse.arabic}</p>
            <p className="text-sm text-slate-600 italic">"{result.verse.english}"</p>
            <p className="text-xs text-slate-400 font-medium">— {result.verse.reference}</p>
          </div>

          {/* Hadith Section */}
          <div className="flex flex-col gap-2 bg-rose-50 p-4 rounded-lg border border-rose-100">
             <div className="flex items-center gap-2 text-rose-800">
                <ScrollText className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Prophetic Wisdom</h3>
             </div>
             <p className="text-sm text-slate-700 italic leading-relaxed">"{result.hadith.text}"</p>
             <p className="text-xs text-rose-400 text-right font-medium">— {result.hadith.source}</p>
          </div>

          {/* Dua Section */}
          <div className="space-y-2">
             <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest text-center">Your Dua</h3>
             <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <p className="font-serif text-lg text-primary-900 text-center mb-2 leading-relaxed" dir="rtl">{result.dua.arabic}</p>
                <p className="text-xs text-primary-700 text-center mb-1 font-medium">{result.dua.transliteration}</p>
                <p className="text-xs text-slate-500 text-center">{result.dua.english}</p>
             </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setResult(null)} className="w-full">
            Find Comfort for Another Feeling
          </Button>
        </div>
      )}
    </Card>
  );
};