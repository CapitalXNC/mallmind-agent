import { connectDB } from '../db/connection.js';

export async function queryTraffic({ zoneId, limit = 10 }) {
  const db = await connectDB();
  const query = zoneId ? { zoneId } : {};
  const results = await db.collection('foot_traffic')
    .find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();

  return {
    success: true,
    count: results.length,
    data: results.map(r => ({
      zoneId: r.zoneId,
      zoneName: r.zoneName,
      timestamp: r.timestamp,
      count: r.count,
      capacity: r.capacity,
      occupancyPct: r.occupancyPct,
      alertLevel: r.alertLevel,
      isSurge: r.isSurge
    }))
  };
}

export async function getTenantsByZone({ zoneId }) {
  const db = await connectDB();
  const query = zoneId ? { zoneId } : {};
  const results = await db.collection('tenants')
    .find(query)
    .toArray();

  return {
    success: true,
    count: results.length,
    data: results.map(r => ({
      tenantId: r.tenantId,
      name: r.name,
      zoneId: r.zoneId,
      category: r.category,
      unit: r.unit,
      contact: r.contact,
      avgDailyRevenue: r.avgDailyRevenue
    }))
  };
}

export async function logIncident({ type, zoneId, title, description, severity, affectedTenantIds = [] }) {
  const db = await connectDB();

  const zone = await db.collection('zones').findOne({ zoneId });
  const incidentId = `inc-${Date.now()}`;

  const incident = {
    incidentId,
    type,
    zoneId,
    zoneName: zone?.name || zoneId,
    title,
    description,
    severity,
    status: 'open',
    createdAt: new Date(),
    resolvedAt: null,
    agentActions: [],
    affectedTenants: affectedTenantIds,
    embedding: null
  };

  await db.collection('incidents').insertOne(incident);

  return {
    success: true,
    incidentId,
    message: `Incident "${title}" logged successfully with severity: ${severity}`
  };
}

export async function getIncidentHistory({ zoneId, limit = 5, status }) {
  const db = await connectDB();
  const query = {};
  if (zoneId) query.zoneId = zoneId;
  if (status) query.status = status;

  const results = await db.collection('incidents')
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return {
    success: true,
    count: results.length,
    data: results.map(r => ({
      incidentId: r.incidentId,
      type: r.type,
      title: r.title,
      severity: r.severity,
      status: r.status,
      zoneName: r.zoneName,
      createdAt: r.createdAt,
      agentActions: r.agentActions
    }))
  };
}

export async function triggerCampaign({ title, type, targetZoneId, targetTenantIds = [], message, channel = ['digital_signage'], incidentId }) {
  const db = await connectDB();

  const campaignId = `camp-${Date.now()}`;

  const campaign = {
    campaignId,
    title,
    type,
    targetZoneId,
    targetTenantIds,
    message,
    channel,
    status: 'active',
    triggeredBy: 'agent',
    incidentId: incidentId || null,
    createdAt: new Date(),
    metrics: { reach: 0, estimatedRevenueImpact: 0 }
  };

  await db.collection('campaigns').insertOne(campaign);

  if (incidentId) {
    await db.collection('incidents').updateOne(
      { incidentId },
      { $push: { agentActions: `Campaign "${title}" triggered` } }
    );
  }

  return {
    success: true,
    campaignId,
    message: `Campaign "${title}" is now active on channels: ${channel.join(', ')}`
  };
}

export async function updateIncidentStatus({ incidentId, status, agentAction }) {
  const db = await connectDB();

  const update = {
    $set: { status },
    $push: { agentActions: agentAction }
  };

  if (status === 'resolved') {
    update.$set.resolvedAt = new Date();
  }

  await db.collection('incidents').updateOne({ incidentId }, update);

  return {
    success: true,
    message: `Incident ${incidentId} updated to status: ${status}`
  };
}

export async function logAgentAction({ sessionId, actionType, input, output, toolsUsed = [] }) {
  const db = await connectDB();

  await db.collection('agent_logs').insertOne({
    sessionId,
    actionType,
    input,
    output,
    toolsUsed,
    createdAt: new Date()
  });

  return { success: true };
}