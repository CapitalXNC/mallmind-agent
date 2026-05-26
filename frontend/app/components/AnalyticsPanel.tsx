'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity, Blocks, Database, ListChecks, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Incident {
  incidentId?: string;
  type?: string;
  severity?: string;
  zoneName?: string;
}

interface Campaign {
  campaignId?: string;
  type?: string;
  channel?: string[];
}

interface LogEntry {
  sessionId?: string;
  actionType?: string;
  toolsUsed?: string[];
  createdAt?: string;
}

interface Props {
  activeIncidents?: Incident[];
  activeCampaigns?: Campaign[];
  recentLogs?: LogEntry[];
}

interface StatBucket {
  _id: string;
  count: number;
}

interface ZoneStat {
  _id: string;
  zoneName: string;
  avgOccupancy: number;
  maxOccupancy: number;
  surgeCount: number;
  criticalCount: number;
  riskScore: number;
}

interface IncidentStats {
  byType?: StatBucket[];
  bySeverity?: StatBucket[];
  byZone?: StatBucket[];
  resolution?: {
    totalResolved?: number;
    avgResolutionMinutes?: number;
  };
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#f87171',
  high: '#fb923c',
  medium: '#facc15',
  low: '#6ee7b7',
  none: '#514761'
};

const CHART_COLORS = ['#8b5cf6', '#a78bfa', '#6ee7b7', '#facc15', '#fb923c', '#f87171'];

function labelize(value: string | undefined) {
  if (!value) return 'Unknown';
  return value.replace(/_/g, ' ');
}

function sumBuckets(buckets: StatBucket[] = []) {
  return buckets.reduce((sum, bucket) => sum + (bucket.count || 0), 0);
}

function countBy<T>(items: T[], getKey: (item: T) => string | undefined): StatBucket[] {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item) || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => ({ _id: key, count }))
    .sort((a, b) => b.count - a.count);
}

function toolCounts(logs: LogEntry[]): StatBucket[] {
  const counts = logs.reduce<Record<string, number>>((acc, log) => {
    const tools = log.toolsUsed?.length ? log.toolsUsed : [log.actionType || 'agent_action'];
    tools.forEach(tool => {
      acc[tool] = (acc[tool] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => ({ _id: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export default function AnalyticsPanel({
  activeIncidents = [],
  activeCampaigns = [],
  recentLogs = []
}: Props) {
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([]);
  const [incidentStats, setIncidentStats] = useState<IncidentStats | null>(null);
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

  const severityData = useMemo(() => {
    const historical = incidentStats?.bySeverity || [];
    const live = countBy(activeIncidents, incident => incident.severity);
    const source = historical.length ? historical : live;
    return ['critical', 'high', 'medium', 'low'].map(severity => {
      const match = source.find(item => item._id === severity);
      return { name: severity, count: match?.count || 0 };
    });
  }, [activeIncidents, incidentStats]);

  const typeData = useMemo(() => (
    (incidentStats?.byType?.length ? incidentStats.byType : countBy(activeIncidents, incident => incident.type))
      .slice(0, 5)
      .map(item => ({ name: labelize(item._id), count: item.count }))
  ), [activeIncidents, incidentStats]);

  const zoneRiskData = useMemo(() => (
    zoneStats.slice(0, 6).map(zone => ({
      name: zone.zoneName,
      avg: zone.avgOccupancy,
      peak: zone.maxOccupancy,
      risk: zone.riskScore
    }))
  ), [zoneStats]);

  const zoneIncidentData = useMemo(() => (
    (incidentStats?.byZone || countBy(activeIncidents, incident => incident.zoneName))
      .slice(0, 5)
      .map(item => ({ name: labelize(item._id), count: item.count }))
  ), [activeIncidents, incidentStats]);

  const logData = useMemo(() => (
    toolCounts(recentLogs).map(item => ({ name: labelize(item._id), count: item.count }))
  ), [recentLogs]);

  const campaignData = useMemo(() => (
    countBy(activeCampaigns, campaign => campaign.type)
      .slice(0, 5)
      .map(item => ({ name: labelize(item._id), count: item.count }))
  ), [activeCampaigns]);

  const totalIncidents = incidentStats?.byType?.length
    ? sumBuckets(incidentStats.byType)
    : activeIncidents.length;
  const totalLogs = recentLogs.length;
  const resolved = incidentStats?.resolution?.totalResolved || 0;
  const avgResolution = Math.round(incidentStats?.resolution?.avgResolutionMinutes || 0);
  const topZone = incidentStats?.byZone?.[0]?._id || activeIncidents[0]?.zoneName || 'None';

  if (loading) {
    return (
      <section className="border border-[#241d34] bg-[#09080d]/95 p-6 text-center text-sm uppercase tracking-[0.22em] text-[#8f879d]">
        Loading analytics
      </section>
    );
  }

  return (
    <section className="panel-edge border border-[#241d34] bg-[#09080d]/95 p-4">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
            Analytics Demographics
          </h2>
          <p className="mt-1 text-xs text-[#7f768f]">
            Incident, alert, campaign, and agent-log distribution from live operations data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 border border-[#2b243a] bg-[#111019] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8f879d]">
            <Database size={12} />
            Mongo aggregations
          </span>
          <span className="flex items-center gap-1.5 border border-[#2b243a] bg-[#111019] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8f879d]">
            <Activity size={12} />
            60s analytics refresh
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 border border-[#1c1726] md:grid-cols-4">
        <Metric label="Total Incidents" value={totalIncidents} Icon={ShieldAlert} />
        <Metric label="Resolved" value={resolved} Icon={ListChecks} />
        <Metric label="Avg Resolution" value={`${avgResolution}m`} Icon={Activity} />
        <Metric label="Top Zone" value={topZone} Icon={Blocks} compact />
      </div>

      <div className="grid grid-cols-1 border border-[#1c1726] lg:grid-cols-2">
        <ChartCell title="Alert Severity" subtitle="Critical / high / medium / low mix">
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="count"
                nameKey="name"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
              >
                {severityData.map(entry => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || CHART_COLORS[0]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0b0910', border: '1px solid #3a2c52', color: '#f4f2ff' }}
                itemStyle={{ color: '#f4f2ff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <LegendList data={severityData} />
        </ChartCell>

        <ChartCell title="Incident Types" subtitle="Most common operational categories">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={typeData} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 24 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={96}
                tick={{ fill: '#9a93a9', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                contentStyle={{ background: '#0b0910', border: '1px solid #3a2c52', color: '#f4f2ff' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCell>

        <ChartCell title="Zone Risk" subtitle="Average occupancy, peak load, and risk score">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={zoneRiskData} margin={{ top: 10, right: 12, bottom: 20, left: -20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#9a93a9', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#241d34' }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={56}
              />
              <YAxis tick={{ fill: '#9a93a9', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                contentStyle={{ background: '#0b0910', border: '1px solid #3a2c52', color: '#f4f2ff' }}
              />
              <Bar dataKey="avg" fill="#6ee7b7" radius={0} />
              <Bar dataKey="peak" fill="#8b5cf6" radius={0} />
              <Bar dataKey="risk" fill="#fb923c" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCell>

        <ChartCell title="Agent Logs" subtitle="Tools and action mix from recent sessions">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={logData} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 38 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={126}
                tick={{ fill: '#9a93a9', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                contentStyle={{ background: '#0b0910', border: '1px solid #3a2c52', color: '#f4f2ff' }}
              />
              <Bar dataKey="count" fill="#a78bfa" radius={0} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[#8f879d]">
            <span className="border border-[#2b243a] bg-[#111019] px-2 py-1">Logs: {totalLogs}</span>
            <span className="border border-[#2b243a] bg-[#111019] px-2 py-1">Campaigns: {activeCampaigns.length}</span>
          </div>
        </ChartCell>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Distribution title="Incident Zone Distribution" items={zoneIncidentData} />
        <Distribution title="Campaign Type Distribution" items={campaignData} />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  Icon,
  compact = false
}: {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  compact?: boolean;
}) {
  return (
    <div className="border-r border-b border-[#1c1726] bg-[#07060a] p-4 last:border-r-0 md:border-b-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f768f]">{label}</p>
        <Icon size={14} className="text-[#8b5cf6]" />
      </div>
      <p className={`${compact ? 'truncate text-base' : 'text-2xl'} font-semibold text-white`} title={String(value)}>
        {value}
      </p>
    </div>
  );
}

function ChartCell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[310px] border-b border-[#1c1726] bg-[#07060a] p-4 odd:lg:border-r">
      <div className="mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">{title}</h3>
        <p className="mt-1 text-xs text-[#7f768f]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function LegendList({ data }: { data: Array<{ name: string; count: number }> }) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map(item => (
        <div key={item.name} className="flex items-center justify-between border border-[#2b243a] bg-[#111019] px-2 py-1 text-xs">
          <span className="flex items-center gap-2 text-[#c8c1d6]">
            <span className="h-2 w-2" style={{ background: SEVERITY_COLORS[item.name] || CHART_COLORS[0] }} />
            {labelize(item.name)}
          </span>
          <span className="text-[#8f879d]">{Math.round((item.count / total) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function Distribution({ title, items }: { title: string; items: Array<{ name: string; count: number }> }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="border border-[#1c1726] bg-[#07060a] p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-[#7f768f]">No distribution data yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-[#c8c1d6]">{item.name}</span>
                  <span className="text-[#8f879d]">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#171321]">
                  <div
                    className="h-full"
                    style={{ width: `${pct}%`, background: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
