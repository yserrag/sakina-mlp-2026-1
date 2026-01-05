import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth/model/useAuth';

export const DataDeleteButton: React.FC = () => {
  const { signOut } = useAuth();
  const [step, setStep] = useState<'IDLE' | 'CONFIRM' | 'DELETING'>('IDLE');

  const handleDelete = async () => {
    if (step === 'IDLE') {
        setStep('CONFIRM');
        return;
    }

    if (step === 'CONFIRM') {
        setStep('DELETING');
        
        // 1. Sign out from Supabase
        await signOut();

        // 2. Clear Local Storage
        localStorage.clear();

        // 3. Clear Session Storage
        sessionStorage.clear();

        // 4. Force Reload to reset application state
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
  };

  return (
    <div className="space-y-2">
      {step === 'CONFIRM' && (
        <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
             <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
             <div className="text-xs text-red-200">
                 <p className="font-bold mb-1">Are you absolutely sure?</p>
                 <p>This will wipe all local preferences, saved progress, and log you out. This action cannot be undone.</p>
             </div>
        </div>
      )}
      
      <button 
        onClick={handleDelete}
        disabled={step === 'DELETING'}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            step === 'CONFIRM' 
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40' 
            : 'bg-white/5 text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-900/50'
        }`}
      >
        {step === 'DELETING' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <Trash2 className="w-4 h-4" />
        )}
        {step === 'IDLE' ? 'Delete All Data' : step === 'DELETING' ? 'Nuking Data...' : 'Confirm Deletion'}
      </button>
      
      {step === 'CONFIRM' && (
          <button 
            onClick={() => setStep('IDLE')}
            className="w-full text-xs text-slate-500 hover:text-white py-2"
          >
              Cancel
          </button>
      )}
    </div>
  );
};