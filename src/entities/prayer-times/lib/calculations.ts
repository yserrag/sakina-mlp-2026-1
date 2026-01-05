import { Coordinates, CalculationMethod, PrayerTimes, HighLatitudeRule } from 'adhan';

export const getPrayerCalculations = (lat: number, lng: number) => {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.IslamicSocietyOfNorthAmerica();

  // MLP Requirement: High Latitude Fallback [cite: 161-162]
  if (Math.abs(lat) > 48.5) {
    params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  }

  const date = new Date();
  const times = new PrayerTimes(coords, date, params);

  // MLP Requirement: Forbidden Zones (Makruh) [cite: 153-156]
  const forbidden: ForbiddenZone[] = [
    {
      name: 'Ishraq',
      start: times.sunrise,
      end: new Date(times.sunrise.getTime() + 15 * 60000), // +15 mins [cite: 154]
      message: "Sun is rising. Wait 15 minutes before praying."
    },
    {
      name: 'Zawal',
      start: new Date(times.dhuhr.getTime() - 10 * 60000), // -10 mins [cite: 155]
      end: times.dhuhr,
      message: "Sun is at zenith. Avoid praying until Dhuhr."
    },
    {
      name: 'Ghurub',
      start: new Date(times.maghrib.getTime() - 15 * 60000), // -15 mins [cite: 156]
      end: times.maghrib,
      message: "Sun is setting. Only today's Asr is permitted."
    }
  ];

  return { times, forbidden };
};