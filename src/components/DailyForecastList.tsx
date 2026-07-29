import React, { useState } from 'react';
import { 
  Calendar, 
  Droplets, 
  Wind, 
  Sun, 
  ChevronDown, 
  ChevronUp, 
  Sunrise, 
  Sunset,
  Umbrella
} from 'lucide-react';
import { DailyForecastItem, UnitSystem } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { convertTemp, convertSpeed, convertPrecip, getUVInfo } from '../utils/weatherCalculations';

interface DailyForecastListProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({
  daily,
  unit,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default expand today

  if (!daily || daily.length === 0) return null;

  // Calculate week's overall Min and Max temperature to draw proportional range bars
  const weekMinTemp = Math.min(...daily.map((d) => d.tempMin));
  const weekMaxTemp = Math.max(...daily.map((d) => d.tempMax));
  const weekTempRange = Math.max(1, weekMaxTemp - weekMinTemp);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl text-slate-100">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-slate-100">7-Day Outlook & Temperature Ranges</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Tap day for details
        </span>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {daily.map((item, index) => {
          const isToday = index === 0;
          const dateObj = new Date(item.date);
          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const wmo = getWMOCodeInfo(item.weatherCode);
          const WmoIcon = wmo.icon;

          // Calculate visual range bar position
          const minPercent = ((item.tempMin - weekMinTemp) / weekTempRange) * 100;
          const maxPercent = ((item.tempMax - weekMinTemp) / weekTempRange) * 100;
          const barWidth = Math.max(8, maxPercent - minPercent);

          const isExpanded = expandedIndex === index;
          const uvInfo = getUVInfo(item.uvIndexMax);

          return (
            <div
              key={`daily-item-${item.date}-${index}`}
              className={`border rounded-2xl transition-all overflow-hidden ${
                isToday
                  ? 'bg-slate-800/90 border-sky-500/40 shadow-md'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
              }`}
            >
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(index)}
                className="p-3.5 sm:p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Day Name & Weather Icon */}
                <div className="flex items-center space-x-3 sm:w-1/4">
                  <div className={`p-2 rounded-xl shrink-0 ${isToday ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-300'}`}>
                    <WmoIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{dayName}</span>
                      {isToday && (
                        <span className="text-[10px] font-extrabold uppercase bg-sky-500 text-white px-1.5 py-0.2 rounded">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{formattedDate}</div>
                  </div>
                </div>

                {/* Condition & Rain Chance */}
                <div className="flex items-center space-x-3 sm:w-1/4">
                  <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]" title={wmo.label}>
                    {wmo.label}
                  </span>
                  {item.precipitationProbabilityMax > 0 && (
                    <span className="text-xs font-bold text-sky-400 flex items-center space-x-0.5 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-lg shrink-0">
                      <Droplets className="w-3 h-3 mr-0.5 fill-sky-400" />
                      <span>{item.precipitationProbabilityMax}%</span>
                    </span>
                  )}
                </div>

                {/* Visual Temperature Range Bar */}
                <div className="flex items-center space-x-3 sm:w-2/5">
                  <span className="text-xs font-semibold text-slate-400 w-9 text-right">
                    {convertTemp(item.tempMin, unit)}°
                  </span>

                  {/* Range Bar Track */}
                  <div className="flex-1 bg-slate-950/80 h-2.5 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${minPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-100 w-9">
                    {convertTemp(item.tempMax, unit)}°
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="hidden sm:block text-slate-500 hover:text-slate-300">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 bg-slate-950/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  {/* Sunrise & Sunset */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sun Times</span>
                    </span>
                    <div className="text-slate-200 font-semibold text-[11px]">
                      Rise: {item.sunrise ? new Date(item.sunrise).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                    </div>
                    <div className="text-slate-200 font-semibold text-[11px]">
                      Set: {item.sunset ? new Date(item.sunset).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>

                  {/* Wind & Gusts */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      <span>Wind Peak</span>
                    </span>
                    <div className="text-slate-200 font-semibold text-[11px]">
                      Speed: {convertSpeed(item.windSpeedMax, unit)} {unit === 'imperial' ? 'mph' : 'km/h'}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Gusts up to {convertSpeed(item.windGustsMax, unit)} {unit === 'imperial' ? 'mph' : 'km/h'}
                    </div>
                  </div>

                  {/* UV Peak */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Peak UV</span>
                    </span>
                    <div className="text-slate-200 font-semibold text-[11px] flex items-center space-x-1.5">
                      <span>Index {item.uvIndexMax}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded ${uvInfo.badgeBg}`}>
                        {uvInfo.level}
                      </span>
                    </div>
                  </div>

                  {/* Total Rainfall */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <Umbrella className="w-3.5 h-3.5 text-sky-400" />
                      <span>Total Precip</span>
                    </span>
                    <div className="text-slate-200 font-semibold text-[11px]">
                      {convertPrecip(item.precipitationSum, unit)} {unit === 'imperial' ? 'in' : 'mm'}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Max probability: {item.precipitationProbabilityMax}%
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
