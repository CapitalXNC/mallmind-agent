import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

function buildWeatherQueries(city) {
  const baseCity = (city || process.env.MALL_CITY || 'Dallas').trim();
  const queries = new Set([baseCity]);
  const parts = baseCity.split(',').map(part => part.trim()).filter(Boolean);

  if (parts.length === 2 && /^[A-Za-z]{2}$/.test(parts[1])) {
    queries.add(`${parts[0]},${parts[1].toUpperCase()},US`);
    queries.add(parts[0]);
  }

  return [...queries];
}

export async function getWeatherContext({ city }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherQueries = buildWeatherQueries(city);

  if (!apiKey) {
    return {
      success: false,
      message: 'OpenWeather API key not configured',
      weather: null
    };
  }

  try {
    let data = null;
    let lastMessage = 'city not found';

    for (const query of weatherQueries) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=imperial`;
      const response = await fetch(url);
      const result = await response.json();

      if (Number(result.cod) === 200) {
        data = result;
        break;
      }

      lastMessage = result.message || lastMessage;
    }

    if (!data) {
      return { success: false, message: lastMessage, weather: null };
    }

    const weather = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      isRaining: ['Rain', 'Drizzle', 'Thunderstorm'].includes(data.weather[0].main),
      isExtreme: ['Thunderstorm', 'Snow', 'Extreme'].includes(data.weather[0].main)
    };

    const trafficImpact = weather.isRaining
      ? 'HIGH — Rain typically increases indoor mall traffic by 15-25%'
      : weather.temperature > 95
      ? 'HIGH — Extreme heat drives shoppers indoors'
      : weather.condition === 'Clear' && weather.temperature > 65 && weather.temperature < 85
      ? 'LOW — Pleasant weather may reduce mall visits'
      : 'NORMAL — Weather conditions neutral for mall traffic';

    return {
      success: true,
      weather,
      trafficImpact,
      recommendation: weather.isRaining
        ? 'Pre-position staff at entrances. Alert Food Court and Entertainment tenants to expect surge.'
        : weather.temperature > 95
        ? 'Expect above-average foot traffic. Monitor Food Court and Central Atrium capacity.'
        : 'Normal operations expected.'
    };
  } catch (err) {
    return {
      success: false,
      message: `Weather fetch failed: ${err.message}`,
      weather: null
    };
  }
}
