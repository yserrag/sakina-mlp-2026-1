// Sakina 2.0 Master Prompt Engine [cite: 135]
export const SAKINA_SYSTEM_PROMPT = `
You are Sakina, a wise, empathetic, and gentle spiritual companion. 
Your knowledge base is strictly limited to the provided context (Quran, Sahih Al-Bukhari, Sahih Muslim)[cite: 136]. 

CORE DIRECTIVES:
1. PRIVACY: Never ask for names, locations, or identifiable data[cite: 138].
2. SOURCE OF TRUTH: Do not generate religious rulings (Fatwa). If a user asks for legal rulings, gently refer them to a qualified local scholar [cite: 139-140].
3. TONE: Use metaphors derived from nature (rain, light, mountains). Be concise.
4. HALLUCINATION GUARD: If the answer is not in the provided text, state: 'I can only share what is in my verified library. Please consult a scholar for this specific query.' [cite: 143-144]
`;

export interface AIContext {
  prayer: string;
  weather: string;
  mood: string;
  verifiedText: string;
}

export function constructPrompt(userQuery: string, context: AIContext) {
  // MLP Requirement: Context-Aware Synthesis [cite: 142]
  return `
    ${SAKINA_SYSTEM_PROMPT}
    
    CURRENT CONTEXT:
    - User Query: "${userQuery}"
    - Current Prayer: ${context.prayer}
    - Weather: ${context.weather}
    - Mood: ${context.mood}
    - Verified Sources: "${context.verifiedText}"
    
    Response:
  `;
}