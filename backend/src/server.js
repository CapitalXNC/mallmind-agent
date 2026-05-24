import express from 'express';
import cors from 'cors';
import { runAgentQuery } from './agent/gemini.js';
import { connectDB } from './db/connection.js';
import { startSimulator } from './simulator/trafficSimulator.js';
import { runScenario, SCENARIOS } from './scenarios/scenarioRunner.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { agentModel, genaiBackend, genaiLocation, genaiProject } from './lib/genai.js';
import {
  getZonePerformance,
  getHourlyPattern,
  getIncidentSummary,
  getCampaignStats,
  getTrafficTrend
} from './analytics/aggregations.js';
import { embedIncident } from './tools/vectorSearch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// ── HEALTH ────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MallMind Agent API',
    timestamp: new Date()
  });
});

// ── AGENT ─────────────────────────────────────────────────────────
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

// ── SCENARIOS ─────────────────────────────────────────────────────
app.get('/api/scenarios', (req, res) => {
  res.json(Object.values(SCENARIOS).map(s => ({
    id: s.id,
    name: s.name,
    description: s.description
  })));
});

app.post('/api/scenarios/:id', async (req, res) => {
  const { id } = req.params;
  const { param, sessionId } = req.body;
  try {
    const result = await runScenario(id, param, sessionId);
    res.json(result);
  } catch (err) {
    console.error('Scenario error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── TRAFFIC ───────────────────────────────────────────────────────
app.get('/api/traffic', async (req, res) => {
  try {
    const db = await connectDB();
    const { zoneId, limit = 50 } = req.query;
    const query = zoneId ? { zoneId } : {};
    const data = await db.collection('foot_traffic')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── INCIDENTS ─────────────────────────────────────────────────────
app.get('/api/incidents', async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.query;
    const query = status ? { status } : {};
    const data = await db.collection('incidents')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CAMPAIGNS ─────────────────────────────────────────────────────
app.get('/api/campaigns', async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.query;
    const query = status ? { status } : {};
    const data = await db.collection('campaigns')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ZONES ─────────────────────────────────────────────────────────
app.get('/api/zones', async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.collection('zones').find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TENANTS ───────────────────────────────────────────────────────
app.get('/api/tenants', async (req, res) => {
  try {
    const db = await connectDB();
    const { zoneId } = req.query;
    const query = zoneId ? { zoneId } : {};
    const data = await db.collection('tenants').find(query).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AGENT LOGS ────────────────────────────────────────────────────
app.get('/api/logs', async (req, res) => {
  try {
    const db = await connectDB();
    const data = await db.collection('agent_logs')
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DASHBOARD ─────────────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    const db = await connectDB();

    const [latestTraffic, activeIncidents, activeCampaigns, recentLogs, zones, tenants] = await Promise.all([
      // Latest reading per zone using aggregation
      db.collection('foot_traffic').aggregate([
        { $sort: { timestamp: -1 } },
        { $group: { _id: '$zoneId', latest: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$latest' } },
        { $sort: { zoneId: 1 } }
      ]).toArray(),

      // All open or in-progress incidents
      db.collection('incidents')
        .find({ status: { $in: ['open', 'in_progress'] } })
        .sort({ createdAt: -1 })
        .toArray(),

      // All active campaigns
      db.collection('campaigns')
        .find({ status: 'active' })
        .sort({ createdAt: -1 })
        .toArray(),

      // Last 10 agent actions
      db.collection('agent_logs')
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),

      // All zones
      db.collection('zones').find({}).toArray(),

      // All tenants
      db.collection('tenants').find({}).toArray()
    ]);

    // Compute mall-wide summary
    const totalOccupancy = latestTraffic.reduce((sum, z) => sum + (z.count || 0), 0);
    const totalCapacity = latestTraffic.reduce((sum, z) => sum + (z.capacity || 0), 0);
    const criticalZones = latestTraffic.filter(z => z.alertLevel === 'critical').map(z => z.zoneName);
    const highZones = latestTraffic.filter(z => z.alertLevel === 'high').map(z => z.zoneName);

    res.json({
      timestamp: new Date(),
      summary: {
        totalOccupancy,
        totalCapacity,
        mallOccupancyPct: totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
        criticalZones,
        highZones,
        activeIncidentCount: activeIncidents.length,
        activeCampaignCount: activeCampaigns.length
      },
      zones: latestTraffic,
      activeIncidents,
      activeCampaigns,
      recentAgentActions: recentLogs,
      allZones: zones,
      allTenants: tenants
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

// ── ANALYTICS ─────────────────────────────────────────────────────
app.get('/api/analytics/zones', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const data = await getZonePerformance(parseInt(hours));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/hourly/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { days = 7 } = req.query;
    const data = await getHourlyPattern(zoneId, parseInt(days));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/incidents', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await getIncidentSummary(parseInt(days));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/campaigns', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await getCampaignStats(parseInt(days));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/trend', async (req, res) => {
  try {
    const { zoneId } = req.query;
    const data = await getTrafficTrend(zoneId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Embed a specific incident for vector search
app.post('/api/incidents/:incidentId/embed', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const result = await embedIncident(incidentId);
    res.json({ success: !!result, incidentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


connectDB().then(() => {
  startSimulator(30);

  app.listen(PORT, () => {
    console.log(`MallMind API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`GenAI backend: ${genaiBackend} | model: ${agentModel}${genaiBackend === 'vertex' ? ` | project: ${genaiProject} | location: ${genaiLocation}` : ''}`);
    console.log(`Live traffic simulator running — new readings every 30s`);
  });
});
