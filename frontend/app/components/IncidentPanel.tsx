'use client';

import { CheckCircle2, Lock, TrendingDown, TriangleAlert, Users, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Incident {
  incidentId: string;
  type: string;
  title: string;
  severity: string;
  status: string;
  zoneName: string;
  createdAt: string;
  agentActions: string[];
}

interface Props {
  incidents: Incident[];
  embedded?: boolean;
}

const severityColors: Record<string, { border: string; text: string; chip: string }> = {
  critical: {
    border: 'border-red-500/60',
    text: 'text-red-200',
    chip: 'border-red-500/50 bg-red-950/70 text-red-200'
  },
  high: {
    border: 'border-orange-500/55',
    text: 'text-orange-200',
    chip: 'border-orange-500/50 bg-orange-950/70 text-orange-200'
  },
  medium: {
    border: 'border-amber-500/45',
    text: 'text-amber-100',
    chip: 'border-amber-500/40 bg-amber-950/45 text-amber-100'
  },
  low: {
    border: 'border-emerald-500/35',
    text: 'text-emerald-200',
    chip: 'border-emerald-500/30 bg-emerald-950/35 text-emerald-200'
  }
};

const typeIcons: Record<string, LucideIcon> = {
  crowd_surge: Users,
  maintenance: Wrench,
  revenue_alert: TrendingDown,
  security: Lock,
  other: TriangleAlert
};

export default function IncidentPanel({ incidents, embedded = false }: Props) {
  const body = incidents.length === 0 ? (
        <div className="grid min-h-44 place-items-center border border-[#1c1726] bg-[#07060a] p-6 text-center">
          <div>
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center border border-emerald-500/30 bg-emerald-950/25 text-emerald-200">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-sm font-medium text-white">No active incidents</p>
            <p className="mt-1 text-xs text-[#7f768f]">All zones are operating within tolerance.</p>
          </div>
        </div>
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {incidents.map((incident, index) => {
            const colors = severityColors[incident.severity] || severityColors.low;
            const Icon = typeIcons[incident.type] || typeIcons.other;
            return (
              <article
                key={incident.incidentId}
                className={`panel-enter border ${colors.border} bg-[#0d0b13] p-3`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center border ${colors.border} bg-[#120d1d] ${colors.text}`}>
                    <Icon size={15} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 text-sm font-semibold text-white">{incident.title}</p>
                      <span className="shrink-0 border border-[#2b243a] bg-[#111019] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#c8c1d6]">
                        {incident.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8f879d]">
                      {incident.zoneName} / {incident.severity.toUpperCase()}
                    </p>
                  </div>
                </div>

                {incident.agentActions?.length > 0 && (
                  <div className="mt-3 space-y-1 border-l border-[#2b243a] pl-3">
                    {incident.agentActions.slice(-2).map((action, actionIndex) => (
                      <p key={actionIndex} className="truncate text-xs text-[#8f879d]" title={action}>
                        {action}
                      </p>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs text-[#655d72]">
                  {new Date(incident.createdAt).toLocaleTimeString()}
                </p>
              </article>
            );
          })}
        </div>
      );

  if (embedded) {
    return <div>{body}</div>;
  }

  return (
    <section className="panel-edge click-adapt border border-[#241d34] bg-[#09080d]/95 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
            Active Incidents
          </h2>
          <p className="mt-1 text-xs text-[#7f768f]">Open operational alerts</p>
        </div>
        <span className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
          incidents.length > 0
            ? 'border-red-500/50 bg-red-950/60 text-red-200'
            : 'border-[#2b243a] bg-[#111019] text-[#8f879d]'
        }`}>
          {incidents.length} active
        </span>
      </div>
      {body}
    </section>
  );
}
