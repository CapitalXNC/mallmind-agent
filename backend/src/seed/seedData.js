import { connectDB, closeDB } from '../db/connection.js';
import { createCollectionsAndIndexes } from '../db/schemas.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const zones = [
  {
    zoneId: 'zone-north',
    name: 'North Wing',
    floor: 1,
    type: 'retail',
    capacity: 800,
    coordinates: { x: 0, y: 80, width: 200, height: 160 },
    cameras: 8,
    entrances: ['main-north', 'parking-north']
  },
  {
    zoneId: 'zone-south',
    name: 'South Wing',
    floor: 1,
    type: 'retail',
    capacity: 750,
    coordinates: { x: 0, y: 280, width: 200, height: 160 },
    cameras: 7,
    entrances: ['main-south', 'parking-south']
  },
  {
    zoneId: 'zone-foodcourt',
    name: 'Food Court',
    floor: 2,
    type: 'dining',
    capacity: 600,
    coordinates: { x: 220, y: 160, width: 180, height: 180 },
    cameras: 12,
    entrances: ['escalator-a', 'escalator-b', 'elevator-main']
  },
  {
    zoneId: 'zone-entertainment',
    name: 'Entertainment Hub',
    floor: 2,
    type: 'entertainment',
    capacity: 500,
    coordinates: { x: 420, y: 80, width: 200, height: 180 },
    cameras: 10,
    entrances: ['escalator-c', 'cinema-entrance']
  },
  {
    zoneId: 'zone-central',
    name: 'Central Atrium',
    floor: 1,
    type: 'common',
    capacity: 1200,
    coordinates: { x: 200, y: 80, width: 220, height: 360 },
    cameras: 15,
    entrances: ['main-entrance', 'parking-east', 'parking-west']
  }
];

const tenants = [
  { tenantId: 't-001', name: 'Zara', zoneId: 'zone-north', category: 'fashion', floor: 1, unit: 'N-101', contact: { manager: 'Sarah Chen', phone: '555-0101', email: 'sarah.chen@zara-mall.com' }, monthlyRent: 8500, avgDailyRevenue: 4200 },
  { tenantId: 't-002', name: 'Apple Store', zoneId: 'zone-north', category: 'electronics', floor: 1, unit: 'N-102', contact: { manager: 'Mike Torres', phone: '555-0102', email: 'mtorres@apple-partner.com' }, monthlyRent: 14000, avgDailyRevenue: 18000 },
  { tenantId: 't-003', name: 'The Body Shop', zoneId: 'zone-north', category: 'beauty', floor: 1, unit: 'N-103', contact: { manager: 'Priya Patel', phone: '555-0103', email: 'ppatel@tbsmall.com' }, monthlyRent: 5200, avgDailyRevenue: 2100 },
  { tenantId: 't-004', name: 'Foot Locker', zoneId: 'zone-north', category: 'sports', floor: 1, unit: 'N-104', contact: { manager: 'James Wilson', phone: '555-0104', email: 'jwilson@footlocker.com' }, monthlyRent: 6800, avgDailyRevenue: 3400 },
  { tenantId: 't-005', name: 'H&M', zoneId: 'zone-south', category: 'fashion', floor: 1, unit: 'S-101', contact: { manager: 'Emma Davis', phone: '555-0105', email: 'edavis@hm-mall.com' }, monthlyRent: 9200, avgDailyRevenue: 5100 },
  { tenantId: 't-006', name: 'Sephora', zoneId: 'zone-south', category: 'beauty', floor: 1, unit: 'S-102', contact: { manager: 'Lucia Gomez', phone: '555-0106', email: 'lgomez@sephora.com' }, monthlyRent: 7800, avgDailyRevenue: 6200 },
  { tenantId: 't-007', name: 'GameStop', zoneId: 'zone-south', category: 'electronics', floor: 1, unit: 'S-103', contact: { manager: 'Chris Park', phone: '555-0107', email: 'cpark@gamestop.com' }, monthlyRent: 4500, avgDailyRevenue: 1800 },
  { tenantId: 't-008', name: 'Bath & Body Works', zoneId: 'zone-south', category: 'beauty', floor: 1, unit: 'S-104', contact: { manager: 'Nina Brown', phone: '555-0108', email: 'nbrown@bbw.com' }, monthlyRent: 5500, avgDailyRevenue: 2900 },
  { tenantId: 't-009', name: "McDonald's", zoneId: 'zone-foodcourt', category: 'fast-food', floor: 2, unit: 'F-201', contact: { manager: 'Tom Harris', phone: '555-0109', email: 'tharris@mcds.com' }, monthlyRent: 6000, avgDailyRevenue: 7800 },
  { tenantId: 't-010', name: 'Shake Shack', zoneId: 'zone-foodcourt', category: 'fast-casual', floor: 2, unit: 'F-202', contact: { manager: 'Aisha Johnson', phone: '555-0110', email: 'ajohnson@shakeshack.com' }, monthlyRent: 7200, avgDailyRevenue: 5600 },
  { tenantId: 't-011', name: 'Panda Express', zoneId: 'zone-foodcourt', category: 'fast-food', floor: 2, unit: 'F-203', contact: { manager: 'Kevin Lee', phone: '555-0111', email: 'klee@pandaex.com' }, monthlyRent: 5800, avgDailyRevenue: 4900 },
  { tenantId: 't-012', name: 'Starbucks', zoneId: 'zone-foodcourt', category: 'cafe', floor: 2, unit: 'F-204', contact: { manager: 'Rachel Kim', phone: '555-0112', email: 'rkim@sbux-mall.com' }, monthlyRent: 6500, avgDailyRevenue: 6100 },
  { tenantId: 't-013', name: 'Chipotle', zoneId: 'zone-foodcourt', category: 'fast-casual', floor: 2, unit: 'F-205', contact: { manager: 'Diego Reyes', phone: '555-0113', email: 'dreyes@chipotle.com' }, monthlyRent: 6200, avgDailyRevenue: 5300 },
  { tenantId: 't-014', name: 'AMC Theatres', zoneId: 'zone-entertainment', category: 'cinema', floor: 2, unit: 'E-201', contact: { manager: 'Sandra Fox', phone: '555-0114', email: 'sfox@amcmall.com' }, monthlyRent: 22000, avgDailyRevenue: 14000 },
  { tenantId: 't-015', name: 'Round One', zoneId: 'zone-entertainment', category: 'arcade', floor: 2, unit: 'E-202', contact: { manager: 'Hiro Tanaka', phone: '555-0115', email: 'htanaka@roundone.com' }, monthlyRent: 9500, avgDailyRevenue: 4800 },
  { tenantId: 't-016', name: 'Dave & Busters', zoneId: 'zone-entertainment', category: 'arcade', floor: 2, unit: 'E-203', contact: { manager: 'Mark Spencer', phone: '555-0116', email: 'mspencer@dbs.com' }, monthlyRent: 12000, avgDailyRevenue: 8900 },
  { tenantId: 't-017', name: 'Information Kiosk', zoneId: 'zone-central', category: 'services', floor: 1, unit: 'C-001', contact: { manager: 'Mall Ops', phone: '555-0000', email: 'ops@mallmind.com' }, monthlyRent: 0, avgDailyRevenue: 0 },
  { tenantId: 't-018', name: 'Pandora', zoneId: 'zone-central', category: 'jewelry', floor: 1, unit: 'C-101', contact: { manager: 'Olivia Stone', phone: '555-0118', email: 'ostone@pandora.com' }, monthlyRent: 7100, avgDailyRevenue: 3800 },
  { tenantId: 't-019', name: 'GNC', zoneId: 'zone-central', category: 'health', floor: 1, unit: 'C-102', contact: { manager: 'Ryan Adams', phone: '555-0119', email: 'radams@gnc.com' }, monthlyRent: 4800, avgDailyRevenue: 1600 },
  { tenantId: 't-020', name: 'Sprint Store', zoneId: 'zone-central', category: 'telecom', floor: 1, unit: 'C-103', contact: { manager: 'Tina Yu', phone: '555-0120', email: 'tyu@sprint.com' }, monthlyRent: 5400, avgDailyRevenue: 2200 }
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAlertLevel(count, capacity) {
  const pct = count / capacity;
  if (pct >= 0.9) return 'critical';
  if (pct >= 0.7) return 'high';
  if (pct >= 0.45) return 'normal';
  return 'low';
}

function generateFootTraffic() {
  const events = [];
  const now = new Date();

  const zoneProfiles = {
    'zone-north':         [20,15,10,8,6,10,30,80,150,280,350,380,420,400,380,350,300,280,250,200,180,120,80,40],
    'zone-south':         [18,12,8,6,5,8,25,70,140,260,320,360,390,370,350,330,280,260,230,190,160,110,70,35],
    'zone-foodcourt':     [5,3,2,1,1,2,5,20,60,120,300,520,580,560,400,200,180,450,520,400,280,150,80,20],
    'zone-entertainment': [10,8,5,4,3,5,10,30,80,120,150,180,200,220,260,300,380,420,480,500,460,350,200,60],
    'zone-central':       [30,20,15,10,8,12,40,100,200,380,500,560,600,580,540,500,460,420,380,320,280,200,140,60]
  };

  const zoneIds = Object.keys(zoneProfiles);

  for (let hoursAgo = 47; hoursAgo >= 0; hoursAgo -= 0.25) {
    const timestamp = new Date(now.getTime() - hoursAgo * 3600 * 1000);
    const hour = timestamp.getHours();
    const zoneId = zoneIds[Math.floor(Math.random() * zoneIds.length)];
    const zone = zones.find(z => z.zoneId === zoneId);
    const baseCount = zoneProfiles[zoneId][hour];
    const isSurge = Math.random() < 0.06;
    const noise = randomBetween(-20, 20);
    const surgeMultiplier = isSurge ? randomBetween(140, 180) / 100 : 1;
    const count = Math.max(0, Math.round((baseCount + noise) * surgeMultiplier));

    events.push({
      zoneId,
      zoneName: zone.name,
      timestamp,
      count,
      capacity: zone.capacity,
      occupancyPct: Math.round((count / zone.capacity) * 100),
      alertLevel: getAlertLevel(count, zone.capacity),
      isSurge,
      source: 'camera-system',
      metadata: {
        cameraCount: zone.cameras,
        confidence: randomBetween(92, 99)
      }
    });
  }

  return events;
}

const incidents = [
  {
    incidentId: 'inc-001',
    type: 'crowd_surge',
    zoneId: 'zone-foodcourt',
    zoneName: 'Food Court',
    title: 'Lunch rush crowd surge',
    description: 'Occupancy reached 94% during peak lunch hours. Queues extending into Central Atrium.',
    severity: 'high',
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 23 * 3600 * 1000),
    agentActions: ['Sent promo SMS to redirect traffic to South Wing tenants', 'Notified security to manage queue'],
    affectedTenants: ['t-009', 't-010', 't-011'],
    embedding: null
  },
  {
    incidentId: 'inc-002',
    type: 'maintenance',
    zoneId: 'zone-north',
    zoneName: 'North Wing',
    title: 'Escalator out of service',
    description: 'North Wing escalator B reported non-functional. Technician dispatched.',
    severity: 'medium',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000),
    resolvedAt: null,
    agentActions: ['Maintenance ticket #MT-2847 created', 'Signage update requested for affected area'],
    affectedTenants: ['t-001', 't-002', 't-003', 't-004'],
    embedding: null
  },
  {
    incidentId: 'inc-003',
    type: 'revenue_alert',
    zoneId: 'zone-south',
    zoneName: 'South Wing',
    title: 'South Wing below target — Tuesday afternoon',
    description: 'South Wing foot traffic 32% below Tuesday average. Revenue tracking low.',
    severity: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 2 * 3600 * 1000),
    agentActions: ['Triggered "Afternoon Deals" campaign for South Wing tenants', 'Posted to mall digital signage'],
    affectedTenants: ['t-005', 't-006', 't-007', 't-008'],
    embedding: null
  },
  {
    incidentId: 'inc-004',
    type: 'crowd_surge',
    zoneId: 'zone-entertainment',
    zoneName: 'Entertainment Hub',
    title: 'Post-movie crowd surge',
    description: 'Multiple screenings ended simultaneously. Entertainment Hub at 96% capacity.',
    severity: 'critical',
    status: 'resolved',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 47.5 * 3600 * 1000),
    agentActions: ['Alerted security to all exits', 'Sent crowd dispersal notification to Food Court tenants'],
    affectedTenants: ['t-014', 't-015', 't-016'],
    embedding: null
  }
];

const campaigns = [
  {
    campaignId: 'camp-001',
    title: 'Afternoon Deals — South Wing',
    type: 'traffic_boost',
    targetZoneId: 'zone-south',
    targetTenantIds: ['t-005', 't-006', 't-007', 't-008'],
    message: 'Exclusive afternoon deals in the South Wing! Up to 30% off at H&M, Sephora, and more. Today only, 2–6 PM.',
    channel: ['digital_signage', 'sms', 'mall_app'],
    status: 'completed',
    triggeredBy: 'agent',
    incidentId: 'inc-003',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    metrics: { reach: 1240, estimatedRevenueImpact: 3800 }
  },
  {
    campaignId: 'camp-002',
    title: 'Food Court Redirect — Lunch Rush',
    type: 'crowd_dispersal',
    targetZoneId: 'zone-south',
    targetTenantIds: ['t-005', 't-006'],
    message: 'Beat the Food Court rush! Grab lunch deals at South Wing restaurants with no wait. Limited time.',
    channel: ['digital_signage', 'mall_app'],
    status: 'completed',
    triggeredBy: 'agent',
    incidentId: 'inc-001',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    metrics: { reach: 890, estimatedRevenueImpact: 2100 }
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const db = await connectDB();

  console.log('Creating indexes...');
  await createCollectionsAndIndexes();

  const collections = ['zones', 'tenants', 'foot_traffic', 'incidents', 'campaigns', 'agent_logs'];
  for (const col of collections) {
    await db.collection(col).deleteMany({});
    console.log(`Cleared: ${col}`);
  }

  await db.collection('zones').insertMany(zones);
  console.log(`Seeded ${zones.length} zones`);

  await db.collection('tenants').insertMany(tenants);
  console.log(`Seeded ${tenants.length} tenants`);

  const trafficEvents = generateFootTraffic();
  await db.collection('foot_traffic').insertMany(trafficEvents);
  console.log(`Seeded ${trafficEvents.length} foot traffic events`);

  await db.collection('incidents').insertMany(incidents);
  console.log(`Seeded ${incidents.length} incidents`);

  await db.collection('campaigns').insertMany(campaigns);
  console.log(`Seeded ${campaigns.length} campaigns`);

  console.log('\nDay 1 complete. MongoDB Atlas is loaded and ready.');
  await closeDB();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});