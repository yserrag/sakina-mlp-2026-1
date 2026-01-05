import React, { useState } from 'react';
import { Send, ShieldCheck, UserCircle, AlertCircle } from 'lucide-react';

export const BuddyChat = () => {
  const [message, setMessage] = useState('');
  
  // MLP Strategy: Vetted Mentor System [cite: 188-190]
  return (
    <div className="flex flex-col h-[500px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
      {/* Mentor Header */}
      <div className="p-5 border-b border-white/10 bg-blue-600/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Mentor: Ibrahim</h4>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vetted Member</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] text-emerald-400 font-black uppercase">E2EE Active</span>
        </div>
      </div>

      {/* Chat Area (Placeholder for Real-time stream) */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
          <p className="text-xs text-slate-300 leading-relaxed">
            As-salamu alaykum! I am here to help with any questions about your first 48 hours. No question is too small.
          </p>
        </div>
      </div>

      {/* Input Area [cite: 200] */}
      <div className="p-4 bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-sm text-white focus:border-blue-500 outline-none transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Compliance Guardrail [cite: 190] */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-slate-500 uppercase tracking-widest">
          <AlertCircle className="w-3 h-3" /> Chat logs are audited locally for safety
        </p>
      </div>
    </div>
  );
};