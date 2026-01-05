// [FACTS]: Domain types for the Prayer Feature
export interface PrayerData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimingState {
  currentPrayer: string;
  nextPrayer: string;
  timeRemaining: string;
}