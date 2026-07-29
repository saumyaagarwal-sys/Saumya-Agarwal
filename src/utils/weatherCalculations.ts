import { UnitSystem, WeatherData, IntelligenceRecommendations, ActivityScore } from '../types/weather';
import { getWMOCodeInfo } from './wmoCodes';

export function convertTemp(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: UnitSystem): string {
  const val = convertTemp(celsius, unit);
  return `${val}°${unit === 'imperial' ? 'F' : 'C'}`;
}

export function convertSpeed(kmh: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function formatSpeed(kmh: number, unit: UnitSystem): string {
  const val = convertSpeed(kmh, unit);
  return `${val} ${unit === 'imperial' ? 'mph' : 'km/h'}`;
}

export function convertPrecip(mm: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Number((mm * 0.0393701).toFixed(2));
  }
  return Number(mm.toFixed(1));
}

export function formatPrecip(mm: number, unit: UnitSystem): string {
  const val = convertPrecip(mm, unit);
  return `${val} ${unit === 'imperial' ? 'in' : 'mm'}`;
}

export function getUVInfo(uv: number): { level: string; color: string; badgeBg: string; advice: string } {
  if (uv <= 2) {
    return {
      level: 'Low',
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      advice: 'Minimal sun danger. Ideal for outdoor activities.'
    };
  } else if (uv <= 5) {
    return {
      level: 'Moderate',
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      advice: 'Wear sunglasses & SPF 30+ if outdoors for >45 minutes.'
    };
  } else if (uv <= 7) {
    return {
      level: 'High',
      color: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
      advice: 'Protection required. Seek shade during mid-day hours.'
    };
  } else if (uv <= 10) {
    return {
      level: 'Very High',
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      advice: 'Take extra precautions. Unprotected skin can burn quickly.'
    };
  } else {
    return {
      level: 'Extreme',
      color: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      advice: 'Avoid sun exposure during peak hours (10am - 4pm).'
    };
  }
}

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function generateIntelligence(data: WeatherData): IntelligenceRecommendations {
  const current = data.current;
  const today = data.daily[0];
  const hourly = data.hourly.slice(0, 24); // Next 24 hours
  const wmo = getWMOCodeInfo(current.weatherCode);

  const tempC = current.temperature;
  const windKmh = current.windSpeed;
  const rainProb = Math.max(...hourly.slice(0, 12).map(h => h.precipitationProbability), 0);
  const maxUV = today ? today.uvIndexMax : 0;

  // 1. Overall Outdoor Score Calculation (0 - 100)
  let outdoorScore = 100;

  // Penalty for rain or snow
  if (wmo.isThunder) outdoorScore -= 60;
  else if (wmo.isRainy) outdoorScore -= 40;
  else if (wmo.isSnowy) outdoorScore -= 35;
  else if (rainProb > 50) outdoorScore -= 25;

  // Penalty for temperature extremities
  if (tempC < 0) outdoorScore -= 30;
  else if (tempC < 10) outdoorScore -= 15;
  else if (tempC > 35) outdoorScore -= 35;
  else if (tempC > 30) outdoorScore -= 15;

  // Penalty for high wind
  if (windKmh > 50) outdoorScore -= 35;
  else if (windKmh > 30) outdoorScore -= 15;

  // Penalty for extreme UV
  if (maxUV >= 8) outdoorScore -= 15;

  outdoorScore = Math.max(10, Math.min(100, Math.round(outdoorScore)));

  // 2. Activities Analysis
  const activities: ActivityScore[] = [];

  // Running & Cycling
  let runScore = 100;
  if (tempC < 5 || tempC > 28) runScore -= 30;
  if (wmo.isRainy) runScore -= 40;
  if (windKmh > 25) runScore -= 25;
  runScore = Math.max(15, Math.min(100, runScore));
  activities.push({
    name: 'Running & Cycling',
    score: runScore,
    category: 'sports',
    status: getScoreStatus(runScore),
    icon: 'Bike',
    reason: runScore > 75 
      ? 'Ideal temperature & wind balance for endurance sports.'
      : runScore > 50
      ? 'Moderate conditions; mind hydration and footing.'
      : 'Unfavorable weather; indoor workout recommended.'
  });

  // Outdoor Dining & Picnic
  let picnicScore = 100;
  if (tempC < 15 || tempC > 32) picnicScore -= 35;
  if (wmo.isRainy || rainProb > 30) picnicScore -= 50;
  if (windKmh > 20) picnicScore -= 25;
  picnicScore = Math.max(10, Math.min(100, picnicScore));
  activities.push({
    name: 'Picnics & Outdoor Dining',
    score: picnicScore,
    category: 'leisure',
    status: getScoreStatus(picnicScore),
    icon: 'Utensils',
    reason: picnicScore > 75
      ? 'Pleasant mild weather with low chance of rain.'
      : picnicScore > 50
      ? 'Chilly or breezy; choose covered outdoor seating.'
      : 'High precipitation or harsh wind; dine indoors.'
  });

  // Hiking & Photography
  let hikeScore = 100;
  if (wmo.isThunder) hikeScore -= 70;
  if (wmo.isRainy) hikeScore -= 40;
  if (current.cloudCover > 85) hikeScore -= 15;
  if (current.humidity > 85) hikeScore -= 15;
  hikeScore = Math.max(10, Math.min(100, hikeScore));
  activities.push({
    name: 'Hiking & Photography',
    score: hikeScore,
    category: 'outdoor',
    status: getScoreStatus(hikeScore),
    icon: 'Camera',
    reason: hikeScore > 75
      ? 'Great visibility and crisp air for scenic walks.'
      : hikeScore > 50
      ? 'Overcast or damp trails; wear sturdy waterproof footwear.'
      : 'Stormy or slippery conditions; delay high-elevation hikes.'
  });

  // Travel & Commute
  let commuteScore = 100;
  if (wmo.isThunder) commuteScore -= 50;
  if (wmo.isSnowy || wmo.code >= 65) commuteScore -= 45;
  if (current.humidity > 90 && current.cloudCover > 80) commuteScore -= 20;
  commuteScore = Math.max(15, Math.min(100, commuteScore));
  activities.push({
    name: 'Daily Commute & Travel',
    score: commuteScore,
    category: 'commute',
    status: getScoreStatus(commuteScore),
    icon: 'Car',
    reason: commuteScore > 75
      ? 'Clear roads and minimal weather-induced traffic hazards.'
      : commuteScore > 50
      ? 'Wet roads ahead; allow an extra 10–15 mins for travel.'
      : 'Severe weather risk; slow down and check live transit alerts.'
  });

  // 3. Attire & Accessories
  const attireItems: string[] = [];
  let umbrellaNeeded = wmo.isRainy || rainProb > 35;
  let sunscreenNeeded = maxUV >= 3;
  let layersNeeded = tempC < 16;

  if (tempC < 0) {
    attireItems.push('Heavy winter coat & thermal base layer');
    attireItems.push('Insulated gloves, beanie & scarf');
  } else if (tempC < 10) {
    attireItems.push('Warm jacket or fleece sweater');
    attireItems.push('Long pants & closed-toe footwear');
  } else if (tempC < 20) {
    attireItems.push('Light jacket or comfortable hoodie');
    attireItems.push('Breathable trousers or jeans');
  } else if (tempC < 28) {
    attireItems.push('T-shirt or linen shirt');
    attireItems.push('Light shorts or chinos');
  } else {
    attireItems.push('Ultralight loose cotton clothing');
    attireItems.push('Sun hat & breathable footwear');
  }

  if (umbrellaNeeded) {
    attireItems.push('Compact windproof umbrella or raincoat');
  }
  if (sunscreenNeeded) {
    attireItems.push('UV400 Sunglasses & Broad-spectrum SPF 30+');
  }

  // 4. Best Outdoor Window calculation
  let bestWindow: { start: string; end: string; reason: string } | undefined;
  
  // Find a 3-hour window in hourly with lowest precip & mildest temp
  if (hourly.length >= 12) {
    let bestStartIndex = 0;
    let minPenalty = 999;

    for (let i = 0; i < 12; i++) {
      const windowHours = hourly.slice(i, i + 3);
      const avgRain = windowHours.reduce((acc, h) => acc + h.precipitationProbability, 0) / 3;
      const avgTemp = windowHours.reduce((acc, h) => acc + h.temperature, 0) / 3;
      const tempDist = Math.abs(avgTemp - 22); // ideal ~22C
      
      const penalty = avgRain * 2 + tempDist;
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestStartIndex = i;
      }
    }

    const startHour = new Date(hourly[bestStartIndex].time);
    const endHour = new Date(hourly[Math.min(bestStartIndex + 3, hourly.length - 1)].time);

    const startStr = startHour.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endStr = endHour.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    bestWindow = {
      start: startStr,
      end: endStr,
      reason: `Lowest rain probability (${hourly[bestStartIndex].precipitationProbability}%) and comfortable temperature window.`
    };
  }

  // 5. Commute Alert Level
  let commuteAlertLevel: 'low' | 'moderate' | 'high' = 'low';
  let alertTitle = 'Smooth Road Conditions';
  let alertDetails = 'Weather poses minimal disruption to regular transit and driving.';

  if (wmo.isThunder || wmo.code >= 65) {
    commuteAlertLevel = 'high';
    alertTitle = 'Severe Weather Driving Advisory';
    alertDetails = 'Heavy rain/thunderstorm risk. Standing water may cause hydroplaning on highways.';
  } else if (wmo.isSnowy) {
    commuteAlertLevel = 'high';
    alertTitle = 'Winter Driving Alert';
    alertDetails = 'Sub-zero surfaces with snow/ice accumulation. Ensure winter tire tread and exercise caution.';
  } else if (wmo.isRainy || rainProb > 50) {
    commuteAlertLevel = 'moderate';
    alertTitle = 'Wet Road Warning';
    alertDetails = 'Scattered showers expected. Decreased visibility and reduced brake grip.';
  }

  return {
    overallOutdoorScore: outdoorScore,
    attire: {
      summary: tempC > 22 ? 'Light & Warm Weather Clothing' : tempC > 12 ? 'Layered Casual Attire' : 'Insulated Cold Weather Apparel',
      items: attireItems,
      umbrellaNeeded,
      sunscreenNeeded,
      layersNeeded
    },
    uvAdvisory: {
      level: getUVInfo(maxUV).level,
      maxExposureMinutes: maxUV > 8 ? 15 : maxUV > 5 ? 30 : 60,
      recommendation: getUVInfo(maxUV).advice
    },
    commuteAlert: {
      level: commuteAlertLevel,
      title: alertTitle,
      details: alertDetails
    },
    bestOutdoorWindow: bestWindow,
    activities
  };
}

function getScoreStatus(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}
