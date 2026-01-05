import React from 'react';
import { ShoppingBag, ExternalLink, Plane, Coffee, Book } from 'lucide-react';

// MLP Strategy: Data derived from the "Hikmah" Logic Table 
const GET_RECOMMENDATION = (context: string) => {
  const recommendations: Record<string, any> = {
    travel: {
      title: "The Traveler's Kit",
      desc: "Portable prayer mats & wudu bottles.",
      icon: Plane,
      link: "https://halalbooking.com",
      label: "View Gear"
    },
    morning: {
      title: "Sunnah Morning",
      desc: "Authentic Miswaks & Fajr alarms.",
      icon: Coffee,
      link: "https://amazon.com/s?k=miswak",
      label: "Shop Sunnah"
    },
    knowledge: {
      title: "Deepen Your Deen",
      desc: "Scholar-verified Tafsir & Quran stands.",
      icon: Book,
      link: "https://amazon.com/s?k=islamic+books",
      label: "Explore"
    }
  };
  return recommendations[context] || recommendations.knowledge;
};

export const AffiliateDock = ({ context = 'morning' }: { context?: string }) => {
  const rec = GET_RECOMMENDATION(context);
  const Icon = rec.icon;

  return (
    <div className="group relative bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 overflow-hidden">
      {/* Subtle Glow Effect */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Recommended</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          <h4 className="text-white font-bold text-sm">{rec.title}</h4>
          <p className="text-slate-500 text-[11px] leading-tight mt-1">{rec.desc}</p>
        </div>
        
        <a 
          href={rec.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-slate-800 hover:bg-blue-600 rounded-2xl text-white transition-all shadow-lg flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Compliance Notice (MLP Transparency Requirement) */}
      <p className="text-[8px] text-slate-600 mt-4 text-center uppercase tracking-widest">
        Ethical Affiliate • Shariah Filtered Feed
      </p>
    </div>
  );
};