import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Sparkles, Bot, Loader2, AlertCircle, RefreshCw, Cpu, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// [BLUEPRINT] Sakina's Persona
const SYSTEM_PROMPT = `
You are Sakina, a wise, empathetic, and gentle spiritual companion. 
Your goal is to provide comfort and spiritual insight based on Islamic principles.
CORE RULES:
1. PRIVACY: Never ask for names, locations, or identifiable data.
2. TONE: Gentle, poetic, using metaphors from nature.
3. SCOPE: Do NOT give Fatwas.
4. CONTEXT: Keep answers concise (under 150 words) unless asked to expand.
5. FORMATTING: Use bullet points for lists and line breaks for readability.
`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// [COMPONENT] The Pulsing Dots Animation
const TypingIndicator = () => (
  <div className="flex items-center gap-3 animate-in fade-in duration-300">
    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
      <Bot className="w-4 h-4 text-emerald-400" />
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 rounded-tl-sm flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
      <span className="text-xs text-slate-500 ml-2 font-medium">Sakina is reflecting...</span>
    </div>
  </div>
);

export const AiAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // [FIX] Cast to 'any' to bypass strict TS check for Vite env variables
  const apiKey = (import.meta as any).env.VITE_GOOGLE_API_KEY;

  // 1. [ENGINE] Discovery (Keep specific Gemini models)
  useEffect(() => {
    const discoverModels = async () => {
      if (!apiKey) {
        setIsInitializing(false);
        setError("API Key Missing");
        return;
      }
      // Default to Flash as it's the most reliable for chat
      setActiveModel('gemini-1.5-flash'); 
      setIsInitializing(false);
    };
    discoverModels();
  }, [apiKey]);

  // 2. [UX] Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // 3. [UX] Auto-resize Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey || !activeModel) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: activeModel });

      // [LOGIC] Reconstruct History for Context
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({
        history: [
          // Inject System Prompt
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "I understand. I am ready to serve as Sakina." }] },
          ...chatHistory
        ],
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setError("Sakina is having trouble connecting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Sakina AI</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-emerald-500 flex items-center gap-1.5 font-mono">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                 </span>
                 Online
               </span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMessages([])}
          className="hover:bg-red-500/10 hover:text-red-400 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950/50 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-3 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium">Say "Salam" to begin your journey.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             
             {/* Avatar */}
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
               msg.role === 'user' ? 'bg-indigo-500/20' : 'bg-emerald-500/10'
             }`}>
               {msg.role === 'user' ? <div className="text-xs">You</div> : <Sparkles className="w-4 h-4 text-emerald-400" />}
             </div>

             {/* Bubble */}
             <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="p-3 mx-auto max-w-xs bg-red-950/30 border border-red-500/30 rounded-lg text-red-300 text-xs text-center animate-pulse">
            <AlertCircle className="w-3 h-3 mb-1 inline mr-1" />
            {error}
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInitializing || isLoading}
            placeholder={isInitializing ? "Initializing brain..." : "Ask Sakina..."}
            className="w-full bg-transparent text-white placeholder:text-slate-600 text-sm resize-none focus:outline-none py-2 px-2 max-h-32 overflow-y-auto"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim() || isInitializing}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5 shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Sakina is an AI companion and may make mistakes.
        </p>
      </div>
    </Card>
  );
};