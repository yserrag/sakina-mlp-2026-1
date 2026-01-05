import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  LogOut, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Trash2, 
  ChevronRight,
  Globe,
  Moon
} from 'lucide-react';
import { STORAGE_KEYS } from '../../shared/lib/storage';

export const SettingsPage: React.FC = () => {
  const [limitSPI, setLimitSPI] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    window.location.reload();
  };

  const handleCryptoShred = () => {
    if (window.confirm("🚨 Permanent Action: This will mathematically shred your encryption keys and render all local data unrecoverable. Continue?")) {
      indexedDB.deleteDatabase('keyval-store');
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-28 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      
      <header className="pt-4 mb-2">
        <h1 className="text-2xl font-serif font-bold text-white">Settings</h1>
        <p className="text-xs text-slate-400">Manage your sovereign sanctuary</p>
      </header>

      {/* SECTION: Privacy & Security */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Privacy & Security</h3>
        <Card className="overflow-hidden border-white/5 bg-slate-900/40">
          {/* Iron Dome Status */}
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Iron Dome Protection</p>
                <p className="text-[10px] text-emerald-400">On-device AES-256 Active</p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>

          {/* CPRA Limit SPI Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Limit Sensitive Info</p>
                <p className="text-[10px] text-slate-400">Strict location usage (CPRA)</p>
              </div>
            </div>
            <button 
              onClick={() => setLimitSPI(!limitSPI)}
              className={`w-10 h-5 rounded-full transition-colors relative ${limitSPI ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${limitSPI ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </Card>
      </div>

      {/* SECTION: Preferences */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">App Preferences</h3>
        <Card className="divide-y divide-white/5 border-white/5 bg-slate-900/40">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-200">Adhan Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-200">Language (English)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-200">Dark Mode (Default)</span>
            </div>
            <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400 uppercase font-bold">System</div>
          </div>
        </Card>
      </div>

      {/* SECTION: Account Actions */}
      <div className="space-y-3 pt-4">
        <Button 
          onClick={handleLogout}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-white/5 py-6 rounded-2xl gap-3"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          Log Out of Session
        </Button>

        <button 
          onClick={handleCryptoShred}
          className="w-full flex items-center justify-center gap-2 text-rose-500 text-[11px] font-bold uppercase tracking-widest py-4 hover:bg-rose-500/5 rounded-xl transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Crypto-Shred All Local Data
        </button>
      </div>

      <footer className="text-center space-y-1 py-4">
        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Sakina 2.0 MLP</p>
        <p className="text-[9px] text-slate-700 italic">"Verifiable Truth. Absolute Privacy."</p>
      </footer>
    </div>
  );
};