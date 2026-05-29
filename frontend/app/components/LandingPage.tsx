'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowLeft, Command, Sparkles, Activity, Brain,
  Zap, TrendingUp, Shield, Bot, BarChart3, MapPin,
  CheckCircle2, Layers, Database, Cpu, Users, Eye,
  MessageSquare, Bell, Play, ChevronRight,
} from 'lucide-react';

interface Props {
  onEnter: () => void;
}

function useInView(threshold = 0.12) {
  const ref  = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const FEATURES = [
  {
    num: '01', key: 'feature-0',
    title: 'Real-Time Zone Intelligence',
    body: 'Live foot traffic readings across all 5 mall zones, updated every 30 seconds. Weather-adjusted occupancy data flags crowd surges, high-density zones, and surge events the moment they happen.',
    Icon: MapPin,
    tags: ['30s refresh', 'weather-adjusted', 'surge detection'],
  },
  {
    num: '02', key: 'feature-1',
    title: 'Autonomous Incident Detection',
    body: 'The auto-patrol system scans every zone every 5 minutes. When occupancy crosses HIGH or CRITICAL thresholds, incidents are logged automatically, affected tenants are identified, and dispersal campaigns are triggered — no human needed.',
    Icon: Shield,
    tags: ['auto-patrol', 'tenant alerting', 'auto-resolution'],
  },
  {
    num: '03', key: 'feature-2',
    title: 'Campaign Control Center',
    body: 'Every crowd surge or revenue alert automatically triggers a targeted marketing campaign on digital signage, SMS, and the mall app. Campaign effectiveness is tracked back to MongoDB Atlas in real time.',
    Icon: TrendingUp,
    tags: ['auto-triggered', 'digital signage', 'mall app'],
  },
  {
    num: '04', key: 'feature-3',
    title: 'Gemini-Powered AI Agent',
    body: 'Ask anything about your mall in plain English. The agent reasons across live traffic, weather, tenant data, and incident history — then takes real multi-step actions, writing every decision back to MongoDB Atlas with a full audit trail.',
    Icon: Bot,
    tags: ['Gemini 2.5', 'multi-step reasoning', 'full audit trail'],
  },
];

const CAPABILITIES = [
  { Icon: Activity,   label: 'Live Traffic Monitor',     desc: 'Zone occupancy updated every 30 seconds, weather-adjusted in real time' },
  { Icon: Brain,      label: 'AI Agent Chat',             desc: 'Gemini 2.5 reasons across all live data and takes real actions' },
  { Icon: Shield,     label: 'Auto-Patrol System',        desc: 'Autonomous incident detection, creation, and resolution every 5 minutes' },
  { Icon: TrendingUp, label: 'Campaign Engine',           desc: 'Auto-triggered campaigns on digital signage, SMS, and mall app' },
  { Icon: BarChart3,  label: 'Atlas Analytics',           desc: 'Aggregation pipelines compute zone risk scores and incident trends live' },
  { Icon: Zap,        label: 'Atlas Vector Search',       desc: 'Semantic similarity search finds relevant past incidents to inform responses' },
];

const STATS = [
  { value: '5',    label: 'Zones monitored' },
  { value: '30s',  label: 'Traffic refresh cadence' },
  { value: '7',    label: 'Agent tools' },
  { value: '100%', label: 'Autonomous operations' },
];

type IconComponent = (props: { size?: number; strokeWidth?: number; className?: string }) => any;

type Block =
  | { type: 'hero';  label: string; title: string; body: string }
  | { type: 'steps'; items: { num: string; title: string; body: string }[] }
  | { type: 'grid';  cols?: number; items: { Icon: IconComponent; title: string; body: string; bullets?: string[] }[] }
  | { type: 'roles'; items: { Icon: IconComponent; role: string; quote: string; tasks: string[] }[] }
  | { type: 'text';  heading: string; body: string };

interface SubPageDef { label: string; title: string; blocks: Block[] }

const SUB_PAGES: Record<string, SubPageDef> = {
  'how-it-works': {
    label: 'Overview',
    title: 'How MallMind works',
    blocks: [
      {
        type: 'hero',
        label: 'Simple by design',
        title: 'From live sensor data to autonomous action in seconds.',
        body: 'MallMind continuously ingests live foot traffic data, checks real-world weather, detects anomalies, and takes action — all without a human in the loop. When you do want to intervene, the AI agent is one message away.',
      },
      {
        type: 'steps',
        items: [
          {
            num: '01',
            title: 'Live traffic flows into MongoDB Atlas',
            body: 'A weather-adjusted traffic simulator inserts real occupancy readings for all 5 zones every 30 seconds directly into MongoDB Atlas. Readings reflect time-of-day patterns, real Dallas weather from OpenWeatherMap, and random surge events.',
          },
          {
            num: '02',
            title: 'Auto-patrol scans every zone every 5 minutes',
            body: 'A background patrol process continuously queries the latest traffic readings. When any zone crosses HIGH or CRITICAL occupancy thresholds, it automatically creates an incident document in Atlas, identifies all affected tenants, and triggers a crowd dispersal campaign.',
          },
          {
            num: '03',
            title: 'The AI agent reasons and acts on demand',
            body: 'Mall operators can ask the Gemini 2.5 agent anything in plain English. The agent calls up to 7 real tools — querying live traffic, checking weather, searching similar past incidents via Atlas Vector Search, logging new incidents, and triggering campaigns — all in a single reasoning chain.',
          },
          {
            num: '04',
            title: 'Every action is written back to Atlas',
            body: 'Incidents, campaigns, agent actions, and audit logs are all persisted as real documents in MongoDB Atlas in real time. The dashboard polls the API every 30 seconds so operators always see the current state of the mall.',
          },
        ],
      },
      {
        type: 'text',
        heading: 'Built on Google Cloud and MongoDB Atlas',
        body: 'The backend runs on Google Cloud Run with Gemini 2.5 Flash on Vertex AI. The frontend is deployed on Vercel. MongoDB Atlas powers all data storage, vector search, and aggregation pipelines. OpenWeatherMap provides real-time weather data for Dallas TX.',
      },
    ],
  },

  'platform': {
    label: 'Platform',
    title: 'The MallMind platform',
    blocks: [
      {
        type: 'hero',
        label: 'Architecture',
        title: 'Three layers. One unified system.',
        body: 'MallMind is built on three layers: a live data layer powered by MongoDB Atlas, an AI intelligence layer powered by Gemini 2.5 on Vertex AI, and an action layer that surfaces everything to operators in real time.',
      },
      {
        type: 'grid',
        cols: 3,
        items: [
          {
            Icon: Database,
            title: 'Data Layer — MongoDB Atlas',
            body: 'Six collections store every piece of operational data. The traffic simulator inserts live readings every 30 seconds. Atlas Vector Search indexes incident embeddings for semantic similarity lookup.',
            bullets: ['foot_traffic — live zone readings', 'incidents — auto and agent-created', 'campaigns — auto-triggered actions', 'agent_logs — full audit trail', 'zones + tenants — static config'],
          },
          {
            Icon: Cpu,
            title: 'Intelligence Layer — Gemini 2.5',
            body: 'The Gemini 2.5 Flash agent on Vertex AI orchestrates 7 tool calls per conversation turn. It reasons across live traffic, weather, tenant data, and vector-searched incident history.',
            bullets: ['get_weather_context (live OpenWeatherMap)', 'query_traffic (live Atlas query)', 'find_similar_incidents (Vector Search)', 'log_incident (writes to Atlas)', 'trigger_campaign (writes to Atlas)', 'update_incident_status', 'get_tenants_by_zone'],
          },
          {
            Icon: Layers,
            title: 'Action Layer — Cloud Run + Vercel',
            body: 'The Express API runs on Google Cloud Run with secrets managed by Google Secret Manager. The Next.js dashboard deploys on Vercel and polls the API every 30 seconds for fresh data.',
            bullets: ['Google Cloud Run (backend)', 'Vercel (frontend)', 'Google Secret Manager (secrets)', 'Google Artifact Registry (Docker)', 'Google Cloud Build (CI/CD)'],
          },
        ],
      },
      {
        type: 'text',
        heading: 'Production-grade deployment',
        body: 'MallMind is fully deployed on Google Cloud infrastructure. The backend container is built with Google Cloud Build, stored in Artifact Registry, and served via Cloud Run with a minimum of 1 instance always running. All secrets are stored in Google Secret Manager — never in code or environment files.',
      },
    ],
  },

  'capabilities': {
    label: 'Capabilities',
    title: 'Full capability breakdown',
    blocks: [
      {
        type: 'hero',
        label: 'What MallMind can do',
        title: 'Six capabilities, one platform.',
        body: 'Each capability is live and working in production. Here is exactly what each one does and how it uses MongoDB Atlas.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Activity,
            title: 'Live Traffic Monitor',
            body: 'Real-time occupancy for all 5 zones — North Wing, South Wing, Food Court, Entertainment Hub, and Central Atrium — updated every 30 seconds from a weather-adjusted simulator.',
            bullets: ['Zone occupancy % and people count', 'Alert levels: LOW / NORMAL / HIGH / CRITICAL', 'Surge event detection (3% probability per tick)', 'Weather multiplier from live OpenWeatherMap API', 'Stored in MongoDB foot_traffic collection'],
          },
          {
            Icon: Brain,
            title: 'Gemini 2.5 AI Agent',
            body: 'Ask anything about the mall in plain English. The agent calls real tools, queries live Atlas data, and writes real documents back to the database in every session.',
            bullets: ['7 callable tools per conversation', 'Multi-step reasoning chains (up to 10 iterations)', 'Atlas Vector Search for similar incident lookup', 'Full session audit logged to agent_logs collection', 'Powered by Gemini 2.5 Flash on Vertex AI'],
          },
          {
            Icon: Shield,
            title: 'Auto-Patrol Incident System',
            body: 'Background patrol runs every 5 minutes. Detects HIGH and CRITICAL zones, creates incident documents, attaches affected tenants, and auto-resolves when zones return to normal.',
            bullets: ['Scans all 5 zones every 5 minutes', 'Creates crowd_surge incidents automatically', 'Attaches affected tenant IDs from Atlas', 'Auto-triggers campaigns for CRITICAL zones', 'Auto-resolves incidents after 1 hour if zone normalizes'],
          },
          {
            Icon: TrendingUp,
            title: 'Campaign Engine',
            body: 'Campaigns are triggered automatically by auto-patrol or manually by the agent. Each campaign targets a specific zone and deploys across digital signage, SMS, and the mall app.',
            bullets: ['Types: crowd_dispersal, traffic_boost, promotion', 'Channels: digital_signage, sms, mall_app', 'Linked to triggering incident in Atlas', 'Auto-completed when incident resolves', 'Stored in MongoDB campaigns collection'],
          },
          {
            Icon: BarChart3,
            title: 'Atlas Aggregation Analytics',
            body: 'The analytics panel runs live MongoDB aggregation pipelines to compute zone performance metrics, risk scores, and incident summaries directly from the database.',
            bullets: ['Zone risk scores (criticals × 3 + surges × 2)', 'Avg/peak occupancy per zone over 24h', 'Incident counts by type, severity, and zone', 'Campaign stats by type', 'Hourly traffic patterns per zone'],
          },
          {
            Icon: Zap,
            title: 'Atlas Vector Search',
            body: 'Every incident is embedded using Gemini text-embedding-004 and stored as a 768-dimension vector in Atlas. The agent uses cosine similarity search to find relevant past incidents before taking action.',
            bullets: ['768-dimension Gemini embeddings', 'Cosine similarity search via Atlas Vector Search', 'Finds semantically similar past incidents', 'Surfaces proven response strategies', 'Index: incident_vector_index on incidents collection'],
          },
        ],
      },
    ],
  },

  'intelligence': {
    label: 'Intelligence',
    title: 'The MallMind intelligence engine',
    blocks: [
      {
        type: 'hero',
        label: 'AI & ML',
        title: 'Gemini 2.5 with real tools and real memory.',
        body: 'MallMind\'s intelligence layer is built on Gemini 2.5 Flash running on Vertex AI. The agent does not just answer questions — it executes multi-step tool chains that query live data, search vector memory, and write real actions back to MongoDB Atlas.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Eye,
            title: 'Auto-Patrol Detection',
            body: 'A background process runs every 5 minutes and queries the latest foot_traffic readings per zone using a MongoDB aggregation pipeline. Any zone at HIGH or CRITICAL occupancy automatically triggers the incident and campaign creation workflow.',
            bullets: ['MongoDB aggregation for latest reading per zone', 'HIGH threshold → incident created', 'CRITICAL threshold → incident + campaign created', 'Deduplication: no duplicate incidents within 30 min', 'Auto-resolution after 1 hour at normal occupancy'],
          },
          {
            Icon: TrendingUp,
            title: 'Weather-Adjusted Traffic',
            body: 'Every traffic reading is adjusted by a real-time weather multiplier fetched from OpenWeatherMap. Rain increases indoor traffic by 20%, extreme heat by 15%, and pleasant weather reduces it by 10%.',
            bullets: ['Live weather from OpenWeatherMap API (Dallas TX)', 'Rain/drizzle/thunderstorm: +20% multiplier', 'Extreme heat (>95°F): +15% multiplier', 'Pleasant weather (65–85°F clear): −10% multiplier', 'Weather refreshes every 10 simulator ticks'],
          },
          {
            Icon: MessageSquare,
            title: 'Gemini Tool Calling',
            body: 'The Gemini 2.5 agent uses function calling to execute real tools against live MongoDB Atlas data. Each tool call queries or writes to Atlas and returns structured JSON that Gemini uses to reason about its next step.',
            bullets: ['Up to 10 reasoning iterations per query', 'Each function response sent as separate content item', 'Tool results include real Atlas document data', 'Agent logs every session to agent_logs collection', 'System prompt grounds agent in Westfield Grand context'],
          },
          {
            Icon: Database,
            title: 'Vector Memory',
            body: 'Incidents are embedded using Gemini\'s text-embedding-004 model into 768-dimension vectors stored directly in MongoDB Atlas. The find_similar_incidents tool runs a cosine similarity search so the agent can learn from how past situations were handled.',
            bullets: ['Model: text-embedding-004 (Gemini)', '768-dimension vectors', 'Stored in incidents.embedding field', 'Atlas Vector Search index: incident_vector_index', 'Fallback to recency sort if index not ready'],
          },
        ],
      },
    ],
  },

  'operations': {
    label: 'Operations',
    title: 'MallMind for operations teams',
    blocks: [
      {
        type: 'hero',
        label: 'Who uses MallMind',
        title: 'Every role. One platform.',
        body: 'MallMind serves four distinct roles in a mall operations team. The AI agent and auto-patrol system handle routine monitoring autonomously — so your team focuses on decisions, not data.',
      },
      {
        type: 'roles',
        items: [
          {
            Icon: Users,
            role: 'Mall Operations Manager',
            quote: '"I need to know what\'s happening across the entire mall right now — not after a manual check."',
            tasks: [
              'Opens dashboard to see live occupancy across all 5 zones',
              'Reviews auto-generated incidents from overnight patrol',
              'Asks the AI agent for a full daily operations briefing',
              'Monitors active campaigns triggered by auto-patrol',
            ],
          },
          {
            Icon: Shield,
            role: 'Security Team',
            quote: '"We need to respond to a crowd surge before it becomes a safety issue."',
            tasks: [
              'Sees CRITICAL alert on Entertainment Hub in real time',
              'Views which tenants are affected (AMC, Round One, Dave & Busters)',
              'Checks agent-recommended dispersal actions',
              'Confirms incident resolution once zone normalizes',
            ],
          },
          {
            Icon: TrendingUp,
            role: 'Marketing Team',
            quote: '"We want to drive traffic to underperforming zones with targeted campaigns."',
            tasks: [
              'Asks agent to run the Revenue Alert scenario for South Wing',
              'Watches agent trigger a targeted promotion campaign',
              'Sees campaign appear in Active Campaigns feed instantly',
              'Reviews campaign reach and estimated revenue impact in Atlas',
            ],
          },
          {
            Icon: BarChart3,
            role: 'Executive / Ownership',
            quote: '"Show me which zones are performing and which ones need attention."',
            tasks: [
              'Reviews zone risk scores in the analytics panel',
              'Checks incident summary by zone and severity',
              'Asks agent for a full operational briefing with top 3 actions',
              'Verifies all data is live from MongoDB Atlas',
            ],
          },
        ],
      },
      {
        type: 'text',
        heading: 'Fully autonomous between operator sessions',
        body: 'MallMind does not require constant operator input. The auto-patrol system monitors all zones 24/7, creates incidents, triggers campaigns, and resolves situations autonomously. When operators do engage, the Gemini agent provides instant context from live data and historical patterns — so every decision is informed, not guessed.',
      },
    ],
  },

  'feature-0': {
    label: 'Zone Intelligence',
    title: 'Real-Time Zone Intelligence',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 01',
        title: 'Live occupancy across every zone, every 30 seconds.',
        body: 'MallMind tracks foot traffic across all 5 zones of Westfield Grand Mall in real time. Every reading is weather-adjusted using live Dallas weather data and stored directly in MongoDB Atlas.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Activity,
            title: 'What gets tracked',
            body: 'Each zone gets a new traffic reading every 30 seconds with full occupancy context.',
            bullets: ['People count and capacity', 'Occupancy % (count / capacity)', 'Alert level: LOW / NORMAL / HIGH / CRITICAL', 'Surge flag (3% random probability)', 'Weather multiplier applied to reading', 'Confidence score from simulated cameras'],
          },
          {
            Icon: Eye,
            title: 'How the data is generated',
            body: 'The live simulator uses published retail foot traffic research to model realistic hourly patterns per zone, adjusted by real-time weather.',
            bullets: ['Hourly baseline profiles per zone', 'Smooth interpolation between hours', 'OpenWeatherMap weather multiplier', '±12% random noise for realism', 'Random surge events at 3% probability', 'Inserted to MongoDB Atlas every 30 seconds'],
          },
          {
            Icon: Bell,
            title: 'Alert thresholds',
            body: 'Alert levels are computed automatically from occupancy percentage and drive the auto-patrol incident system.',
            bullets: ['≥90% occupancy → CRITICAL', '≥70% occupancy → HIGH', '≥45% occupancy → NORMAL', '<45% occupancy → LOW', 'CRITICAL zones trigger auto-patrol campaigns', 'HIGH zones trigger auto-patrol incidents'],
          },
          {
            Icon: BarChart3,
            title: 'Analytics and history',
            body: 'MongoDB aggregation pipelines compute zone performance metrics from the foot_traffic collection in real time.',
            bullets: ['Average occupancy over last 24 hours', 'Peak occupancy in period', 'Surge event count', 'Critical alert count', 'Risk score (weighted formula)', 'Hourly pattern analysis per zone'],
          },
        ],
      },
    ],
  },

  'feature-1': {
    label: 'Incident Detection',
    title: 'Autonomous Incident Detection & Response',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 02',
        title: 'Incidents detected, logged, and resolved without a human.',
        body: 'The MallMind auto-patrol system runs a full zone scan every 5 minutes. When thresholds are crossed, the entire incident lifecycle — detection, logging, campaign triggering, and resolution — happens autonomously.',
      },
      {
        type: 'steps',
        items: [
          {
            num: '01',
            title: 'Patrol scans all zones',
            body: 'Every 5 minutes, a MongoDB aggregation query fetches the latest foot_traffic reading per zone. The patrol compares occupancy percentage against HIGH (70%) and CRITICAL (90%) thresholds.',
          },
          {
            num: '02',
            title: 'Incident document created in Atlas',
            body: 'If a zone crosses a threshold and no recent incident exists for that zone, a new incident document is inserted into the incidents collection with type, severity, affected tenants, description, and timestamp.',
          },
          {
            num: '03',
            title: 'Campaign triggered for CRITICAL zones',
            body: 'For CRITICAL zones, the patrol also inserts a crowd_dispersal campaign document, identifying the lowest-occupancy zone as the redirect target and activating it on digital_signage and mall_app channels.',
          },
          {
            num: '04',
            title: 'Auto-resolution when zone normalizes',
            body: 'Incidents older than 1 hour are re-evaluated. If the zone has returned to LOW or NORMAL occupancy, the incident is marked resolved, the resolvedAt timestamp is set, and linked campaigns are completed — all in Atlas.',
          },
        ],
      },
      {
        type: 'text',
        heading: 'Agent-created incidents too',
        body: 'Beyond auto-patrol, the Gemini agent creates incidents when operators describe situations in the chat. The agent uses Atlas Vector Search to find similar past incidents first, then logs the new incident with full context, affected tenants, and recommended actions — all written to MongoDB Atlas in real time.',
      },
    ],
  },

  'feature-2': {
    label: 'Campaign Engine',
    title: 'Autonomous Campaign Control',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 03',
        title: 'Campaigns that trigger themselves.',
        body: 'MallMind\'s campaign engine responds to live conditions automatically. When the auto-patrol detects a critical crowd situation, a targeted dispersal campaign is created and activated in MongoDB Atlas within seconds — no human approval needed.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: TrendingUp,
            title: 'Auto-triggered campaigns',
            body: 'Auto-patrol creates campaigns automatically when CRITICAL occupancy is detected. The campaign message directs shoppers to the least-occupied zone.',
            bullets: ['Triggered by auto-patrol on CRITICAL alert', 'Redirect target: lowest occupancy zone', 'Message generated dynamically per situation', 'Channels: digital_signage + mall_app', 'Linked to triggering incident by incidentId'],
          },
          {
            Icon: Bot,
            title: 'Agent-triggered campaigns',
            body: 'The Gemini agent triggers campaigns as part of its multi-step reasoning chain. It selects campaign type, target zone, message, and channels based on context.',
            bullets: ['Types: crowd_dispersal, traffic_boost, promotion', 'Agent selects channels based on severity', 'Campaign linked to incident in Atlas', 'Agent updates incident with campaign action', 'Full reasoning chain logged to agent_logs'],
          },
          {
            Icon: Activity,
            title: 'Campaign lifecycle',
            body: 'Every campaign has a full lifecycle tracked in MongoDB Atlas from creation to completion.',
            bullets: ['Status: active → completed', 'Auto-completed when linked incident resolves', 'Reach and revenue impact tracked in metrics field', 'triggeredBy field: auto-patrol or agent', 'Full timestamp audit trail in Atlas'],
          },
          {
            Icon: CheckCircle2,
            title: 'Campaign analytics',
            body: 'MongoDB aggregation pipelines compute campaign performance stats grouped by type.',
            bullets: ['Count by campaign type', 'Total reach across all campaigns', 'Estimated revenue impact sum', 'Active vs completed breakdown', 'Available via /api/analytics/campaigns endpoint'],
          },
        ],
      },
    ],
  },

  'feature-3': {
    label: 'AI Agent',
    title: 'Gemini 2.5 AI Operations Agent',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 04',
        title: 'Ask your mall anything. Watch it act.',
        body: 'The MallMind AI agent is powered by Gemini 2.5 Flash on Vertex AI. It doesn\'t just answer questions — it calls real tools, queries live MongoDB Atlas data, and writes real actions back to the database in every single conversation.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: MessageSquare,
            title: 'Example queries you can ask',
            body: 'The agent understands operational context and handles complex, multi-step requests naturally.',
            bullets: [
              '"There\'s a crowd surge in the Food Court — what should we do?"',
              '"Give me a full operational briefing for the mall right now."',
              '"South Wing traffic is low — launch a campaign to drive shoppers there."',
              '"The North Wing escalator is broken — log it and identify affected tenants."',
              '"Find similar past incidents to what\'s happening in the Entertainment Hub."',
            ],
          },
          {
            Icon: Database,
            title: 'The 7 real tools it calls',
            body: 'Every tool makes a real API call to MongoDB Atlas or OpenWeatherMap. Nothing is simulated in the agent layer.',
            bullets: ['get_weather_context → OpenWeatherMap API', 'query_traffic → MongoDB foot_traffic collection', 'get_tenants_by_zone → MongoDB tenants collection', 'find_similar_incidents → Atlas Vector Search', 'log_incident → inserts to incidents collection', 'trigger_campaign → inserts to campaigns collection', 'update_incident_status → updates Atlas document'],
          },
          {
            Icon: CheckCircle2,
            title: 'What it writes to Atlas',
            body: 'Every agent session produces real MongoDB documents that persist in Atlas and appear on the dashboard immediately.',
            bullets: ['New incident documents with full metadata', 'New campaign documents with target zone and message', 'Incident status updates with action descriptions', 'Full session audit log in agent_logs collection', 'Incident embeddings for future vector searches'],
          },
          {
            Icon: Brain,
            title: 'Four built-in scenarios',
            body: 'One-click scenarios trigger pre-built agent workflows for the most common operational situations.',
            bullets: ['Daily Briefing — full mall status + top 3 actions', 'Crowd Surge — detect, log, campaign, resolve', 'Revenue Alert — identify low zone, launch promotion', 'Maintenance — log issue, identify tenants, recommend actions'],
          },
        ],
      },
    ],
  },
};

function SubPageView({ pageKey, onBack }: { pageKey: string; onBack: () => void }) {
  const page = SUB_PAGES[pageKey];
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#050407]">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 0%, rgba(139,92,246,0.18), transparent 65%),
            linear-gradient(180deg, #08060f 0%, #050407 55%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 10%, transparent 80%)',
        }}
      />

      <div className="relative z-10 border-b border-[#272235]/60 bg-[#050407]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 md:px-10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9a93a9] transition-colors hover:text-white"
          >
            <ArrowLeft size={13} />
            Back
          </button>
          <span className="text-[#272235]">/</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">{page.label}</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">{page.label}</p>
        <h1 className="mb-16 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
          {page.title}
        </h1>

        {page.blocks.map((block, bi) => {
          if (block.type === 'hero') {
            return (
              <div key={bi} className="mb-20 border-l-2 border-[#8b5cf6]/50 pl-8">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#8b5cf6]">{block.label}</p>
                <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">{block.title}</h2>
                <p className="max-w-2xl text-base font-light leading-relaxed text-[#9a93a9]">{block.body}</p>
              </div>
            );
          }

          if (block.type === 'steps') {
            return (
              <div key={bi} className="mb-20 space-y-0">
                {block.items.map((step, si) => (
                  <div key={si} className="group border-t border-[#272235]/60 py-8 last:border-b">
                    <div className="flex flex-col gap-5 md:flex-row md:gap-16">
                      <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#5c3d86] md:w-12 md:shrink-0">{step.num}</span>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-[#9a93a9]">{step.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'grid') {
            const cols = block.cols ?? 3;
            const gridClass = cols === 2
              ? 'grid grid-cols-1 gap-px bg-[#272235]/40 sm:grid-cols-2'
              : 'grid grid-cols-1 gap-px bg-[#272235]/40 md:grid-cols-3';
            return (
              <div key={bi} className={`mb-20 ${gridClass}`}>
                {block.items.map(({ Icon, title, body, bullets }, gi) => (
                  <div key={gi} className="panel-edge group bg-[#050407] p-8 transition-colors hover:bg-[#0b0910]">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[#272235] bg-[#0b0910] text-[#8b5cf6] transition-all duration-300 group-hover:border-[#5c3d86]">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
                    <p className="mb-4 text-xs leading-relaxed text-[#9a93a9]">{body}</p>
                    {bullets && (
                      <ul className="space-y-1.5">
                        {bullets.map((b, bui) => (
                          <li key={bui} className="flex items-start gap-2 text-[11px] text-[#655d72]">
                            <ChevronRight size={11} className="mt-0.5 shrink-0 text-[#5c3d86]" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'roles') {
            return (
              <div key={bi} className="mb-20 grid grid-cols-1 gap-px bg-[#272235]/40 sm:grid-cols-2">
                {block.items.map(({ Icon, role, quote, tasks }, ri) => (
                  <div key={ri} className="panel-edge group bg-[#050407] p-8 transition-colors hover:bg-[#0b0910]">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[#272235] bg-[#0b0910] text-[#8b5cf6] transition-all duration-300 group-hover:border-[#5c3d86]">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b5cf6]">{role}</p>
                    <p className="mb-5 text-sm italic leading-relaxed text-[#d4cfe6]">{quote}</p>
                    <ul className="space-y-2">
                      {tasks.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-xs text-[#9a93a9]">
                          <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-[#5c3d86]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'text') {
            return (
              <div key={bi} className="mb-20 border border-[#272235]/60 bg-[#0b0910]/40 p-10">
                <h3 className="mb-3 text-xl font-semibold text-white">{block.heading}</h3>
                <p className="text-sm leading-relaxed text-[#9a93a9]">{block.body}</p>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default function LandingPage({ onEnter }: Props) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mouse,       setMouse]       = useState({ x: 0.5, y: 0.4 });
  const [activePage,  setActivePage]  = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activePage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activePage]);

  const statsRef = useInView();
  const featRef  = useInView();
  const capRef   = useInView();
  const ctaRef   = useInView();

  const navLinks = ['Platform', 'Capabilities', 'Intelligence', 'Operations'] as const;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050407] text-white">

      {activePage && (
        <SubPageView pageKey={activePage} onBack={() => setActivePage(null)} />
      )}

      <div
        className="pointer-events-none fixed inset-0 transition-[background] duration-500"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(139,92,246,0.13), transparent 70%),
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.20), transparent 62%),
            radial-gradient(ellipse 45% 38% at 88% 65%, rgba(110,231,183,0.05), transparent 60%),
            linear-gradient(180deg, #08060f 0%, #050407 55%)
          `,
        }}
      />

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 85% 72% at 50% 28%, black 10%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 72% at 50% 28%, black 10%, transparent 82%)',
        }}
      />

      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background:     scrolled ? 'rgba(5,4,7,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom:   scrolled ? '1px solid rgba(139,92,246,0.10)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center border border-[#5d3c86]/60 bg-[#120d1d]/80 text-[#d9c8ff]">
              <Command size={15} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.30em] text-white/90">MallMind</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setActivePage(l.toLowerCase())}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9a93a9] transition-colors duration-150 hover:text-white"
              >
                {l}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={onEnter}
            className="flex items-center gap-2 border border-[#6d4ea0] bg-[#24143a] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-[#8b5cf6] hover:bg-[#2e1a4a] hover:shadow-[0_0_22px_rgba(139,92,246,0.28)]"
          >
            Enter Ops Center
            <ArrowRight size={12} />
          </button>
        </div>
      </header>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-36 text-center md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="mm-orb-1 absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#8b5cf6]/7 blur-3xl" />
          <div className="mm-orb-2 absolute right-[12%] top-[30%] h-52 w-52 rounded-full bg-[#6ee7b7]/4 blur-3xl" />
          <div className="mm-orb-3 absolute bottom-[18%] left-[35%] h-64 w-64 rounded-full bg-[#8b5cf6]/5 blur-3xl" />
        </div>

        <div className="landing-enter mb-7 flex items-center gap-2 border border-[#3a2c52]/60 bg-[#0b0910]/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#a98cff] backdrop-blur">
          <Sparkles size={11} />
          Built on Gemini 2.5 · MongoDB Atlas · Google Cloud
        </div>

        <h1 className="landing-enter landing-enter-delay-1 max-w-5xl text-5xl font-semibold leading-[1.06] tracking-[-0.025em] text-white md:text-7xl lg:text-8xl">
          The mall that runs
          <span className="block bg-gradient-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#6ee7b7] bg-clip-text text-transparent">
            itself.
          </span>
        </h1>

        <p className="landing-enter landing-enter-delay-2 mt-8 max-w-xl text-[15px] font-light leading-relaxed text-[#9a93a9] md:text-lg">
          Real-time zone intelligence, autonomous incident detection, and a Gemini-powered
          AI agent that takes real actions — all backed by MongoDB Atlas.
        </p>

        <div className="landing-enter landing-enter-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onEnter}
            className="group flex items-center gap-3 bg-[#8b5cf6] px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_44px_rgba(139,92,246,0.35)] transition-all duration-200 hover:bg-[#7c4de8] hover:shadow-[0_0_64px_rgba(139,92,246,0.50)]"
          >
            Enter Operations Center
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setActivePage('how-it-works')}
            className="flex items-center gap-2.5 border border-[#272235] px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-[#9a93a9] transition-all duration-200 hover:border-[#5c3d86] hover:text-white"
          >
            <Play size={12} />
            See how it works
          </button>
        </div>

        <div className="landing-enter landing-enter-delay-4 mt-6 flex items-center gap-2 text-[11px] text-[#4a4458]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7b7]" />
          Live · Westfield Grand Mall, Dallas TX · Auto-patrol active
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-[#272235] pt-2">
            <div className="mm-scroll-dot h-1.5 w-0.5 rounded-full bg-[#8b5cf6]" />
          </div>
        </div>
      </section>

      <div ref={statsRef.ref} className="relative border-y border-[#272235]/60 bg-[#0b0910]/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#272235]/50 md:grid-cols-4 md:divide-y-0">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="px-8 py-9 text-center transition-all duration-700"
              style={{
                opacity:          statsRef.inView ? 1 : 0,
                transform:        statsRef.inView ? 'translateY(0)' : 'translateY(18px)',
                transitionDelay:  `${i * 90}ms`,
              }}
            >
              <p className="text-3xl font-semibold text-[#c4b5fd] md:text-4xl">{value}</p>
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#655d72]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section ref={featRef.ref} className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: featRef.inView ? 1 : 0, transform: featRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Platform</p>
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
            Four pillars of autonomous mall operations
          </h2>
        </div>

        <div>
          {FEATURES.map(({ num, key, title, body, Icon, tags }, i) => (
            <div
              key={num}
              className="group border-t border-[#272235]/60 py-10 last:border-b transition-all duration-700"
              style={{
                opacity:         featRef.inView ? 1 : 0,
                transform:       featRef.inView ? 'translateX(0)' : 'translateX(-22px)',
                transitionDelay: `${i * 110 + 200}ms`,
              }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
                <div className="flex items-center gap-5 md:w-60 md:shrink-0">
                  <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#5c3d86]">{num}</span>
                  <div className="flex h-10 w-10 items-center justify-center border border-[#272235] bg-[#0b0910] text-[#8b5cf6] transition-all duration-300 group-hover:border-[#5c3d86] group-hover:bg-[#120d1d]">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-white md:hidden">{title}</h3>
                </div>

                <div className="flex-1">
                  <h3 className="mb-3 hidden text-xl font-semibold text-white md:block">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#9a93a9]">{body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="border border-[#272235] bg-[#0b0910] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#655d72]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage(key)}
                  className="hidden items-center gap-2 text-[#3a2c52] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#8b5cf6] md:flex"
                  aria-label={`Learn more about ${title}`}
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage(key)}
                  className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b5cf6] md:hidden"
                >
                  Learn more <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={capRef.ref} className="border-t border-[#272235]/60 bg-[#0b0910]/25 py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div
            className="mb-14 transition-all duration-700"
            style={{ opacity: capRef.inView ? 1 : 0, transform: capRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Capabilities</p>
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
              Six live capabilities, one platform
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#272235]/40 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ Icon, label, desc }, i) => (
              <div
                key={label}
                className="panel-edge group relative bg-[#050407] p-8 transition-all duration-500 hover:bg-[#0b0910]"
                style={{
                  opacity:         capRef.inView ? 1 : 0,
                  transform:       capRef.inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 70 + 200}ms`,
                }}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#272235] bg-[#0b0910] text-[#8b5cf6] transition-all duration-300 group-hover:border-[#5c3d86] group-hover:shadow-[0_0_16px_rgba(139,92,246,0.2)]">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">{label}</h3>
                <p className="text-xs leading-relaxed text-[#655d72]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:px-10">
        <blockquote>
          <p className="text-xl font-light italic leading-relaxed text-[#d4cfe6] md:text-2xl lg:text-3xl">
            &ldquo;Mall operations today are reactive, manual, and slow.
            MallMind makes them proactive, autonomous, and instant —
            one agent, live data, real actions.&rdquo;
          </p>
          <footer className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-[#4a4458]">
            — MallMind · Built on Google Cloud + MongoDB Atlas
          </footer>
        </blockquote>
      </section>

      <section ref={ctaRef.ref} className="border-t border-[#272235]/60 py-28">
        <div
          className="mx-auto max-w-3xl px-6 text-center transition-all duration-700 md:px-10"
          style={{ opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Live Demo</p>
          <h2 className="mb-6 text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
            See the agent act in real time.
          </h2>
          <p className="mb-10 text-base font-light text-[#9a93a9]">
            Live foot traffic. Real MongoDB Atlas data. Gemini 2.5 reasoning over it all.
            No demo data. No mock responses. Everything is live.
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center gap-3 bg-[#8b5cf6] px-11 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_60px_rgba(139,92,246,0.30)] transition-all duration-200 hover:bg-[#7c4de8] hover:shadow-[0_0_88px_rgba(139,92,246,0.48)]"
          >
            Enter Operations Center
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      <footer className="border-t border-[#272235]/60 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-7 w-7 place-items-center border border-[#5d3c86]/40 bg-[#120d1d]/80 text-[#d9c8ff]">
              <Command size={12} strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#4a4458]">MallMind</span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#4a4458]">
            Built on Gemini 2.5 · MongoDB Atlas · Google Cloud Run · Vercel
          </p>
        </div>
      </footer>

    </div>
  );
}