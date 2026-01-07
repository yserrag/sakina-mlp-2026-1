import React, { useState } from 'react';
import { Book, Star, ChevronRight, Share2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// A small subset of the 99 Names for the MVP
const NAMES_DATA = [
  { 
    arabic: "ٱللَّٰهُ", transliteration: "Allah", 
    meaning: "The Greatest Name", 
    desc: "The One and Only Deity, the Creator and Sustainer of the universe, possessing all attributes of perfection." 
  },
  { 
    arabic: "ٱلرَّحْمَٰنُ", transliteration: "Ar-Rahman", 
    meaning: "The Entirely Merciful", 
    desc: "He whose Mercy encompasses all things and all beings, regardless of their belief or action." 
  },
  { 
    arabic: "ٱلرَّحِيمُ", transliteration: "Ar-Rahim", 
    meaning: "The Especially Merciful", 
    desc: "He who bestows a special, permanent mercy upon the believers in the Hereafter." 
  },
  { 
    arabic: "ٱلْمَلِكُ", transliteration: "Al-Malik", 
    meaning: "The King", 
    desc: "The Absolute Ruler and Owner of all things. His dominion is complete and eternal." 
  },
  { 
    arabic: "ٱلْقُدُّوسُ", transliteration: "Al-Quddus", 
    meaning: "The Pure / Holy", 
    desc: "The One currently and forever free from any imperfection, error, or negligence." 
  },
  { 
    arabic: "ٱلسَّلَامُ", transliteration: "As-Salam", 
    meaning: "The Source of Peace", 
    desc: "The One who is free from every imperfection and the source of peace and safety for His creation." 
  }
];

export const NamesOfAllah = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // [LOGIC] Pick a name based on the Day of the Year so it changes daily
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const nameIndex = dayOfYear % NAMES_DATA.length;
  const name = NAMES_DATA[nameIndex];

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[320px] relative group">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
        <div className="flex items-center gap-2">
          <div className="bg-teal-500/10 p-1.5 rounded-lg">
            <Book className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Know Your Lord</h3>
            <p className="text-[10px] text-slate-400">Name of the Day</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-slate-500 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT CARD (Click to Flip) */}
      <div 
        className="flex-1 p-6 relative cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 backface-hidden ${isFlipped ? 'opacity-0 rotate-y-180 pointer-events-none' : 'opacity-100 rotate-y-0'}`}>
           <div className="w-full flex justify-between items-start absolute top-4 px-4">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest">#{nameIndex + 1}</span>
             <Star className="w-4 h-4 text-slate-700" />
           </div>

           <h2 className="text-6xl text-white mb-4 drop-shadow-2xl font-amiri" style={{ fontFamily: 'serif' }}>
             {name.arabic}
           </h2>
           <h3 className="text-xl font-bold text-teal-400 mb-1">{name.transliteration}</h3>
           <p className="text-sm text-slate-400">{name.meaning}</p>

           <div className="absolute bottom-6 flex items-center gap-2 text-xs text-slate-500">
             <span>Tap to learn more</span>
             <ChevronRight className="w-3 h-3" />
           </div>
        </div>

        {/* BACK SIDE */}
        <div className={`absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-8 text-center transition-all duration-500 backface-hidden ${isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 -rotate-y-180 pointer-events-none'}`}>
           <h3 className="text-2xl text-white font-amiri mb-4">{name.arabic}</h3>
           <p className="text-sm text-slate-300 leading-relaxed">
             "{name.desc}"
           </p>
           <Button variant="ghost" className="mt-6 text-xs text-teal-400 hover:text-white">
             Show Card
           </Button>
        </div>
      </div>

    </Card>
  );
};