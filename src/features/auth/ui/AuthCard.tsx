import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/api/supabase';
import { Card } from '../../../components/ui/Card';
import { Mail, Lock, Loader2, LogIn, AlertCircle } from 'lucide-react';

export const AuthCard: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.reload(); 
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      setErrorMsg(error.message || "Authentication failed");
      setLoading(false);
    }
  };

  // [BYPASS]: Logic to skip login securely for development
  const handleDevBypass = () => {
    localStorage.setItem('sakina_dev_mode', 'true');
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-sm p-8 bg-slate-900/60 backdrop-blur-3xl border-white/5 shadow-2xl relative">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl mb-4">
          <LogIn className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase px-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-xs text-white focus:border-indigo-500/50 focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase px-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-xs text-white focus:border-indigo-500/50 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 flex justify-center items-center transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'SIGN UP NOW' : 'SIGN IN NOW')}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <button 
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setErrorMsg(null);
          }}
          className="text-[10px] text-indigo-400 hover:text-white font-black uppercase tracking-widest transition-colors block w-full"
        >
          {isRegistering ? 'Have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>

        {/* [BYPASS BUTTON] */}
        <button 
          type="button"
          onClick={handleDevBypass}
          className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          🔓 DEV BYPASS (SKIP LOGIN)
        </button>
      </div>
    </Card>
  );
};