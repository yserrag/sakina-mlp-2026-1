import React, { useState, useEffect } from 'react';
import { ShoppingBag, Moon, Sun, Plane, ExternalLink, X, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ContentValidator, logAffiliateClick, type Recommendation } from '../../lib/contentValidator';
import { useTravelDetection } from '../../hooks/useTravelDetection'; // [NEW] Intelligence Hook

export const AffiliateDock = () => {
  const [activeRec, setActiveRec] = useState<Recommendation | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // [INTELLIGENCE] Real Sensor Fusion for Travel
  const { isTraveling } = useTravelDetection(); 

  // [ENGINE] Context Monitor with Validation
  useEffect(() => {
    const determineContext = (): Recommendation | null => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // [LIVE] Now reacts to real GPS data
      if (isTraveling) {
        return {
          id: 'hotel-deal',
          trigger: 'travel',
          title: 'Traveling?',
          description: 'Find Qibla-verified hotels with Halal food nearby.',
          icon: Plane,
          actionLabel: 'View Halal Hotels',
          link: 'https://halalbooking.com?ref=sakina',
          color: 'bg-blue-500'
        };
      }

      if (day === 5 && hour < 14) {
        return {
          id: 'kahf-stand',
          trigger: 'friday',
          title: "Jumu'ah Mubarak",
          description: 'Enhance your Surah Al-Kahf reading with a handcrafted wooden Rehal.',
          icon: Sun,
          actionLabel: 'View Standards',
          link: 'https://amazon.com/s?k=quran+rehal&tag=sakina-20',
          color: 'bg-emerald-500'
        };
      }

      if (hour >= 4 && hour < 7) {
        return {
          id: 'miswak-fajr',
          trigger: 'fajr',
          title: 'Sunnah of Fajr',
          description: 'Revive the Sunnah. Fresh Olive Miswak bundles available.',
          icon: Moon,
          actionLabel: 'Get Miswak',
          link: 'https://amazon.com/s?k=miswak&tag=sakina-20',
          color: 'bg-amber-600'
        };
      }

      return {
        id: 'charity-water',
        trigger: 'general',
        title: 'Sadaqah Jariyah',
        description: 'Build a well in your name. 100% donation policy.',
        icon: ShoppingBag,
        actionLabel: 'Donate Now',
        link: 'https://launchgood.com',
        color: 'bg-indigo-500'
      };
    };

    // [SECURITY] Validate before showing
    const candidate = determineContext();
    if (candidate && ContentValidator.validateRecommendation(candidate)) {
      setActiveRec(candidate);
    } else {
      setActiveRec(null); 
    }
  }, [isTraveling]); // Re-run when travel status changes

  const handleAffiliateClick = () => {
    if (!activeRec) return;
    const sanitizedLink = ContentValidator.sanitizeAffiliateLink(activeRec.link);
    logAffiliateClick(activeRec.id, sanitizedLink);
    window.open(sanitizedLink, '_blank', 'noopener,noreferrer');
  };

  if (!activeRec || !isVisible) return null;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg animate-in slide-in-from-bottom-4 duration-700">
      <div className={`absolute inset-0 opacity-10 ${activeRec.color}`}></div>
      
      <div className="p-4 flex items-start gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl ${activeRec.color} flex items-center justify-center shrink-0 shadow-lg text-white`}>
          <activeRec.icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                 <Info className="w-3 h-3" /> Context Suggestion
               </p>
               <h3 className="text-white font-bold text-base mt-0.5">{activeRec.title}</h3>
             </div>
             <button 
               onClick={() => setIsVisible(false)}
               className="text-slate-500 hover:text-slate-300 transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
          
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {activeRec.description}
          </p>

          <Button 
            size="sm" 
            className={`mt-3 w-full ${activeRec.color} hover:opacity-90 text-white border-none shadow-md`}
            onClick={handleAffiliateClick}
          >
            {activeRec.actionLabel} <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
          
          {/* [COMPLIANCE] Transparency Disclosure */}
          <p className="text-[9px] text-slate-600 mt-2 text-center opacity-80">
            Automated suggestion based on time/location. Tracking removed for privacy.
          </p>
        </div>
      </div>
    </Card>
  );
};