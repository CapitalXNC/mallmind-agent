export { queryTraffic, getTenantsByZone, logIncident, getIncidentHistory, triggerCampaign, updateIncidentStatus, logAgentAction } from './mongoTools.js';
export { getWeatherContext } from './weatherTool.js';

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
        zoneId: { type: 'string', description: 'Zone ID to get tenants for (e.g. zone-north, zone-foodcourt).' }
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
        affectedTenantIds: { type: 'array', items: { type: 'string' }, description: 'List of affected tenant IDs.' }
      },
      required: ['type', 'zoneId', 'title', 'description', 'severity']
    }
  },
  {
    name: 'get_incident_history',
    description: 'Retrieve past incidents from the database. Use this to find similar past events and learn from previous agent actions.',
    parameters: {
      type: 'object',
      properties: {
        zoneId: { type: 'string', description: 'Filter by zone ID.' },
        limit: { type: 'number', description: 'Number of incidents to return. Default 5.' },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved'], description: 'Filter by status.' }
      }
    }
  },
  {
    name: 'trigger_campaign',
    description: 'Create and activate a marketing campaign to redirect shopper traffic or boost tenant revenue. Always use this after logging a crowd surge or revenue alert.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Campaign title.' },
        type: { type: 'string', enum: ['traffic_boost', 'crowd_dispersal', 'promotion', 'emergency'] },
        targetZoneId: { type: 'string', description: 'Zone to target with this campaign.' },
        targetTenantIds: { type: 'array', items: { type: 'string' }, description: 'Specific tenants to include.' },
        message: { type: 'string', description: 'The actual message to display on signage or send via SMS.' },
        channel: { type: 'array', items: { type: 'string' }, description: 'Channels: digital_signage, sms, mall_app.' },
        incidentId: { type: 'string', description: 'Link this campaign to an incident ID.' }
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
        incidentId: { type: 'string', description: 'The incident ID to update.' },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] },
        agentAction: { type: 'string', description: 'Description of what action was taken.' }
      },
      required: ['incidentId', 'status', 'agentAction']
    }
  },
  {
    name: 'get_weather_context',
    description: 'Get real-time weather data for the mall city. Use this to predict traffic impact and adjust recommendations. Always call this first when assessing crowd situations.',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name. Defaults to mall city (Dallas) if omitted.' }
      }
    }
  }
];