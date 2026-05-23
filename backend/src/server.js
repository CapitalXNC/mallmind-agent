import express from 'express';
import cors from 'cors';
import { runAgentQuery } from './agent/gemini.js';
import { connectDB } from './db/connection.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MallMind Agent API', timestamp: new Date() });
});

app.post('/api/agent', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const sessionKey = sessionId || `session-${Date.now()}`;
    const result = await runAgentQuery(message, sessionKey);
    res.json(result);
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/traffic', async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.collection('foot_traffic')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/incidents', async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.collection('incidents')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.collection('campaigns')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.once('error', reject);
  });
}

async function startServer(initialPort) {
  let port = Number(initialPort);

  while (true) {
    try {
      await listenOnPort(port);
      console.log(`MallMind API running on http://localhost:${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      return;
    } catch (err) {
      if (err.code !== 'EADDRINUSE') {
        throw err;
      }

      console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
      port += 1;
    }
  }
}

connectDB()
  .then(() => startServer(PORT))
  .catch((err) => {
    console.error('Server startup failed:', err);
    process.exit(1);
  });
