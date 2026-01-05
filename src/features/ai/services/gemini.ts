import { GoogleGenerativeAI } from '@google/generative-ai';
import { getContextForQuery, VERIFIED_SOURCES } from '../data/verifiedSources';

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_KEY || '';

const CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-001",
  "gemini-1.5-pro",
  "gemini-pro"
];

const genAI = new GoogleGenerativeAI(API_KEY);

// [HELPER]: Test if a model is alive
async function testConnection(modelName: string): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("Test");
    return true;
  } catch (e) {
    return false;
  }
}

// [STRATEGY]: Offline Fallback Generator
// If cloud fails, we construct a high-quality answer from local data.
function getOfflineResponse(query: string): string {
  console.log("⚠️ Cloud AI Unreachable. Switching to Offline Mode.");
  
  const contextDocs = getContextForQuery(query);
  const mainVerse = contextDocs[0]; // Get the most relevant verse
  
  return `(Offline Mode) I cannot reach the cloud right now, but here is a verified truth for your heart:
  
"${mainVerse.text}"
— ${mainVerse.source}

Remember, this state is temporary. Breathe, and trust in the wisdom of these words.`;
}

let _workingModel: string | null = null;

async function getBestWorkingModel(): Promise<string> {
  if (_workingModel) return _workingModel;
  
  // Try Configured Model
  const envModel = import.meta.env.VITE_GEMINI_MODEL;
  if (envModel && await testConnection(envModel)) {
    _workingModel = envModel;
    return envModel;
  }

  // Try Auto-Discovery
  for (const model of CANDIDATE_MODELS) {
    if (await testConnection(model)) {
      _workingModel = model;
      return model;
    }
  }
  
  throw new Error("No Connection");
}

export const generateHikmahResponse = async (userQuery: string) => {
  // 1. RETRIEVAL (RAG) - Always happens first
  const contextDocs = getContextForQuery(userQuery);
  const contextString = contextDocs.map(d => `"${d.text}" (${d.source})`).join("\n");

  try {
    if (!API_KEY) throw new Error("No Key");

    // 2. CONNECT TO CLOUD
    const activeModelName = await getBestWorkingModel();
    const model = genAI.getGenerativeModel({ 
      model: activeModelName,
      systemInstruction: {
        role: "system",
        parts: [{ text: `You are Sakina. Context: ${contextString}` }]
      }
    });

    const result = await model.generateContent(userQuery);
    return result.response.text();

  } catch (error) {
    // 3. FALLBACK (The Safety Net)
    console.warn("❌ Cloud Failed, using Local Wisdom.");
    return getOfflineResponse(userQuery);
  }
};