import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MoodEngine } from '@/services/MoodEngine'; // [FACTS]: Integrated Mood Service
import { Send, Sparkles, Bot, Loader2, Info } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SYSTEM_INSTRUCTION = `You are Sakina AI, a compassionate spiritual companion for Muslims. 
  Your goal is to provide emotional support, reflection on Quranic verses, and guidance on Islamic values. 
  IMPORTANT: You are NOT a scholar or a Mufti. Do not give fatwas.`;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input; // [FACTS]: Defined within scope
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const chat = model.startChat({
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();

      // [ANALYSIS]: Resolve Mood suggestion inside the function scope
      const detectedMood = MoodEngine.analyzeMood(userMessage);
      const spiritualLift = MoodEngine.getRecommendation(detectedMood);

      setMessages(prev => [
        ...prev, 
        { role: 'model', text: responseText },
        ...(spiritualLift.arabic ? [{ 
          role: 'model' as const, 
          text: `💡 Reflection: ${spiritualLift.arabic} — "${spiritualLift.translation}"` 
        }] : [])
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] bg-slate-900/60 backdrop-blur-3xl border-indigo-500/20">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="font-serif font-bold text-white text-sm">Sakina AI</h3>
        </div>
        <Info className="w-4 h-4 text-slate-600" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-black/20">
        <div className="relative flex items-center">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
          />
          <button onClick={handleSend} className="absolute right-2 p-2 text-indigo-400">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};