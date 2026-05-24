'use client';

interface Props {
  zones: any[];
}

export default function WeatherBadge({ zones }: Props) {
  const hasLiveData = zones && zones.length > 0;
  const source = hasLiveData ? zones[0]?.source : null;

  return (
    <div className="flex items-center gap-3">
      {hasLiveData && (
        <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Live data · {source || 'simulator'}</span>
        </div>
      )}
    </div>
  );
}