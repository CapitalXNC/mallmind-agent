import {
    queryTraffic,
    getTenantsByZone,
    logIncident,
    getIncidentHistory,
    triggerCampaign,
    updateIncidentStatus,
    logAgentAction,
    getWeatherContext
  } from '../tools/index.js';
  
  const toolMap = {
    query_traffic: queryTraffic,
    get_tenants_by_zone: getTenantsByZone,
    log_incident: logIncident,
    get_incident_history: getIncidentHistory,
    trigger_campaign: triggerCampaign,
    update_incident_status: updateIncidentStatus,
    get_weather_context: getWeatherContext
  };
  
  export async function runTool(toolName, args) {
    const tool = toolMap[toolName];
    if (!tool) throw new Error(`Unknown tool: ${toolName}`);
    console.log(`Running tool: ${toolName}`, JSON.stringify(args));
    const result = await tool(args);
    console.log(`Tool result: ${toolName}`, JSON.stringify(result).slice(0, 200));
    return result;
  }