'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, ClipboardList, Loader2, Send, TrendingDown, User, Users, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Message } from '../hooks/useAgent';

interface Props {
  messages: Message[];
  onSend: (msg: string) => void;
  onScenario: (id: string) => void;
  isThinking: boolean;
}

const QUICK_SCENARIOS: Array<{ id: string; label: string; Icon: LucideIcon }> = [
  { id: 'daily_briefing', label: 'Briefing', Icon: ClipboardList },
  { id: 'crowd_surge', label: 'Crowd Surge', Icon: Users },
  { id: 'revenue_alert', label: 'Revenue Alert', Icon: TrendingDown },
  { id: 'maintenance', label: 'Maintenance', Icon: Wrench }
];

const toolLabels: Record<string, string> = {
  get_weather_context: 'Weather checked',
  query_traffic: 'Traffic queried',
  get_tenants_by_zone: 'Tenants fetched',
  log_incident: 'Incident logged',
  trigger_campaign: 'Campaign triggered',
  update_incident_status: 'Incident updated',
  get_incident_history: 'History reviewed',
  find_similar_incidents: 'Similar incidents reviewed'
};

export default function AgentChat({ messages, onSend, onScenario, isThinking }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="scanline flex h-full min-h-0 flex-col border border-[#241d34] bg-[#09080d]/95">
      <div className="shrink-0 border-b border-[#241d34] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-9 w-9 place-items-center border border-[#5d3c86] bg-[#120d1d] text-[#d9c8ff]">
              <Bot size={17} strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 border border-[#09080d] bg-emerald-300" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
                MallMind Agent
              </h2>
              <p className="mt-1 text-xs text-[#7f768f]">Scenario runner and operations copilot</p>
            </div>
          </div>
          <span className="border border-emerald-500/30 bg-emerald-950/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Online
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {QUICK_SCENARIOS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onScenario(id)}
              disabled={isThinking}
              className="click-adapt flex items-center justify-center gap-2 border border-[#2b243a] bg-[#111019] px-2.5 py-2 text-xs font-medium text-[#c8c1d6] disabled:cursor-not-allowed disabled:opacity-40"
              title={`Run ${label}`}
            >
              <Icon size={13} />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] ${isUser ? 'order-2' : 'order-1'}`}>
                <div className={`mb-1 flex items-center gap-2 px-0.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="grid h-5 w-5 place-items-center border border-[#2b243a] bg-[#111019] text-[#8f879d]">
                    {isUser ? <User size={11} /> : <Bot size={11} />}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#655d72]">
                    {isUser ? 'Operator' : 'Agent'} / {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {msg.isLoading ? (
                  <div className="border border-[#2b243a] bg-[#111019] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-3 w-1 animate-pulse bg-[#8b5cf6]" />
                        <span className="h-3 w-1 animate-pulse bg-[#a78bfa] [animation-delay:120ms]" />
                        <span className="h-3 w-1 animate-pulse bg-[#c4b5fd] [animation-delay:240ms]" />
                      </div>
                      <span className="text-xs text-[#8f879d]">Agent is working</span>
                    </div>
                  </div>
                ) : (
                  <div className={`border px-4 py-3 ${
                    isUser
                      ? 'border-[#6d4ea0] bg-[#2a1744] text-white'
                      : 'border-[#2b243a] bg-[#111019] text-[#f1eef8]'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#2b243a] pt-3">
                        {[...new Set(msg.toolsUsed)].map(tool => (
                          <span
                            key={tool}
                            className="border border-[#3a2c52] bg-[#0b0910] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#a98cff]"
                          >
                            {toolLabels[tool] || tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-[#241d34] p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isThinking}
            placeholder="Ask MallMind anything..."
            rows={2}
            className="min-h-[52px] flex-1 resize-none border border-[#2b243a] bg-[#0b0910] px-3 py-3 text-sm text-white placeholder:text-[#655d72] focus:border-[#8b5cf6] focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="click-adapt grid w-14 shrink-0 place-items-center border border-[#6d4ea0] bg-[#24143a] text-[#f4f2ff] disabled:cursor-not-allowed disabled:opacity-40"
            title="Send message"
          >
            {isThinking ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>
      </div>
    </section>
  );
}
