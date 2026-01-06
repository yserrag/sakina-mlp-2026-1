import React, { useState, useRef, useEffect } from 'react';
import { Scan, Search, CheckCircle, XCircle, AlertTriangle, Loader2, Camera, Type, Barcode, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// [DATA] Mock Database
const PRODUCT_DB: Record<string, { status: 'HALAL' | 'HARAM' | 'MASHBOOH'; details: string; ingredients: string }> = {
  'gummies': { status: 'HARAM', details: 'Contains Pork Gelatin', ingredients: 'Glucose Syrup, Gelatin (Porcine), Sugar' },
  'chicken': { status: 'HALAL', details: 'Hand-Slaughtered (Zabiha)', ingredients: '100% Chicken Breast' },
  'chips': { status: 'HALAL', details: 'Certified Halal', ingredients: 'Potatoes, Sunflower Oil, Salt' },
  'bread': { status: 'MASHBOOH', details: 'Check for L-Cysteine', ingredients: 'Flour, Water, Yeast, L-Cysteine (E920)' },
  'default': { status: 'MASHBOOH', details: 'Status Unknown', ingredients: 'Scan clearer image' }
};

export const HalalScanner = () => {
  const [mode, setMode] = useState<'IDLE' | 'CAMERA' | 'RESULT'>('IDLE');
  const [scanType, setScanType] = useState<'BARCODE' | 'TEXT'>('BARCODE');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; details: string; ingredients: string } | null>(null);
  
  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // [ENGINE] Start Camera
  const startCamera = async () => {
    setMode('CAMERA');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please allow permissions.");
      setMode('IDLE');
    }
  };

  // [ENGINE] Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleScan = () => {
    setLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      stopCamera();
      
      // Random result for demo
      const keys = Object.keys(PRODUCT_DB);
      const randomKey = keys[Math.floor(Math.random() * (keys.length - 1))];
      setResult(PRODUCT_DB[randomKey]);
      setMode('RESULT');
    }, 2000);
  };

  return (
    <Card className="bg-slate-900 border border-white/10 overflow-hidden flex flex-col min-h-[350px] relative">
      
      {/* 1. IDLE MODE (Search) */}
      {mode === 'IDLE' && (
        <div className="flex-1 flex flex-col p-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                 <Scan className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                 <h3 className="font-bold text-white text-lg">Halal Scanner</h3>
                 <p className="text-xs text-slate-400">Check Ingredients Instantly</p>
              </div>
           </div>

           <div className="flex-1 flex flex-col justify-center gap-4">
              <button 
                onClick={startCamera}
                className="w-full bg-slate-800 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center transition-all group"
              >
                 <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10">
                    <Camera className="w-8 h-8 text-white" />
                 </div>
                 <span className="font-bold text-white">Scan Product</span>
                 <span className="text-xs text-slate-500 mt-1">Barcode or Ingredients List</span>
              </button>

              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Or type product name..." 
                   className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                   onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                         setResult(PRODUCT_DB['gummies']); // Demo default
                         setMode('RESULT');
                      }
                   }}
                 />
                 <Search className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
           </div>
        </div>
      )}

      {/* 2. CAMERA MODE (Live Feed) */}
      {mode === 'CAMERA' && (
        <div className="absolute inset-0 bg-black flex flex-col z-20">
           {/* Camera View */}
           <div className="flex-1 relative overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              
              {/* Overlay UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                 <div className="w-full aspect-square border-2 border-emerald-500/80 rounded-3xl relative shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                    <div className="absolute top-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                    <div className="absolute -bottom-8 w-full text-center">
                       <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                          Align {scanType === 'BARCODE' ? 'Barcode' : 'Text'} Here
                       </span>
                    </div>
                 </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => { stopCamera(); setMode('IDLE'); }}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md z-30"
              >
                 <X className="w-5 h-5" />
              </button>
           </div>

           {/* Controls */}
           <div className="h-32 bg-slate-900 flex flex-col items-center justify-center gap-4 relative z-30 rounded-t-3xl -mt-4">
              
              {/* Toggle Scan Type */}
              <div className="flex bg-slate-800 p-1 rounded-full">
                 <button 
                   onClick={() => setScanType('BARCODE')}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${scanType === 'BARCODE' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                 >
                    <Barcode className="w-3 h-3" /> Barcode
                 </button>
                 <button 
                   onClick={() => setScanType('TEXT')}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${scanType === 'TEXT' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                 >
                    <Type className="w-3 h-3" /> Ingredients
                 </button>
              </div>

              <Button 
                onClick={handleScan}
                className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 p-0 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
              >
                 {loading ? <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /> : <div className="w-14 h-14 bg-white rounded-full border-2 border-black" />}
              </Button>
           </div>
        </div>
      )}

      {/* 3. RESULT MODE */}
      {mode === 'RESULT' && result && (
        <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-bottom-10">
           <div className={`flex-1 rounded-2xl border flex flex-col items-center justify-center text-center p-6 mb-4 ${
              result.status === 'HALAL' ? 'bg-emerald-900/20 border-emerald-500/30' :
              result.status === 'HARAM' ? 'bg-red-900/20 border-red-500/30' :
              'bg-amber-900/20 border-amber-500/30'
           }`}>
              {result.status === 'HALAL' && <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />}
              {result.status === 'HARAM' && <XCircle className="w-20 h-20 text-red-500 mb-4" />}
              {result.status === 'MASHBOOH' && <AlertTriangle className="w-20 h-20 text-amber-500 mb-4" />}
              
              <h2 className={`text-3xl font-black tracking-wider mb-2 ${
                 result.status === 'HALAL' ? 'text-emerald-400' :
                 result.status === 'HARAM' ? 'text-red-400' :
                 'text-amber-400'
              }`}>{result.status}</h2>
              
              <p className="text-white font-medium text-lg">{result.details}</p>
           </div>

           <div className="bg-slate-950 p-4 rounded-xl border border-white/5 mb-4">
              <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">Analysis</p>
              <p className="text-sm text-slate-300">{result.ingredients}</p>
           </div>

           <Button onClick={() => setMode('IDLE')} variant="outline" className="w-full border-white/10 text-white">
              Scan Another
           </Button>
        </div>
      )}
    </Card>
  );
};