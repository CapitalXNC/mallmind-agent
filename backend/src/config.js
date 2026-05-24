import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env in development, Cloud Run uses real env vars in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: resolve(__dirname, '../../.env') });
}

export const config = {
  mongoUri: process.env.MONGODB_URI,
  mongoDb: process.env.MONGODB_DB_NAME || 'mallmind',
  geminiApiKey: process.env.GEMINI_API_KEY,
  openWeatherKey: process.env.OPENWEATHER_API_KEY,
  mallCity: process.env.MALL_CITY || 'Dallas',
  port: parseInt(process.env.PORT) || 3001,
  gcpProject: process.env.GCP_PROJECT || 'mallmind-agent',
  gcpLocation: process.env.GCP_LOCATION || 'us-central1',
  nodeEnv: process.env.NODE_ENV || 'development'
};