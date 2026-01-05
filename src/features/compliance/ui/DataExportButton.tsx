import React, { useState } from 'react';
import { Download, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DataExportButton: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'EXPORTING' | 'DONE'>('IDLE');

  const handleExport = () => {
    setStatus('EXPORTING');

    // Simulate collecting data (async)
    setTimeout(() => {
      try {
        const dataToExport: Record<string, any> = {};
        
        // Collect all Sakina related keys from LocalStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('sakina') || key.includes('sb-'))) {
             try {
                 dataToExport[key] = JSON.parse(localStorage.getItem(key) || '{}');
             } catch (e) {
                 dataToExport[key] = localStorage.getItem(key);
             }
          }
        }

        // Create Blob
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Trigger Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `sakina-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setStatus('DONE');
        setTimeout(() => setStatus('IDLE'), 3000);
      } catch (e) {
        console.error("Export failed", e);
        setStatus('IDLE');
      }
    }, 1500);
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={status !== 'IDLE'}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
    >
      {status === 'EXPORTING' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'DONE' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
      {status === 'IDLE' && <Download className="w-4 h-4" />}
      {status === 'DONE' ? 'Export Complete' : 'Export My Data (JSON)'}
    </Button>
  );
};