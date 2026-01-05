// [FACTS]: Updated to the specific MLP model path
import { PrayerData } from '@/entities/prayer-times/model/types'; 
import * as adhan from 'adhan';

export class PrayerEngine {
  static calculate(lat: number, lng: number): PrayerData {
    const coords = new adhan.Coordinates(lat, lng);
    const params = adhan.CalculationMethod.MuslimWorldLeague();
    const date = new Date();
    const times = new adhan.PrayerTimes(coords, date, params);

    const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      fajr: format(times.fajr),
      dhuhr: format(times.dhuhr),
      asr: format(times.asr),
      maghrib: format(times.maghrib),
      isha: format(times.isha),
    };
  }
}