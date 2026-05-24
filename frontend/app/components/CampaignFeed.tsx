'use client';

interface Campaign {
  campaignId: string;
  title: string;
  type: string;
  message: string;
  channel: string[];
  status: string;
  createdAt: string;
}

interface Props {
  campaigns: Campaign[];
}

const typeColors: Record<string, string> = {
  crowd_dispersal: 'bg-purple-900 text-purple-300',
  traffic_boost: 'bg-blue-900 text-blue-300',
  promotion: 'bg-green-900 text-green-300',
  emergency: 'bg-red-900 text-red-300'
};

const channelIcons: Record<string, string> = {
  digital_signage: '📺',
  sms: '📱',
  mall_app: '📲',
  email: '📧'
};

export default function CampaignFeed({ campaigns }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Active Campaigns</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${campaigns.length > 0 ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>
          {campaigns.length} live
        </span>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-3xl mb-2">📢</span>
          <p className="text-sm text-gray-400">No active campaigns</p>
          <p className="text-xs text-gray-600 mt-1">Agent will trigger campaigns automatically</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-80">
          {campaigns.map(campaign => {
            const typeColor = typeColors[campaign.type] || 'bg-gray-800 text-gray-300';
            return (
              <div key={campaign.campaignId} className="border border-gray-700 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-white">{campaign.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeColor}`}>
                    {campaign.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{campaign.message}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {campaign.channel?.map(ch => (
                      <span key={ch} className="text-xs bg-gray-800 px-2 py-0.5 rounded">
                        {channelIcons[ch] || '📡'} {ch.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {new Date(campaign.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}