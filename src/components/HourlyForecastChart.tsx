import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  Thermometer, 
  CloudRain, 
  Wind, 
  Sun, 
  Clock 
} from 'lucide-react';
import { HourlyForecastItem, UnitSystem } from '../types/weather';
import { convertTemp, convertSpeed, convertPrecip } from '../utils/weatherCalculations';
import { getWMOCodeInfo } from '../utils/wmoCodes';

interface HourlyForecastChartProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

type ChartTab = 'temp' | 'precip' | 'wind' | 'uv';

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourly,
  unit,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('temp');

  // Limit to next 24 hours for chart clarity
  const chartData = hourly.slice(0, 24).map((item) => {
    const dateObj = new Date(item.time);
    const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric' });

    return {
      timeLabel: hourLabel,
      fullTime: dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      temp: convertTemp(item.temperature, unit),
      apparentTemp: convertTemp(item.apparentTemperature, unit),
      precipProb: item.precipitationProbability,
      precipAmount: convertPrecip(item.precipitation, unit),
      windSpeed: convertSpeed(item.windSpeed, unit),
      uvIndex: item.uvIndex,
      weatherCode: item.weatherCode,
      humidity: item.humidity,
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl text-slate-100">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-slate-100">24-Hour Forecast & Interactive Trends</h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'temp'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab('precip')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'precip'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'wind'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'uv'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV Index</span>
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="apparentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={`°${unit === 'imperial' ? 'F' : 'C'}`} />
              <Tooltip content={<CustomTooltip unit={unit} type="temp" />} />
              <Area 
                type="monotone" 
                dataKey="temp" 
                name="Temperature" 
                stroke="#38bdf8" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#tempGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="apparentTemp" 
                name="Feels Like" 
                stroke="#818cf8" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#apparentGradient)" 
              />
            </AreaChart>
          ) : activeTab === 'precip' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit={unit} type="precip" />} />
              <Bar dataKey="precipProb" name="Rain Chance (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : activeTab === 'wind' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={unit === 'imperial' ? 'mph' : 'km/h'} />
              <Tooltip content={<CustomTooltip unit={unit} type="wind" />} />
              <Area type="monotone" dataKey="windSpeed" name="Wind Speed" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 12]} />
              <Tooltip content={<CustomTooltip unit={unit} type="uv" />} />
              <Bar dataKey="uvIndex" name="UV Index" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Hourly Quick Scroll Cards Carousel */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Hourly Overview
        </h4>
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          {hourly.slice(0, 24).map((item, index) => {
            const wmo = getWMOCodeInfo(item.weatherCode);
            const WmoIcon = wmo.icon;
            const hourStr = new Date(item.time).toLocaleTimeString([], { hour: 'numeric' });

            return (
              <div
                key={`hourly-item-${item.time}-${index}`}
                className="flex flex-col items-center justify-between p-3 min-w-[72px] bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-2xl transition-all"
              >
                <span className="text-xs font-medium text-slate-400">{hourStr}</span>
                <WmoIcon className="w-6 h-6 text-sky-400 my-2 shrink-0" />
                <span className="text-sm font-bold text-slate-100">
                  {convertTemp(item.temperature, unit)}°
                </span>
                {item.precipitationProbability > 0 && (
                  <span className="text-[10px] font-bold text-sky-400 mt-1 flex items-center">
                    {item.precipitationProbability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label, unit, type }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const wmo = getWMOCodeInfo(data.weatherCode);

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-slate-100 text-xs space-y-1 z-50">
        <div className="font-bold text-sky-300 border-b border-slate-700 pb-1 flex items-center justify-between gap-3">
          <span>{data.fullTime}</span>
          <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">{wmo.label}</span>
        </div>
        
        {type === 'temp' && (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Temp:</span>
              <span className="font-bold text-white">{data.temp}°{unit === 'imperial' ? 'F' : 'C'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Feels Like:</span>
              <span className="font-semibold text-indigo-300">{data.apparentTemp}°{unit === 'imperial' ? 'F' : 'C'}</span>
            </div>
          </>
        )}

        {type === 'precip' && (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Chance:</span>
              <span className="font-bold text-blue-400">{data.precipProb}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Amount:</span>
              <span className="font-semibold text-white">{data.precipAmount} {unit === 'imperial' ? 'in' : 'mm'}</span>
            </div>
          </>
        )}

        {type === 'wind' && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Speed:</span>
            <span className="font-bold text-teal-300">{data.windSpeed} {unit === 'imperial' ? 'mph' : 'km/h'}</span>
          </div>
        )}

        {type === 'uv' && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">UV Index:</span>
            <span className="font-bold text-amber-400">{data.uvIndex}</span>
          </div>
        )}

        <div className="flex justify-between gap-4 pt-1 border-t border-slate-700/50 text-[10px] text-slate-400">
          <span>Humidity: {data.humidity}%</span>
        </div>
      </div>
    );
  }
  return null;
};
