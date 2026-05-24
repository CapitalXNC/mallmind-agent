'use client';

interface Props {
  summary: any;
  lastUpdated: Date | null;
}

export default function MallSummary({ summary, lastUpdated }: Props) {
  if (!summary) return null;

  const { totalOccupancy, totalCapacity, mallOccupancyPct, criticalZones, highZones, activeIncidentCount, activeCampaignCount } = summary;

  const getOccupancyColor = (pct: number) => {
    if (pct >= 90) return 'text-red-400';
    if (pct >= 70) return 'text-orange-400';
    if (pct >= 45) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mall Occupancy</p>
        <p className={`text-3xl font-bold ${getOccupancyColor(mallOccupancyPct)}`}>{mallOccupancyPct}%</p>
        <p className="text-xs text-gray-500 mt-1">{totalOccupancy.toLocaleString()} / {totalCapacity.toLocaleString()}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Critical Zones</p>
        <p className="text-3xl font-bold text-red-400">{criticalZones?.length || 0}</p>
        <p className="text-xs text-gray-500 mt-1">{criticalZones?.join(', ') || 'None'}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Incidents</p>
        <p className={`text-3xl font-bold ${activeIncidentCount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
          {activeIncidentCount}
        </p>
        <p className="text-xs text-gray-500 mt-1">{activeIncidentCount > 0 ? 'Requires attention' : 'All clear'}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Live Campaigns</p>
        <p className={`text-3xl font-bold ${activeCampaignCount > 0 ? 'text-blue-400' : 'text-gray-400'}`}>
          {activeCampaignCount}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
        </p>
      </div>
    </div>
  );
}