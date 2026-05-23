import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || 'mallmind');
  console.log('Connected to MongoDB Atlas');
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}

export function getDB() {
  if (!db) throw new Error('DB not connected. Call connectDB() first.');
  return db;
}