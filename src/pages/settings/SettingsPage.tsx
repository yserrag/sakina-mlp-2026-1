import React from 'react';
import { Shield, Database, Bell, Moon, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-32 font-sans">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Account Section */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Account</h2>
        <Card className="bg-slate-900 border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
              Y
            </div>
            <div>
              <h3 className="text-white font-bold">Yserrag</h3>
              <p className="text-xs text-slate-400">Pro Partner</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Privacy & Data (Iron Dome) */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Data & Privacy</h2>
        <div className="space-y-2">
          <button className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Iron Dome Status</p>
                <p className="text-[10px] text-emerald-400">Active & Encrypted</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>

          <button className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Manage Storage</p>
                <p className="text-[10px] text-slate-400">0.4 MB Used</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </section>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-600">Sakina OS v2.0</p>
      </div>
    </div>
  );
};