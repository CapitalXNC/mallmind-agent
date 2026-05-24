'use client';

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
}

const severityColors: Record<string, string> = {
  critical: 'text-red-400 border-red-800',
  high: 'text-orange-400 border-orange-800',
  medium: 'text-yellow-400 border-yellow-800',
  low: 'text-green-400 border-green-800'
};

const typeIcons: Record<string, string> = {
  crowd_surge: '👥',
  maintenance: '🔧',
  revenue_alert: '📉',
  security: '🔒',
  other: '⚠️'
};

export default function IncidentPanel({ incidents }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Active Incidents</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${incidents.length > 0 ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-400'}`}>
          {incidents.length} active
        </span>
      </div>

      {incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-3xl mb-2">✅</span>
          <p className="text-sm text-gray-400">No active incidents</p>
          <p className="text-xs text-gray-600 mt-1">All zones operating normally</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-80">
          {incidents.map(incident => {
            const colors = severityColors[incident.severity] || severityColors.low;
            const icon = typeIcons[incident.type] || typeIcons.other;
            return (
              <div key={incident.incidentId} className={`border rounded-lg p-3 ${colors}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-base">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{incident.title}</p>
                    <p className="text-xs text-gray-400">{incident.zoneName} · {incident.severity.toUpperCase()}</p>
                  </div>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full shrink-0">
                    {incident.status}
                  </span>
                </div>
                {incident.agentActions?.length > 0 && (
                  <div className="ml-6">
                    {incident.agentActions.slice(-2).map((action, i) => (
                      <p key={i} className="text-xs text-gray-500 truncate">→ {action}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-700 mt-1 ml-6">
                  {new Date(incident.createdAt).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}