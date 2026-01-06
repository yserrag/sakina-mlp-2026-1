import React, { useState } from 'react';
import { 
  BookOpen, Star, Sun, Utensils, Smile, Home, 
  Mic, User, Droplets, ChevronLeft, ChevronRight, 
  PlayCircle, Pause, X, Heart, Sparkles, GraduationCap, 
  Volume2, ArrowRight, Book, Library
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// [CONFIG] Types
interface Coordinates { lat: number; lng: number; }
interface UserSettings { madhab: 'shafi' | 'hanafi'; calculationMethod: string; }

interface Props {
  coords?: Coordinates | null;
  settings?: UserSettings;
}

// [DATA] Content: Salah Guide
const SALAH_STEPS = [
  { 
    id: 1, name: 'Takbir', arabicScript: 'اللَّهُ أَكْبَرُ', recitation: 'Allahu Akbar', 
    meaning: 'God is the Greatest', instruction: 'Raise hands to ears, palms facing forward. Focus your heart.', 
    desc: 'Opening', icon: '🤲'
  },
  { 
    id: 2, name: 'Qiyam', arabicScript: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', recitation: 'Alhamdulillahi Rabbil Alameen...', 
    meaning: 'Praise be to Allah (Surah Al-Fatiha)', instruction: 'Stand with right hand over left on chest. Look at the ground.', 
    desc: 'Recitation', icon: '🧍'
  },
  { 
    id: 3, name: 'Ruku', arabicScript: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', recitation: 'Subhana Rabbiyal Azeem', 
    meaning: 'Glory to my Lord the Almighty', instruction: 'Bow down, keeping back straight. Say 3 times.', 
    desc: 'Bowing', icon: '🙇'
  },
  { 
    id: 4, name: 'Sujood', arabicScript: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', recitation: "Subhana Rabbiyal A'la", 
    meaning: 'Glory to my Lord the Most High', instruction: 'Prostrate on the ground. Say 3 times.', 
    desc: 'Prostration', icon: '🛐'
  },
  { 
    id: 5, name: 'Tashahhud', arabicScript: 'التَّحِيَّاتُ لِلَّهِ', recitation: 'At-tahiyyatu Lillahi...', 
    meaning: 'All compliments are due to Allah', instruction: 'Sit and recite the testimony. Point index finger.', 
    desc: 'Testimony', icon: '☝️'
  }
];

// [DATA] Content: Wudu Guide
const WUDU_STEPS = [
  { id: 1, name: 'Niyyah', recitation: 'Bismillah', meaning: 'In the name of Allah', instruction: 'Make intention and say Bismillah.', desc: 'Start' },
  { id: 2, name: 'Hands', recitation: '', meaning: '', instruction: 'Wash hands 3 times, getting between fingers.', desc: 'Wash' },
  { id: 3, name: 'Mouth & Nose', recitation: '', meaning: '', instruction: 'Rinse mouth and nose 3 times.', desc: 'Rinse' },
  { id: 4, name: 'Face', recitation: '', meaning: '', instruction: 'Wash face 3 times from hairline to chin.', desc: 'Wash' },
  { id: 5, name: 'Arms', recitation: '', meaning: '', instruction: 'Wash arms to elbows 3 times, right then left.', desc: 'Wash' },
  { id: 6, name: 'Head & Ears', recitation: '', meaning: '', instruction: 'Wipe head and ears once.', desc: 'Wipe' },
  { id: 7, name: 'Feet', recitation: '', meaning: '', instruction: 'Wash feet to ankles 3 times.', desc: 'Wash' },
];

// [DATA] Content: Sunnah Habits
const SUNNAH_PRACTICES = [
  {
    category: "Morning", icon: <Sun className="w-5 h-5" />, color: "text-amber-400",
    items: [
      { label: "Waking Up", recitation: "Alhamdulillahil-ladhi ahyana...", meaning: "Praise is to Allah Who gives us life." },
      { label: "Bed Making", recitation: "", meaning: "Shake out the bedding before sleeping (Bukhari)." },
    ]
  },
  {
    category: "Eating", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-400",
    items: [
      { label: "Right Hand", recitation: "Bismillah", meaning: "Always eat with the right hand." },
      { label: "Gratitude", recitation: "Alhamdulillah", meaning: "Praise Allah after finishing." },
    ]
  },
  {
    category: "Social", icon: <Smile className="w-5 h-5" />, color: "text-rose-400",
    items: [
      { label: "Greeting", recitation: "Assalamu Alaykum", meaning: "Spread peace to those you know and don't know." },
      { label: "Smiling", recitation: "", meaning: "Smiling at your brother is charity." },
    ]
  }
];

// [DATA] Sanctuary: Emotional First Aid
const EMOTIONAL_SUPPORT: Record<string, { title: string; text: string; source: string }> = {
  'Lonely': { title: "Allah is Close", text: "Verily, in the remembrance of Allah do hearts find rest. You are never truly alone when you have Him.", source: "Quran 13:28" },
  'Anxious': { title: "With Hardship Comes Ease", text: "Do not worry. Whatever is meant for you will not pass you by. Allah is the best of planners.", source: "Hadith" },
  'Overwhelmed': { title: "One Step at a Time", text: "Allah does not burden a soul beyond that it can bear. Just do your best, that is enough.", source: "Quran 2:286" },
  'Confused': { title: "Guide Us", text: "Keep asking 'Ihdinas-sirat al-mustaqim' (Guide us to the straight path). He answers those who ask.", source: "Al-Fatiha" }
};

// [DATA] Library: Essential Phrases
const ESSENTIAL_PHRASES = [
  { label: "The Shahada", arabicScript: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", recitation: "Ash-hadu an la ilaha illa Allah", meaning: "I bear witness that there is no god but Allah." },
  { label: "Bismillah", arabicScript: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ", recitation: "Bismillah hir-Rahman nir-Rahim", meaning: "In the name of Allah, the Most Gracious, the Most Merciful." },
  { label: "Gratitude", arabicScript: "ٱلْحَمْدُ لِلَّٰهِ", recitation: "Alhamdulillah", meaning: "All praise is due to Allah." },
];

export const RevertJourney: React.FC<Props> = ({ coords, settings }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'LEARN' | 'SUNNAH' | 'SANCTUARY' | 'LIBRARY'>('LEARN');
  
  // Guide State
  const [guideMode, setGuideMode] = useState<'SALAH' | 'WUDU'>('SALAH');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  
  // Audio State (Native Browser TTS)
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Sanctuary State
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const currentGuideSteps = guideMode === 'SALAH' ? SALAH_STEPS : WUDU_STEPS;
  const activeStepData = currentGuideSteps[stepIndex];

  // [ENGINE] Browser Text-to-Speech
  const speak = (text: string, id: string) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingId(id);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; 
    utterance.pitch = 1;
    utterance.onend = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    if (stepIndex < currentGuideSteps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setIsPracticeMode(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500 font-sans">
      
      {/* 1. HERO SECTION: "The Path of Light" */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <BookOpen className="w-48 h-48 -mr-10 -mt-10" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">My Journey</h2>
                <p className="text-teal-200/60 text-xs flex items-center gap-2 mt-1 font-medium uppercase tracking-wider">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Day 14 - Path of Light
                </p>
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold font-mono text-amber-400">45%</div>
                <div className="text-[9px] uppercase tracking-widest text-teal-300/50">Complete</div>
             </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="bg-slate-950/50 p-1 rounded-2xl border border-white/5 flex text-[10px] font-bold uppercase tracking-widest overflow-x-auto scrollbar-hide">
             {['LEARN', 'SUNNAH', 'SANCTUARY', 'LIBRARY'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 min-w-[80px] py-3 rounded-xl transition-all ${
                        activeTab === tab 
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                 >
                    {tab}
                 </button>
             ))}
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT: LEARN (Visual Guide) */}
      {activeTab === 'LEARN' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
           <Card className={`border-0 shadow-2xl overflow-hidden bg-[#0f172a] border border-white/5 ${isPracticeMode ? 'fixed inset-0 z-50 rounded-none flex flex-col pt-12' : 'relative'}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 p-4">
                 <div>
                    <h3 className="font-bold text-lg text-white">Visual Guide</h3>
                    <p className="text-xs text-slate-500">{isPracticeMode ? 'Follow along...' : 'Master the basics'}</p>
                 </div>
                 {!isPracticeMode ? (
                   <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
                      <button onClick={() => { setGuideMode('SALAH'); setStepIndex(0); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${guideMode === 'SALAH' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Salah</button>
                      <button onClick={() => { setGuideMode('WUDU'); setStepIndex(0); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${guideMode === 'WUDU' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Wudu</button>
                   </div>
                 ) : (
                   <button onClick={() => setIsPracticeMode(false)} className="bg-white/10 p-2 rounded-full text-white"><X className="w-5 h-5" /></button>
                 )}
              </div>

              {/* Main Step Display */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(20,184,166,0.2)] bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-6 transition-all ${isPracticeMode ? 'scale-125' : ''}`}>
                    {(activeStepData as any).icon || (guideMode === 'WUDU' ? <Droplets /> : <User />)}
                 </div>
                 <h4 className="text-3xl font-bold mb-2 text-white">{activeStepData.name}</h4>
                 <p className="font-medium text-sm mb-6 max-w-xs leading-relaxed text-slate-400">{activeStepData.instruction}</p>

                 {/* Recitation Card */}
                 {activeStepData.recitation && (
                    <div className="w-full max-w-sm rounded-2xl p-6 mb-6 bg-white/5 border border-white/10 relative overflow-hidden group">
                       <p className="text-[10px] font-bold uppercase mb-2 text-teal-400 flex items-center justify-center gap-2"><Mic className="w-3 h-3" /> Say This</p>
                       {(activeStepData as any).arabicScript && (
                         <p className="font-serif text-2xl mb-3 text-white leading-loose" dir="rtl">{(activeStepData as any).arabicScript}</p>
                       )}
                       <p className="text-lg text-slate-200 mb-2">"{activeStepData.recitation}"</p>
                       <p className="text-xs italic text-slate-500">{activeStepData.meaning}</p>
                    </div>
                 )}

                 {/* Controls */}
                 <div className="flex items-center gap-4 w-full justify-center">
                    <button 
                      onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                      disabled={stepIndex === 0}
                      className="p-4 rounded-full bg-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-700"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    {activeStepData.recitation ? (
                      <button 
                        onClick={() => speak(activeStepData.recitation, `step-${activeStepData.id}`)}
                        className={`h-16 px-8 rounded-full flex items-center gap-3 font-bold shadow-lg transition-all ${playingId === `step-${activeStepData.id}` ? 'bg-rose-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-500'}`}
                      >
                         {playingId === `step-${activeStepData.id}` ? <Pause className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                         {playingId === `step-${activeStepData.id}` ? 'Pause' : 'Listen'}
                      </button>
                    ) : (
                      <div className="w-16" />
                    )}

                    <button 
                      onClick={handleNextStep}
                      disabled={stepIndex === currentGuideSteps.length - 1 && !isPracticeMode}
                      className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-30"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="p-6 bg-slate-900/50 border-t border-white/5">
                 <div className="flex justify-center gap-1.5 mb-4">
                    {currentGuideSteps.map((_, i) => (
                       <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === stepIndex ? 'bg-teal-500 w-8' : 'bg-slate-700 w-2'}`} />
                    ))}
                 </div>
                 {!isPracticeMode && guideMode === 'SALAH' && (
                    <Button onClick={() => { setIsPracticeMode(true); }} className="w-full bg-teal-600 hover:bg-teal-500 text-white">Start Practice Mode</Button>
                 )}
              </div>
           </Card>
        </div>
      )}

      {/* 3. TAB CONTENT: SUNNAH */}
      {activeTab === 'SUNNAH' && (
        <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
           {SUNNAH_PRACTICES.map((practice, i) => (
             <Card key={i} className="bg-[#0f172a] border-white/5 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 p-4 pb-0">
                   <div className={`p-2 rounded-lg bg-white/5 ${practice.color}`}>{practice.icon}</div>
                   <h3 className="font-bold text-white">{practice.category} Sunnahs</h3>
                </div>
                <div className="divide-y divide-white/5">
                   {practice.items.map((item, j) => (
                      <div key={j} className="p-4 hover:bg-white/5 transition-colors flex items-start justify-between group">
                         <div>
                            <p className="text-sm font-bold text-slate-200 mb-1">{item.label}</p>
                            {item.recitation && <p className="text-xs text-teal-400 italic mb-1">"{item.recitation}"</p>}
                            <p className="text-xs text-slate-500">{item.meaning}</p>
                         </div>
                         <button className="text-slate-600 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                   ))}
                </div>
             </Card>
           ))}
        </div>
      )}

      {/* 4. TAB CONTENT: SANCTUARY */}
      {activeTab === 'SANCTUARY' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
           <Card className="bg-[#0f172a] border-white/5 p-6 text-center">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Spiritual Sanctuary</h3>
              <p className="text-sm text-slate-400 mb-8">How is your heart feeling today?</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                 {Object.keys(EMOTIONAL_SUPPORT).map((key) => (
                    <button 
                      key={key}
                      onClick={() => setSelectedEmotion(key)}
                      className={`p-4 rounded-xl text-sm font-bold transition-all ${
                         selectedEmotion === key 
                         ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                         : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                       {key}
                    </button>
                 ))}
              </div>

              {selectedEmotion && (
                 <div className="bg-slate-900/50 rounded-2xl p-6 border border-rose-500/20 animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="font-serif text-lg text-rose-300 mb-2">{EMOTIONAL_SUPPORT[selectedEmotion].title}</h4>
                    <p className="text-slate-200 leading-relaxed mb-4">"{EMOTIONAL_SUPPORT[selectedEmotion].text}"</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{EMOTIONAL_SUPPORT[selectedEmotion].source}</p>
                 </div>
              )}
           </Card>
        </div>
      )}

      {/* 5. TAB CONTENT: LIBRARY (Sacred Texts + Phrases) */}
      {activeTab === 'LIBRARY' && (
        <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
           
           {/* Section 1: Sacred Texts (Bookshelf) */}
           <div>
             <div className="flex items-center gap-3 px-2 mb-3">
                <Library className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-white">Sacred Texts</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {['The Noble Quran', 'Sahih Al-Bukhari', 'Fortress of the Muslim', 'Seerah of Prophet'].map((book, i) => (
                  <Card key={i} className="bg-[#0f172a] border-white/5 p-4 flex flex-col items-center justify-center text-center hover:border-amber-500/30 transition-colors group cursor-pointer">
                     <Book className="w-8 h-8 text-slate-600 group-hover:text-amber-400 mb-3 transition-colors" />
                     <p className="text-xs font-bold text-slate-300">{book}</p>
                     <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Read</p>
                  </Card>
                ))}
             </div>
           </div>

           {/* Section 2: Essential Phrases */}
           <div>
              <div className="flex items-center gap-3 px-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-teal-500" />
                  <h3 className="font-bold text-white">Essential Phrases</h3>
              </div>
              
              <div className="space-y-3">
                 {ESSENTIAL_PHRASES.map((item, i) => (
                    <Card key={i} className="bg-[#0f172a] border-white/5 p-4 flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-teal-500 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="font-serif text-lg text-white mb-1">{item.recitation}</p>
                          <p className="text-xs text-slate-500 italic">"{item.meaning}"</p>
                       </div>
                       <button 
                          onClick={() => speak(item.recitation, `phrase-${i}`)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                             playingId === `phrase-${i}` ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-teal-400 hover:bg-teal-500 hover:text-white'
                          }`}
                       >
                          {playingId === `phrase-${i}` ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                       </button>
                    </Card>
                 ))}
              </div>
           </div>

        </div>
      )}
    </div>
  );
};