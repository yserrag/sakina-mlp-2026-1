import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../shared/api/supabase';
import { AppRoutes } from './routes';
import { BottomNav } from '../components/layout/BottomNav';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [BYPASS]: Check for a special "Dev Token" in local storage
    const devToken = localStorage.getItem('sakina_dev_mode');
    
    if (devToken) {
        console.log("🔓 DEV MODE ACTIVE: Bypassing Supabase Auth");
        setSession({ user: { email: 'dev@sakina.local', id: 'dev-123' } });
        setLoading(false);
        return;
    }

    // Normal Supabase Logic
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 pb-20">
        <AppRoutes session={session} />
        {session && <BottomNav />}
      </div>
    </BrowserRouter>
  );
};