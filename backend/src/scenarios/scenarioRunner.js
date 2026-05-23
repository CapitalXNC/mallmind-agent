import { runAgentQuery } from '../agent/gemini.js';

export const SCENARIOS = {
  crowd_surge: {
    id: 'crowd_surge',
    name: 'Crowd Surge Response',
    description: 'Agent detects a dangerous crowd surge, logs the incident, redirects traffic and triggers a campaign',
    prompt: (zone) => `There is a critical crowd surge happening right now in the ${zone || 'Food Court'}. Occupancy is dangerously high. Assess the situation using live data, log the incident, and take all necessary actions to protect shopper safety and notify affected tenants.`
  },
  revenue_alert: {
    id: 'revenue_alert',
    name: 'Revenue Drop Alert',
    description: 'Agent detects low traffic in a zone and launches a targeted campaign to boost tenant revenue',
    prompt: (zone) => `Traffic in the ${zone || 'South Wing'} is significantly below average for this time of day. Tenants are reporting lower than expected revenue. Analyze the current situation, check weather impact, review historical patterns, and launch an appropriate campaign to drive traffic to that zone.`
  },
  maintenance: {
    id: 'maintenance',
    name: 'Maintenance Issue',
    description: 'Agent logs a maintenance incident, identifies affected tenants and takes corrective action',
    prompt: (detail) => `We have a maintenance emergency: ${detail || 'the main escalator in the North Wing is out of service'}. Log this incident, identify all affected tenants, assess the impact on foot traffic, and recommend immediate actions to minimize disruption.`
  },
  daily_briefing: {
    id: 'daily_briefing',
    name: 'Daily Operations Briefing',
    description: 'Agent reviews all zones, weather, recent incidents and gives a full operational status report',
    prompt: () => `Give me a full operational briefing for the mall right now. Check current weather and its impact, review live foot traffic across all zones, summarize any active or recent incidents, check active campaigns, and give me your top 3 recommended actions for the next 2 hours.`
  }
};

export async function runScenario(scenarioId, param, sessionId) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioId}`);

  const prompt = scenario.prompt(param);
  const session = sessionId || `scenario-${scenarioId}-${Date.now()}`;

  console.log(`\nRunning scenario: ${scenario.name}`);
  return await runAgentQuery(prompt, session);
}