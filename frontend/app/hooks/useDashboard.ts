'use client';
import { useState, useEffect, useCallback } from 'react';
import { getDashboard } from '../lib/api';

export interface DashboardZone {
  zoneId: string;
  zoneName: string;
  count: number;
  capacity: number;
  occupancyPct: number;
  alertLevel: string;
  isSurge: boolean;
  timestamp: string;
  source?: string;
}

export interface DashboardIncident {
  incidentId: string;
  type: string;
  title: string;
  severity: string;
  status: string;
  zoneName: string;
  createdAt: string;
  agentActions: string[];
}

export interface DashboardCampaign {
  campaignId: string;
  title: string;
  type: string;
  message: string;
  channel: string[];
  status: string;
  createdAt: string;
}

export interface DashboardLog {
  sessionId?: string;
  actionType?: string;
  toolsUsed?: string[];
  createdAt?: string;
}

export interface DashboardData {
  timestamp?: string;
  summary?: {
    totalOccupancy: number;
    totalCapacity: number;
    mallOccupancyPct: number;
    criticalZones?: string[];
    highZones?: string[];
    activeIncidentCount: number;
    activeCampaignCount: number;
  };
  zones?: DashboardZone[];
  activeIncidents?: DashboardIncident[];
  activeCampaigns?: DashboardCampaign[];
  recentAgentActions?: DashboardLog[];
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function useDashboard(refreshInterval = 30000) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await getDashboard();
      setData(result as DashboardData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);
    const interval = window.setInterval(() => {
      void fetchDashboard();
    }, refreshInterval);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [fetchDashboard, refreshInterval]);

  return { data, loading, error, lastUpdated, refresh: fetchDashboard };
}
