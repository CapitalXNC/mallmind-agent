'use client';

import {
  Activity,
  BarChart3,
  Bot,
  Command,
  Database,
  LayoutDashboard,
  MapPin,
  Megaphone,
  ShieldCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import MallSummary from './MallSummary';
import ZoneGrid from './ZoneGrid';
import IncidentPanel from './IncidentPanel';
import CampaignFeed from './CampaignFeed';
import AgentChat from './AgentChat';
import WeatherBadge from './WeatherBadge';
import AnalyticsPanel from './AnalyticsPanel';
import type { Message } from '../hooks/useAgent';
import type { DashboardData } from '../hooks/useDashboard';

export type DashboardTab = 'overview' | 'zones' | 'operations' | 'analytics' | 'agent';

interface Props {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  messages: Message[];
  sendMessage: (msg: string) => void;
  triggerScenario: (id: string) => void;
  isThinking: boolean;
}

const TABS: Array<{ id: DashboardTab; label: string; Icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'zones', label: 'Zones', Icon: MapPin },
  { id: 'operations', label: 'Operations', Icon: Megaphone },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'agent', label: 'AI Agent', Icon: Bot }
];

function SectionHeader({
  title,
  subtitle,
  badge
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c93aa]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-[#655d72]">{subtitle}</p>
        )}
      </div>
      {badge && (
        <span className="border border-[#241d34] bg-[#09080d] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7f768f]">
          {badge}
        </span>
      )}
    </div>
  );
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`panel-edge border border-[#241d34] bg-[#09080d]/95 ${className}`}>
      {children}
    </div>
  );
}

export default function DashboardShell({
  data,
  loading,
  error,
  lastUpdated,
  messages,
  sendMessage,
  triggerScenario,
  isThinking
}: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const renderTabContent = () => {
    if (loading && !data) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-11 w-11 place-items-center border border-[#5d3c86] bg-[#100d18]">
              <Activity size={18} className="animate-pulse text-[#a78bfa]" />
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8f879d]">
              Connecting to live mall data
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-5 panel-enter">
            <SectionHeader
              title="Command Summary"
              subtitle="Real-time occupancy, incidents, and campaign posture"
              badge={lastUpdated ? `Synced ${lastUpdated.toLocaleTimeString()}` : undefined}
            />
            <MallSummary summary={data?.summary} lastUpdated={lastUpdated} />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Panel className="p-4">
                <SectionHeader title="Zone Snapshot" subtitle="Top pressure zones at a glance" />
                <ZoneGrid zones={data?.zones || []} compact />
              </Panel>
              <Panel className="p-4">
                <SectionHeader title="Active Incidents" subtitle="Requires ops attention" />
                <IncidentPanel incidents={data?.activeIncidents || []} embedded />
              </Panel>
            </div>
          </div>
        );

      case 'zones':
        return (
          <div className="space-y-5 panel-enter">
            <SectionHeader
              title="Live Zone Traffic"
              subtitle="Per-zone occupancy, capacity, and risk indicators"
              badge="Refresh / 30s"
            />
            <ZoneGrid zones={data?.zones || []} />
          </div>
        );

      case 'operations':
        return (
          <div className="space-y-5 panel-enter">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <SectionHeader title="Incident Management" subtitle="Open and in-progress alerts" />
                <IncidentPanel incidents={data?.activeIncidents || []} />
              </div>
              <div>
                <SectionHeader title="Campaign Control" subtitle="Active marketing and ops campaigns" />
                <CampaignFeed campaigns={data?.activeCampaigns || []} />
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="panel-enter">
            <SectionHeader
              title="Analytics & Demographics"
              subtitle="Aggregated incident, zone, and agent activity"
            />
            <AnalyticsPanel
              activeIncidents={data?.activeIncidents || []}
              activeCampaigns={data?.activeCampaigns || []}
              recentLogs={data?.recentAgentActions || []}
            />
          </div>
        );

      case 'agent':
        return (
          <div className="panel-enter h-[min(78vh,820px)]">
            <SectionHeader
              title="MallMind Agent"
              subtitle="Scenario runner and natural-language operations copilot"
              badge="Online"
            />
            <AgentChat
              messages={messages}
              onSend={sendMessage}
              onScenario={triggerScenario}
              isThinking={isThinking}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ops-grid min-h-screen text-white">
      <header className="sticky top-0 z-20 border-b border-[#241d34] bg-[#050407]/95 backdrop-blur-md">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center border border-[#5d3c86] bg-[#120d1d] text-[#d9c8ff] shadow-[0_0_28px_rgba(139,92,246,0.16)]">
                <Command size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-base font-semibold uppercase tracking-[0.32em] text-white md:text-lg">
                    MallMind
                  </h1>
                  <span className="border border-[#2f2940] bg-[#0b0910] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#a98cff]">
                    Ops Center
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8f879d]">
                  Westfield Grand Mall / Dallas, TX
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden items-center gap-2 border border-[#241d34] bg-[#09080d] px-3 py-2 text-xs text-[#8f879d] md:flex">
                <ShieldCheck size={14} className="text-[#8b5cf6]" />
                Protected
              </div>
              <div className="hidden items-center gap-2 border border-[#241d34] bg-[#09080d] px-3 py-2 text-xs text-[#8f879d] md:flex">
                <Database size={14} className="text-[#8b5cf6]" />
                Live feed
              </div>
              <WeatherBadge zones={data?.zones || []} />
            </div>
          </div>

          <nav
            className="tab-nav mt-4 flex gap-1 overflow-x-auto pb-0.5"
            role="tablist"
            aria-label="Dashboard sections"
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(id)}
                  className={`tab-btn click-adapt flex shrink-0 items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] ${
                    active
                      ? 'tab-btn-active border border-[#6d4ea0] bg-[#1a1028] text-white'
                      : 'border border-transparent text-[#8f879d] hover:border-[#2f2940] hover:bg-[#0b0910] hover:text-[#d4cfe6]'
                  }`}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-5 md:px-6 md:py-6">
        {error && (
          <div className="mb-5 border border-red-800 bg-red-950/70 p-4 text-sm text-red-200">
            Backend connection error: {error}. Make sure the backend server is running on port 3001.
          </div>
        )}
        {renderTabContent()}
      </main>
    </div>
  );
}
