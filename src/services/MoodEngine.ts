import { DuaData } from '@/entities/daily-wisdom/model/types'; // [FACTS]: Verified @ alias

export class MoodEngine {
  /**
   * analyzeMood
   * [ANALYSIS]: Simple keyword-based sentiment analysis for the MLP phase.
   */
  static analyzeMood(text: string): 'anxiety' | 'gratitude' | 'sadness' | 'neutral' {
    const input = text.toLowerCase();
    if (input.includes('worried') || input.includes('scared') || input.includes('anxious')) return 'anxiety';
    if (input.includes('happy') || input.includes('alhamdulillah') || input.includes('blessed')) return 'gratitude';
    if (input.includes('sad') || input.includes('lonely') || input.includes('hard')) return 'sadness';
    return 'neutral';
  }

  /**
   * getRecommendation
   * [FACTS]: Returns a targeted Dua/Verse based on the detected mood.
   */
  static getRecommendation(mood: string): Partial<DuaData> {
    const recommendations: Record<string, Partial<DuaData>> = {
      anxiety: {
        arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        translation: "Verily, in the remembrance of Allah do hearts find rest.",
        source: "Quran 13:28"
      },
      sadness: {
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Indeed, with hardship comes ease.",
        source: "Quran 94:6"
      },
      gratitude: {
        arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        translation: "If you are grateful, I will surely increase you.",
        source: "Quran 14:7"
      }
    };
    return recommendations[mood] || {};
  }
}