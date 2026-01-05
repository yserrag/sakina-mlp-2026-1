import React from 'react';
import { AuthCard } from '@/features/auth/ui/AuthCard';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Background Elements [ANALYSIS]: High-fidelity indigo glow */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
      
      <AuthCard />
    </div>
  );
};