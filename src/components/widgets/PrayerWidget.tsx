import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, SunnahTimes } from 'adhan';
import { 
  MapPin, 
  RotateCw, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  AlertCircle,
  Sparkles,
  Coffee,
  BookOpen,
  Wind,
  Umbrella,
  Moon
} from 'lucide-react';
import { Card } from '../ui/Card';

const getWeatherIcon = (code: number) => {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 95) return CloudLightning;
  return Cloud;
};

// [LOGIC] Spiritual Status Types
type SpiritStatus = {
  label: string;
  subtext: string;
  color: 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'violet';
  icon: any;
};

export const PrayerWidget = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ id: string, time: Date } | null>(null);
  const [timeString, setTimeString] = useState<string>('00:00:00');
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [hourlyWeather, setHourlyWeather] = useState<Record<number, { temp: number; code: number }>>({});
  
  // Suggestion State
  const [guidance, setGuidance] = useState<SpiritStatus | null>(null);

  useEffect(() => {
    // 1. Initialize Calculation
    const coordinates = new Coordinates(51.5074, -0.1278);
    const params = CalculationMethod.MoonsightingCommittee();
    const now = new Date();
    
    let prayerTimes = new PrayerTimes(coordinates, now, params);
    let next = prayerTimes.nextPrayer();
    let nextTime = prayerTimes.timeForPrayer(next);

    // Handle "After Isha" rollover
    if (next === Prayer.None) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayers = new PrayerTimes(coordinates, tomorrow, params);
      next = Prayer.Fajr;
      nextTime = tomorrowPrayers.fajr;
    }

    setPrayers(prayerTimes);
    
    if (nextTime) {
      // [FIX] Explicitly typed map including Sunrise to satisfy TypeScript
      const idMap: Record<string, string> = {
        [Prayer.Fajr]: 'fajr', 
        [Prayer.Sunrise]: 'sunrise',
        [Prayer.Dhuhr]: 'dhuhr', 
        [Prayer.Asr]: 'asr',
        [Prayer.Maghrib]: 'maghrib', 
        [Prayer.Isha]: 'isha', 
        [Prayer.None]: 'none'
      };
      
      const nextId = idMap[next] || 'none';
      setNextPrayerInfo({ id: nextId, time: nextTime });
    }

    // --- ENHANCED SPIRITUAL GUIDANCE ENGINE ---
    const updateGuidance = (weatherCode?: number) => {
      const currentTime = new Date();
      const sunnah = new SunnahTimes(prayerTimes);
      const isFriday = currentTime.getDay() === 5; // 5 = Friday
      const isMonOrThu = currentTime.getDay() === 1 || currentTime.getDay() === 4;

      // PRIORITY 1: FORBIDDEN TIMES (Red Zone)
      const sunriseStart = prayerTimes.sunrise;
      const sunriseEnd = new Date(sunriseStart.getTime() + 15 * 60000);
      const zawalStart = new Date(prayerTimes.dhuhr.getTime() - 10 * 60000);
      const sunsetStart = new Date(prayerTimes.maghrib.getTime() - 15 * 60000);

      if (currentTime >= sunriseStart && currentTime <= sunriseEnd) {
        setGuidance({ label: "Prayer Prohibited", subtext: "Sunrise in progress. Please wait.", color: 'rose', icon: AlertCircle });
        return;
      }
      if (currentTime >= zawalStart && currentTime < prayerTimes.dhuhr) {
        setGuidance({ label: "Prayer Prohibited", subtext: "Zawal (Zenith). Wait for Dhuhr.", color: 'rose', icon: AlertCircle });
        return;
      }
      if (currentTime >= sunsetStart && currentTime < prayerTimes.maghrib) {
        setGuidance({ label: "Prayer Prohibited", subtext: "Sunset. Wait for Maghrib.", color: 'rose', icon: AlertCircle });
        return;
      }

      // PRIORITY 2: ENVIRONMENTAL (Rain/Wind)
      if (weatherCode && (weatherCode >= 51 || weatherCode >= 80)) {
        setGuidance({
          label: "Beneficial Rain",
          subtext: "Sunnah: Recite 'Allahumma sayyiban nafi'an'",
          color: 'cyan',
          icon: Umbrella
        });
        return;
      }

      // PRIORITY 3: FRIDAY SPECIALS (Jumu'ah)
      if (isFriday) {
        if (currentTime >= prayerTimes.asr && currentTime < prayerTimes.maghrib) {
          setGuidance({
            label: "Hour of Acceptance",
            subtext: "Intense Dua time before Maghrib.",
            color: 'violet',
            icon: Sparkles
          });
          return;
        }
        if (currentTime > sunriseEnd && currentTime < prayerTimes.asr) {
           setGuidance({
             label: "Jumu'ah Mubarak",
             subtext: "Read Surah Al-Kahf today.",
             color: 'emerald',
             icon: BookOpen
           });
           return;
        }
      }

      // PRIORITY 4: RECOMMENDED TIMES
      if (isMonOrThu && currentTime < prayerTimes.fajr && currentTime.getHours() > 3) {
         setGuidance({
           label: "Sunnah Fasting",
           subtext: "It is a day of fasting. Have Suhoor.",
           color: 'indigo',
           icon: Coffee
         });
         return;
      }

      if (currentTime > sunriseEnd && currentTime < zawalStart) {
         setGuidance({ label: "Time for Duha", subtext: "The prayer of the oft-returning.", color: 'amber', icon: Sun });
         return;
      }

      if (currentTime >= sunnah.lastThirdOfTheNight && currentTime < prayerTimes.fajr) {
        setGuidance({ label: "Time for Tahajjud", subtext: "Divine descent. Ask and be given.", color: 'indigo', icon: Moon });
        return;
      }

      setGuidance({ label: "Time for Dhikr", subtext: "Keep your tongue moist with remembrance.", color: 'emerald', icon: Sparkles });
    };

    // Weather Fetch
    fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&forecast_days=2')
      .then(res => res.json())
      .then(data => {
        if (data.current) {
          setCurrentTemp(Math.round(data.current.temperature_2m));
          updateGuidance(data.current.weather_code);
        }
        
        if (data.hourly) {
          const weatherMap: Record<number, { temp: number; code: number }> = {};
          data.hourly.time.forEach((isoTime: string, index: number) => {
            const h = new Date(isoTime).getHours();
            weatherMap[h] = {
              temp: Math.round(data.hourly.temperature_2m[index]),
              code: data.hourly.weather_code[index]
            };
          });
          setHourlyWeather(weatherMap);
        }
      })
      .catch(e => {
        console.error(e);
        updateGuidance();
      });

    const guidanceTimer = setInterval(() => updateGuidance(), 60000);
    return () => clearInterval(guidanceTimer);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!nextPrayerInfo) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextPrayerInfo.time.getTime() - now.getTime();
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeString(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeString("00:00:00");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextPrayerInfo]);

  if (!prayers) return <div className="p-12 text-center text-slate-500">Initializing...</div>;

  const PRAYER_LIST = [
    { id: 'fajr', label: 'Fajr', time: prayers.fajr },
    { id: 'dhuhr', label: 'Dhuhr', time: prayers.dhuhr },
    { id: 'asr', label: 'Asr', time: prayers.asr },
    { id: 'maghrib', label: 'Maghrib', time: prayers.maghrib },
    { id: 'isha', label: 'Isha', time: prayers.isha },
  ];

  const getStatusColor = (color: string) => {
    switch(color) {
      case 'rose': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'amber': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'indigo': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'cyan': return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
      case 'violet': return 'bg-violet-500/10 border-violet-500/20 text-violet-400';
      default: return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#0f3d3e] to-[#041C1E] text-white min-h-[380px] flex flex-col justify-between">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      {/* 1. HEADER */}
      <div className="flex justify-center pt-6 relative z-10">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full shadow-lg">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-bold tracking-widest uppercase">London</span>
          {currentTemp !== null && (
            <span className="text-xs text-slate-300 font-mono border-l border-white/10 pl-3">
              {currentTemp > 0 ? `+${currentTemp}` : currentTemp}°
            </span>
          )}
        </div>
      </div>

      {/* 2. CENTER: Countdown */}
      <div className="text-center relative z-10 flex-1 flex flex-col justify-center py-2">
        <p className="text-emerald-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-1 animate-pulse">
          Next: {nextPrayerInfo?.id || '...'}
        </p>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] font-mono">
          {timeString}
        </h1>
        
        {/* Spiritual Guidance Bar */}
        {guidance && (
          <div className="mt-4 flex justify-center animate-in fade-in slide-in-from-bottom-2">
             <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-md ${getStatusColor(guidance.color)} shadow-lg`}>
                <guidance.icon className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-wider">{guidance.label}</p>
                  <p className="text-[10px] opacity-80 font-medium">{guidance.subtext}</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 3. FOOTER */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="flex justify-between items-center px-6 py-4 overflow-x-auto gap-4">
          {PRAYER_LIST.map((p) => {
            const isActive = nextPrayerInfo?.id === p.id;
            const h = p.time.getHours();
            const w = hourlyWeather[h];
            const Icon = w ? getWeatherIcon(w.code) : Sun;

            return (
              <div key={p.id} className="flex flex-col items-center gap-2 min-w-[64px] group relative">
                <div className={`transition-all duration-300 ${isActive ? 'opacity-100 -translate-y-1' : 'opacity-30 group-hover:opacity-60'}`}>
                   <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]' : 'text-slate-300'}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {p.label}
                </span>
                <span className={`text-xs font-mono font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {p.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                {isActive && (
                  <div className="absolute -bottom-4 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};