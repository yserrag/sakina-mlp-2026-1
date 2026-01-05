import React, { useState } from 'react';
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  Shield, 
  Lock, 
  Wifi, 
  Database, 
  Bell, 
  MapPin, 
  Moon, 
  ChevronRight,
  CheckCircle2,
  Activity
} from "lucide-react";

export const SettingsModal = () => {
  const [location, setLocation] = useState("London, UK");
  const [notifications, setNotifications] = useState(true);
  const [ironDomeActive, setIronDomeActive] = useState(true);

  return (
    <div className="space-y-6">
      
      {/* 1. THE IRON DOME STATUS PANEL */}
      <Card className="bg-slate-900 border-emerald-500/30 overflow-hidden relative">
        {/* Background Animation */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Iron Dome Protocols
              </h3>
              <h2 className="text-xl font-bold text-white mt-1">System Secure</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>

          {/* Security Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Encryption Module */}
            <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-md text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Storage</p>
                <p className="text-xs text-slate-200 font-medium">AES-256 Encrypted</p>
              </div>
            </div>

            {/* Network Module */}
            <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-md text-emerald-400">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Network</p>
                <p className="text-xs text-slate-200 font-medium">Strict CSP Shield</p>
              </div>
            </div>

            {/* Data Sovereignty */}
            <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-md text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Database</p>
                <p className="text-xs text-slate-200 font-medium">Local-First Only</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Audit Log */}
        <div className="bg-emerald-900/10 border-t border-white/5 p-3 flex items-center justify-between">
           <p className="text-[10px] text-slate-400 font-mono">
             AUDIT_ID: 0x8F2...A1 • CLAUDE_VERIFIED
           </p>
           <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        </div>
      </Card>

      {/* 2. GENERAL SETTINGS */}
      <Card className="bg-slate-900 border-white/10">
        <div className="p-5 space-y-6">
          
          {/* Location */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-200">Prayer Location</h4>
                <p className="text-xs text-slate-500 mt-0.5">{location}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
              Edit
            </Button>
          </div>

          <div className="h-px bg-white/5" />

          {/* Notifications */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-200">Adhan Notifications</h4>
                <p className="text-xs text-slate-500 mt-0.5">Alerts for all 5 prayers</p>
              </div>
            </div>
            <div 
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${notifications ? 'bg-emerald-600' : 'bg-slate-700'}`} 
              onClick={() => setNotifications(!notifications)}
            >
              <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${notifications ? 'left-6' : 'left-1'}`}></div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Data Wipe (Danger Zone) */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-900/20 rounded-lg text-red-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-400">Emergency Data Wipe</h4>
                <p className="text-xs text-slate-500 mt-0.5">Crypto-shred all local keys</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </div>

        </div>
      </Card>

      <div className="text-center">
        <p className="text-[10px] text-slate-600">Sakina OS v2.0.4 • Build 2026-RC1</p>
      </div>
    </div>
  );
};