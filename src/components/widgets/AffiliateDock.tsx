import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { ExternalLink, Heart, Coffee, Plane } from 'lucide-react';

export const AffiliateDock: React.FC<{ 
  context: 'travel' | 'ramadan' | 'morning' | 'default' 
}> = ({ context }) => {
  
  const recommendation = useMemo(() => {
    switch (context) {
      case 'travel':
        return {
          partner: 'HalalBooking.com',
          text: 'Find prayer-friendly stays nearby.',
          icon: Plane,
          link: 'https://halalbooking.com?ref=sakina_mlp',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        };
      case 'ramadan':
        return {
          partner: 'Human Appeal',
          text: 'Sponsor an Iftar meal today.',
          icon: Heart,
          link: 'https://humanappeal.org/appeals/ramadan?ref=sakina',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10'
        };
      case 'morning':
        return {
          partner: 'Sunnah Store',
          text: 'Revive the Sunnah: Premium Miswak.',
          icon: Coffee,
          link: 'https://amazon.com/s?k=miswak&tag=sakina2026-20',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        };
      default:
        return {
          partner: 'Sunnah Store',
          text: 'Revive the Sunnah: Premium Miswak.',
          icon: Coffee,
          link: 'https://amazon.com/s?k=miswak&tag=sakina2026-20',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        };
    }
  }, [context]);

  if (!recommendation) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Card className="p-4 bg-slate-900/40 border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
        <div className={`absolute top-0 right-0 w-24 h-24 ${recommendation.bg} blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />

        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-3 rounded-xl ${recommendation.bg} ${recommendation.color}`}>
            <recommendation.icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">
              Recommended for You
            </p>
            <h3 className="text-white font-bold text-sm leading-tight">
              {recommendation.text}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              via <span className="font-bold text-slate-300">{recommendation.partner}</span>
            </p>
          </div>

          <a 
            href={recommendation.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Card>
    </div>
  );
};