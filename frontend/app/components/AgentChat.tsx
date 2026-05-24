'use client';
import { useState, useRef, useEffect } from 'react';
import { Message } from '../hooks/useAgent';

interface Props {
  messages: Message[];
  onSend: (msg: string) => void;
  onScenario: (id: string) => void;
  isThinking: boolean;
}

const QUICK_SCENARIOS = [
  { id: 'daily_briefing', label: '📋 Daily Briefing' },
  { id: 'crowd_surge', label: '👥 Crowd Surge' },
  { id: 'revenue_alert', label: '📉 Revenue Alert' },
  { id: 'maintenance', label: '🔧 Maintenance' }
];

const toolLabels: Record<string, string> = {
  get_weather_context: '🌤 Checked weather',
  query_traffic: '📊 Queried live traffic',
  get_tenants_by_zone: '🏪 Fetched tenants',
  log_incident: '🚨 Logged incident',
  trigger_campaign: '📢 Triggered campaign',
  update_incident_status: '✅ Updated incident',
  get_incident_history: '📁 Reviewed history'
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">MallMind Agent</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {QUICK_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => onScenario(s.id)}
              disabled={isThinking}
              className="text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 px-2 py-1 rounded-lg transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              {msg.isLoading ? (
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-gray-500 ml-2">Agent is working...</span>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700 flex flex-wrap gap-1">
                      {[...new Set(msg.toolsUsed)].map(tool => (
                        <span key={tool} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                          {toolLabels[tool] || tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-600 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isThinking}
            placeholder="Ask MallMind anything... (Enter to send)"
            rows={2}
            className="flex-1 bg-gray-800 text-white text-sm placeholder-gray-500 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            {isThinking ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}