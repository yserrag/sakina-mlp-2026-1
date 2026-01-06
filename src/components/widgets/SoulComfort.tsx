import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heart, Sparkles, BookOpen, Loader2, Quote, ScrollText, ArrowRight } from 'lucide-react';

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

// [DATA] Local Wisdom Database (Simulating AI for MLP)
const PRESCRIPTIONS: Record<string, Prescription> = {
  'Anxious': {
    verse: {
      arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
      english: "Unquestionably, by the remembrance of Allah do hearts find rest.",
      reference: "Surah Ar-Ra'd 13:28"
    },
    hadith: {
      text: "Whatever is meant for you will not pass you by, and whatever passed you by was not meant for you.",
      source: "Sunan Abi Dawud"
    },
    dua: {
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
      english: "O Allah, I seek refuge in You from anxiety and sorrow."
    }
  },
  'Lonely': {
    verse: {
      arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ",
      english: "And We are closer to him than [his] jugular vein.",
      reference: "Surah Qaf 50:16"
    },
    hadith: {
      text: "Allah says: 'I am as My servant thinks I am. I am with him when he mentions Me.'",
      source: "Sahih Bukhari"
    },
    dua: {
      arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ",
      transliteration: "Rabbi la tadharni fardan wa anta khairul-warithin",
      english: "My Lord, do not leave me alone, while You are the best of inheritors."
    }
  },
  'Grateful': {
    verse: {
      arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      english: "If you are grateful, I will surely increase you [in favor].",
      reference: "Surah Ibrahim 14:7"
    },
    hadith: {
      text: "Strange is the affair of the believer... if good happens to him, he thanks Allah, and that is good for him.",
      source: "Sahih Muslim"
    },
    dua: {
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
      transliteration: "Alhamdulillahil-ladhi bi ni'matihi tatimmus-salihat",
      english: "Praise be to Allah by Whose grace good deeds are completed."
    }
  },
  'Overwhelmed': {
    verse: {
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      english: "Allah does not burden a soul beyond that it can bear.",
      reference: "Surah Al-Baqarah 2:286"
    },
    hadith: {
      text: "Do not get angry. (Repeated 3 times)",
      source: "Sahih Bukhari"
    },
    dua: {
      arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
      transliteration: "Ya Hayyu Ya Qayyum, bi rahmatika astagheeth",
      english: "O Living, O Sustaining, in Your mercy I seek relief."
    }
  }
};

export const SoulComfort: React.FC = () => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prescription | null>(null);

  const getComfort = async (selectedMood: string) => {
    if (loading) return;
    setMood(selectedMood);
    setLoading(true);
    setResult(null);

    // Simulate AI Delay
    setTimeout(() => {
      // Fuzzy match or default to "Anxious" if not found
      const key = Object.keys(PRESCRIPTIONS).find(k => selectedMood.toLowerCase().includes(k.toLowerCase())) || 'Anxious';
      setResult(PRESCRIPTIONS[key]);
      setLoading(false);
    }, 1200);
  };

  const suggestions = ["Anxious", "Lonely", "Grateful", "Overwhelmed"];

  return (
    <Card className="border-l-4 border-rose-500 bg-gradient-to-br from-slate-900 to-rose-950/30 text-white min-h-[300px] flex flex-col shadow-xl">
      <div className="flex justify-between items-start mb-4 p-4 pb-0">
        <div>
          <h2 className="text-xl font-serif font-bold text-rose-100 flex items-center gap-2">
            Soul Comfort
          </h2>
          <p className="text-xs text-rose-300">Prescriptions for the Heart</p>
        </div>
        <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col justify-center space-y-6 p-6 pt-0">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">How is your heart feeling?</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => getComfort(s)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    mood === s 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 scale-105' 
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-rose-500/50 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="e.g. Worried about uncertain future..."
                className="w-full bg-slate-950/50 border border-rose-500/20 rounded-xl px-4 py-3 text-sm focus:border-rose-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') getComfort((e.target as HTMLInputElement).value);
                }}
              />
              <button 
                disabled={loading}
                className="absolute right-2 top-2 p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-500 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="text-center opacity-60">
             <Quote className="w-6 h-6 text-rose-400 mx-auto mb-2 opacity-50" />
             <p className="text-[10px] text-slate-400 italic">"Verily, in the remembrance of Allah do hearts find rest."</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 p-6 pt-0">
          {/* Verse Section */}
          <div className="text-center space-y-2 bg-slate-950/50 p-4 rounded-xl border border-rose-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50" />
            <h3 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-2">
              <BookOpen className="w-3 h-3" /> Quranic Wisdom
            </h3>
            <p className="font-arabic text-xl text-white leading-loose" dir="rtl">{result.verse.arabic}</p>
            <p className="text-sm text-slate-300 italic">"{result.verse.english}"</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1">— {result.verse.reference}</p>
          </div>

          {/* Hadith Section */}
          <div className="flex flex-col gap-2 p-3 rounded-lg border border-white/5 bg-white/5">
             <div className="flex items-center gap-2 text-rose-300">
                <ScrollText className="w-3 h-3" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Prophetic Wisdom</h3>
             </div>
             <p className="text-xs text-slate-300 italic leading-relaxed">"{result.hadith.text}"</p>
             <p className="text-[9px] text-slate-500 text-right font-medium">— {result.hadith.source}</p>
          </div>

          {/* Dua Section */}
          <div className="space-y-2">
             <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Your Prescription (Dua)</h3>
             <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-500/20 text-center">
                <p className="font-arabic text-lg text-white mb-2 leading-loose" dir="rtl">{result.dua.arabic}</p>
                <p className="text-[10px] text-emerald-200 mb-1 font-medium">{result.dua.transliteration}</p>
                <p className="text-[10px] text-slate-400 italic">"{result.dua.english}"</p>
             </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setResult(null)} className="w-full border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-white">
            Find Comfort for Another Feeling
          </Button>
        </div>
      )}
    </Card>
  );
};