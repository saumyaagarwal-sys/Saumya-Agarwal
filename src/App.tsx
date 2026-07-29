import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { DailyForecastList } from './components/DailyForecastList';
import { IntelligencePlanner } from './components/IntelligencePlanner';
import { ErrorMessage } from './components/ErrorMessage';
import { GeocodingResult, WeatherData, UnitSystem } from './types/weather';
import { fetchWeatherData, reverseGeocode } from './services/weatherApi';
import { Loader2, CloudSun, RefreshCw } from 'lucide-react';

const DEFAULT_LOCATION: GeocodingResult = {
  id: 5128581,
  name: 'New York',
  latitude: 40.7143,
  longitude: -74.006,
  country: 'United States',
  admin1: 'New York',
  country_code: 'US',
};

const STORAGE_FAVORITES_KEY = 'weather_intelligence_favs_v1';
const STORAGE_UNIT_KEY = 'weather_intelligence_unit_v1';
const STORAGE_LAST_LOC_KEY = 'weather_intelligence_last_loc_v1';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LAST_LOC_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UNIT_KEY);
      return saved === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  });

  const [favoriteLocations, setFavoriteLocations] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [DEFAULT_LOCATION];
    } catch {
      return [DEFAULT_LOCATION];
    }
  });

  // Fetch weather data when selected location changes
  const loadWeather = async (loc: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      localStorage.setItem(STORAGE_LAST_LOC_KEY, JSON.stringify(loc));
    } catch (err) {
      setError('Unable to fetch weather forecast data. Please check your internet connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const handleSelectLocation = (loc: GeocodingResult) => {
    setSelectedLocation(loc);
  };

  const handleToggleUnit = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    localStorage.setItem(STORAGE_UNIT_KEY, newUnit);
  };

  const handleToggleFavorite = (loc: GeocodingResult) => {
    setFavoriteLocations((prev) => {
      const exists = prev.some((f) => f.id === loc.id || (Math.abs(f.latitude - loc.latitude) < 0.01 && Math.abs(f.longitude - loc.longitude) < 0.01));
      let updated: GeocodingResult[];
      if (exists) {
        updated = prev.filter((f) => f.id !== loc.id);
      } else {
        updated = [...prev, loc];
      }
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await reverseGeocode(latitude, longitude);
          setSelectedLocation(loc);
        } catch (err) {
          setError('Failed to resolve location coordinates.');
        } finally {
          setIsGeoLoading(false);
        }
      },
      (geoErr) => {
        console.warn('Geolocation error:', geoErr);
        setIsGeoLoading(false);
        alert('Could not retrieve your location. Please ensure location permissions are granted.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      
      {/* Header */}
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onUseGeolocation={handleUseGeolocation}
        isGeoLoading={isGeoLoading}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        favoriteLocations={favoriteLocations}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 animate-pulse">
                <CloudSun className="w-8 h-8" />
              </div>
              <Loader2 className="w-6 h-6 text-sky-400 animate-spin absolute -bottom-2 -right-2" />
            </div>
            <p className="text-sm font-semibold tracking-wide text-slate-300">
              Gathering atmospheric data for {selectedLocation.name}...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeather(selectedLocation)}
            onSearchFallback={(name) => handleSelectLocation(DEFAULT_LOCATION)}
          />
        )}

        {/* Weather Content */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Hero Current Weather */}
            <CurrentWeatherCard weatherData={weatherData} unit={unit} />

            {/* Grid Layout: Charts (Left) & Intelligence Planner (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Trends & Daily Outlook */}
              <div className="lg:col-span-7 space-y-6">
                {/* 24-Hour Interactive Charts */}
                <HourlyForecastChart hourly={weatherData.hourly} unit={unit} />

                {/* 7-Day Outlook */}
                <DailyForecastList daily={weatherData.daily} unit={unit} />
              </div>

              {/* Intelligence Planner & Activity Score */}
              <div className="lg:col-span-5 space-y-6">
                <IntelligencePlanner weatherData={weatherData} unit={unit} />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-4 h-4 text-sky-500" />
            <span className="font-bold text-slate-400">Weather Intelligence</span>
            <span>• Powered by Open-Meteo API</span>
          </div>
          <div className="text-slate-500">
            Real-time weather data & precision activity forecasting
          </div>
        </div>
      </footer>

    </div>
  );
}
