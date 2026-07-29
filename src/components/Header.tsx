import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Compass, 
  Star, 
  X, 
  Loader2, 
  Navigation,
  Check
} from 'lucide-react';
import { GeocodingResult, UnitSystem } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  selectedLocation: GeocodingResult | null;
  onSelectLocation: (location: GeocodingResult) => void;
  onUseGeolocation: () => void;
  isGeoLoading: boolean;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  favoriteLocations: GeocodingResult[];
  onToggleFavorite: (location: GeocodingResult) => void;
}

const POPULAR_CITIES: GeocodingResult[] = [
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', admin1: 'New South Wales' },
  { id: 1275339, name: 'Mumbai', latitude: 19.0728, longitude: 72.8826, country: 'India', admin1: 'Maharashtra' },
];

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  onSelectLocation,
  onUseGeolocation,
  isGeoLoading,
  unit,
  onToggleUnit,
  favoriteLocations,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchCities(value);
        setResults(data);
        if (data.length === 0) {
          setSearchError(`No cities found matching "${value}"`);
        }
      } catch (err) {
        setSearchError('Failed to search locations. Please try again.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = (loc: GeocodingResult) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const isCurrentFav = selectedLocation 
    ? favoriteLocations.some(f => f.id === selectedLocation.id || (Math.abs(f.latitude - selectedLocation.latitude) < 0.01 && Math.abs(f.longitude - selectedLocation.longitude) < 0.01))
    : false;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => POPULAR_CITIES[0] && handleSelect(POPULAR_CITIES[0])}>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 text-white shrink-0">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                  WEATHER<span className="text-blue-500">INTEL</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold">Precision Weather Intelligence</p>
              </div>
            </div>

            {/* Mobile Units & Geo Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                id="btn-unit-toggle-mobile"
                onClick={() => onToggleUnit(unit === 'metric' ? 'imperial' : 'metric')}
                className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition-all text-blue-400"
              >
                °{unit === 'metric' ? 'C' : 'F'}
              </button>
              <button
                id="btn-geolocation-mobile"
                onClick={onUseGeolocation}
                disabled={isGeoLoading}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
                title="Use Current Location"
              >
                {isGeoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search Bar & Autocomplete */}
          <div ref={searchRef} className="relative w-full md:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                placeholder="Search city (e.g. London, Tokyo)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setIsOpen(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span>Searching cities...</span>
                  </div>
                ) : searchError ? (
                  <div className="p-3 text-center text-xs text-rose-400">
                    {searchError}
                  </div>
                ) : results.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto py-1">
                    {results.map((loc) => (
                      <li key={`${loc.id}-${loc.latitude}-${loc.longitude}`}>
                        <button
                          onClick={() => handleSelect(loc)}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-800 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-slate-100 group-hover:text-blue-300">
                                {loc.name}
                              </div>
                              <div className="text-xs text-slate-400">
                                {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>
                          {loc.population && (
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 font-mono border border-slate-800">
                              Pop: {(loc.population / 1000).toFixed(0)}k
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>

          {/* Desktop Right Controls (Units, Geolocation, Favorite, Telemetry) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Geolocation Button */}
            <button
              id="btn-use-location-desktop"
              onClick={onUseGeolocation}
              disabled={isGeoLoading}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
              title="Locate me"
            >
              {isGeoLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>My Location</span>
            </button>

            {/* Favorite Star Button */}
            {selectedLocation && (
              <button
                id="btn-toggle-favorite"
                onClick={() => onToggleFavorite(selectedLocation)}
                className={`p-2 rounded-full border transition-all ${
                  isCurrentFav
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400 hover:bg-slate-700'
                }`}
                title={isCurrentFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isCurrentFav ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Units Segmented Control */}
            <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700 rounded-full">
              <button
                onClick={() => onToggleUnit('metric')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  unit === 'metric'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onToggleUnit('imperial')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  unit === 'imperial'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Coordinates Telemetry display */}
            {selectedLocation && (
              <div className="hidden lg:flex flex-col items-end border-l border-slate-800 pl-4">
                <span className="text-xs text-blue-400 font-mono">
                  {Math.abs(selectedLocation.latitude).toFixed(4)}° {selectedLocation.latitude >= 0 ? 'N' : 'S'}, {Math.abs(selectedLocation.longitude).toFixed(4)}° {selectedLocation.longitude >= 0 ? 'E' : 'W'}
                </span>
                <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Operational Hub</span>
              </div>
            )}
          </div>

        </div>

        {/* Quick City Pills Bar (Favorites & Popular) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Saved & Popular:</span>
          </span>

          {/* User Favorites */}
          {favoriteLocations.map((fav) => (
            <button
              key={`fav-${fav.id}`}
              onClick={() => onSelectLocation(fav)}
              className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1 ${
                selectedLocation?.id === fav.id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Check className="w-3 h-3 text-amber-400" />
              <span>{fav.name}</span>
            </button>
          ))}

          {/* Popular Defaults */}
          {POPULAR_CITIES.filter(
            p => !favoriteLocations.some(f => f.name.toLowerCase() === p.name.toLowerCase())
          ).map((city) => (
            <button
              key={`popular-${city.id}`}
              onClick={() => onSelectLocation(city)}
              className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                selectedLocation?.id === city.id || selectedLocation?.name === city.name
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold shadow-sm'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
