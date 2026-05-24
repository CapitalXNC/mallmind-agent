import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const LEGACY_MODEL_ALIASES = new Map([
  ['gemini-2.5', 'gemini-2.5-flash'],
  ['gemini-2.5-flash-preview-04-17', 'gemini-2.5-flash'],
  ['gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash']
]);

function normalizeModel(modelName, fallback) {
  const trimmedModel = modelName?.trim();
  if (!trimmedModel) return fallback;
  return LEGACY_MODEL_ALIASES.get(trimmedModel) || trimmedModel;
}

function normalizeBackend(backendName) {
  const trimmedBackend = backendName?.trim().toLowerCase();
  if (!trimmedBackend) return null;
  if (trimmedBackend === 'vertex' || trimmedBackend === 'vertexai') return 'vertex';
  if (trimmedBackend === 'gemini' || trimmedBackend === 'api' || trimmedBackend === 'aistudio') return 'gemini';
  return trimmedBackend;
}

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const backendOverride = normalizeBackend(process.env.GENAI_BACKEND);
export const genaiBackend = backendOverride || (apiKey ? 'gemini' : 'vertex');
export const genaiProject = process.env.GOOGLE_CLOUD_PROJECT || 'mallmind-agent';
export const genaiLocation = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

if (genaiBackend === 'gemini' && !apiKey) {
  throw new Error('GENAI_BACKEND is set to Gemini API, but GEMINI_API_KEY/GOOGLE_API_KEY is missing.');
}

const clientOptions = genaiBackend === 'gemini'
  ? { apiKey }
  : {
      vertexai: true,
      project: genaiProject,
      location: genaiLocation
    };

export const ai = new GoogleGenAI(clientOptions);
export const agentModel = normalizeModel(process.env.GEMINI_MODEL, 'gemini-2.5-flash');
export const embeddingModel = normalizeModel(process.env.GEMINI_EMBEDDING_MODEL, 'text-embedding-004');

if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL !== agentModel) {
  console.warn(`Normalized GEMINI_MODEL from "${process.env.GEMINI_MODEL}" to "${agentModel}"`);
}

export function formatGenAIError(err) {
  let parsedError = null;

  try {
    parsedError = JSON.parse(err.message);
  } catch {
    parsedError = null;
  }

  const errorBody = parsedError?.error;
  const errorInfo = errorBody?.details?.find(detail => detail['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo');
  const reason = errorInfo?.reason;

  if (reason === 'API_KEY_SERVICE_BLOCKED') {
    const serviceName = errorInfo.metadata?.service || 'generativelanguage.googleapis.com';
    const consumer = errorInfo.metadata?.consumer || 'the Google Cloud project tied to this key';

    return new Error(
      `Gemini API access is blocked for the configured API key. ` +
      `The key's project (${consumer}) is not allowed to call ${serviceName}. ` +
      `Use a Gemini API key created in Google AI Studio or in Google Cloud with API restrictions that allow Generative Language API, ` +
      `or switch this app to Vertex by setting GENAI_BACKEND=vertex and configuring Google Cloud credentials.`
    );
  }

  return err;
}
