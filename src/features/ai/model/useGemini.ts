import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Interface for the experimental Chrome "window.ai" API
interface WindowAI {
  ai?: {
    canCreateTextSession: () => Promise<string>;
    createTextSession: () => Promise<{
      prompt: (text: string) => Promise<string>;
      destroy: () => void;
    }>;
  };
}

// Preference list: Latest stable models first
const PREFERRED_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'gemini-pro'
];

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModelName, setActiveModelName] = useState<string>('gemini-pro');

  useEffect(() => {
    const checkModels = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return;

      try {
        console.log('[AI] Checking available models...');
        // Manually fetch the list to see what IS enabled
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        
        if (!response.ok) {
           console.error('[AI] Failed to list models. Status:', response.status);
           console.error('Hint: Ensure "Generative Language API" is ENABLED in Google Cloud Console.');
           return;
        }

        const data = await response.json();
        const available = data.models
           .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
           .map((m: any) => m.name.replace('models/', ''));

        console.log('[AI] Your Key has access to:', available);

        // Pick the best one
        const best = PREFERRED_MODELS.find(p => available.includes(p));
        if (best) {
           console.log(`[AI] Switching to: ${best} 🚀`);
           setActiveModelName(best);
        } else if (available.length > 0) {
           // If none of our preferred ones exist, take the first available one
           console.log(`[AI] Fallback to available model: ${available[0]}`);
           setActiveModelName(available[0]);
        }

      } catch (e) {
        console.error('[AI] Model check failed:', e);
      }
    };

    checkModels();
  }, []);

  const generateResponse = async (prompt: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Try On-Device AI first
      const win = window as WindowAI;
      if (win.ai && (await win.ai.canCreateTextSession()) === 'readily') {
        const session = await win.ai.createTextSession();
        const text = await session.prompt(prompt);
        session.destroy();
        return text;
      } 
      
      // 2. Cloud Fallback
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: activeModelName });
      
      const result = await model.generateContent(prompt);
      return result.response.text();

    } catch (err: any) {
      // Clean up the error message for the UI
      let msg = err.message || 'Service Error';
      if (msg.includes('404')) msg = `Model ${activeModelName} not found. Check API Access.`;
      if (msg.includes('400')) msg = 'Invalid API Key or Request.';
      
      console.error('[AI Error]', err);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error, activeModelName };
};