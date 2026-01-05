import { get, set } from 'idb-keyval';

// Verified Source: Sahih International (Quran) & Sahih Bukhari/Muslim [cite: 128, 136]
export interface VectorEntry {
  id: string;
  text: string;
  metadata: {
    source: string;
    chapter?: number;
    verse?: number;
  };
  embedding: number[]; // Local vector representation
}

export const VectorStore = {
  // Store a verified truth in the "Iron Dome" 
  async saveEntry(entry: VectorEntry) {
    const existing = (await get<VectorEntry[]>('sakina_vectors')) || [];
    await set('sakina_vectors', [...existing, entry]);
  },

  // MLP Requirement: Local Similarity Search [cite: 130-131]
  async query(queryEmbedding: number[], topK = 3): Promise<VectorEntry[]> {
    const vectors = (await get<VectorEntry[]>('sakina_vectors')) || [];
    
    // Simple cosine similarity performed on-device [cite: 6]
    return vectors
      .map(v => ({
        ...v,
        similarity: this.cosineSimilarity(queryEmbedding, v.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  },

  cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }
};