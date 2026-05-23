import { connectDB, closeDB } from '../db/connection.js';
import { createCollectionsAndIndexes } from '../db/schemas.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// ── STATIC CONFIG: ZONES ──────────────────────────────────────────
// These are real mall layout config — not sensor data, never changes
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

// ── STATIC CONFIG: TENANTS ────────────────────────────────────────
// Real tenant directory — static config, not sensor data
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

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const db = await connectDB();

  console.log('Creating indexes...');
  await createCollectionsAndIndexes();

  // Wipe all collections clean
  const collections = ['zones', 'tenants', 'foot_traffic', 'incidents', 'campaigns', 'agent_logs'];
  for (const col of collections) {
    await db.collection(col).deleteMany({});
    console.log(`Cleared: ${col}`);
  }

  // Only seed static config — no fake traffic, incidents or campaigns
  await db.collection('zones').insertMany(zones);
  console.log(`Seeded ${zones.length} zones (static layout config)`);

  await db.collection('tenants').insertMany(tenants);
  console.log(`Seeded ${tenants.length} tenants (static directory config)`);

  console.log(`
foot_traffic  → empty (live simulator will fill this every 30s)
incidents     → empty (agent will create these in real time)
campaigns     → empty (agent will create these in real time)
agent_logs    → empty (agent will write these in real time)

Day 3 seed complete.
Start the server to begin live data flow.
  `);

  await closeDB();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});