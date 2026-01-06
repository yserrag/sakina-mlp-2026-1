import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// [CONFIG] Simple Types for Chat
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export const AiFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Assalamu Alaikum. I am Sakina, your Halal AI companion. How can I help you finding peace today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // [MOCK] Simulate AI Latency & "Verified Source" Logic
    // In Production: Connect this to Google Gemini API
    setTimeout(() => {
      const responses = [
        "That is a profound question. The Prophet (ﷺ) taught us that patience (Sabr) is a light.",
        "I can help with that. According to verified sources, this prayer is performed at...",
        "May Allah grant you ease. Remember, 'Verily, with hardship comes ease' (94:6).",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: randomResponse 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* 1. THE CHAT WINDOW (OVERLAY) */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[90vw] max-w-sm md:right-8 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <Card className="h-[500px] flex flex-col shadow-2xl border-emerald-500/30 bg-slate-900/95 backdrop-blur-xl">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-emerald-900/50 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Sakina AI</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Qibla Verified
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-700' : 'bg-emerald-900/50 border border-emerald-500/20'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                      : 'bg-emerald-950/30 border border-emerald-500/10 text-emerald-50 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center">
                     <Bot className="w-4 h-4 text-emerald-400" />
                   </div>
                   <div className="bg-emerald-950/30 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                     <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about prayer, fasting, or feelings..."
                  className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-600"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl w-12 flex items-center justify-center p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* 2. THE FLOATING BUTTON (TRIGGER) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-5 z-50 p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-300" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-white fill-white/20" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
          </>
        )}
      </button>
    </>
  );
};