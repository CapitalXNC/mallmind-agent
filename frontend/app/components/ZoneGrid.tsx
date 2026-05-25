'use client';

import { Clock3, Film, Landmark, MapPin, ShoppingBag, TrendingUp, Utensils, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  compact?: boolean;
}

const alertConfig: Record<string, { border: string; badge: string; bar: string; glow: string; text: string }> = {
  critical: {
    border: 'border-red-500/70',
    badge: 'border-red-500/50 bg-red-950/70 text-red-200',
    bar: 'bg-red-400',
    glow: 'shadow-[0_0_36px_rgba(248,113,113,0.1)]',
    text: 'text-red-200'
  },
  high: {
    border: 'border-orange-500/60',
    badge: 'border-orange-500/50 bg-orange-950/70 text-orange-200',
    bar: 'bg-orange-300',
    glow: 'shadow-[0_0_36px_rgba(251,146,60,0.08)]',
    text: 'text-orange-200'
  },
  normal: {
    border: 'border-amber-500/45',
    badge: 'border-amber-500/40 bg-amber-950/40 text-amber-100',
    bar: 'bg-amber-200',
    glow: '',
    text: 'text-amber-100'
  },
  low: {
    border: 'border-[#2b243a]',
    badge: 'border-emerald-500/30 bg-emerald-950/35 text-emerald-200',
    bar: 'bg-emerald-300',
    glow: '',
    text: 'text-emerald-200'
  }
};

const zoneIcons: Record<string, LucideIcon> = {
  'zone-north': ShoppingBag,
  'zone-south': ShoppingBag,
  'zone-foodcourt': Utensils,
  'zone-entertainment': Film,
  'zone-central': Landmark
};

function formatAlert(alertLevel: string) {
  return alertLevel.replace(/_/g, ' ').toUpperCase();
}

export default function ZoneGrid({ zones, compact = false }: Props) {
  if (!zones || zones.length === 0) {
    return (
      <div className="border border-[#241d34] bg-[#09080d]/95 p-6 text-center text-sm uppercase tracking-[0.22em] text-[#8f879d]">
        Waiting for live traffic data
      </div>
    );
  }

  const displayZones = compact
    ? [...zones].sort((a, b) => b.occupancyPct - a.occupancyPct).slice(0, 4)
    : zones;

  if (compact) {
    return (
      <div className="space-y-2">
        {displayZones.map((zone, index) => {
          const config = alertConfig[zone.alertLevel] || alertConfig.low;
          const Icon = zoneIcons[zone.zoneId] || MapPin;
          return (
            <div
              key={zone.zoneId}
              className={`panel-enter flex items-center gap-3 border ${config.border} bg-[#0d0b13] px-3 py-2.5`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center border border-[#2f2940] bg-[#120d1d] text-[#bda5ff]">
                <Icon size={14} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{zone.zoneName}</p>
                <p className="text-[11px] text-[#7f768f]">
                  {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-sm font-semibold ${config.text}`}>{zone.occupancyPct}%</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#655d72]">
                  {formatAlert(zone.alertLevel)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {displayZones.map((zone, index) => {
        const config = alertConfig[zone.alertLevel] || alertConfig.low;
        const Icon = zoneIcons[zone.zoneId] || MapPin;
        const barWidth = Math.min(zone.occupancyPct, 100);

        return (
          <div
            key={zone.zoneId}
            className={`panel-edge click-adapt panel-enter border ${config.border} ${config.glow} bg-[#09080d]/95 p-4`}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center border border-[#2f2940] bg-[#120d1d] text-[#bda5ff]">
                  <Icon size={17} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{zone.zoneName}</p>
                  <p className="mt-1 text-xs text-[#8f879d]">
                    {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()} people
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`border px-2 py-1 text-[10px] font-semibold tracking-[0.16em] ${config.badge}`}>
                  {formatAlert(zone.alertLevel)}
                </span>
                {zone.isSurge && (
                  <span className="flex items-center gap-1 border border-[#8b5cf6]/60 bg-[#26143f] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d9c8ff]">
                    <TrendingUp size={11} />
                    Surge
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 uppercase tracking-[0.18em] text-[#7f768f]">
                  <Users size={12} />
                  Occupancy
                </span>
                <span className={`font-semibold ${config.text}`}>{zone.occupancyPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden bg-[#171321]">
                <div
                  className={`meter-fill h-full transition-all duration-700 ${config.bar}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-[#655d72]">
              <Clock3 size={12} />
              {new Date(zone.timestamp).toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
