'use client';
import { useDashboard } from './hooks/useDashboard';
import { useAgent } from './hooks/useAgent';
import MallSummary from './components/MallSummary';
import ZoneGrid from './components/ZoneGrid';
import IncidentPanel from './components/IncidentPanel';
import CampaignFeed from './components/CampaignFeed';
import AgentChat from './components/AgentChat';
import WeatherBadge from './components/WeatherBadge';

export default function Home() {
  const { data, loading, error, lastUpdated } = useDashboard(30000);
  const { messages, sendMessage, triggerScenario, isThinking } = useAgent();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">�mall</span>
            <div>
              <h1 className="text-lg font-bold text-white">MallMind</h1>
              <p className="text-xs text-gray-500">Westfield Grand Mall · Dallas, TX · AI Operations Center</p>
            </div>
          </div>
          <WeatherBadge zones={data?.zones || []} />
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm">
            ⚠️ Backend connection error: {error}. Make sure the backend server is running on port 3001.
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Connecting to live mall data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary row */}
            <MallSummary summary={data?.summary} lastUpdated={lastUpdated} />

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: zones + incidents + campaigns */}
              <div className="xl:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Live Zone Traffic — updates every 30s
                  </h2>
                  <ZoneGrid zones={data?.zones || []} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IncidentPanel incidents={data?.activeIncidents || []} />
                  <CampaignFeed campaigns={data?.activeCampaigns || []} />
                </div>
              </div>

              {/* Right: agent chat */}
              <div className="xl:col-span-1 h-[700px]">
                <AgentChat
                  messages={messages}
                  onSend={sendMessage}
                  onScenario={triggerScenario}
                  isThinking={isThinking}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}