import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  Cloud, 
  Eye, 
  Sunrise, 
  Sunset,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Compass
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { 
  formatTemp, 
  formatSpeed, 
  getUVInfo, 
  getWindCompass,
  convertTemp
} from '../utils/weatherCalculations';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weatherData,
  unit,
}) => {
  const { location, current, daily } = weatherData;
  const wmo = getWMOCodeInfo(current.weatherCode);
  const WmoIcon = wmo.icon;

  const today = daily[0];
  const uvInfo = getUVInfo(today?.uvIndexMax || 0);

  // Format local date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Calculate Sunrise/Sunset progress percentage
  let sunProgress = 50;
  if (today?.sunrise && today?.sunset) {
    const sunriseTime = new Date(today.sunrise).getTime();
    const sunsetTime = new Date(today.sunset).getTime();
    const currentTime = now.getTime();
    if (currentTime > sunriseTime && currentTime < sunsetTime) {
      sunProgress = Math.round(((currentTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100);
    } else if (currentTime >= sunsetTime) {
      sunProgress = 100;
    } else {
      sunProgress = 0;
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${wmo.gradient} text-white p-6 sm:p-8 shadow-2xl border border-white/20 transition-all duration-500`}>
      
      {/* Decorative ambient background blur lights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info: Location & Date */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {location.name}
            </h2>
            {location.country && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider border border-white/20">
                {location.country_code || location.country}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
            {[location.admin1, location.country].filter(Boolean).join(', ')} • <span className="text-white font-semibold">{dateStr}</span>
          </p>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 self-start sm:self-auto">
          <WmoIcon className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">
            {wmo.label}
          </span>
        </div>
      </div>

      {/* Main Temp & Hero Display */}
      <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Huge Temp & Feels Like */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-8xl font-black tracking-tighter drop-shadow-md">
              {convertTemp(current.temperature, unit)}
            </span>
            <span className="text-3xl sm:text-5xl font-light text-white/90 ml-1">
              °{unit === 'metric' ? 'C' : 'F'}
            </span>
          </div>

          <div className="space-y-1.5 border-l border-white/20 pl-4 sm:pl-6">
            <div className="text-sm sm:text-base font-semibold text-white/90 flex items-center space-x-1.5">
              <span>Feels like {formatTemp(current.apparentTemperature, unit)}</span>
            </div>

            {today && (
              <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-white/80">
                <span className="flex items-center text-emerald-300">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  {formatTemp(today.tempMax, unit)}
                </span>
                <span className="flex items-center text-sky-200">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  {formatTemp(today.tempMin, unit)}
                </span>
              </div>
            )}

            <p className="text-xs text-white/75 max-w-xs leading-snug pt-1">
              {wmo.description}
            </p>
          </div>
        </div>

        {/* Right Column: Mini Sun / Sunrise Arc */}
        <div className="md:col-span-5 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/80 font-medium mb-3">
            <span className="flex items-center space-x-1">
              <Sunrise className="w-4 h-4 text-amber-300" />
              <span>Sunrise: {today?.sunrise ? new Date(today.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:15 AM'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Sunset className="w-4 h-4 text-orange-300" />
              <span>Sunset: {today?.sunset ? new Date(today.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 PM'}</span>
            </span>
          </div>

          {/* Daylight Progress Bar */}
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden p-0.5 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-300 via-sky-300 to-orange-400 h-full rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${Math.max(5, Math.min(100, sunProgress))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-white/70">
            <span>Daylight cycle</span>
            <span className="font-semibold text-white">{sunProgress}% elapsed</span>
          </div>
        </div>

      </div>

      {/* Grid of Key Weather Metrics */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        
        {/* Wind Speed */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-sky-300" />
          </div>
          <div className="text-lg font-bold">
            {formatSpeed(current.windSpeed, unit)}
          </div>
          <div className="text-[11px] text-white/70 flex items-center space-x-1 mt-0.5">
            <Compass className="w-3 h-3 text-white/80" />
            <span>{getWindCompass(current.windDirection)} ({current.windDirection}°)</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-teal-300" />
          </div>
          <div className="text-lg font-bold">
            {current.humidity}%
          </div>
          <div className="text-[11px] text-white/70 mt-0.5">
            {current.humidity > 70 ? 'High moisture' : current.humidity < 30 ? 'Dry air' : 'Comfortable'}
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>UV Index</span>
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-lg font-bold flex items-center space-x-1.5">
            <span>{today?.uvIndexMax || 0}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${uvInfo.badgeBg}`}>
              {uvInfo.level}
            </span>
          </div>
          <div className="text-[11px] text-white/70 truncate mt-0.5" title={uvInfo.advice}>
            Max today
          </div>
        </div>

        {/* Air Pressure */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-lg font-bold">
            {Math.round(current.pressure)} <span className="text-xs font-normal">hPa</span>
          </div>
          <div className="text-[11px] text-white/70 mt-0.5">
            {current.pressure > 1015 ? 'High Pressure' : current.pressure < 1005 ? 'Low Pressure' : 'Normal'}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-lg font-bold">
            {current.cloudCover}%
          </div>
          <div className="text-[11px] text-white/70 mt-0.5">
            {current.cloudCover > 80 ? 'Overcast' : current.cloudCover > 30 ? 'Partly Cloudy' : 'Clear Skies'}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 hover:bg-black/30 transition-all">
          <div className="flex items-center justify-between text-white/75 text-xs font-medium mb-1">
            <span>Visibility</span>
            <Eye className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="text-lg font-bold">
            {weatherData.hourly[0]?.visibility || 10} <span className="text-xs font-normal">km</span>
          </div>
          <div className="text-[11px] text-white/70 mt-0.5">
            {(weatherData.hourly[0]?.visibility || 10) >= 10 ? 'Clear view' : 'Reduced mist'}
          </div>
        </div>

      </div>

    </div>
  );
};
