'use client';

import { Activity, Megaphone, ShieldAlert, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  summary: {
    totalOccupancy: number;
    totalCapacity: number;
    mallOccupancyPct: number;
    criticalZones?: string[];
    highZones?: string[];
    activeIncidentCount: number;
    activeCampaignCount: number;
  } | null | undefined;
  lastUpdated: Date | null;
}

interface Metric {
  label: string;
  value: string | number;
  detail: string;
  tone: string;
  Icon: LucideIcon;
  meter: number;
}

export default function MallSummary({ summary, lastUpdated }: Props) {
  if (!summary) return null;

  const {
    totalOccupancy,
    totalCapacity,
    mallOccupancyPct,
    criticalZones,
    highZones,
    activeIncidentCount,
    activeCampaignCount
  } = summary;

  const occupancyTone =
    mallOccupancyPct >= 90 ? 'text-red-300' :
    mallOccupancyPct >= 70 ? 'text-orange-300' :
    mallOccupancyPct >= 45 ? 'text-amber-200' :
    'text-emerald-300';

  const zoneDetail = [
    ...(criticalZones || []),
    ...(highZones || []).map((zone: string) => `${zone} high`)
  ].slice(0, 2).join(' / ');

  const metrics: Metric[] = [
    {
      label: 'Mall Occupancy',
      value: `${mallOccupancyPct}%`,
      detail: `${totalOccupancy.toLocaleString()} / ${totalCapacity.toLocaleString()} capacity`,
      tone: occupancyTone,
      Icon: Users,
      meter: mallOccupancyPct
    },
    {
      label: 'Critical Zones',
      value: criticalZones?.length || 0,
      detail: zoneDetail || 'No elevated pressure',
      tone: criticalZones?.length ? 'text-red-300' : 'text-emerald-300',
      Icon: ShieldAlert,
      meter: Math.min(((criticalZones?.length || 0) + (highZones?.length || 0)) * 24, 100)
    },
    {
      label: 'Active Incidents',
      value: activeIncidentCount,
      detail: activeIncidentCount > 0 ? 'Ops review required' : 'All zones clear',
      tone: activeIncidentCount > 0 ? 'text-orange-300' : 'text-emerald-300',
      Icon: Activity,
      meter: Math.min(activeIncidentCount * 18, 100)
    },
    {
      label: 'Live Campaigns',
      value: activeCampaignCount,
      detail: lastUpdated ? `Synced ${lastUpdated.toLocaleTimeString()}` : 'Awaiting sync',
      tone: activeCampaignCount > 0 ? 'text-[#bda5ff]' : 'text-[#8f879d]',
      Icon: Megaphone,
      meter: Math.min(activeCampaignCount * 25, 100)
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, detail, tone, Icon, meter }, index) => (
        <div
          key={label}
          className="panel-edge click-adapt panel-enter border border-[#241d34] bg-[#09080d]/95 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          style={{ animationDelay: `${index * 55}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8f879d]">
                {label}
              </p>
              <p className={`mt-3 text-3xl font-semibold tracking-tight ${tone}`}>
                {value}
              </p>
            </div>
            <div className="grid h-9 w-9 shrink-0 place-items-center border border-[#2f2940] bg-[#120d1d] text-[#a98cff]">
              <Icon size={17} strokeWidth={1.8} />
            </div>
          </div>

          <p className="mt-3 truncate text-xs text-[#8f879d]" title={detail}>
            {detail}
          </p>

          <div className="mt-4 h-1.5 w-full overflow-hidden bg-[#171321]">
            <div
              className="meter-fill h-full bg-[#8b5cf6]"
              style={{ width: `${Math.max(6, Math.min(meter, 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
