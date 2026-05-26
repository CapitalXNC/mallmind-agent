'use client';

import { Mail, Megaphone, MessageSquare, Monitor, Radio, Route, Tag, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  crowd_dispersal: 'border-[#8b5cf6]/55 bg-[#24143a] text-[#d9c8ff]',
  traffic_boost: 'border-cyan-500/35 bg-cyan-950/25 text-cyan-200',
  promotion: 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200',
  emergency: 'border-red-500/50 bg-red-950/60 text-red-200'
};

const typeIcons: Record<string, LucideIcon> = {
  crowd_dispersal: Route,
  traffic_boost: Zap,
  promotion: Tag,
  emergency: Radio
};

const channelIcons: Record<string, LucideIcon> = {
  digital_signage: Monitor,
  sms: MessageSquare,
  mall_app: Megaphone,
  email: Mail
};

export default function CampaignFeed({ campaigns }: Props) {
  return (
    <section className="panel-edge click-adapt border border-[#241d34] bg-[#09080d]/95 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
            Active Campaigns
          </h2>
          <p className="mt-1 text-xs text-[#7f768f]">Autonomous messaging and routing</p>
        </div>
        <span className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
          campaigns.length > 0
            ? 'border-[#8b5cf6]/50 bg-[#24143a] text-[#d9c8ff]'
            : 'border-[#2b243a] bg-[#111019] text-[#8f879d]'
        }`}>
          {campaigns.length} live
        </span>
      </div>

      {campaigns.length === 0 ? (
        <div className="grid min-h-44 place-items-center border border-[#1c1726] bg-[#07060a] p-6 text-center">
          <div>
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center border border-[#8b5cf6]/35 bg-[#24143a] text-[#d9c8ff]">
              <Megaphone size={18} />
            </div>
            <p className="text-sm font-medium text-white">No active campaigns</p>
            <p className="mt-1 text-xs text-[#7f768f]">MallMind will activate campaigns when conditions change.</p>
          </div>
        </div>
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {campaigns.map((campaign, index) => {
            const typeColor = typeColors[campaign.type] || 'border-[#2b243a] bg-[#111019] text-[#c8c1d6]';
            const TypeIcon = typeIcons[campaign.type] || Megaphone;

            return (
              <article
                key={campaign.campaignId}
                className="panel-enter border border-[#2b243a] bg-[#0d0b13] p-3"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{campaign.title}</p>
                    <p className="mt-1 text-xs text-[#8f879d]">
                      {new Date(campaign.createdAt).toLocaleTimeString()} / {campaign.status}
                    </p>
                  </div>
                  <span className={`flex shrink-0 items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${typeColor}`}>
                    <TypeIcon size={11} />
                    {campaign.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-[#c8c1d6]">
                  {campaign.message}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {campaign.channel?.map(channel => {
                    const ChannelIcon = channelIcons[channel] || Radio;
                    return (
                      <span
                        key={channel}
                        className="flex items-center gap-1 border border-[#2b243a] bg-[#111019] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8f879d]"
                      >
                        <ChannelIcon size={11} />
                        {channel.replace(/_/g, ' ')}
                      </span>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
