import React from 'react';
import { 
  Sparkles, 
  Bike, 
  Utensils, 
  Camera, 
  Car, 
  Shirt, 
  Umbrella, 
  Sun, 
  AlertTriangle, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types/weather';
import { generateIntelligence } from '../utils/weatherCalculations';

interface IntelligencePlannerProps {
  weatherData: WeatherData;
  unit: UnitSystem;
}

export const IntelligencePlanner: React.FC<IntelligencePlannerProps> = ({
  weatherData,
}) => {
  const intel = generateIntelligence(weatherData);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-sky-400 border-sky-500/40 bg-sky-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bike': return <Bike className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl text-slate-100 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-sky-500 to-indigo-600 text-white shadow-md">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>Weather Intelligence & Activity Planner</span>
            </h3>
            <p className="text-xs text-slate-400">Algorithmic planning recommendations based on real-time physics</p>
          </div>
        </div>

        {/* Outdoor Score Dial */}
        <div className={`flex items-center space-x-3 px-4 py-2 rounded-2xl border ${getScoreColor(intel.overallOutdoorScore)}`}>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Outdoor Score</div>
            <div className="text-xs font-semibold">{intel.overallOutdoorScore >= 75 ? 'Great Conditions' : intel.overallOutdoorScore >= 50 ? 'Moderate' : 'Poor Outdoor'}</div>
          </div>
          <div className="text-2xl font-black">
            {intel.overallOutdoorScore}<span className="text-xs font-normal opacity-70">/100</span>
          </div>
        </div>
      </div>

      {/* Commute Warning Banner (If Moderate or High) */}
      {intel.commuteAlert.level !== 'low' && (
        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
          intel.commuteAlert.level === 'high'
            ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${intel.commuteAlert.level === 'high' ? 'text-rose-400' : 'text-amber-400'}`} />
          <div>
            <h4 className="text-sm font-bold">{intel.commuteAlert.title}</h4>
            <p className="text-xs opacity-90 mt-0.5">{intel.commuteAlert.details}</p>
          </div>
        </div>
      )}

      {/* Recommended Best Outdoor Time Window */}
      {intel.bestOutdoorWindow && (
        <div className="bg-sky-950/30 border border-sky-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Optimal Outdoor Window</span>
              <div className="text-sm font-extrabold text-slate-100">
                {intel.bestOutdoorWindow.start} – {intel.bestOutdoorWindow.end}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            {intel.bestOutdoorWindow.reason}
          </p>
        </div>
      )}

      {/* Activity Suitability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {intel.activities.map((act) => (
          <div 
            key={act.name}
            className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-800/80 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-slate-700 text-sky-400">
                  {getIcon(act.icon)}
                </div>
                <h4 className="text-sm font-bold text-slate-100">{act.name}</h4>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getScoreColor(act.score)}`}>
                {act.status} ({act.score}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {act.reason}
            </p>
          </div>
        ))}
      </div>

      {/* Wardrobe & Sun Protection Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Attire Assistant */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm border-b border-slate-700/60 pb-2">
            <Shirt className="w-4 h-4" />
            <span>Recommended Wardrobe</span>
          </div>
          <div className="text-xs font-semibold text-slate-200">
            {intel.attire.summary}
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {intel.attire.items.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* UV & Gear Checklist */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm border-b border-slate-700/60 pb-2">
            <Sun className="w-4 h-4" />
            <span>Sun & Essentials Protocol</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2">
              <Umbrella className={`w-4 h-4 shrink-0 mt-0.5 ${intel.attire.umbrellaNeeded ? 'text-sky-400' : 'text-slate-500'}`} />
              <div>
                <span className="font-semibold text-slate-200">Umbrella Advisory: </span>
                <span className="text-slate-300">
                  {intel.attire.umbrellaNeeded ? 'Rain or drizzle expected. Carry a windproof umbrella.' : 'No umbrella needed today.'}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <Sun className={`w-4 h-4 shrink-0 mt-0.5 ${intel.attire.sunscreenNeeded ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <span className="font-semibold text-slate-200">UV Advisory ({intel.uvAdvisory.level}): </span>
                <span className="text-slate-300">{intel.uvAdvisory.recommendation}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
