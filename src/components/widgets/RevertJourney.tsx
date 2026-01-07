import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BookOpen, Sparkles, Lightbulb, CheckCircle2, Circle, ArrowRight, Loader2, 
  User, ChevronRight, ChevronLeft, Volume2, StopCircle, PlayCircle, 
  GraduationCap, Mic, Droplets, Star, Sun, Utensils, Home, Smile,
  X, List, Pause, Play, Search
} from 'lucide-react';
import { PrayerWidget } from './PrayerWidget';

// [TYPES]
interface Coordinates {
  lat: number;
  lng: number;
}
interface UserSettings {
  madhab: string;
  calcMethod: string;
}
interface Props {
  coords?: Coordinates | null; 
  settings?: UserSettings;     
}

interface ConceptExplanation {
  definition: string;
  analogy: string;
  benefit: string;
}

interface FeedbackResult {
   score: number;
   feedback: string;
}

// [DATA]
const SUGGESTED_QUESTIONS = [
  "What is Wudu?",
  "Why do we pray?",
  "What is Halal?",
  "Who is the Prophet?"
];

const SALAH_STEPS = [
  { 
    id: 1, 
    name: 'Takbir', 
    arabicScript: 'اللَّهُ أَكْبَرُ',
    recitation: 'Allahu Akbar', 
    meaning: 'God is the Greatest', 
    instruction: 'Raise hands to ears, palms facing forward. Focus your heart.',
    desc: 'Opening',
    icon: '🤲'
  },
  { 
    id: 2, 
    name: 'Qiyam (Standing)', 
    arabicScript: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    recitation: 'Alhamdulillahi Rabbil Alameen...', 
    meaning: 'Praise be to Allah, Lord of the worlds (Surah Al-Fatiha)', 
    instruction: 'Stand with hands folded (right over left) on chest or navel. Look at the ground.',
    desc: 'Recitation',
    icon: '🧍',
    fullRecitation: [
      { arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", transliteration: "Bismillāhir-Raḥmānir-Raḥīm", translation: "In the name of Allah, the Most Gracious, the Most Merciful." },
      { arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", transliteration: "Al-ḥamdu lillāhi rabbil-ʿālamīn", translation: "All praise is due to Allah, Lord of the worlds." },
      { arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", transliteration: "Ar-raḥmānir-raḥīm", translation: "The Most Gracious, the Most Merciful." },
      { arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ", transliteration: "Māliki yawmid-dīn", translation: "Sovereign of the Day of Recompense." },
      { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", transliteration: "Iyyāka naʿbudu wa iyyāka nastaʿīn", translation: "It is You we worship and You we ask for help." },
      { arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm", translation: "Guide us to the straight path." },
      { arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", transliteration: "Ṣirāṭallaḏīna anʿamta ʿalayhim ġayril-maġḍūbi ʿalayhim walaḍ-ḍāllīn", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked Your anger or of those who are astray." },
    ]
  },
  { 
    id: 3, 
    name: 'Ruku (Bowing)', 
    arabicScript: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    recitation: 'Subhana Rabbiyal Azeem', 
    meaning: 'Glory to my Lord the Almighty', 
    instruction: 'Bow down, keeping back straight, hands on knees. Say 3 times.',
    desc: 'Bowing',
    icon: '🙇'
  },
  { 
    id: 4, 
    name: 'Sujood (Prostration)', 
    arabicScript: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    recitation: 'Subhana Rabbiyal A\'la', 
    meaning: 'Glory to my Lord the Most High', 
    instruction: 'Prostrate with forehead, nose, palms, knees, and toes on ground. Say 3 times.',
    desc: 'Prostration',
    icon: '🛐'
  },
  { 
    id: 5, 
    name: 'Jalsa (Sitting)', 
    arabicScript: 'رَبِّ اغْفِرْ لِي',
    recitation: 'Rabbighfir lee', 
    meaning: 'O Lord, forgive me', 
    instruction: 'Sit comfortably between the two prostrations. Pause for a moment.',
    desc: 'Sitting',
    icon: '🧎'
  },
  { 
    id: 6, 
    name: 'Tashahhud', 
    arabicScript: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    recitation: 'At-tahiyyatu Lillahi was-salawatu wat-tayyibat...', 
    meaning: 'All compliments, prayers and pure words are due to Allah', 
    instruction: 'Sit and recite the Tashahhud (Testimony of Faith). index finger points at "Illallah".',
    desc: 'Testimony',
    icon: '☝️',
    fullRecitation: [
        { arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ", transliteration: "At-tahiyyatu Lillahi was-salawatu wat-tayyibat", translation: "All compliments, prayers and pure words are due to Allah." },
        { arabic: "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ", transliteration: "As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh", translation: "Peace be upon you, O Prophet, and the mercy of Allah and His blessings." },
        { arabic: "السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ", transliteration: "As-salamu 'alayna wa 'ala 'ibadillhis-salihin", translation: "Peace be upon us and on the righteous slaves of Allah." },
        { arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ", transliteration: "Ash-hadu an la ilaha illallah", translation: "I bear witness that there is no god but Allah." },
        { arabic: "وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", transliteration: "Wa ash-hadu anna Muhammadan 'abduhu wa rasuluh", translation: "And I bear witness that Muhammad is His slave and Messenger." }
    ]
  },
  { 
    id: 7, 
    name: 'Tasleem', 
    arabicScript: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ',
    recitation: 'Assalamu Alaykum wa Rahmatullah', 
    meaning: 'Peace be upon you and God\'s mercy', 
    instruction: 'Turn face to the right, then to the left.',
    desc: 'Closing',
    icon: '👋'
  }
];

const WUDU_STEPS = [
  { 
    id: 1, 
    name: 'Niyyah (Intention)', 
    arabicScript: 'بِسْمِ ٱللَّٰهِ',
    recitation: 'Bismillah', 
    meaning: 'In the name of Allah', 
    instruction: 'Make the intention in your heart to purify yourself for prayer, then say Bismillah.', 
    desc: 'Preparation' 
  },
  { 
    id: 2, 
    name: 'Hands', 
    recitation: '', 
    meaning: '', 
    instruction: 'Wash both hands up to the wrists 3 times. Ensure water reaches between fingers.', 
    desc: 'Washing' 
  },
  { 
    id: 3, 
    name: 'Mouth & Nose', 
    recitation: '', 
    meaning: '', 
    instruction: 'Rinse mouth 3 times. Then, rinse nose 3 times by sniffing water in and blowing it out.', 
    desc: 'Purification' 
  },
  { 
    id: 4, 
    name: 'Face', 
    recitation: '', 
    meaning: '', 
    instruction: 'Wash your entire face 3 times, from hairline to chin and ear to ear.', 
    desc: 'Face' 
  },
  { 
    id: 5, 
    name: 'Arms', 
    recitation: '', 
    meaning: '', 
    instruction: 'Wash arms up to and including the elbows 3 times. Start with the right arm.', 
    desc: 'Arms' 
  },
  { 
    id: 6, 
    name: 'Head & Ears', 
    recitation: '', 
    meaning: '', 
    instruction: 'Wipe (Masah) over your head once with wet hands, then wipe the inside and back of ears.', 
    desc: 'Wiping' 
  },
  { 
    id: 7, 
    name: 'Feet', 
    recitation: '', 
    meaning: '', 
    instruction: 'Wash both feet up to and including the ankles 3 times. Start with the right foot.', 
    desc: 'Feet' 
  },
  { 
    id: 8, 
    name: 'Completion Dua', 
    arabicScript: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    recitation: 'Ash-hadu an la ilaha illallah...', 
    meaning: 'I bear witness that there is no god but Allah...', 
    instruction: 'Point right index finger to the sky and recite the testimony of faith.', 
    desc: 'Testimony' 
  }
];

const ESSENTIAL_PHRASES = [
  { label: "The Shahada", arabicScript: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", recitation: "Ash-hadu an la ilaha illa Allah", meaning: "I bear witness that there is no god but Allah." },
  { label: "Bismillah", arabicScript: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ", recitation: "Bismillah hir-Rahman nir-Rahim", meaning: "In the name of Allah, the Most Gracious, the Most Merciful." },
  { label: "Gratitude", arabicScript: "ٱلْحَمْدُ لِلَّٰهِ", recitation: "Alhamdulillah", meaning: "All praise is due to Allah." },
  { label: "Forgiveness", arabicScript: "أَسْتَغْفِرُ ٱللَّٰهَ", recitation: "Astaghfirullah", meaning: "I seek forgiveness from Allah." },
  { label: "Awe", arabicScript: "سُبْحَانَ ٱللَّٰهِ", recitation: "SubhanAllah", meaning: "Glory be to Allah (Perfect and Flawless)." },
  { label: "Greatness", arabicScript: "ٱللَّٰهُ أَكْبَرُ", recitation: "Allahu Akbar", meaning: "God is the Greatest." },
];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const RevertJourney: React.FC<Props> = ({ coords, settings }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'LEARN' | 'SUNNAH' | 'SANCTUARY' | 'LIBRARY'>('LEARN');
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Guide State
  const [guideMode, setGuideMode] = useState<'SALAH' | 'WUDU'>('SALAH');
  const [salahStep, setSalahStep] = useState(0);
  const [wuduStep, setWuduStep] = useState(0);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  
  // Ask Sakina State
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);
  
  // Audio State
  const [playingAudio, setPlayingAudio] = useState<string | null>(null); 
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null); 
  const [lastRecordedId, setLastRecordedId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTextRef = useRef<string>(''); 
  const isHoldingRef = useRef<boolean>(false);

  // Progress State
  const [steps, setSteps] = useState([
    { id: 'step-shahada', title: 'The Shahada', completed: true, targetTab: 'LIBRARY', targetId: 'phrase-0' },
    { id: 'step-wudu', title: 'Wudu (Ablution)', completed: true, targetTab: 'LEARN', guide: 'WUDU' },
    { id: 'step-fatiha', title: 'Surah Al-Fatiha', completed: false, targetTab: 'LEARN', guide: 'SALAH', stepIndex: 1, autoOpenFullText: true }, 
    { id: 'step-salah', title: 'Prayer Positions', completed: false, targetTab: 'LEARN', guide: 'SALAH' },
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const navigateToStep = (step: any) => {
      setActiveTab(step.targetTab as any);
      
      if (step.targetTab === 'LEARN') {
          if (step.guide) {
              setGuideMode(step.guide);
              if (step.guide === 'SALAH') setSalahStep(step.stepIndex || 0);
              if (step.guide === 'WUDU') setWuduStep(step.stepIndex || 0);
          }
          if (step.autoOpenFullText) {
              setShowFullText(true);
          } else {
              setShowFullText(false);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } 
      else if (step.targetTab === 'LIBRARY' && step.targetId) {
          setHighlightId(step.targetId);
          setTimeout(() => {
              const el = document.getElementById(step.targetId);
              if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }, 300); // Wait for tab render
      }
  };

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
    }
    setPlayingAudio(null);
  }, []);

  // --- AI LOGIC ---

  const analyzeAudio = async (blob: Blob, text: string) => {
      setIsAnalyzing(true);
      try {
          const base64Audio = await blobToBase64(blob);
          const ai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
          const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

          const prompt = `The user is a new Muslim revert practicing. They are trying to say: "${text}".
          Listen to the audio carefully.
          IMPORTANT: If the audio is silent, unclear, or just noise, return score: 0.
          1. Rate accuracy from 0-100.
          2. Give 1 short, gentle sentence of feedback.
          Return ONLY JSON: { "score": number, "feedback": "string" }`;

          const result = await model.generateContent([
            prompt,
            { inlineData: { mimeType: "audio/webm", data: base64Audio } }
          ]);

          const responseText = result.response.text();
          const cleanJson = responseText.replace(/```json|```/g, '').trim();
          setFeedback(JSON.parse(cleanJson));

      } catch (e) {
          console.error("Analysis failed", e);
          setFeedback({ score: 0, feedback: "Sorry, I couldn't hear that clearly. Please try again." });
      } finally {
          setIsAnalyzing(false);
      }
  };

  const startRecording = async (id: string, text: string) => {
      try {
          isHoldingRef.current = true;
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          if (!isHoldingRef.current) {
             stream.getTracks().forEach(track => track.stop());
             return; 
          }

          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          chunksRef.current = [];
          recordingTextRef.current = text;

          mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunksRef.current.push(e.data);
          };

          mediaRecorder.onstop = () => {
              setIsRecording(false);
              setRecordingId(null);
              const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
              
              if (chunksRef.current.length > 0 && blob.size > 0) {
                 analyzeAudio(blob, text);
              }
              stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingId(id);
          setLastRecordedId(id);
          setFeedback(null);
          stopAudio();
      } catch (err) {
          console.error("Mic error:", err);
          alert("Could not access microphone.");
          setIsRecording(false);
          setRecordingId(null);
      }
  };

  const stopRecording = useCallback(() => {
      isHoldingRef.current = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
      }
  }, []);

  useEffect(() => {
    const handleGlobalRelease = () => {
        if (isHoldingRef.current || isRecording) {
            stopRecording();
        }
    };
    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    return () => {
        window.removeEventListener('mouseup', handleGlobalRelease);
        window.removeEventListener('touchend', handleGlobalRelease);
    };
  }, [isRecording, stopRecording]);

  const playTTS = async (text: string, id: string) => {
    if (playingAudio === id) {
        stopAudio();
        return;
    }
    stopAudio();
    setPlayingAudio(id);
    setIsLoadingAudio(true);

    try {
        console.log("TTS Request:", text);
        // Mock delay for UI response
        setTimeout(() => {
            setIsLoadingAudio(false);
            setPlayingAudio(null); 
        }, 2000);
    } catch (error) {
        setPlayingAudio(null);
        setIsLoadingAudio(false);
    }
  };

  const playFullSurah = async () => {
      if (!activeStepData || !(activeStepData as any).fullRecitation) return;
      const fullId = `full-surah-${activeStepData.id}`;
      if (playingAudio === fullId) {
          stopAudio();
          return;
      }
      playTTS("Surah Recitation", fullId);
  };

  // [UPDATED] Explain Concept Logic
  const explainConcept = async (queryOverride?: string) => {
    const query = queryOverride || concept;
    if (!query.trim() || loading) return;

    setLoading(true);
    setExplanation(null);
    setConcept(query); // Update input if chip clicked
    stopAudio();

    try {
      const ai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Explain the Islamic concept of "${query}" to a beginner/revert.
      1. Definition: A simple 1-sentence definition based on Sunni understanding.
      2. Analogy: A relatable real-world analogy.
      3. Benefit: One practical spiritual or physical benefit.
      Return ONLY JSON: { "definition": "...", "analogy": "...", "benefit": "..." }`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      setExplanation(JSON.parse(cleanJson));

    } catch (error) {
      console.error("Explanation Error:", error);
      // Fallback for user
      setExplanation({
          definition: "We couldn't reach the guide right now.",
          analogy: "Like a phone with no signal.",
          benefit: "Please check your internet connection and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const currentGuideSteps = guideMode === 'SALAH' ? SALAH_STEPS : WUDU_STEPS;
  const currentStepIndex = guideMode === 'SALAH' ? salahStep : wuduStep;
  const setStepIndex = guideMode === 'SALAH' ? setSalahStep : setWuduStep;
  const activeStepData = currentGuideSteps[currentStepIndex];

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentGuideSteps.length) {
        setStepIndex(nextIndex);
        if (isPracticeMode && currentGuideSteps[nextIndex].recitation) {
            setTimeout(() => {
                playTTS(currentGuideSteps[nextIndex].recitation, `${guideMode}-${currentGuideSteps[nextIndex].id}`);
            }, 500);
        }
    } else {
        setIsPracticeMode(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-5 rounded-[2rem] shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <BookOpen className="w-48 h-48 -mr-10 -mt-10" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">My Journey</h2>
                <p className="text-teal-200/60 text-xs flex items-center gap-2 mt-1 font-medium uppercase tracking-wider">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    Day 14 - Path of Light
                </p>
             </div>
             <div className="text-right">
                <div className="text-xl font-bold font-mono text-yellow-400">
                    {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
                </div>
                <div className="text-[9px] uppercase tracking-widest text-teal-300/50">Complete</div>
             </div>
          </div>
          
          <div className="bg-[#0f172a] p-1 rounded-2xl border border-white/5 flex text-[10px] font-bold uppercase tracking-widest relative z-20 overflow-x-auto scrollbar-hide">
             {['LEARN', 'SUNNAH', 'SANCTUARY', 'LIBRARY'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 min-w-[70px] py-2.5 rounded-xl transition-all ${
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

      {/* --- TAB CONTENT: LEARN --- */}
      {activeTab === 'LEARN' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            
            {/* [MOVED HERE] Ask Your Guide - Now Top Priority */}
            <Card className="border-l-4 border-amber-500 bg-[#0f172a] shadow-lg shadow-amber-900/10">
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-amber-500/20 p-2 rounded-lg shrink-0">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-200">Ask Your Guide</h3>
                        <p className="text-xs text-slate-500">Clarify concepts simply.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="e.g. What is Ghusl?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-600 text-slate-200 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && explainConcept()}
                        />
                        <button 
                            onClick={() => explainConcept()}
                            disabled={!concept.trim() || loading}
                            className="absolute right-2 top-2 p-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Quick Suggestion Chips */}
                    {!explanation && !loading && (
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button 
                                    key={i}
                                    onClick={() => explainConcept(q)}
                                    className="text-[10px] px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {explanation && (
                        <div className="bg-[#1e293b] border border-amber-500/20 rounded-xl p-4 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 relative">
                             <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Definition</span>
                                <button onClick={() => setExplanation(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
                             </div>
                             <p className="text-slate-200 font-medium">{explanation.definition}</p>
                             <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                 <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                     <Lightbulb className="w-3 h-3" /> Think of it like...
                                 </span>
                                 <p className="text-amber-200 text-sm italic">"{explanation.analogy}"</p>
                             </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Visual Guide */}
            <Card className={`border-0 shadow-2xl overflow-hidden transition-all duration-500 bg-[#0f172a] border border-white/5 ${isPracticeMode ? 'fixed inset-0 z-50 rounded-none flex flex-col' : 'relative'}`}>
                
                {/* Header */}
                <div className={`flex items-center justify-between ${isPracticeMode ? 'p-6 bg-slate-900 border-b border-white/5' : 'mb-6'}`}>
                    <div>
                        <h3 className={`font-bold text-lg ${isPracticeMode ? 'text-teal-400' : 'text-slate-200'}`}>
                            {isPracticeMode ? 'Salah Coach' : 'Visual Guide'}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {isPracticeMode ? 'Follow along with the audio' : 'Master the basics step-by-step'}
                        </p>
                    </div>
                    
                    {!isPracticeMode && (
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
                            <button onClick={() => { setGuideMode('WUDU'); stopAudio(); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${guideMode === 'WUDU' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Wudu</button>
                            <button onClick={() => { setGuideMode('SALAH'); stopAudio(); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${guideMode === 'SALAH' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Salah</button>
                        </div>
                    )}
                    
                    {isPracticeMode && (
                        <button onClick={() => { setIsPracticeMode(false); stopAudio(); }} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20">
                            <StopCircle className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Main Interactive Area */}
                <div className={`flex-1 flex flex-col items-center justify-center p-4 text-center transition-all ${isPracticeMode ? '' : 'min-h-[300px]'}`}>
                    
                    <div className={`transition-all duration-500 mb-6 ${isPracticeMode ? 'scale-125 mt-10' : ''}`}>
                         <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(20,184,166,0.2)] bg-teal-500/10 text-teal-400 border border-teal-500/20`}>
                             {(activeStepData as any).icon || (guideMode === 'SALAH' ? <User className="w-10 h-10" /> : <Droplets className="w-10 h-10" />)}
                         </div>
                    </div>
                    
                    <h4 className="text-3xl font-serif font-bold mb-2 text-white">
                        {activeStepData.name}
                    </h4>
                    <p className="font-medium text-sm mb-6 max-w-xs leading-relaxed text-slate-400">
                        {activeStepData.instruction}
                    </p>

                    {/* Recitation Card */}
                    {activeStepData.recitation && (
                        <div className={`w-full max-w-sm rounded-2xl p-6 mb-6 relative overflow-hidden transition-all bg-white/5 border border-white/10`}>
                             {playingAudio?.includes(activeStepData.id.toString()) && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                    <div className="flex gap-1 items-end h-full py-4">
                                        {[...Array(5)].map((_,i) => (
                                            <div key={i} className="w-3 bg-teal-400 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: '0.5s' }} />
                                        ))}
                                    </div>
                                </div>
                             )}

                            <p className="text-[10px] font-bold uppercase mb-2 flex items-center justify-center gap-2 text-teal-400">
                                <Mic className="w-3 h-3" /> Say This
                            </p>
                            
                            {(activeStepData as any).arabicScript && (
                                <p className="font-arabic text-3xl mb-3 text-white leading-loose drop-shadow-md" dir="rtl">
                                    {(activeStepData as any).arabicScript}
                                </p>
                            )}
                            
                            <p className="font-serif text-lg mb-2 leading-relaxed text-slate-200">
                                "{activeStepData.recitation}"
                            </p>
                            <p className="text-xs italic text-slate-500 mb-4">
                                {activeStepData.meaning}
                            </p>

                            {(activeStepData as any).fullRecitation && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowFullText(true)}
                                    className="w-full mb-4 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-white text-xs font-bold"
                                >
                                    <BookOpen className="w-3 h-3 mr-2" /> Read Full Text
                                </Button>
                            )}

                            <div className="flex justify-center gap-2">
                                <button 
                                    onMouseDown={() => startRecording(`guide-${activeStepData.id}`, activeStepData.recitation)}
                                    onTouchStart={() => startRecording(`guide-${activeStepData.id}`, activeStepData.recitation)}
                                    disabled={isAnalyzing}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 select-none touch-none ${
                                        isRecording && recordingId === `guide-${activeStepData.id}`
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                    }`}
                                >
                                    {isAnalyzing && lastRecordedId === `guide-${activeStepData.id}` ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            {isRecording && recordingId === `guide-${activeStepData.id}` ? <Mic className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
                                            {isRecording && recordingId === `guide-${activeStepData.id}` ? "Release to Check" : "Hold to Practice"}
                                        </>
                                    )}
                                </button>
                            </div>

                            {feedback && !isRecording && !isAnalyzing && recordingId === null && lastRecordedId === `guide-${activeStepData.id}` && (
                                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-2">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <div className="text-lg font-black text-emerald-400">{feedback.score}%</div>
                                        <div className="text-[10px] font-bold uppercase text-emerald-600">Accuracy</div>
                                    </div>
                                    <p className="text-xs text-emerald-200">{feedback.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-auto pb-6">
                        {!isPracticeMode && (
                             <button 
                                onClick={() => { setStepIndex(Math.max(0, currentStepIndex - 1)); stopAudio(); setFeedback(null); setShowFullText(false); }}
                                disabled={currentStepIndex === 0}
                                className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30 text-slate-400 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {activeStepData.recitation ? (
                             <button 
                                onClick={() => playTTS(activeStepData.recitation, `${guideMode}-${activeStepData.id}`)}
                                disabled={isLoadingAudio}
                                className={`h-16 px-8 rounded-full flex items-center gap-3 font-bold shadow-lg transition-transform active:scale-95 ${
                                    playingAudio?.includes(activeStepData.id.toString()) 
                                    ? 'bg-rose-600 text-white shadow-rose-900/40' 
                                    : 'bg-teal-600 text-white shadow-teal-900/40 hover:bg-teal-500'
                                }`}
                            >
                                {isLoadingAudio ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                                 playingAudio?.includes(activeStepData.id.toString()) ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                {playingAudio?.includes(activeStepData.id.toString()) ? 'Pause' : 'Listen'}
                            </button>
                        ) : (
                            <div className="h-16" />
                        )}

                        {isPracticeMode ? (
                             <button 
                                onClick={handleNextStep}
                                className="h-16 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg flex items-center gap-2"
                             >
                                Next <ArrowRight className="w-5 h-5" />
                             </button>
                        ) : (
                            <button 
                                onClick={() => { setStepIndex(Math.min(currentGuideSteps.length - 1, currentStepIndex + 1)); stopAudio(); setFeedback(null); setShowFullText(false); }}
                                disabled={currentStepIndex === currentGuideSteps.length - 1}
                                className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30 text-slate-400 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                {!isPracticeMode && (
                    <div className="bg-slate-900/50 p-4 border-t border-white/5">
                        <div className="flex justify-center gap-1.5 mb-4">
                            {currentGuideSteps.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentStepIndex 
                                    ? 'bg-teal-500 w-6' 
                                    : 'bg-slate-700 w-1.5'
                                }`} />
                            ))}
                        </div>
                        {guideMode === 'SALAH' && (
                             <Button onClick={() => { setIsPracticeMode(true); playTTS("Ready to pray. Step 1: Takbir", "intro"); }} className="w-full bg-teal-600 hover:bg-teal-500 text-white shadow-lg">
                                 <PlayCircle className="w-4 h-4 mr-2" /> Start Practice Mode
                             </Button>
                        )}
                    </div>
                )}
            </Card>

             <div className="space-y-3">
                <h3 className="font-bold text-slate-400 px-1 mt-4 uppercase text-xs tracking-widest">Your Path</h3>
                {steps.map((step) => (
                    <div 
                        key={step.id} 
                        className={`group p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        step.completed 
                            ? 'bg-emerald-900/10 border-emerald-500/20 opacity-80' 
                            : 'bg-white/5 border-white/5 hover:border-teal-500/30 hover:bg-white/10'
                        }`}
                    >
                        <button 
                            onClick={() => toggleStep(step.id)}
                            className={`shrink-0 transition-colors ${step.completed ? 'text-emerald-500' : 'text-slate-500 hover:text-teal-400'}`}
                        >
                            {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        
                        <div className="flex-1">
                            <h4 className={`font-medium ${step.completed ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>
                            {step.title}
                            </h4>
                            {!step.completed && (
                                <button 
                                    onClick={() => navigateToStep(step)}
                                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-1 font-bold"
                                >
                                    Go to Lesson <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>
      )}

      {/* --- Full Text Modal --- */}
      {showFullText && (activeStepData as any).fullRecitation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={() => { setShowFullText(false); stopAudio(); }} />
              <div className="w-full max-w-lg relative bg-[#0f172a] border border-teal-500/30 rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                  <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 rounded-t-3xl">
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                          <List className="w-5 h-5 text-teal-500" />
                          {activeStepData.name}
                      </h3>
                      <div className="flex items-center gap-2">
                           <button 
                                onClick={playFullSurah} 
                                className={`p-2 rounded-full transition-colors ${playingAudio?.startsWith('full-surah') ? 'bg-teal-600 text-white' : 'text-teal-400 hover:bg-white/10'}`}
                           >
                               {isLoadingAudio && playingAudio?.startsWith('full-surah') ? <Loader2 className="w-6 h-6 animate-spin" /> :
                                playingAudio?.startsWith('full-surah') ? <StopCircle className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                           </button>
                           <button onClick={() => { setShowFullText(false); stopAudio(); }} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                           </button>
                      </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar bg-gradient-to-b from-[#0f172a] to-slate-900">
                      {(activeStepData as any).fullRecitation.map((verse: any, idx: number) => {
                          const verseId = `full-recitation-${activeStepData.id}-${idx}`;
                          const isPlaying = playingAudio === verseId;
                          const isRecordingThis = isRecording && recordingId === verseId;
                          const isAnalyzingThis = isAnalyzing && lastRecordedId === verseId;

                          return (
                          <div key={idx} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                              <div className="flex gap-4">
                                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold shrink-0 mt-2">
                                      {idx + 1}
                                  </div>
                                  <div className="flex-1 space-y-3">
                                      <p className="font-arabic text-3xl text-slate-100 leading-loose text-right" dir="rtl">{verse.arabic}</p>
                                      <p className="text-sm font-bold text-teal-400/90">{verse.transliteration}</p>
                                      <p className="text-sm text-slate-400 italic leading-relaxed">{verse.translation}</p>
                                      
                                      <div className="flex items-center gap-3 mt-3">
                                          <button 
                                              onClick={() => playTTS(verse.arabic, verseId)}
                                              disabled={isLoadingAudio}
                                              className={`p-2 rounded-full transition-all ${
                                                  isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-teal-400 hover:bg-white/20'
                                              }`}
                                          >
                                              {isLoadingAudio && isPlaying ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                                               isPlaying ? <StopCircle className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                          </button>

                                          <button
                                              onMouseDown={() => startRecording(verseId, verse.transliteration)}
                                              onTouchStart={() => startRecording(verseId, verse.transliteration)}
                                              disabled={isAnalyzing}
                                              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all select-none touch-none ${
                                                  isRecordingThis 
                                                      ? 'bg-red-500 text-white' 
                                                      : isAnalyzingThis
                                                          ? 'bg-white/5 text-slate-400'
                                                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                              }`}
                                          >
                                              {isRecordingThis ? <Mic className="w-4 h-4 animate-pulse" /> : 
                                               isAnalyzingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                               <Mic className="w-4 h-4" />}
                                              {isRecordingThis ? "Listening..." : isAnalyzingThis ? "Checking..." : "Practice"}
                                          </button>
                                      </div>

                                      {feedback && lastRecordedId === verseId && !isRecording && !isAnalyzing && (
                                          <div className="mt-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                              <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 font-bold text-xs">
                                                  {feedback.score}%
                                              </div>
                                              <div>
                                                  <p className="text-xs text-emerald-100 font-medium">{feedback.feedback}</p>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )})}
                  </div>

                  <div className="p-4 border-t border-white/5 bg-slate-900/50 rounded-b-3xl">
                        <Button onClick={() => { setShowFullText(false); stopAudio(); }} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold">
                           Close Reading
                        </Button>
                  </div>
              </div>
          </div>
      )}

      {/* --- TAB CONTENT: LIBRARY --- */}
      {activeTab === 'LIBRARY' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-bold text-slate-300 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-emerald-500" />
                        Essential Phrases
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {ESSENTIAL_PHRASES.map((item, i) => {
                        const audioId = `phrase-${i}`;
                        const isPlaying = playingAudio === audioId;
                        const isHighlighted = highlightId === audioId;

                        return (
                        <div 
                            key={i} 
                            id={audioId}
                            className={`p-4 rounded-xl border transition-all flex flex-col gap-4 group duration-500 ${
                                isHighlighted 
                                ? 'bg-emerald-900/40 border-emerald-400 ring-2 ring-emerald-400/50 shadow-emerald-500/20' 
                                : isPlaying 
                                    ? 'bg-emerald-900/20 border-emerald-500/30 scale-[1.02]' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">{item.label}</span>
                                    {item.arabicScript && (
                                        <p className="font-arabic text-xl text-slate-200 leading-loose mb-1" dir="rtl">{item.arabicScript}</p>
                                    )}
                                    {!item.arabicScript && (
                                        <p className="font-serif text-xl text-slate-200 leading-tight mb-1">{item.recitation}</p>
                                    )}
                                    <p className="text-xs text-slate-500 italic">"{item.meaning}"</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => playTTS(item.recitation, audioId)}
                                        disabled={isLoadingAudio}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all ${
                                            isPlaying 
                                            ? 'bg-emerald-600 text-white shadow-lg' 
                                            : 'bg-white/5 text-emerald-500 hover:bg-emerald-500/20'
                                        }`}
                                    >
                                        {isLoadingAudio && isPlaying ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                                         isPlaying ? <StopCircle className="w-5 h-5 animate-pulse" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
                                    </button>
                                    
                                    <button 
                                        onMouseDown={() => startRecording(audioId, item.recitation)}
                                        onTouchStart={() => startRecording(audioId, item.recitation)}
                                        disabled={isAnalyzing}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all select-none touch-none ${
                                            isRecording && recordingId === audioId
                                            ? 'bg-red-500 text-white animate-pulse' 
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        {isAnalyzing && lastRecordedId === audioId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})}
                    
                    {/* General Feedback Area */}
                    {feedback && !isRecording && !isAnalyzing && recordingId === null && lastRecordedId?.startsWith('phrase-') && (
                         <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                             <div className="bg-slate-900 border border-emerald-500 shadow-2xl p-4 rounded-2xl flex items-center gap-4">
                                 <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/50">
                                     <span className="text-lg font-black text-emerald-400">{feedback.score}</span>
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="text-white font-bold text-sm mb-1">Coach Sakina Says:</h4>
                                     <p className="text-slate-300 text-xs">{feedback.feedback}</p>
                                 </div>
                                 <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-white"><Circle className="w-5 h-5 fill-slate-700" /></button>
                             </div>
                         </div>
                    )}
                </div>
             </div>
        </div>
      )}

      {/* Embed Prayer Widget for Context */}
      <div className="pt-4 px-1 opacity-70">
        <h3 className="font-bold text-slate-500 mb-3 text-sm uppercase tracking-widest">Current Prayer Time</h3>
        <PrayerWidget />
      </div>
    </div>
  );
};