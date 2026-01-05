import React, { useState, useEffect, useRef } from 'react';
import { Camera, RotateCcw, Info, CheckCircle, Shield } from 'lucide-react';

export const ARCoach = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentStep, setCurrentStep] = useState('Takbir');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // MLP Strategy: Request Camera with local-only permissions 
  const startCoach = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied - Permissions-Policy check:", err);
    }
  };

  return (
    <div className="relative h-[600px] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      {/* Local Processing Privacy Indicator [cite: 114] */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-emerald-500/30">
        <Shield className="w-3 h-3 text-emerald-400" />
        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">On-Device Processing Only</span>
      </div>

      {!isCameraActive ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">
            <Camera className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">AR Prayer Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              Position your phone 5ft away. The AI will guide your posture through each Rakat.
            </p>
          </div>
          <button 
            onClick={startCoach}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg"
          >
            Start Guided Practice
          </button>
        </div>
      ) : (
        <div className="relative h-full">
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover scale-x-[-1]" />
          
          {/* AR Overlay HUD  */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-8 left-6 right-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-1 mr-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Current Position</span>
                <h4 className="text-xl font-black text-white">{currentStep}</h4>
              </div>
              <button onClick={() => setIsCameraActive(false)} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-xs text-emerald-100 font-medium italic">"Posture looks correct. Keep your back straight in Ruku."</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};