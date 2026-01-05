import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export interface PrayerTimeData {
  name: string;
  time: string;
  isNext: boolean;
}

// 1. Get User's Location
export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        }),
        (error) => reject(error)
      );
    }
  });
};

// 2. Calculate the Times
export const calculatePrayerTimes = (lat: number, lng: number): PrayerTimeData[] => {
  const coordinates = new Coordinates(lat, lng);
  const date = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi; 

  const prayers = new PrayerTimes(coordinates, date, params);

  const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const now = new Date();
  const list = [
    { name: 'Fajr', time: format(prayers.fajr), dateObj: prayers.fajr },
    { name: 'Dhuhr', time: format(prayers.dhuhr), dateObj: prayers.dhuhr },
    { name: 'Asr', time: format(prayers.asr), dateObj: prayers.asr },
    { name: 'Maghrib', time: format(prayers.maghrib), dateObj: prayers.maghrib },
    { name: 'Isha', time: format(prayers.isha), dateObj: prayers.isha },
  ];

  let nextFound = false;
  return list.map((p) => {
    const isNext = !nextFound && p.dateObj > now;
    if (isNext) nextFound = true;
    return { name: p.name, time: p.time, isNext };
  });
};