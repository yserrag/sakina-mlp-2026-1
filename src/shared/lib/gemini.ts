import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------------------------------------------------
// 🔑 PASTE YOUR REAL API KEY HERE
// ---------------------------------------------------------
const API_KEY = 'AIzaSyBZoLi15nzpWaqRmpj7GeqEvzVUoG4cNRw'; 

const SYSTEM_PROMPT = `
You are Sakina, a compassionate, empathetic, and spiritually grounded AI companion.
Your goal is to help users find peace, reflect on their day, and grow spiritually.
You speak with warmth, using calming language. 
If appropriate, gently reference Islamic concepts like Sabr (patience) or Dhikr (remembrance).
Keep answers concise (under 3 sentences) unless asked for more.
`;

export const sendMessageToGemini = async (userMessage: string) => {
  if (!API_KEY || API_KEY.includes('PASTE_YOUR')) {
    return "API Key is missing in lib/gemini.ts";
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    // STEP 1: Get the list (We know you have 2.5 now!)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (!data.models) throw new Error("No models returned.");

    const availableModels = data.models
      .map((m: any) => m.name.replace('models/', ''));

    // STEP 2: The New Priority List (Targeting 2.5 Pro)
    let selectedModelName = availableModels.find((m: string) => m.includes('gemini-2.5-pro')); // 🥇 The Best
    
    if (!selectedModelName) {
        selectedModelName = availableModels.find((m: string) => m.includes('gemini-2.0-flash')); // 🥈 Super Fast
    }
    if (!selectedModelName) {
        selectedModelName = availableModels.find((m: string) => m.includes('gemini-1.5-pro')); // 🥉 Old Best
    }
    
    // Fallback
    if (!selectedModelName) selectedModelName = "gemini-pro";

    console.log(`🚀 UPGRADED: Sakina is running on ${selectedModelName}`);

    // STEP 3: Connect
    const model = genAI.getGenerativeModel({ model: selectedModelName });
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "I am currently meditating (Connection Error).";
  }
};