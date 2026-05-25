'use client';

import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { useAgent } from './hooks/useAgent';
import LandingPage from './components/LandingPage';
import DashboardShell from './components/DashboardShell';

export default function Home() {
  const [entered, setEntered] = useState(false);
  const { data, loading, error, lastUpdated } = useDashboard(30000);
  const { messages, sendMessage, triggerScenario, isThinking } = useAgent();

  if (!entered) {
    return <LandingPage onEnter={() => setEntered(true)} />;
  }

  return (
    <DashboardShell
      data={data}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      messages={messages}
      sendMessage={sendMessage}
      triggerScenario={triggerScenario}
      isThinking={isThinking}
    />
  );
}
