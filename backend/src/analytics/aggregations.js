import { connectDB } from '../db/connection.js';

// Zone performance over last N hours
export async function getZonePerformance(hours = 24) {
  const db = await connectDB();
  const since = new Date(Date.now() - hours * 3600 * 1000);

  return db.collection('foot_traffic').aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: '$zoneId',
        zoneName: { $first: '$zoneName' },
        avgOccupancy: { $avg: '$occupancyPct' },
        maxOccupancy: { $max: '$occupancyPct' },
        minOccupancy: { $min: '$occupancyPct' },
        avgCount: { $avg: '$count' },
        peakCount: { $max: '$count' },
        totalReadings: { $sum: 1 },
        surgeCount: { $sum: { $cond: ['$isSurge', 1, 0] } },
        criticalCount: { $sum: { $cond: [{ $eq: ['$alertLevel', 'critical'] }, 1, 0] } },
        highCount: { $sum: { $cond: [{ $eq: ['$alertLevel', 'high'] }, 1, 0] } }
      }
    },
    {
      $addFields: {
        avgOccupancy: { $round: ['$avgOccupancy', 1] },
        avgCount: { $round: ['$avgCount', 0] },
        riskScore: {
          $round: [{
            $add: [
              { $multiply: ['$criticalCount', 3] },
              { $multiply: ['$highCount', 1] },
              { $multiply: ['$surgeCount', 2] }
            ]
          }, 0]
        }
      }
    },
    { $sort: { riskScore: -1 } }
  ]).toArray();
}

// Hourly traffic pattern for a zone
export async function getHourlyPattern(zoneId, days = 7) {
  const db = await connectDB();
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);

  return db.collection('foot_traffic').aggregate([
    { $match: { zoneId, timestamp: { $gte: since } } },
    {
      $group: {
        _id: { hour: { $hour: '$timestamp' } },
        avgCount: { $avg: '$count' },
        avgOccupancy: { $avg: '$occupancyPct' },
        surges: { $sum: { $cond: ['$isSurge', 1, 0] } }
      }
    },
    {
      $addFields: {
        hour: '$_id.hour',
        avgCount: { $round: ['$avgCount', 0] },
        avgOccupancy: { $round: ['$avgOccupancy', 1] }
      }
    },
    { $sort: { hour: 1 } }
  ]).toArray();
}

// Mall-wide incident summary
export async function getIncidentSummary(days = 7) {
  const db = await connectDB();
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);

  const [byType, bySeverity, byZone, resolutionTime] = await Promise.all([
    db.collection('incidents').aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray(),

    db.collection('incidents').aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray(),

    db.collection('incidents').aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$zoneName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray(),

    db.collection('incidents').aggregate([
      {
        $match: {
          createdAt: { $gte: since },
          status: 'resolved',
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionMinutes: {
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] },
              60000
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionMinutes: { $avg: '$resolutionMinutes' },
          totalResolved: { $sum: 1 }
        }
      }
    ]).toArray()
  ]);

  return {
    byType,
    bySeverity,
    byZone,
    resolution: resolutionTime[0] || { avgResolutionMinutes: 0, totalResolved: 0 }
  };
}

// Campaign effectiveness
export async function getCampaignStats(days = 7) {
  const db = await connectDB();
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);

  return db.collection('campaigns').aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalReach: { $sum: '$metrics.reach' },
        totalRevenueImpact: { $sum: '$metrics.estimatedRevenueImpact' }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();
}

// Real-time traffic trend (last 2 hours, per zone)
export async function getTrafficTrend(zoneId) {
  const db = await connectDB();
  const since = new Date(Date.now() - 2 * 3600 * 1000);

  const query = zoneId ? { zoneId, timestamp: { $gte: since } } : { timestamp: { $gte: since } };

  return db.collection('foot_traffic').aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          zoneId: '$zoneId',
          zoneName: '$zoneName',
          minute: {
            $subtract: [
              { $toLong: '$timestamp' },
              { $mod: [{ $toLong: '$timestamp' }, 60000] }
            ]
          }
        },
        avgCount: { $avg: '$count' },
        alertLevel: { $last: '$alertLevel' }
      }
    },
    {
      $project: {
        zoneId: '$_id.zoneId',
        zoneName: '$_id.zoneName',
        timestamp: { $toDate: '$_id.minute' },
        avgCount: { $round: ['$avgCount', 0] },
        alertLevel: 1
      }
    },
    { $sort: { timestamp: 1 } }
  ]).toArray();
}