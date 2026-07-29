export type UnitSystem = 'metric' | 'imperial';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State or region
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  precipitation: number;
  cloudCover: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface WeatherData {
  location: GeocodingResult;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  timezone: string;
  elevation: number;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 to 100
  category: 'outdoor' | 'sports' | 'leisure' | 'commute';
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  icon: string;
  reason: string;
}

export interface IntelligenceRecommendations {
  overallOutdoorScore: number;
  attire: {
    summary: string;
    items: string[];
    umbrellaNeeded: boolean;
    sunscreenNeeded: boolean;
    layersNeeded: boolean;
  };
  uvAdvisory: {
    level: string;
    maxExposureMinutes: number;
    recommendation: string;
  };
  commuteAlert: {
    level: 'low' | 'moderate' | 'high';
    title: string;
    details: string;
  };
  bestOutdoorWindow?: {
    start: string;
    end: string;
    reason: string;
  };
  activities: ActivityScore[];
}
