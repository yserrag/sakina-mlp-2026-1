import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card } from "../ui/Card"; // [FACTS]: Fixed path (was ./ui/Card)
import { Sparkles, RefreshCw, Loader2, BookHeart } from "lucide-react";

export const NamesOfAllah = () => {
  const [name, setName] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

// [SECURITY] Use the environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

  const fetchName = async () => {
    setLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Prompt specifically for JSON format to keep it clean
      const prompt = `Give me one random Name of Allah (Asmaul Husna). 
      Return ONLY a JSON object with these fields: 
      { "arabic": "Arabic text", "transliteration": "English text", "meaning": "Meaning", "reflection": "Short spiritual reflection" }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to ensure it parses as JSON
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonStr);
      
      setName(data);
    } catch (err) {
      console.error("Failed to fetch name:", err);
      // Fallback data if API fails or key is missing
      setName({
        arabic: "الرَّحْمَنُ",
        transliteration: "Ar-Rahman",
        meaning: "The Most Gracious",
        reflection: "His mercy encompasses all things, appearing before His anger."
      });
    } finally {
      setLoading(false);
    }
  };

  // Load one on mount
  useEffect(() => {
    fetchName();
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Know Your Lord</h3>
        </div>
        <button 
          onClick={fetchName} 
          disabled={loading}
          className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          )}
        </button>
      </div>

      {name ? (
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-amiri text-emerald-800 mb-2">{name.arabic}</h2>
          <div>
            <p className="text-lg font-bold text-slate-800">{name.transliteration}</p>
            <p className="text-sm text-emerald-600 font-medium">{name.meaning}</p>
          </div>
          <div className="bg-white/60 p-3 rounded-lg text-sm text-slate-600 italic border border-emerald-100/50">
            "{name.reflection}"
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
    </Card>
  );
};