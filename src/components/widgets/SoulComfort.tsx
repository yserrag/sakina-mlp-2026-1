
import React, { useState } from 'react';
import { Heart, X, ChevronRight, Droplets, Moon, Sun, Wind } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// THE DIVINE PHARMACY DATABASE 💊
// Hardcoded verified remedies for offline speed.
const REMEDIES = {
  anxiety: {
    label: "Anxiety",
    color: "bg-emerald-500",
    icon: <Wind className="w-5 h-5" />,
    ayah_ref: "Surah Ar-Ra'd (13:28)",
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: "Verily, in the remembrance of Allah do hearts find rest.",
    action: "Do 'Istighfar' (saying Astaghfirullah) 33 times slowly.",
    bg: "from-emerald-900/50 to-slate-900"
  },
  grief: {
    label: "Grief",
    color: "bg-blue-500",
    icon: <Droplets className="w-5 h-5" />,
    ayah_ref: "Surah Al-Baqarah (2:156)",
    arabic: "إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَاجِعُونَ",
    translation: "Indeed we belong to Allah, and indeed to Him we will return.",
    action: "Make Wudu with cold water to cool the fire of sadness.",
    bg: "from-blue-900/50 to-slate-900"
  },
  anger: {
    label: "Anger",
    color: "bg-red-500",
    icon: <Sun className="w-5 h-5" />,
    ayah_ref: "Prophetic Advice",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    translation: "I seek refuge in Allah from the accursed Satan.",
    action: "If standing, sit. If sitting, lie down. Change your posture.",
    bg: "from-red-900/50 to-slate-900"
  },
  lonely: {
    label: "Loneliness",
    color: "bg-indigo-500",
    icon: <Moon className="w-5 h-5" />,
    ayah_ref: "Surah Qaf (50:16)",
    arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ",
    translation: "We are closer to him than [his] jugular vein.",
    action: "Call upon Him by His name 'Al-Wadud' (The Loving One).",
    bg: "from-indigo-900/50 to-slate-900"
  }
};

type EmotionKey = keyof typeof REMEDIES;

export const SoulComfort = () => {
  const [selected, setSelected] = useState<EmotionKey | null>(null);

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[300px]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-rose-500/10 p-1.5 rounded-lg">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Soul Comfort</h3>
            <p className="text-[10px] text-slate-400">Emotional Triage</p>
          </div>
        </div>
        {selected && (
          <button 
            onClick={() => setSelected(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 p-4 relative">
        
        {/* SELECTION GRID (Visible when no emotion selected) */}
        <div className={`transition-all duration-500 ${selected ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
          <p className="text-slate-400 text-sm mb-4">How is your heart feeling right now?</p>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(REMEDIES) as EmotionKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="group relative overflow-hidden rounded-xl bg-slate-800/50 border border-white/5 p-4 text-left hover:border-emerald-500/50 transition-all active:scale-95"
              >
                <div className={`absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity ${REMEDIES[key].color.replace('bg-', 'text-')}`}>
                  {REMEDIES[key].icon}
                </div>
                <span className="relative z-10 text-slate-200 font-medium group-hover:text-white">
                  {REMEDIES[key].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PRESCRIPTION CARD (Visible when selected) */}
        {selected && (
          <div className={`absolute inset-0 p-4 transition-all duration-500 bg-gradient-to-br ${REMEDIES[selected].bg}`}>
            <div className="h-full flex flex-col justify-center text-center animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-[10px] text-white/70 border border-white/10 uppercase tracking-widest">
                  Prescription for {REMEDIES[selected].label}
                </span>
              </div>

              <h2 className="font-amiri text-2xl text-white leading-relaxed mb-3 drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                {REMEDIES[selected].arabic}
              </h2>
              
              <p className="text-sm text-slate-300 italic mb-4">
                "{REMEDIES[selected].translation}"
              </p>
              
              <div className="mt-auto bg-black/30 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Action Item</p>
                    <p className="text-xs text-white">{REMEDIES[selected].action}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </Card>
  );
};