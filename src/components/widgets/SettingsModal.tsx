import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { X, Globe, Clock, MapPin, Search, Loader2, Shield } from 'lucide-react';
import { CalculationMethod, UserSettings, Coordinates } from '../types';
import { DataExportButton } from '../features/compliance/ui/DataExportButton';
import { DataDeleteButton } from '../features/compliance/ui/DataDeleteButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  coords: Coordinates | null;
  onUpdateLocation: (coords: Coordinates) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onUpdateSettings, coords, onUpdateLocation }) => {
  const [cityInput, setCityInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim() || searching) return;

    setSearching(true);
    setError(null);

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=6531b1de95eb7582a79b702f0bab7b23`);
      if (res.ok) {
        const data = await res.json();
        if (data.coord) {
          onUpdateLocation({
            latitude: data.coord.lat,
            longitude: data.coord.lon
          });
          setCityInput('');
          onClose(); // Close on success
        } else {
          setError("Could not find coordinates for this city.");
        }
      } else {
        setError("City not found. Try 'London, UK' format.");
      }
    } catch (err) {
      setError("Network error. Check connection.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="w-full max-w-md relative bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-serif font-bold text-slate-800">App Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Location Info */}
          <div className="space-y-3">
             <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                 <div className="bg-white p-2 rounded-full shadow-sm">
                    <MapPin className="w-5 h-5 text-primary-600" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-700 text-sm">Current Coordinates</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                       {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Detecting...'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {cityInput ? 'Manual Override' : 'Detected via GPS'}
                    </p>
                 </div>
             </div>

             <form onSubmit={handleManualLocation} className="relative">
                <input 
                  type="text" 
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Change Location (e.g. Dubai, UAE)"
                  className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={searching || !cityInput.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
             </form>
             {error && <p className="text-xs text-red-500 font-medium px-1">{error}</p>}
          </div>

          {/* Calculation Method */}
          <div>
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                Asr Calculation Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => onUpdateSettings({ ...settings, calcMethod: CalculationMethod.STANDARD })}
                 className={`p-3 rounded-xl border text-left transition-all ${
                    settings.calcMethod === CalculationMethod.STANDARD 
                    ? 'bg-primary-50 border-primary-500 text-primary-800 ring-1 ring-primary-500' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                 }`}
               >
                 <span className="font-bold text-sm block">Standard</span>
                 <span className="text-[10px] opacity-80 block">Majority (Shafi, Maliki, Hanbali)</span>
               </button>

               <button 
                 onClick={() => onUpdateSettings({ ...settings, calcMethod: CalculationMethod.HANAFI })}
                 className={`p-3 rounded-xl border text-left transition-all ${
                    settings.calcMethod === CalculationMethod.HANAFI
                    ? 'bg-primary-50 border-primary-500 text-primary-800 ring-1 ring-primary-500' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                 }`}
               >
                 <span className="font-bold text-sm block">Hanafi</span>
                 <span className="text-[10px] opacity-80 block">Asr time is later</span>
               </button>
            </div>
          </div>

          {/* Data Sovereignty Section */}
          <div className="pt-2">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-500" />
                Data Sovereignty
            </h3>
            <div className="bg-slate-900 rounded-xl p-4 space-y-4">
               <div className="text-[10px] text-slate-400 leading-relaxed">
                   <strong>Your data belongs to you.</strong> Sakina stores your preferences locally. You have the right to export your data or permanently delete it at any time.
               </div>
               <DataExportButton />
               <div className="border-t border-slate-700 pt-3">
                  <DataDeleteButton />
               </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-slate-100">
           <Button className="w-full" onClick={onClose}>
              Save & Close
           </Button>
        </div>
      </Card>
    </div>
  );
};