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


// ─── scroll-in hook ──────────────────────────────────────────────────────────
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


// ─── static data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: '01', key: 'feature-0',
    title: 'Real-Time Zone Intelligence',
    body: 'Monitor foot traffic, dwell time, and crowd density across every zone with 30-second refresh cycles. Spot patterns before they become problems.',
    Icon: MapPin,
    tags: ['crowd density', 'dwell time', 'heatmaps'],
  },
  {
    num: '02', key: 'feature-1',
    title: 'Incident Detection & Response',
    body: 'AI flags anomalies the moment they surface — spills, congestion, security events. Automated alerts route to the right team instantly.',
    Icon: Shield,
    tags: ['anomaly detection', 'auto-routing', 'real-time alerts'],
  },
  {
    num: '03', key: 'feature-2',
    title: 'Campaign Intelligence Engine',
    body: 'Correlate promotions with foot traffic impact. Measure which campaigns drive conversions and optimize spend across anchor stores and pop-ups.',
    Icon: TrendingUp,
    tags: ['ROI tracking', 'conversion lift', 'spend optimization'],
  },
  {
    num: '04', key: 'feature-3',
    title: 'AI Operations Agent',
    body: 'Ask anything about your mall in plain language. The agent reasons across all data streams — zones, incidents, campaigns — and surfaces actionable insights.',
    Icon: Bot,
    tags: ['natural language', 'multi-source reasoning', 'action plans'],
  },
];


const CAPABILITIES = [
  { Icon: Activity,   label: 'Live Traffic Monitor',     desc: 'Zone-level occupancy updated every 30 seconds' },
  { Icon: Brain,      label: 'AI Agent Chat',             desc: 'Ask questions, get operational answers instantly' },
  { Icon: Shield,     label: 'Incident Command',          desc: 'Detect, triage, and resolve faster than ever' },
  { Icon: TrendingUp, label: 'Campaign Analytics',        desc: 'Tie every promotion to real foot traffic outcomes' },
  { Icon: BarChart3,  label: 'Performance Dashboards',    desc: 'Executive-ready reports generated automatically' },
  { Icon: Zap,        label: 'Instant Alerts',            desc: 'Push notifications the moment thresholds are crossed' },
];


const STATS = [
  { value: '12+',   label: 'Zones monitored' },
  { value: '30s',   label: 'Data refresh cadence' },
  { value: '8',     label: 'Agent tools' },
  { value: '99.9%', label: 'Uptime SLA' },
];


// ─── sub-page content ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        title: 'From sensor to decision in seconds.',
        body: 'MallMind sits on top of your existing infrastructure and turns raw sensor data into clear operational guidance — no manual analysis, no lag.',
      },
      {
        type: 'steps',
        items: [
          {
            num: '01',
            title: 'Connect your mall',
            body: 'Plug in your existing cameras, WiFi probes, door counters, and POS systems. MallMind ingests everything through a unified data adapter — no rip-and-replace required.',
          },
          {
            num: '02',
            title: 'AI analyzes in real-time',
            body: 'The intelligence engine processes every data stream simultaneously, detecting crowd patterns, anomalies, and campaign signals as they happen — refreshing every 30 seconds.',
          },
          {
            num: '03',
            title: 'Insights surface instantly',
            body: 'The live dashboard shows zone occupancy, active incidents, campaign performance, and agent recommendations — all in one view, always up to date.',
          },
          {
            num: '04',
            title: 'Your team acts with confidence',
            body: 'Ask the AI agent anything in plain English. Alerts route automatically to the right team. Reports generate themselves. Your ops team spends time acting, not analyzing.',
          },
        ],
      },
      {
        type: 'text',
        heading: 'Built for real retail environments',
        body: 'MallMind is designed for the messiness of physical retail — unreliable sensors, peak traffic spikes, multi-floor layouts, and hundreds of tenants. It handles all of it gracefully so your team never has to.',
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
        body: 'MallMind is built on a three-layer architecture: a real-time data layer, an AI intelligence layer, and an action layer that surfaces insights to your team.',
      },
      {
        type: 'grid',
        cols: 3,
        items: [
          {
            Icon: Database,
            title: 'Data Layer',
            body: 'Ingests from cameras, WiFi probes, door counters, POS systems, and third-party APIs. Normalizes and streams everything in real-time.',
            bullets: ['30-second refresh cycles', 'Multi-source fusion', 'Historical storage for trend analysis', 'Handles sensor dropout gracefully'],
          },
          {
            Icon: Cpu,
            title: 'Intelligence Layer',
            body: 'The AI engine runs continuously across all data streams, detecting anomalies, correlating campaigns, and maintaining a live model of your mall.',
            bullets: ['Anomaly detection (ML-based)', 'Campaign correlation engine', 'Predictive crowd modeling', 'Natural language query processing'],
          },
          {
            Icon: Layers,
            title: 'Action Layer',
            body: 'Delivers insights to the right people at the right time — through the live dashboard, the AI agent, automated alerts, and generated reports.',
            bullets: ['Live operations dashboard', 'AI agent chat interface', 'Push & SMS alert routing', 'Auto-generated executive reports'],
          },
        ],
      },
      {
        type: 'text',
        heading: 'Enterprise-grade reliability',
        body: 'MallMind runs on a cloud-native infrastructure with 99.9% uptime SLA. Data is encrypted in transit and at rest. Role-based access control ensures the right people see the right data. Audit logs capture every action.',
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
        body: 'Each capability works independently and becomes more powerful in combination. Here is a detailed look at what each one does.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Activity,
            title: 'Live Traffic Monitor',
            body: 'Real-time occupancy tracking across all zones, updated every 30 seconds. View crowd flow as a heatmap or time-series chart.',
            bullets: ['Zone-level occupancy %', 'Dwell time per zone', 'Entry/exit flow rates', 'Historical comparison (day/week/month)', 'Configurable alert thresholds'],
          },
          {
            Icon: Brain,
            title: 'AI Agent Chat',
            body: 'Ask anything about your mall in plain English. The agent reasons across all live data and responds with actionable, cited answers.',
            bullets: ['Natural language queries', 'Multi-source reasoning', 'Cites specific zones and timestamps', 'Can draft incident reports', 'Learns your mall\'s baseline patterns'],
          },
          {
            Icon: Shield,
            title: 'Incident Command',
            body: 'From detection to resolution in one workflow. AI classifies incidents, routes alerts to the right team, and tracks response time.',
            bullets: ['Auto-classification (security, maintenance, crowd)', 'Instant SMS/push routing', 'Incident timeline and audit trail', 'Resolution time tracking', 'Post-incident summary generation'],
          },
          {
            Icon: TrendingUp,
            title: 'Campaign Analytics',
            body: 'Tag any promotion or event and MallMind automatically measures its impact on zone traffic, dwell time, and conversion signals.',
            bullets: ['Campaign lift vs. baseline', 'Zone-level attribution', 'Time-decay correlation model', 'Cross-campaign comparison', 'ROI estimation dashboard'],
          },
          {
            Icon: BarChart3,
            title: 'Performance Dashboards',
            body: 'Auto-generated daily, weekly, and monthly reports — ready for executive review without anyone having to pull data manually.',
            bullets: ['Scheduled PDF/email delivery', 'Customizable KPI selection', 'Tenant performance breakdowns', 'Year-over-year comparisons', 'Export to CSV or PowerPoint'],
          },
          {
            Icon: Zap,
            title: 'Instant Alerts',
            body: 'Configurable threshold alerts delivered to the right person the moment something crosses a limit — not after a manual review cycle.',
            bullets: ['Custom threshold rules per zone', 'Escalation chains', 'SMS, push, and email delivery', 'Quiet hours configuration', 'Alert history and acknowledgment tracking'],
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
        title: 'Intelligence that never stops watching.',
        body: 'MallMind\'s AI engine runs 24/7 across every data stream in your mall — detecting anomalies, correlating signals, and answering questions as fast as your team can ask them.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Eye,
            title: 'Anomaly Detection',
            body: 'A machine learning model trained on your mall\'s historical baseline continuously flags deviations — unusual crowd surges, unexpected zone empties, off-pattern behavior.',
            bullets: ['Unsupervised learning on your data', 'Adapts to seasonal and weekly patterns', 'Separate models per zone', 'Sub-minute detection latency'],
          },
          {
            Icon: TrendingUp,
            title: 'Campaign Correlation Engine',
            body: 'Statistical correlation between marketing events and foot traffic signals, using time-decay weighting to attribute impact correctly even across multi-day campaigns.',
            bullets: ['Time-decay attribution model', 'Cross-zone spillover detection', 'A/B campaign comparison', 'Confidence intervals on all estimates'],
          },
          {
            Icon: MessageSquare,
            title: 'Natural Language Processing',
            body: 'The AI agent uses a large language model grounded in live mall data. It understands context, recalls previous questions in a session, and cites its sources.',
            bullets: ['Grounded in live data (not hallucinating)', 'Session memory across questions', 'Structured + unstructured data reasoning', 'Can generate reports and action plans'],
          },
          {
            Icon: Database,
            title: 'Data Sources',
            body: 'The intelligence engine fuses data from multiple physical and digital sources into a single coherent model of your mall at any given moment.',
            bullets: ['Camera-based people counters', 'WiFi probe analytics', 'Door sensor arrays', 'Point-of-sale transaction streams', 'Weather and calendar signals'],
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
        body: 'MallMind is used by four distinct roles inside a mall operations team, each with different needs — and the platform adapts to all of them.',
      },
      {
        type: 'roles',
        items: [
          {
            Icon: Users,
            role: 'Mall Manager',
            quote: '"I need the full picture before my morning briefing — not a stack of spreadsheets."',
            tasks: [
              'Reviews overnight incident summary on arrival',
              'Checks zone performance vs. last week',
              'Asks the AI agent about weekend traffic forecast',
              'Shares auto-generated weekly report with ownership group',
            ],
          },
          {
            Icon: Shield,
            role: 'Security Team',
            quote: '"We need to know about a crowd surge before it becomes a problem, not after."',
            tasks: [
              'Receives instant push alerts for density thresholds',
              'Views live heatmap to pre-position staff',
              'Logs incident responses directly in the platform',
              'Reviews incident audit trail at end of shift',
            ],
          },
          {
            Icon: TrendingUp,
            role: 'Marketing Team',
            quote: '"We need to prove our campaigns actually move traffic, not just awareness."',
            tasks: [
              'Tags new campaign with start/end date and zone scope',
              'Monitors real-time campaign lift during activation',
              'Compares performance across multiple concurrent promotions',
              'Exports campaign report for tenant partner review',
            ],
          },
          {
            Icon: BarChart3,
            role: 'Executive / Ownership',
            quote: '"I want one number that tells me if the mall had a good week."',
            tasks: [
              'Receives scheduled weekly performance PDF by email',
              'Reviews year-over-year zone performance trends',
              'Compares KPIs across properties in portfolio',
              'Uses AI-generated insights in board presentations',
            ],
          },
        ],
      },
      {
        type: 'text',
        heading: 'No training required',
        body: 'MallMind is designed so any member of your team can pick it up in minutes. The AI agent handles complex queries so staff never need to learn SQL, BI tools, or analytics platforms. If you can ask a question, you can get an answer.',
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
        title: 'See every corner of your mall, live.',
        body: 'Zone Intelligence gives your operations team a continuous, real-time picture of how people are moving through your mall — so you can act before problems escalate.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: Activity,
            title: 'What gets tracked',
            body: 'Every zone has its own live metrics panel, updated every 30 seconds from fused sensor data.',
            bullets: ['Occupancy % vs. capacity', 'Dwell time (average and distribution)', 'Entry and exit flow rates', 'Zone-to-zone transition paths', 'Crowd velocity and directional flow'],
          },
          {
            Icon: Eye,
            title: 'How it works',
            body: 'MallMind fuses data from multiple sensor types to produce a single reliable signal per zone, even when individual sensors glitch.',
            bullets: ['Camera-based people counting', 'WiFi probe density signals', 'Door sensor entry/exit counts', 'Sensor fusion with confidence scoring', 'Graceful degradation on sensor dropout'],
          },
          {
            Icon: Bell,
            title: 'Alerts & thresholds',
            body: 'Set occupancy and dwell time thresholds per zone. MallMind alerts the right person the moment a limit is crossed.',
            bullets: ['Configurable per-zone limits', 'Multi-level escalation (warning → critical)', 'SMS, push, and dashboard alerts', 'Quiet hours and on-call routing', 'Auto-clear when threshold drops'],
          },
          {
            Icon: BarChart3,
            title: 'Historical analysis',
            body: 'Compare any zone against its own history — by hour, day, week, or year — to understand patterns and plan staffing, events, and campaigns.',
            bullets: ['Day/week/month comparisons', 'Peak traffic windows per zone', 'Seasonal trend modeling', 'Custom date range export', 'Benchmarking across zones'],
          },
        ],
      },
    ],
  },


  'feature-1': {
    label: 'Incident Detection',
    title: 'Incident Detection & Response',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 02',
        title: 'Catch incidents in seconds, not minutes.',
        body: 'MallMind\'s AI continuously monitors every data stream for signals that something is wrong — and routes the right alert to the right team before the situation escalates.',
      },
      {
        type: 'steps',
        items: [
          {
            num: '01',
            title: 'Detection',
            body: 'The anomaly detection model flags unusual patterns across zone occupancy, crowd velocity, and sensor readings — typically within 30 seconds of the triggering event.',
          },
          {
            num: '02',
            title: 'Classification',
            body: 'The AI classifies the incident type (crowd surge, security concern, maintenance issue, or environmental event) and assigns a severity level automatically.',
          },
          {
            num: '03',
            title: 'Routing',
            body: 'The right team receives an instant alert via push notification, SMS, or dashboard flag — based on incident type, severity, and on-call configuration.',
          },
          {
            num: '04',
            title: 'Resolution & Audit',
            body: 'Response time is tracked automatically. Staff can log actions taken. A full incident timeline is preserved for post-incident review, compliance, and learning.',
          },
        ],
      },
      {
        type: 'text',
        heading: 'Incident types handled',
        body: 'MallMind handles crowd surges and congestion, security and safety events, spills and maintenance triggers, HVAC and environmental anomalies, and unusual tenant activity patterns. The classification model is continuously refined on your mall\'s specific incident history.',
      },
    ],
  },


  'feature-2': {
    label: 'Campaign Engine',
    title: 'Campaign Intelligence Engine',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 03',
        title: 'Prove your campaigns actually work.',
        body: 'The Campaign Intelligence Engine automatically measures the foot traffic impact of every promotion — giving your marketing team real data to optimize spend and demonstrate ROI.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: TrendingUp,
            title: 'Campaign tagging',
            body: 'Tag any promotion with a name, date range, and target zones. MallMind immediately starts measuring impact against your baseline.',
            bullets: ['Name, dates, and zone scope', 'Promotion type classification', 'Multi-zone campaign support', 'Retroactive tagging from history'],
          },
          {
            Icon: BarChart3,
            title: 'Attribution model',
            body: 'A time-decay statistical model attributes foot traffic lift to campaigns fairly, accounting for overlap, lead time, and halo effects across adjacent zones.',
            bullets: ['Time-decay weighting', 'Zone spillover detection', 'Day-of-week normalization', 'Weather and calendar adjustment'],
          },
          {
            Icon: Activity,
            title: 'Live monitoring',
            body: 'Watch campaign impact in real-time during the activation window — so you can amplify what\'s working and pivot what isn\'t before the campaign ends.',
            bullets: ['Hourly lift tracking', 'Vs. baseline comparison', 'Alert if campaign underperforms', 'Side-by-side concurrent campaign view'],
          },
          {
            Icon: CheckCircle2,
            title: 'Post-campaign reporting',
            body: 'After a campaign ends, MallMind generates a full performance report: lift, estimated revenue impact, zone breakdown, and recommendations for next time.',
            bullets: ['Total campaign lift %', 'Estimated incremental visitors', 'Zone-level breakdown', 'Export for tenant partner review', 'AI-written recommendations'],
          },
        ],
      },
    ],
  },


  'feature-3': {
    label: 'AI Agent',
    title: 'AI Operations Agent',
    blocks: [
      {
        type: 'hero',
        label: 'Pillar 04',
        title: 'Ask your mall anything.',
        body: 'The AI Operations Agent is a conversational interface grounded in your live mall data. Ask it anything — it answers with specific, cited, actionable information in seconds.',
      },
      {
        type: 'grid',
        cols: 2,
        items: [
          {
            Icon: MessageSquare,
            title: 'Example questions you can ask',
            body: 'The agent understands context and handles complex, multi-part queries naturally.',
            bullets: [
              '"Which zones are above 80% capacity right now?"',
              '"How did last weekend compare to the same weekend last month?"',
              '"Which campaign drove the most traffic to the food court this quarter?"',
              '"Draft an incident report for the crowd surge in Zone 3 this morning."',
              '"What should we do if Zone 7 hits capacity during the holiday event?"',
            ],
          },
          {
            Icon: Database,
            title: 'What it reasons over',
            body: 'The agent has access to every data source in MallMind — live and historical — and combines them to answer your question accurately.',
            bullets: ['Live zone occupancy and traffic', 'Full incident history and audit logs', 'Campaign performance data', 'Historical baselines and trends', 'Sensor metadata and reliability signals'],
          },
          {
            Icon: CheckCircle2,
            title: 'What it can do',
            body: 'Beyond answering questions, the agent can take actions and produce outputs directly in the platform.',
            bullets: ['Generate formatted incident reports', 'Create and configure alert rules', 'Schedule and send performance summaries', 'Draft recommended operational responses', 'Produce executive-ready slide summaries'],
          },
          {
            Icon: Brain,
            title: 'How it stays accurate',
            body: 'The agent is grounded in real data at every step — it cannot hallucinate zone numbers or invent incidents. Every answer cites its source.',
            bullets: ['Grounded responses only (no fabrication)', 'Source citations with timestamps', 'Confidence indicators on estimates', 'Session memory within a conversation', 'Trained on retail operations context'],
          },
        ],
      },
    ],
  },
};


// ─── sub-page view ────────────────────────────────────────────────────────────
function SubPageView({ pageKey, onBack }: { pageKey: string; onBack: () => void }) {
  const page = SUB_PAGES[pageKey];
  if (!page) return null;


  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#050407]">
      {/* Background */}
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


      {/* Nav */}
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


      {/* Content */}
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


// ─── main component ───────────────────────────────────────────────────────────
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


  // Lock body scroll when sub-page is open
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


      {/* Sub-page overlay */}
      {activePage && (
        <SubPageView pageKey={activePage} onBack={() => setActivePage(null)} />
      )}


      {/* ── Ambient background ── */}
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


      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 85% 72% at 50% 28%, black 10%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 72% at 50% 28%, black 10%, transparent 82%)',
        }}
      />


      {/* ═══ NAV ═══ */}
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


      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-36 text-center md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="mm-orb-1 absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#8b5cf6]/7 blur-3xl" />
          <div className="mm-orb-2 absolute right-[12%] top-[30%] h-52 w-52 rounded-full bg-[#6ee7b7]/4 blur-3xl" />
          <div className="mm-orb-3 absolute bottom-[18%] left-[35%] h-64 w-64 rounded-full bg-[#8b5cf6]/5 blur-3xl" />
        </div>


        <div className="landing-enter mb-7 flex items-center gap-2 border border-[#3a2c52]/60 bg-[#0b0910]/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#a98cff] backdrop-blur">
          <Sparkles size={11} />
          AI-Powered Mall Operations Intelligence
        </div>


        <h1 className="landing-enter landing-enter-delay-1 max-w-5xl text-5xl font-semibold leading-[1.06] tracking-[-0.025em] text-white md:text-7xl lg:text-8xl">
          Where malls think
          <span className="block bg-gradient-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#6ee7b7] bg-clip-text text-transparent">
            before they move.
          </span>
        </h1>


        <p className="landing-enter landing-enter-delay-2 mt-8 max-w-xl text-[15px] font-light leading-relaxed text-[#9a93a9] md:text-lg">
          Real-time zone intelligence, AI-driven incident response, and campaign analytics —
          unified into a single operations platform for modern retail.
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
          Live · Westfield Grand Mall, Dallas TX
        </div>


        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-[#272235] pt-2">
            <div className="mm-scroll-dot h-1.5 w-0.5 rounded-full bg-[#8b5cf6]" />
          </div>
        </div>
      </section>


      {/* ═══ STATS BAR ═══ */}
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


      {/* ═══ METHODOLOGY ═══ */}
      <section ref={featRef.ref} className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: featRef.inView ? 1 : 0, transform: featRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Platform</p>
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
            Four pillars of intelligent mall operations
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


                {/* Clickable arrow */}
                <button
                  type="button"
                  onClick={() => setActivePage(key)}
                  className="hidden items-center gap-2 text-[#3a2c52] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#8b5cf6] md:flex"
                  aria-label={`Learn more about ${title}`}
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>


                {/* Mobile link */}
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


      {/* ═══ CAPABILITIES GRID ═══ */}
      <section ref={capRef.ref} className="border-t border-[#272235]/60 bg-[#0b0910]/25 py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div
            className="mb-14 transition-all duration-700"
            style={{ opacity: capRef.inView ? 1 : 0, transform: capRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Capabilities</p>
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
              Everything your operations team needs
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


      {/* ═══ QUOTE ═══ */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:px-10">
        <blockquote>
          <p className="text-xl font-light italic leading-relaxed text-[#d4cfe6] md:text-2xl lg:text-3xl">
            &ldquo;The best way to predict the future of retail is to orchestrate it —
            with intelligence at every entrance, every aisle, every moment.&rdquo;
          </p>
          <footer className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-[#4a4458]">
            — MallMind Operations Philosophy
          </footer>
        </blockquote>
      </section>


      {/* ═══ BOTTOM CTA ═══ */}
      <section ref={ctaRef.ref} className="border-t border-[#272235]/60 py-28">
        <div
          className="mx-auto max-w-3xl px-6 text-center transition-all duration-700 md:px-10"
          style={{ opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(22px)' }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8b5cf6]">Get Started</p>
          <h2 className="mb-6 text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl">
            Your mall, intelligently orchestrated.
          </h2>
          <p className="mb-10 text-base font-light text-[#9a93a9]">
            Join operations teams using MallMind to turn data into decisions — live, in seconds.
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


      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#272235]/60 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-7 w-7 place-items-center border border-[#5d3c86]/40 bg-[#120d1d]/80 text-[#d9c8ff]">
              <Command size={12} strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#4a4458]">MallMind</span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#4a4458]">
            Professional Mall Operations Intelligence
          </p>
        </div>
      </footer>


    </div>
  );
}



