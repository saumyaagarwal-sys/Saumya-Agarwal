import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudHail, 
  CloudLightning,
  LucideIcon
} from 'lucide-react';

export interface WMOCodeInfo {
  code: number;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
  isRainy: boolean;
  isSnowy: boolean;
  isThunder: boolean;
}

export const WMO_CODES: Record<number, WMOCodeInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Bright and clear conditions with high visibility.',
    icon: Sun,
    gradient: 'from-amber-400 via-sky-400 to-blue-600',
    accentColor: 'text-amber-500',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly sunny with scattered light clouds.',
    icon: CloudSun,
    gradient: 'from-amber-300 via-sky-400 to-blue-500',
    accentColor: 'text-amber-400',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Sun alternating with periods of clouds.',
    icon: CloudSun,
    gradient: 'from-sky-400 via-slate-400 to-blue-600',
    accentColor: 'text-sky-500',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense cloud cover blocking direct sunlight.',
    icon: Cloud,
    gradient: 'from-slate-500 via-gray-600 to-slate-800',
    accentColor: 'text-slate-400',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Reduced visibility due to thick ground moisture.',
    icon: CloudFog,
    gradient: 'from-slate-400 via-gray-500 to-zinc-700',
    accentColor: 'text-slate-300',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  },
  48: {
    code: 48,
    label: 'Rime Fog',
    description: 'Freezing fog depositing ice crystals on surfaces.',
    icon: CloudFog,
    gradient: 'from-cyan-600 via-slate-600 to-zinc-800',
    accentColor: 'text-cyan-300',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine mist-like precipitation.',
    icon: CloudDrizzle,
    gradient: 'from-teal-500 via-sky-600 to-slate-800',
    accentColor: 'text-teal-400',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady light drizzle conditions.',
    icon: CloudDrizzle,
    gradient: 'from-teal-600 via-slate-600 to-slate-800',
    accentColor: 'text-teal-300',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy drizzle causing damp roads and wet surfaces.',
    icon: CloudDrizzle,
    gradient: 'from-cyan-600 via-blue-700 to-slate-900',
    accentColor: 'text-cyan-400',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Freezing rain mist forming icy glazes.',
    icon: CloudDrizzle,
    gradient: 'from-sky-500 via-indigo-600 to-slate-900',
    accentColor: 'text-sky-300',
    isRainy: true,
    isSnowy: true,
    isThunder: false
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle causing icy hazards.',
    icon: CloudDrizzle,
    gradient: 'from-cyan-500 via-indigo-700 to-slate-900',
    accentColor: 'text-cyan-300',
    isRainy: true,
    isSnowy: true,
    isThunder: false
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Gentle rainfall, continuous mist.',
    icon: CloudRain,
    gradient: 'from-blue-500 via-indigo-600 to-slate-800',
    accentColor: 'text-blue-400',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady rainfall requiring an umbrella.',
    icon: CloudRain,
    gradient: 'from-blue-600 via-slate-700 to-slate-900',
    accentColor: 'text-blue-400',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Downpour with standing water potential.',
    icon: CloudRain,
    gradient: 'from-blue-700 via-indigo-900 to-slate-950',
    accentColor: 'text-blue-300',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Freezing rain leading to black ice on roads.',
    icon: CloudRain,
    gradient: 'from-sky-600 via-slate-700 to-slate-900',
    accentColor: 'text-sky-300',
    isRainy: true,
    isSnowy: true,
    isThunder: false
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Dangerous freezing rain coating surfaces in ice.',
    icon: CloudRain,
    gradient: 'from-cyan-700 via-slate-800 to-slate-950',
    accentColor: 'text-cyan-300',
    isRainy: true,
    isSnowy: true,
    isThunder: false
  },
  71: {
    code: 71,
    label: 'Slight Snow Fall',
    description: 'Light flurries with minimal accumulation.',
    icon: CloudSnow,
    gradient: 'from-sky-300 via-indigo-400 to-slate-700',
    accentColor: 'text-sky-200',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  73: {
    code: 73,
    label: 'Moderate Snow Fall',
    description: 'Steady snow fall blanketing outdoors.',
    icon: CloudSnow,
    gradient: 'from-blue-300 via-slate-500 to-slate-800',
    accentColor: 'text-blue-200',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  75: {
    code: 75,
    label: 'Heavy Snow Fall',
    description: 'Heavy snow storm with significant accumulation.',
    icon: CloudSnow,
    gradient: 'from-indigo-400 via-slate-700 to-zinc-900',
    accentColor: 'text-indigo-200',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Small frozen ice particles falling gently.',
    icon: CloudHail,
    gradient: 'from-teal-400 via-slate-600 to-slate-800',
    accentColor: 'text-teal-200',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  80: {
    code: 80,
    label: 'Light Rain Showers',
    description: 'Intermittent brief rain showers with sunny breaks.',
    icon: CloudRain,
    gradient: 'from-sky-500 via-indigo-600 to-slate-800',
    accentColor: 'text-sky-400',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Passing heavier rain showers.',
    icon: CloudRain,
    gradient: 'from-blue-600 via-indigo-700 to-slate-900',
    accentColor: 'text-blue-300',
    isRainy: true,
    isSnowy: false,
    isThunder: false
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Torrential brief downpours with gusty winds.',
    icon: CloudRain,
    gradient: 'from-indigo-700 via-slate-800 to-slate-950',
    accentColor: 'text-indigo-300',
    isRainy: true,
    isSnowy: false,
    isThunder: true
  },
  85: {
    code: 85,
    label: 'Light Snow Showers',
    description: 'Passing brief snow flurries.',
    icon: CloudSnow,
    gradient: 'from-sky-400 via-slate-600 to-slate-800',
    accentColor: 'text-sky-200',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Squall-like heavy snow showers.',
    icon: CloudSnow,
    gradient: 'from-blue-500 via-slate-700 to-slate-950',
    accentColor: 'text-sky-100',
    isRainy: false,
    isSnowy: true,
    isThunder: false
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunder and lightning activity with localized rain.',
    icon: CloudLightning,
    gradient: 'from-violet-700 via-slate-800 to-zinc-950',
    accentColor: 'text-amber-400',
    isRainy: true,
    isSnowy: false,
    isThunder: true
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Severe storm with lightning and small hail.',
    icon: CloudLightning,
    gradient: 'from-purple-800 via-slate-900 to-black',
    accentColor: 'text-purple-300',
    isRainy: true,
    isSnowy: false,
    isThunder: true
  },
  99: {
    code: 99,
    label: 'Heavy Hail Thunderstorm',
    description: 'Severe thunderstorm with large damaging hail.',
    icon: CloudLightning,
    gradient: 'from-purple-900 via-zinc-900 to-black',
    accentColor: 'text-rose-400',
    isRainy: true,
    isSnowy: false,
    isThunder: true
  }
};

export function getWMOCodeInfo(code: number): WMOCodeInfo {
  return WMO_CODES[code] || {
    code,
    label: 'Variable Conditions',
    description: 'Weather conditions dynamically varying.',
    icon: CloudSun,
    gradient: 'from-sky-400 via-slate-500 to-blue-700',
    accentColor: 'text-sky-400',
    isRainy: false,
    isSnowy: false,
    isThunder: false
  };
}
