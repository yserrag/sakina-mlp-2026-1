import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Sparkles, RefreshCw, Loader2, BookHeart, ScrollText } from 'lucide-react';

interface NameData {
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
  hadith: string; // [NEW] Added as requested
}

// [DATA] Local Wisdom Database (Instant Load)
const NAMES_DB: NameData[] = [
  {
    arabic: "ٱلْفَتَّاحُ",
    transliteration: "Al-Fattāḥ",
    meaning: "The Opener / The Granter of Victory",
    reflection: "When doors seem closed—whether in sustenance, knowledge, or relief—call upon Al-Fattah. He creates a way out where there is none.",
    hadith: "Prophet Muhammad (ﷺ) said: 'O Allah, open for me the doors of Your mercy.'"
  },
  {
    arabic: "ٱلْوَدُودُ",
    transliteration: "Al-Wadūd",
    meaning: "The Most Loving",
    reflection: "His love is not just a feeling but an active care. He loves you more than a mother loves her child. Return to Him, and you will find Him embracing.",
    hadith: "Allah says: 'If My servant comes to Me walking, I go to him running.' (Bukhari)"
  },
  {
    arabic: "ٱلرَّزَّاقُ",
    transliteration: "Ar-Razzāq",
    meaning: "The Provider",
    reflection: "Your sustenance was written before you were born. Do not anxiety over what is guaranteed. Work with excellence, but trust the Source.",
    hadith: "If you relied on Allah as He should be relied on, He would provide for you as He provides for the birds. (Tirmidhi)"
  },
  {
    arabic: "ٱلْغَفُورُ",
    transliteration: "Al-Ghafūr",
    meaning: "The Exceedingly Forgiving",
    reflection: "No sin is greater than His mercy. He does not just forgive; He covers and hides your faults. Never despair.",
    hadith: "Allah says: 'O son of Adam, were your sins to reach the clouds of the sky and were you then to ask forgiveness of Me, I would forgive you.' (Tirmidhi)"
  },
  {
    arabic: "ٱلشَّافِي",
    transliteration: "Ash-Shāfi",
    meaning: "The Healer",
    reflection: "Medicine is the method, but He is the Cure. Whether it is a physical pain or a broken heart, turn to the One who holds the remedy.",
    hadith: "The Prophet (ﷺ) used to say: 'O Allah, Lord of mankind, remove the difficulty and bring about healing. You are the Healer.' (Bukhari)"
  }
];

export const NamesOfAllah: React.FC = () => {
  const [data, setData] = useState<NameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const fetchName = () => {
    setLoading(true);
    // Simulate a "seeking" delay for effect
    setTimeout(() => {
      const nextIndex = (index + 1) % NAMES_DB.length;
      setIndex(nextIndex);
      setData(NAMES_DB[nextIndex]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    setData(NAMES_DB[0]); // Load first name immediately
  }, []);

  return (
    <Card className="bg-slate-900 border-l-4 border-amber-500 relative overflow-hidden flex flex-col justify-center min-h-[300px] shadow-lg">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <BookHeart className="w-32 h-32 text-amber-500" />
      </div>

      <div className="relative z-10 p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2">
             <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-amber-500/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                 </div>
                 <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Know Your Lord</span>
             </div>
             <button 
                onClick={fetchName} 
                disabled={loading}
                className="text-slate-500 hover:text-amber-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                title="Next Name"
             >
                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
        </div>

        {!data || loading ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-pulse">
                 <Loader2 className="w-8 h-8 text-amber-500/50 animate-spin" />
                 <p className="text-xs text-slate-500 uppercase tracking-widest">Seeking Light...</p>
             </div>
        ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* The Name */}
                <div>
                    <h2 className="text-5xl font-arabic text-white mb-2 drop-shadow-md leading-normal pt-2">{data.arabic}</h2>
                    <p className="text-xl font-bold text-amber-400">{data.transliteration}</p>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide mt-1">{data.meaning}</p>
                </div>
                
                {/* The Reflection Bubble */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 mx-2 relative group hover:border-amber-500/20 transition-colors">
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                        "{data.reflection}"
                    </p>
                </div>

                {/* [NEW] The Hadith Section */}
                <div className="flex items-start gap-3 px-4 text-left">
                    <ScrollText className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Prophetic Wisdom</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {data.hadith}
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Card>
  );
};