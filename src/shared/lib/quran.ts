// lib/quran.ts

export interface SurahMeta {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  }
  
  export interface Ayah {
    numberInSurah: number;
    text: string;     // Arabic
    translation?: string; // English
  }
  
  // 1. Fetch the list of all 114 Surahs
  export const getAllSurahs = async (): Promise<SurahMeta[]> => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Failed to fetch Surah list", error);
      return [];
    }
  };
  
  // 2. Fetch a specific Surah (Arabic + English)
  export const getSurahContent = async (surahNumber: number): Promise<Ayah[]> => {
    try {
      // We request two editions: Arabic (quran-uthmani) and English (en.sahih)
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
      const data = await response.json();
      
      // The API returns two arrays (one for each edition). We need to merge them.
      const arabicData = data.data[0].ayahs;
      const englishData = data.data[1].ayahs;
  
      // Combine them into a single list of Ayahs
      return arabicData.map((ayah: any, index: number) => ({
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: englishData[index].text
      }));
    } catch (error) {
      console.error(`Failed to fetch Surah ${surahNumber}`, error);
      return [];
    }
  };