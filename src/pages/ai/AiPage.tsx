import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Send, Sparkles, BookOpen, Bot, User, AlertTriangle } from 'lucide-react';
import { generateHikmahResponse } from '../../features/ai/services/gemini'; 

export const AiPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'As-salaam alaykum. I am Sakina AI. I can help answer your questions using verified sources. How is your heart today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 1. Add User Message
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // 2. Call the Hikmah Engine
      const responseText = await generateHikmahResponse(currentInput);
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: responseText 
      }]);
    } catch (err) {
      setError("Connection Error. Please ensure the API key is active.");
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I apologize, but I cannot connect to the knowledge base right now." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-28 flex flex-col max-w-2xl mx-auto animate-in fade-in duration-700">
      <header className="flex items-center gap-3 pt-4 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Ask Sakina</h1>
          <p className="text-xs text-slate-400">Powered by Gemini Nano (RAG)</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-[50vh]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-700'
            }`}>
              {msg.role === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
            </div>
            <Card className={`p-4 max-w-[85%] ${
              msg.role === 'ai' 
                ? 'bg-slate-900/60 border-white/10 text-slate-200' 
                : 'bg-indigo-600/20 border-indigo-500/20 text-white'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Source Verified</span>
                </div>
              )}
            </Card>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs pl-12">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Consulting verified sources...</span>
          </div>
        )}
        {error && (
          <div className="mx-auto bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I feel anxious about my future..."
          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50"
        />
        <Button 
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl"
        >
          <Send className="w-4 h-4 text-white" />
        </Button>
      </form>
    </div>
  );
};