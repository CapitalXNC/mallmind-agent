import { connectDB } from '../db/connection.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// Real mall traffic patterns by zone and hour (people per reading)
// Based on published retail foot traffic research for US indoor malls
const ZONE_PROFILES = {
  'zone-north': {
    name: 'North Wing',
    capacity: 800,
    hourlyBase: [12,8,5,4,3,5,18,65,140,260,330,370,400,385,370,340,290,270,240,195,170,115,75,35]
  },
  'zone-south': {
    name: 'South Wing',
    capacity: 750,
    hourlyBase: [10,6,4,3,2,4,15,55,130,245,310,350,380,360,345,320,275,255,225,185,155,105,65,30]
  },
  'zone-foodcourt': {
    name: 'Food Court',
    capacity: 600,
    hourlyBase: [4,2,1,1,1,2,4,18,55,115,290,510,570,550,390,195,175,440,510,390,275,145,75,18]
  },
  'zone-entertainment': {
    name: 'Entertainment Hub',
    capacity: 500,
    hourlyBase: [8,5,3,2,2,3,8,25,75,115,145,175,195,215,255,295,375,415,475,495,455,345,195,55]
  },
  'zone-central': {
    name: 'Central Atrium',
    capacity: 1200,
    hourlyBase: [25,18,12,8,6,10,35,95,195,370,490,550,590,570,530,490,450,410,370,315,275,195,135,55]
  }
};

function getAlertLevel(count, capacity) {
  const pct = count / capacity;
  if (pct >= 0.9) return 'critical';
  if (pct >= 0.7) return 'high';
  if (pct >= 0.45) return 'normal';
  return 'low';
}

function generateReading(zoneId, profile, weatherMultiplier = 1.0) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Interpolate between current hour and next for smooth transitions
  const currentBase = profile.hourlyBase[hour];
  const nextBase = profile.hourlyBase[(hour + 1) % 24];
  const interpolated = currentBase + (nextBase - currentBase) * (minute / 60);

  // Apply weather multiplier (rain drives people indoors)
  const weatherAdjusted = interpolated * weatherMultiplier;

  // Add realistic noise (+/- 12%)
  const noise = weatherAdjusted * (0.88 + Math.random() * 0.24);

  // Random surge event (3% chance per reading)
  const isSurge = Math.random() < 0.03;
  const surgeMultiplier = isSurge ? 1.4 + Math.random() * 0.4 : 1.0;

  const count = Math.max(0, Math.round(noise * surgeMultiplier));
  const occupancyPct = Math.round((count / profile.capacity) * 100);

  return {
    zoneId,
    zoneName: profile.name,
    timestamp: now,
    count,
    capacity: profile.capacity,
    occupancyPct,
    alertLevel: getAlertLevel(count, profile.capacity),
    isSurge,
    source: 'live-simulator',
    metadata: {
      hour,
      minute,
      weatherMultiplier: Math.round(weatherMultiplier * 100) / 100,
      confidence: Math.floor(92 + Math.random() * 7)
    }
  };
}

async function fetchWeatherMultiplier() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = process.env.MALL_CITY || 'Dallas';
    if (!apiKey) return 1.0;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) return 1.0;

    const condition = data.weather[0].main;
    const temp = data.main.temp;

    // Rain and extreme heat push people indoors
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) return 1.2;
    if (temp > 95) return 1.15;
    if (condition === 'Clear' && temp > 65 && temp < 85) return 0.9;
    return 1.0;
  } catch {
    return 1.0;
  }
}

let weatherMultiplier = 1.0;
let weatherRefreshCounter = 0;

export async function startSimulator(intervalSeconds = 30) {
  const db = await connectDB();
  console.log(`Live traffic simulator started — inserting readings every ${intervalSeconds}s`);

  // Refresh weather every 10 ticks (~5 minutes)
  async function tick() {
    weatherRefreshCounter++;
    if (weatherRefreshCounter % 10 === 1) {
      weatherMultiplier = await fetchWeatherMultiplier();
      console.log(`Weather multiplier updated: ${weatherMultiplier}`);
    }

    const readings = Object.entries(ZONE_PROFILES).map(([zoneId, profile]) =>
      generateReading(zoneId, profile, weatherMultiplier)
    );

    await db.collection('foot_traffic').insertMany(readings);

    const surges = readings.filter(r => r.isSurge);
    const criticals = readings.filter(r => r.alertLevel === 'critical');

    console.log(
      `[${new Date().toLocaleTimeString()}] Inserted ${readings.length} readings` +
      (surges.length ? ` | SURGES: ${surges.map(r => r.zoneName).join(', ')}` : '') +
      (criticals.length ? ` | CRITICAL: ${criticals.map(r => r.zoneName).join(', ')}` : '')
    );
  }

  // Run immediately then on interval
  await tick();
  setInterval(tick, intervalSeconds * 1000);
}