const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getDashboard() {
  const res = await fetch(`${API}/api/dashboard`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function getScenarios() {
  const res = await fetch(`${API}/api/scenarios`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch scenarios');
  return res.json();
}

export async function sendAgentMessage(message: string, sessionId: string) {
  const res = await fetch(`${API}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });
  if (!res.ok) throw new Error('Agent request failed');
  return res.json();
}

export async function runScenario(id: string, param?: string, sessionId?: string) {
  const res = await fetch(`${API}/api/scenarios/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ param, sessionId })
  });
  if (!res.ok) throw new Error('Scenario failed');
  return res.json();
}