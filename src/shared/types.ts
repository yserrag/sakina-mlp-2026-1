// Domain Types
export enum AppMode {
  EVERYDAY = 'EVERYDAY',
  REVERT = 'REVERT',
  KIDS = 'KIDS'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum CalculationMethod {
  STANDARD = 'STANDARD', // Majority (Shafi, Maliki, Hanbali)
  HANAFI = 'HANAFI'      // Hanafi (Asr is later)
}

export interface UserSettings {
  calcMethod: CalculationMethod;
  manualLocation?: string; // For display
}

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface Heir {
  id: string;
  relation: 'Husband' | 'Wife' | 'Father' | 'Mother' | 'Daughter' | 'Son';
  count: number; // For multiple daughters/sons/wives
}

export interface InheritanceResult {
  heir: string;
  share: string; // Fraction string e.g., "1/8"
  percentage: number;
  note?: string;
}

export interface QiblaResult {
  bearing: number;
  distance: number;
}

export interface KidTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}