'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AnalyticsPanel() {
  const [zoneStats, setZoneStats] = useState<any[]>([]);
  const [incidentStats, setIncidentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [zones, incidents] = await Promise.all([
          fetch(`${API}/api/analytics/zones`).then(r => r.json()),
          fetch(`${API}/api/analytics/incidents`).then(r => r.json())
        ]);
        setZoneStats(zones);
        setIncidentStats(incidents);
      } catch (err) {
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm">
      Loading analytics...
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Zone Analytics · Last 24h
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left pb-2 font-medium">Zone</th>
              <th className="text-right pb-2 font-medium">Avg Occ%</th>
              <th className="text-right pb-2 font-medium">Peak Occ%</th>
              <th className="text-right pb-2 font-medium">Surges</th>
              <th className="text-right pb-2 font-medium">Critical</th>
              <th className="text-right pb-2 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {zoneStats.map((zone: any) => (
              <tr key={zone._id} className="text-gray-300">
                <td className="py-2 font-medium text-white">{zone.zoneName}</td>
                <td className="py-2 text-right">{zone.avgOccupancy}%</td>
                <td className="py-2 text-right">{zone.maxOccupancy}%</td>
                <td className="py-2 text-right text-purple-400">{zone.surgeCount}</td>
                <td className="py-2 text-right text-red-400">{zone.criticalCount}</td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    zone.riskScore > 10 ? 'bg-red-900 text-red-300' :
                    zone.riskScore > 5 ? 'bg-orange-900 text-orange-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {zone.riskScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {incidentStats && (
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total Incidents</p>
            <p className="text-lg font-bold text-white">
              {incidentStats.byType?.reduce((s: number, t: any) => s + t.count, 0) || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Resolved</p>
            <p className="text-lg font-bold text-green-400">
              {incidentStats.resolution?.totalResolved || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Avg Resolution</p>
            <p className="text-lg font-bold text-blue-400">
              {Math.round(incidentStats.resolution?.avgResolutionMinutes || 0)}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Top Zone</p>
            <p className="text-sm font-bold text-orange-400">
              {incidentStats.byZone?.[0]?._id || 'None'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}