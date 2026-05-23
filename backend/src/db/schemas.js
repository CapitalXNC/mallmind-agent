import { connectDB } from './connection.js';

export async function createCollectionsAndIndexes() {
  const db = await connectDB();

  const zones = db.collection('zones');
  await zones.createIndex({ zoneId: 1 }, { unique: true });

  const tenants = db.collection('tenants');
  await tenants.createIndex({ tenantId: 1 }, { unique: true });
  await tenants.createIndex({ zoneId: 1 });
  await tenants.createIndex({ category: 1 });

  const traffic = db.collection('foot_traffic');
  await traffic.createIndex({ zoneId: 1, timestamp: -1 });
  await traffic.createIndex({ timestamp: -1 });
  await traffic.createIndex({ alertLevel: 1 });

  const incidents = db.collection('incidents');
  await incidents.createIndex({ status: 1, createdAt: -1 });
  await incidents.createIndex({ zoneId: 1 });
  await incidents.createIndex({ type: 1 });

  const campaigns = db.collection('campaigns');
  await campaigns.createIndex({ status: 1 });
  await campaigns.createIndex({ targetZoneId: 1 });
  await campaigns.createIndex({ createdAt: -1 });

  const logs = db.collection('agent_logs');
  await logs.createIndex({ sessionId: 1 });
  await logs.createIndex({ createdAt: -1 });
  await logs.createIndex({ actionType: 1 });

  console.log('All collections and indexes created.');
  return db;
}