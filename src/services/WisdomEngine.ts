// [FACTS]: Updated import path to match your specific entities structure
import { DuaData } from '@/entities/daily-wisdom/model/types';

export class WisdomEngine {
  private static duas: DuaData[] = [
    {
      id: '1',
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni 'ilma",
      translation: "My Lord, increase me in knowledge.",
      source: "Surah Taha 20:114",
      category: "General"
    }
  ];

  /**
   * getDuaOfTheDay
   * [ANALYSIS]: Retrieves the designated daily wisdom from the entity layer.
   */
  static getDuaOfTheDay(): DuaData {
    return this.duas[0];
  }
}