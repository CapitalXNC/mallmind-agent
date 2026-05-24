'use client';

interface Zone {
  zoneId: string;
  zoneName: string;
  count: number;
  capacity: number;
  occupancyPct: number;
  alertLevel: string;
  isSurge: boolean;
  timestamp: string;
}

interface Props {
  zones: Zone[];
}

const alertConfig: Record<string, { bg: string; border: string; badge: string; bar: string }> = {
  critical: { bg: 'bg-red-950', border: 'border-red-500', badge: 'bg-red-500 text-white', bar: 'bg-red-500' },
  high:     { bg: 'bg-orange-950', border: 'border-orange-500', badge: 'bg-orange-500 text-white', bar: 'bg-orange-500' },
  normal:   { bg: 'bg-yellow-950', border: 'border-yellow-600', badge: 'bg-yellow-600 text-white', bar: 'bg-yellow-500' },
  low:      { bg: 'bg-gray-900', border: 'border-gray-700', badge: 'bg-green-700 text-white', bar: 'bg-green-500' }
};

const zoneIcons: Record<string, string> = {
  'zone-north': '🏬',
  'zone-south': '🏪',
  'zone-foodcourt': '🍔',
  'zone-entertainment': '🎬',
  'zone-central': '🏛️'
};

export default function ZoneGrid({ zones }: Props) {
  if (!zones || zones.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500">
        Waiting for live traffic data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {zones.map(zone => {
        const config = alertConfig[zone.alertLevel] || alertConfig.low;
        const icon = zoneIcons[zone.zoneId] || '📍';
        const barWidth = Math.min(zone.occupancyPct, 100);

        return (
          <div key={zone.zoneId} className={`${config.bg} border ${config.border} rounded-xl p-4 transition-all duration-500`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{zone.zoneName}</p>
                  <p className="text-xs text-gray-400">{zone.count} / {zone.capacity} people</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                  {zone.alertLevel.toUpperCase()}
                </span>
                {zone.isSurge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white font-medium animate-pulse">
                    SURGE
                  </span>
                )}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Occupancy</span>
                <span className="font-bold text-white">{zone.occupancyPct}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${config.bar}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-600">
              {new Date(zone.timestamp).toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}