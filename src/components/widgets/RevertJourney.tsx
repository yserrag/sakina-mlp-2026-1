import React, { useState } from 'react';
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  HeartHandshake, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  Star,
  ChevronRight,
  PlayCircle,
  X,
  Download,
  Share2,
  Coffee,
  Utensils,
  Shirt,
  Heart,
  Brain,
  MapPin
} from "lucide-react";

export const RevertJourney = () => {
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // [BLUEPRINT] Phased Approach
  const PHASES = [
    { id: 1, title: "Foundations", duration: "The Beginning", icon: BookOpen },
    { id: 2, title: "Lifestyle", duration: "Daily Habits", icon: Coffee },
    { id: 3, title: "Community", duration: "Integration", icon: Users },
  ];

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto relative pb-12">
      
      {/* --- CERTIFICATE MODAL (Preserved) --- */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)] relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowCertificate(false)} className="absolute top-4 right-4 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 text-slate-400 z-20"><X className="w-5 h-5" /></button>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-slate-900 to-slate-900 pointer-events-none"></div>
            <div className="p-8 text-center space-y-6 relative z-10 flex flex-col items-center">
              <div className="w-full pb-4 border-b border-amber-500/10">
                <p className="text-2xl md:text-3xl text-amber-500 font-serif leading-loose drop-shadow-sm opacity-90">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              </div>
              <div>
                <p className="text-emerald-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-1">Declaration of Faith</p>
                <h2 className="text-xl font-serif text-slate-200">Certificate of Shahada</h2>
              </div>
              <div className="py-2 space-y-4 w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full"></div>
                  <p className="relative text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 leading-[1.6] py-2">لَا إِلَٰهَ إِلَّا ٱللَّٰهُ</p>
                  <p className="relative text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 leading-[1.6]">مُحَمَّدٌ رَسُولُ ٱللَّٰهِ</p>
                </div>
                <p className="text-slate-400 text-sm italic font-serif mt-4 px-4 border-l-2 border-emerald-500/30 pl-4 mx-auto max-w-xs text-left">"I bear witness that there is no deity but Allah, <br/>and I bear witness that Muhammad is His Messenger."</p>
              </div>
              <div className="w-full pt-4 border-t border-amber-500/10">
                <p className="text-lg text-emerald-600/80 font-serif mb-1">وَٱعْتَصِمُواْ بِحَبْلِ ٱللَّهِ جَمِيعًا</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">"And hold firmly to the rope of Allah" (3:103)</p>
              </div>
              <div className="flex gap-3 w-full pt-4">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-none shadow-lg shadow-amber-900/20"><Download className="w-4 h-4 mr-2" /> Download</Button>
                <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASES NAVIGATION --- */}
      <Card className="bg-slate-900 border-emerald-500/20 p-1 sticky top-20 z-10 backdrop-blur-xl bg-slate-900/90">
        <div className="flex justify-between p-2">
           {PHASES.map((phase) => (
             <button
               key={phase.id}
               onClick={() => setActivePhase(phase.id as 1 | 2 | 3)}
               className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-lg transition-all ${
                 activePhase === phase.id 
                   ? 'bg-emerald-900/20 text-emerald-400' 
                   : 'text-slate-600 hover:text-slate-400'
               }`}
             >
               <phase.icon className={`w-5 h-5 ${activePhase === phase.id ? 'stroke-[2.5px]' : ''}`} />
               <div className="text-center">
                 <p className="text-[10px] uppercase font-bold tracking-wider">{phase.title}</p>
                 <p className="text-[9px] opacity-60">{phase.duration}</p>
               </div>
             </button>
           ))}
        </div>
      </Card>

      {/* --- PHASE 1: FOUNDATIONS & WELLNESS --- */}
      {activePhase === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Shahada (Point 1) */}
          <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Foundation</h2>
                <p className="text-slate-400 text-sm mt-1">"Verily, deeds are judged by intentions."</p>
              </div>
              <Button onClick={() => setShowCertificate(true)} className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none">
                 <Award className="w-4 h-4 mr-2" /> View Shahada Certificate
              </Button>
            </div>
          </Card>

          {/* 2. Wellness / Intentions (Point 4) */}
          <Card className="bg-slate-900 border-emerald-500/20 p-4">
             <div className="flex items-start gap-3">
               <div className="p-2 bg-emerald-500/10 rounded-lg"><Heart className="w-5 h-5 text-emerald-400" /></div>
               <div>
                 <h3 className="text-slate-200 font-bold text-sm">One Step at a Time</h3>
                 <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                   Islam is a journey, not a race. Do not feel pressured to change your entire life overnight. 
                   Focus on sincerity (Ikhlas) rather than perfection.
                 </p>
               </div>
             </div>
          </Card>

          {/* 3. Knowledge Checklist (Point 1) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Knowledge Goals</h3>
            
            <div onClick={() => toggleStep('arabic')} className={`group flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer ${completedSteps['arabic'] ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/30'}`}>
              <div className={`p-2 rounded-full transition-colors ${completedSteps['arabic'] ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 group-hover:text-emerald-500'}`}><BookOpen className="w-5 h-5" /></div>
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${completedSteps['arabic'] ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>Arabic Alphabet</h4>
                <p className="text-slate-500 text-xs mt-0.5">Learn the letters to recite Al-Fatiha.</p>
              </div>
            </div>

            <div onClick={() => toggleStep('salah')} className={`group flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer ${completedSteps['salah'] ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/30'}`}>
              <div className={`p-2 rounded-full transition-colors ${completedSteps['salah'] ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 group-hover:text-emerald-500'}`}><PlayCircle className="w-5 h-5" /></div>
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${completedSteps['salah'] ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>The 5 Prayers</h4>
                <p className="text-slate-500 text-xs mt-0.5">Understanding the postures of Salah.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 2: LIFESTYLE (Point 3) --- */}
      {activePhase === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Halal Living */}
          <Card className="bg-slate-900 border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
               <div className="p-2 bg-orange-500/10 rounded-lg"><Utensils className="w-5 h-5 text-orange-400" /></div>
               <h3 className="text-white font-bold text-sm">Halal Living</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-slate-400 text-xs leading-relaxed">
                Halal is more than just food; it's about what we consume with our eyes and ears too. 
                For diet, look for the "Halal" seal or stick to vegetarian/seafood options when unsure.
              </p>
              <Button size="sm" variant="outline" className="w-full text-xs border-slate-700">Open Halal Scanner Widget</Button>
            </div>
          </Card>

          {/* 2. Family Relations */}
          <Card className="bg-slate-900 border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
               <div className="p-2 bg-pink-500/10 rounded-lg"><HeartHandshake className="w-5 h-5 text-pink-400" /></div>
               <h3 className="text-white font-bold text-sm">Family Relations</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-slate-400 text-xs leading-relaxed">
                Maintain loving ties with your non-Muslim family. You are still their child/sibling. 
                Showing them kindness (Ihsan) is the best way to explain your new faith.
              </p>
            </div>
          </Card>

          {/* 3. Modesty */}
          <Card className="bg-slate-900 border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
               <div className="p-2 bg-indigo-500/10 rounded-lg"><Shirt className="w-5 h-5 text-indigo-400" /></div>
               <h3 className="text-white font-bold text-sm">Modesty & Style</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-slate-400 text-xs leading-relaxed">
                Modesty does not mean losing your style or adopting a specific culture's clothing. 
                Wear what makes you feel dignified and covered, staying true to who you are.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* --- PHASE 3: COMMUNITY & WELLNESS (Point 2 & 4) --- */}
      {activePhase === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Offline Community (Point 2) */}
          <Card className="bg-emerald-950/20 border-emerald-500/20">
            <div className="p-4 flex items-start gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><MapPin className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Seek Physical Connection</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  The Sakina app is a tool, not a community. To combat loneliness, we encourage you to visit 
                  your local mosque. Look for "New Muslim Circles" or volunteer events.
                </p>
                <div className="mt-3 bg-slate-950/50 p-2 rounded border border-white/5">
                   <p className="text-[10px] text-emerald-400 font-bold uppercase">Safe Spaces for Sisters</p>
                   <p className="text-[10px] text-slate-500">Many mosques now have female-led support groups.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Mental Health (Point 4) */}
          <Card className="bg-slate-900 border-white/5">
            <div className="p-4 flex items-start gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg"><Brain className="w-5 h-5 text-purple-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Emotional Wellness</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Feeling overwhelmed or estranged is common. Prioritize your mental health. 
                  If you are struggling, please speak to our AI Companion for spiritual comfort or seek professional counseling.
                </p>
              </div>
            </div>
          </Card>

          {/* 3. Goal Setting */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Spiritual Goals</h3>
             <div onClick={() => toggleStep('jumuah')} className={`group flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer ${completedSteps['jumuah'] ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/30'}`}>
              <div className={`p-2 rounded-full transition-colors ${completedSteps['jumuah'] ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 group-hover:text-emerald-500'}`}><Users className="w-5 h-5" /></div>
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${completedSteps['jumuah'] ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>Attend Jumu'ah</h4>
                <p className="text-slate-500 text-xs mt-0.5">Friday prayer is a weekly community gathering.</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};