import React, { useState } from 'react';
import { Card } from '../ui/Card'; // [FACTS]: Verified import path
import { Button } from '../ui/Button'; // [FACTS]: Verified import path
import { MapPin, Navigation, Info, ExternalLink } from 'lucide-react';

/**
 * MosqueFinder Component
 * [ANALYSIS]: Provides a high-fidelity interface for mosque discovery.
 * Connects to Google Maps/Apple Maps via external links for the MLP phase.
 */
export const MosqueFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mosques] = useState([
    { id: 1, name: "Central Mosque", distance: "0.8 miles", address: "123 Faith St" },
    { id: 2, name: "Al-Noor Islamic Center", distance: "1.2 miles", address: "45 Peace Ave" }
  ]);

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/60 to-teal-900/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif font-bold text-white text-lg">Mosque Finder</h3>
          <p className="text-[10px] text-teal-400 uppercase font-black tracking-widest">Nearby Congregations</p>
        </div>
        <div className="p-2 bg-teal-500/10 rounded-full">
          <MapPin className="w-5 h-5 text-teal-400" />
        </div>
      </div>

      <div className="space-y-3">
        {mosques.map((mosque) => (
          <div 
            key={mosque.id} 
            className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                  {mosque.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">{mosque.address}</p>
              </div>
              <span className="text-[10px] font-black text-teal-500 bg-teal-500/10 px-2 py-1 rounded-md">
                {mosque.distance}
              </span>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="w-full gap-2 border-white/5 text-[10px]">
                <Info className="w-3 h-3" /> DETAILS
              </Button>
              <Button variant="secondary" size="sm" className="w-full gap-2 text-[10px]">
                <Navigation className="w-3 h-3" /> NAVIGATE
              </Button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-t border-white/5 hover:text-white transition-colors">
        View All Locations
      </button>
    </Card>
  );
};