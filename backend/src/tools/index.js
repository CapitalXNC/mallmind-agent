export {
  queryTraffic,
  getTenantsByZone,
  logIncident,
  getIncidentHistory,
  triggerCampaign,
  updateIncidentStatus,
  logAgentAction
} from './mongoTools.js';

export { getWeatherContext } from './weatherTool.js';
export { findSimilarIncidents, embedIncident } from './vectorSearch.js';

export const toolDefinitions = [
  {
    name: 'query_traffic',
    description: 'Query real-time foot traffic data for mall zones. Use this to check current occupancy, detect surges, and see alert levels.',
    parameters: {
      type: 'object',
      properties: {
        zoneId: { type: 'string', description: 'Zone ID to filter by (e.g. zone-foodcourt). Omit for all zones.' },
        limit: { type: 'number', description: 'Number of recent records to return. Default 10.' }
      }
    }
  },
  {
    name: 'get_tenants_by_zone',
    description: 'Get all tenants (shops/restaurants) in a specific mall zone, including contact info and revenue data.',
    parameters: {
      type: 'object',
      properties: {
        zoneId: { type: 'string', description: 'Zone ID to get tenants for.' }
      },
      required: ['zoneId']
    }
  },
  {
    name: 'log_incident',
    description: 'Log a new incident to the database. Use this when detecting crowd surges, maintenance issues, security events, or revenue alerts.',
    parameters: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['crowd_surge', 'maintenance', 'revenue_alert', 'security', 'other'] },
        zoneId: { type: 'string', description: 'Zone where incident occurred.' },
        title: { type: 'string', description: 'Short title for the incident.' },
        description: { type: 'string', description: 'Detailed description of what happened.' },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        affectedTenantIds: { type: 'array', items: { type: 'string' } }
      },
      required: ['type', 'zoneId', 'title', 'description', 'severity']
    }
  },
  {
    name: 'get_incident_history',
    description: 'Retrieve past incidents from the database.',
    parameters: {
      type: 'object',
      properties: {
        zoneId: { type: 'string' },
        limit: { type: 'number' },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] }
      }
    }
  },
  {
    name: 'find_similar_incidents',
    description: 'Use Atlas Vector Search to find semantically similar past incidents. Use this before logging a new incident to learn from how previous similar situations were handled.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Description of the current situation to find similar past incidents for.' },
        limit: { type: 'number', description: 'Number of similar incidents to return. Default 3.' }
      },
      required: ['query']
    }
  },
  {
    name: 'trigger_campaign',
    description: 'Create and activate a marketing campaign to redirect shopper traffic or boost tenant revenue.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['traffic_boost', 'crowd_dispersal', 'promotion', 'emergency'] },
        targetZoneId: { type: 'string' },
        targetTenantIds: { type: 'array', items: { type: 'string' } },
        message: { type: 'string' },
        channel: { type: 'array', items: { type: 'string' } },
        incidentId: { type: 'string' }
      },
      required: ['title', 'type', 'targetZoneId', 'message']
    }
  },
  {
    name: 'update_incident_status',
    description: 'Update the status of an existing incident and log what action was taken.',
    parameters: {
      type: 'object',
      properties: {
        incidentId: { type: 'string' },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] },
        agentAction: { type: 'string' }
      },
      required: ['incidentId', 'status', 'agentAction']
    }
  },
  {
    name: 'get_weather_context',
    description: 'Get real-time weather for the mall city. Always call this first when assessing crowd situations.',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string' }
      }
    }
  }
];