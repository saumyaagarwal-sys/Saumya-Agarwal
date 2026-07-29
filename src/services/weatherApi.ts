import { GeocodingResult, WeatherData } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code,
      country: item.country,
      admin1: item.admin1,
      admin2: item.admin2,
      timezone: item.timezone,
      population: item.population,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
  try {
    // Attempt BigDataCloud open reverse geocoding API
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';

      return {
        id: Math.floor(latitude * 1000 + longitude),
        name: cityName,
        latitude,
        longitude,
        country,
        admin1,
      };
    }
  } catch (err) {
    console.warn('Reverse geocode service failed, using fallback coordinates name:', err);
  }

  // Fallback
  return {
    id: Math.floor(latitude * 1000 + longitude),
    name: `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
    latitude,
    longitude,
    country: 'Your Location',
  };
}

export async function fetchWeatherData(location: GeocodingResult): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather fetch failed with status: ${response.status}`);
    }

    const data = await response.json();

    const currentData = {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      isDay: Boolean(data.current.is_day),
      weatherCode: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGusts: data.current.wind_gusts_10m || data.current.wind_speed_10m,
      pressure: data.current.pressure_msl || data.current.surface_pressure,
      precipitation: data.current.precipitation || 0,
      cloudCover: data.current.cloud_cover || 0,
    };

    // Parse hourly items (take next 48 hours)
    const hourlyItems = data.hourly.time.map((t: string, idx: number) => ({
      time: t,
      temperature: data.hourly.temperature_2m[idx],
      apparentTemperature: data.hourly.apparent_temperature[idx],
      humidity: data.hourly.relative_humidity_2m[idx],
      dewPoint: data.hourly.dew_point_2m ? data.hourly.dew_point_2m[idx] : data.hourly.temperature_2m[idx] - 5,
      precipitationProbability: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[idx] : 0,
      precipitation: data.hourly.precipitation ? data.hourly.precipitation[idx] : 0,
      weatherCode: data.hourly.weather_code[idx],
      pressure: data.hourly.pressure_msl ? data.hourly.pressure_msl[idx] : 1013,
      cloudCover: data.hourly.cloud_cover ? data.hourly.cloud_cover[idx] : 0,
      visibility: data.hourly.visibility ? Math.round(data.hourly.visibility[idx] / 1000) : 10,
      windSpeed: data.hourly.wind_speed_10m[idx],
      uvIndex: data.hourly.uv_index ? data.hourly.uv_index[idx] : 0,
    }));

    // Parse daily items (7 days)
    const dailyItems = data.daily.time.map((d: string, idx: number) => ({
      date: d,
      weatherCode: data.daily.weather_code[idx],
      tempMax: data.daily.temperature_2m_max[idx],
      tempMin: data.daily.temperature_2m_min[idx],
      apparentTempMax: data.daily.apparent_temperature_max[idx],
      apparentTempMin: data.daily.apparent_temperature_min[idx],
      sunrise: data.daily.sunrise ? data.daily.sunrise[idx] : '',
      sunset: data.daily.sunset ? data.daily.sunset[idx] : '',
      uvIndexMax: data.daily.uv_index_max ? data.daily.uv_index_max[idx] : 0,
      precipitationSum: data.daily.precipitation_sum ? data.daily.precipitation_sum[idx] : 0,
      precipitationProbabilityMax: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[idx] : 0,
      windSpeedMax: data.daily.wind_speed_10m_max ? data.daily.wind_speed_10m_max[idx] : 0,
      windGustsMax: data.daily.wind_gusts_10m_max ? data.daily.wind_gusts_10m_max[idx] : 0,
      windDirectionDominant: data.daily.wind_direction_10m_dominant ? data.daily.wind_direction_10m_dominant[idx] : 0,
    }));

    return {
      location,
      current: currentData,
      hourly: hourlyItems,
      daily: dailyItems,
      timezone: data.timezone || 'auto',
      elevation: data.elevation || 0,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
